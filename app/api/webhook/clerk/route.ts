import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { Webhook } from 'svix';
import { WebhookEvent } from '@clerk/nextjs/server';
import { getOrCreateUser, updateUserEmail } from "@/lib/user-utils";
import prismadb from "@/lib/prismadb";

export async function POST(req: Request) {
  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new NextResponse('Error occured -- no svix headers', {
      status: 400
    });
  }

  // Get the body
  const payload = await req.text();
  const body = JSON.parse(payload);

  // Create a new Svix instance with your secret.
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error('CLERK_WEBHOOK_SECRET is not set');
    return new NextResponse('Webhook secret not configured', {
      status: 500
    });
  }

  // Create a new Svix instance with your secret.
  const wh = new Webhook(webhookSecret);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(payload, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new NextResponse('Error occured', {
      status: 400
    });
  }

  // Get the ID and type
  const { id } = evt.data;
  const eventType = evt.type;

  console.log(`Webhook with and ID of ${id} and type of ${eventType}`);
  console.log('Webhook body:', body);

  // Handle the webhook
  if (eventType === 'user.created') {
    const { id: clerkId, email_addresses, ...attributes } = evt.data;
    
    if (email_addresses && email_addresses.length > 0) {
      const email = email_addresses[0].email_address;
      
      try {
        // Get or create user with proper email
        const user = await getOrCreateUser(clerkId, email);
        console.log('User handled successfully:', user.id);
      } catch (error) {
        console.error('Error handling user creation:', error);
        return new NextResponse('Error creating user', {
          status: 500
        });
      }
    }
  }

  if (eventType === 'user.updated') {
    const { id: clerkId, email_addresses, ...attributes } = evt.data;
    
    if (email_addresses && email_addresses.length > 0) {
      const email = email_addresses[0].email_address;
      
      try {
        // Update user email
        const user = await updateUserEmail(clerkId, email);
        console.log('User updated successfully:', user.id);
      } catch (error) {
        console.error('Error updating user:', error);
        return new NextResponse('Error updating user', {
          status: 500
        });
      }
    }
  }

  if (eventType === 'user.deleted') {
    const { id: clerkId } = evt.data;
    
    try {
      // Delete user and all related data (cascade)
      const user = await prismadb.user.delete({
        where: { clerkId: clerkId }
      });
      
      console.log('User deleted successfully:', user.id);
    } catch (error) {
      console.error('Error deleting user:', error);
      return new NextResponse('Error deleting user', {
        status: 500
        });
    }
  }

  return NextResponse.json({ success: true });
}
