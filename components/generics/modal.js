"use client";

import { useRouter } from "next/navigation";
export default function Modal({
  dialogClassName,
  backgroundClassName,
  children,
}) {
  const router = useRouter();
  return (
    <dialog className={dialogClassName} open>
      <div className={backgroundClassName} onClick={router.back}></div>
      {children}
      <div className={backgroundClassName} onClick={router.back}></div>
    </dialog>
  );
}