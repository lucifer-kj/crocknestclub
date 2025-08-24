import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs"

import prismadb from "@/lib/prismadb"
import { getOrCreateUser } from "@/lib/user-utils"

export async function POST(
  req: Request
) {
  try {
    const { userId } = auth()
    const { name } = await req.json()

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 })
    }

    // Get or create user record
    const user = await getOrCreateUser(userId);

    const store = await prismadb.store.create({
      data: {
        name,
        userId: user.id
      }
    })

    return NextResponse.json(store)
  } catch (error) {
    console.log('[STORES_POST]', error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}