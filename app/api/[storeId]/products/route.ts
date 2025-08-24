import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs"

import prismadb from "@/lib/prismadb"
import { logger } from "@/lib/logger"
import { validateRequest, productSchema, storeIdSchema } from "@/lib/validations"
import { rateLimiters, withRateLimit, getClientIdentifier } from "@/lib/rate-limit"

export async function POST(
  req: Request,
  { params }: {params: { storeId: string }}
) {
  // Declare userId outside try-catch so it's accessible in both scopes
  let userId: string | null = null;
  
  try {
    // Rate limiting
    const clientId = getClientIdentifier(req);
    const rateLimit = withRateLimit(rateLimiters.products, clientId);
    
    if (!rateLimit.allowed) {
      return new NextResponse("Too many requests", { 
        status: 429,
        headers: {
          'X-RateLimit-Limit': '30',
          'X-RateLimit-Remaining': rateLimit.remaining.toString(),
          'X-RateLimit-Reset': rateLimit.resetTime.toString(),
          'Retry-After': Math.ceil((rateLimit.resetTime - Date.now()) / 1000).toString()
        }
      });
    }

    const authResult = auth();
    userId = authResult.userId;
    
    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 })
    }

    // Validate store ID
    const storeValidation = validateRequest(storeIdSchema, { storeId: params.storeId });
    if (!storeValidation.success) {
      return new NextResponse(`Store ID validation failed: ${storeValidation.errors.join(', ')}`, { status: 400 });
    }

    // Validate request body
    const body = await req.json();
    const validation = validateRequest(productSchema, body);
    if (!validation.success) {
      return new NextResponse(`Validation failed: ${validation.errors.join(', ')}`, { status: 400 });
    }

    const {
      name,
      price,
      categoryId,
      colorId,
      sizeId,
      images,
      isFeatured,
      isArchived
    } = validation.data;

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId
      }
    })

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 403 })
    }

    const product = await prismadb.product.create({
      data: {
        name,
        price,
        isFeatured,
        isArchived,
        categoryId,
        colorId,
        sizeId,
        storeId: params.storeId,
        images: {
          createMany: {
            data: [
              ...images.map((image: { url: string }) => image)
            ]
          }
        }
      }
    })

    return NextResponse.json(product)
  } catch (error) {
    logger.error('[PRODUCTS_POST] Failed to create product', error as Error, { storeId: params.storeId, userId: userId })
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } },
) {
  try {
    const { searchParams } = new URL(req.url)
    const categoryId = searchParams.get('categoryId') || undefined;
    const colorId = searchParams.get('colorId') || undefined;
    const sizeId = searchParams.get('sizeId') || undefined;
    const isFeatured = searchParams.get('isFeatured');

    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const products = await prismadb.product.findMany({
      where: {
        storeId: params.storeId,
        categoryId,
        colorId,
        sizeId,
        isFeatured: isFeatured ? true : undefined,
        isArchived: false,
      },
      include: {
        images: true,
        category: true,
        color: true,
        size: true,
      },
      orderBy: {
        createdAt: 'desc',
      }
    });
  
    return NextResponse.json(products);
  } catch (error) {
    logger.error('[PRODUCTS_GET] Failed to fetch products', error as Error, { storeId: params.storeId });
    return new NextResponse("Internal error", { status: 500 });
  }
};