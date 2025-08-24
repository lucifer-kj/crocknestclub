import { auth } from "@clerk/nextjs"
import { redirect } from "next/navigation"

import prismadb from "@/lib/prismadb"
import { getUserByClerkId } from "@/lib/user-utils"

import { SettingsForm } from "./components/settings-form"

interface SettingsPageProps {
  params: {
    storeId: string
  }
}

const SettingsPage: React.FC<SettingsPageProps> = async ({
  params
}) => {
  const { userId } = auth()

  if (!userId) {
    redirect("/sign-in")
  }

  // Get the database user record using Clerk ID
  const user = await getUserByClerkId(userId);
  
  if (!user) {
    redirect("/sign-in");
  }

  // Find store using database user ID
  const store = await prismadb.store.findFirst({
    where: {
      id: params.storeId,
      userId: user.id // Use database user ID, not Clerk ID
    }
  })

  if (!store) {
    redirect("/")
  }

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SettingsForm initialData={store} />
      </div>
    </div>
  )
}

export default SettingsPage