import { NextResponse } from "next/server";

import { isInstamojoAvailable } from "@/lib/instamojo";
import prismadb from "@/lib/prismadb";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { productIds, customerInfo } = await req.json();

    if (!productIds || productIds.length === 0) {
      return new NextResponse("Product ids are required", { status: 400 });
    }

    if (!customerInfo) {
      return new NextResponse("Customer information is required", { status: 400 });
    }

    // Check if Instamojo is available
    if (!isInstamojoAvailable()) {
      return new NextResponse("Instamojo not configured", { status: 400 });
    }

    // Get products
    const products = await prismadb.product.findMany({
      where: {
        id: {
          in: productIds,
        },
      },
    });

    if (products.length === 0) {
      return new NextResponse("No products found", { status: 400 });
    }

    // Calculate total amount
    const totalAmount = products.reduce((sum, product) => {
      return sum + product.price.toNumber();
    }, 0);

    // Create order
    const order = await prismadb.order.create({
      data: {
        storeId: params.storeId,
        isPaid: false,
        phone: customerInfo.phone || "",
        address: customerInfo.address || "",
        orderItems: {
          create: productIds.map((productId: string) => ({
            product: {
              connect: {
                id: productId,
              },
            },
          })),
        },
      },
    });

    // Create Instamojo payment request
    const { instamojo } = await import("@/lib/instamojo");
    
    if (!instamojo) {
      return new NextResponse("Payment service not available", { status: 500 });
    }

    const paymentRequest = await instamojo.createPaymentRequest({
      purpose: `Order #${order.id} - ${products.map(p => p.name).join(", ")}`,
      amount: totalAmount,
      buyer_name: customerInfo.name || "Customer",
      email: customerInfo.email || "",
      phone: customerInfo.phone || "",
      redirect_url: `${process.env.NEXT_PUBLIC_APP_URL}/cart?success=1&orderId=${order.id}`,
      webhook_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhook/instamojo`,
      send_email: true,
      send_sms: true,
      allow_repeated_payments: false,
    });

    if (!paymentRequest.success) {
      throw new Error("Failed to create payment request");
    }

    return NextResponse.json(
      {
        success: true,
        paymentUrl: paymentRequest.payment_request.longurl,
        shortUrl: paymentRequest.payment_request.shorturl,
        orderId: order.id,
        method: 'instamojo'
      },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.log("[CHECKOUT_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}