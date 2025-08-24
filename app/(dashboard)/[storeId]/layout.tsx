import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs';

import prismadb from '@/lib/prismadb';
import { getUserByClerkId } from '@/lib/user-utils';
import Navbar from '@/components/navbar';

export default async function DashboardLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: { storeId: string }
}) {
  const { userId } = auth();

  if (!userId) {
    redirect('/sign-in');
  }

  // Get the database user record using Clerk ID
  const user = await getUserByClerkId(userId);
  
  if (!user) {
    redirect('/sign-in');
  }

  // Find store using database user ID and store ID
  const store = await prismadb.store.findFirst({ 
    where: {
      id: params.storeId,
      userId: user.id, // Use database user ID, not Clerk ID
    }
  });

  if (!store) {
    redirect('/');
  }

  return (
    <>
      <Navbar />
      {children}
    </>
  );
};