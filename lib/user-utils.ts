import prismadb from "@/lib/prismadb";

/**
 * Get or create a user by Clerk ID
 * This function ensures a user record exists in the database
 */
export async function getOrCreateUser(clerkId: string, email?: string) {
  try {
    // First, try to find existing user
    let user = await prismadb.user.findUnique({
      where: { clerkId }
    });

    if (!user) {
      // Create user if they don't exist
      user = await prismadb.user.create({
        data: {
          clerkId,
          email: email || `user-${clerkId}@temp.com`,
        }
      });
      console.log('Created new user:', user.id);
    }

    return user;
  } catch (error) {
    console.error('Error in getOrCreateUser:', error);
    throw error;
  }
}

/**
 * Get user by Clerk ID
 */
export async function getUserByClerkId(clerkId: string) {
  try {
    return await prismadb.user.findUnique({
      where: { clerkId }
    });
  } catch (error) {
    console.error('Error getting user by Clerk ID:', error);
    throw error;
  }
}

/**
 * Update user email
 */
export async function updateUserEmail(clerkId: string, email: string) {
  try {
    return await prismadb.user.update({
      where: { clerkId },
      data: { email }
    });
  } catch (error) {
    console.error('Error updating user email:', error);
    throw error;
  }
}
