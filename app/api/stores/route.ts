import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs"

import prismadb from "@/lib/prismadb"
import { getOrCreateUser } from "@/lib/user-utils"

export async function POST(
  req: Request
) {
  try {
    console.log('[STORES_POST] Starting store creation...')
    
    // Test database connection
    try {
      await prismadb.$queryRaw`SELECT 1`
      console.log('[STORES_POST] Database connection successful')
    } catch (dbError) {
      console.error('[STORES_POST] Database connection failed:', dbError)
      return new NextResponse("Database connection failed", { status: 500 })
    }
    
    const authResult = auth()
    console.log('[STORES_POST] Auth result:', authResult)
    
    const { userId } = authResult
    console.log('[STORES_POST] User ID:', userId)
    
    if (!userId) {
      console.log('[STORES_POST] No user ID found')
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { name } = await req.json()
    console.log('[STORES_POST] Store name:', name)

    if (!name) {
      console.log('[STORES_POST] No store name provided')
      return new NextResponse("Name is required", { status: 400 })
    }

    // Get or create user record
    console.log('[STORES_POST] Getting or creating user...')
    const user = await getOrCreateUser(userId);
    console.log('[STORES_POST] User:', user.id)

    console.log('[STORES_POST] Creating store...')
    const store = await prismadb.store.create({
      data: {
        name,
        userId: user.id
      }
    })
    console.log('[STORES_POST] Store created:', store.id)

    return NextResponse.json(store)
  } catch (error) {
    console.error('[STORES_POST] Error:', error)
    
    // Return more specific error messages
    if (error instanceof Error) {
      return new NextResponse(`Error: ${error.message}`, { status: 500 })
    }
    
    return new NextResponse("Internal Error", { status: 500 })
  }
}