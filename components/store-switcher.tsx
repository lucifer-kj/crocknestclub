"use client"

import { useRouter } from "next/navigation"
import { Store as StoreIcon, ChevronsUpDown, PlusCircle } from "lucide-react"
import { Store } from "@prisma/client"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Check, Command } from "lucide-react"
import { cn } from "@/lib/utils"
import { Command as CommandPrimitive, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command"

interface StoreSwitcherProps {
  items: Store[];
}

export default function StoreSwitcher({ items }: StoreSwitcherProps) {
  const router = useRouter()

  const onStoreSelect = (store: Store) => {
    router.push(`/${store.id}`)
  }

  const onCreateStore = () => {
    router.push('/')
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" role="combobox" aria-expanded={false} aria-label="Select a store" className="w-[200px] justify-between">
          <StoreIcon className="mr-2 h-4 w-4" />
          Current Store
          <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandList>
            <CommandInput placeholder="Search store..." />
            <CommandEmpty>No store found.</CommandEmpty>
            <CommandGroup heading="Stores">
              {items.map((item) => (
                <CommandItem key={item.id} onSelect={() => onStoreSelect(item)} className="text-sm">
                  <StoreIcon className="mr-2 h-4 w-4" />
                  {item.name}
                  <Check className={cn("ml-auto h-4 w-4", "opacity-0")} />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          <CommandSeparator />
          <CommandList>
            <CommandGroup>
              <CommandItem onSelect={onCreateStore}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Store
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}