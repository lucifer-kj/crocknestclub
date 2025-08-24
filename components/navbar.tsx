import { UserButton, auth } from "@clerk/nextjs"
import { redirect } from "next/navigation"

import { MainNav } from "@/components/main-nav"
import StoreSwitcher from "@/components/store-switcher"
import prismadb from "@/lib/prismadb"
import { getUserByClerkId } from "@/lib/user-utils"
import { ThemeToggle } from "@/components/theme-toggle"

const Navbar = async () => {
  const { userId } = auth()

  if (!userId) {
    redirect("/sign-in")
  }

  // Get the database user record using Clerk ID
  const user = await getUserByClerkId(userId);
  
  if (!user) {
    redirect("/sign-in");
  }

  // Get stores using database user ID
  const stores = await prismadb.store.findMany({
    where: {
      userId: user.id // Use database user ID, not Clerk ID
    }
  })

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <StoreSwitcher items={stores} />
        <MainNav className="mx-6" />
        <div className="ml-auto flex items-center space-x-4">
          <ThemeToggle />
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </div>
  )
}

export default Navbar