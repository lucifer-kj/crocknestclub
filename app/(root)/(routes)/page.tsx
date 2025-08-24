"use client";

import { useEffect } from "react";

import { useStoreModal } from "@/hooks/use-store-modal";

const SetupPage = () => {
  const onOpen = useStoreModal((state) => state.onOpen);
  const isOpen = useStoreModal((state) => state.isOpen);

  useEffect(() => {
    console.log('SetupPage: Effect running, isOpen:', isOpen);
    if (!isOpen) {
      console.log('SetupPage: Opening modal');
      onOpen();
    } else {
      console.log('SetupPage: Modal already open');
    }
  }, [isOpen, onOpen]);

  console.log('SetupPage: Rendering, isOpen:', isOpen);
  return null;
};

export default SetupPage;