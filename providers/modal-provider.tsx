"use client"

import { useEffect, useState } from "react"

import { StoreModal } from "@/components/modals/store-modal"

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    console.log('ModalProvider: Mounting...')
    setIsMounted(true)
    console.log('ModalProvider: Mounted')
  }, [])

  if (!isMounted) {
    console.log('ModalProvider: Not mounted yet')
    return null
  }

  console.log('ModalProvider: Rendering StoreModal')
  return (
    <>
      <StoreModal/>
    </>
  )
}