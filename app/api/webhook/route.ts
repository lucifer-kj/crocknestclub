import { NextResponse } from "next/server";
import { headers } from "next/headers"

import { instamojo, isInstamojoAvailable } from "@/lib/instamojo";
import prismadb from "@/lib/prismadb";

export async function POST(req: Request) {
  try {
    // Check if Instamojo is available
    if (!isInstamojoAvailable()) {
      return new NextResponse("Instamojo not configured", { status: 400 });
    }

    const body = await req.text();
    const headersList = headers();
    
    // Get the signature from headers
    const signature = headersList.get("x-signature");
    
    if (!signature) {
      return new NextResponse("Missing signature", { status: 400 });
    }

    // Verify webhook signature
    if (!instamojo!.verifyWebhookSignature(body, signature)) {
      return new NextResponse("Invalid signature", { status: 400 });
    }

    const data = JSON.parse(body);

    // Handle different webhook events
    if (data.status === "Credit") {
      // Payment successful
      const paymentRequestId = data.payment_request_id;
      
      try {
        // Get payment details
        const paymentStatus = await instamojo!.getPaymentStatus(paymentRequestId);
        
        if (paymentStatus.success && paymentStatus.payment_request.payments.length > 0) {
          const payment = paymentStatus.payment_request.payments[0];
          
          // Find order by payment request ID or other identifier
          // For now, we'll log the successful payment
          console.log('Payment successful:', payment);
          
          // You can implement order update logic here based on your needs
          // Example: Update order status to paid
        }
      } catch (error) {
        console.error('Error processing payment:', error);
        return new NextResponse("Error processing payment", { status: 500 });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Instamojo webhook error:', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}