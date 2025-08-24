import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs';

import prismadb from '@/lib/prismadb';
import { getUserByClerkId } from '@/lib/user-utils';

export default async function SetupLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { userId } = auth();

  if (!userId) {
    redirect('/sign-in');
  }

  // Get the database user record using Clerk ID
  const user = await getUserByClerkId(userId);
  
  if (!user) {
    // User doesn't exist in database yet, let them create a store
    return (
      <>
        {children}
      </>
    );
  }

  // Look for stores using the database user ID (not Clerk ID)
  const store = await prismadb.store.findFirst({
    where: {
      userId: user.id, // Use database user ID, not Clerk ID
    }
  });

  if (store) {
    redirect(`/${store.id}`);
  }

  return (
    <>
      {children}
    </>
  );
};