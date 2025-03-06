import { verifyAuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  return <main>This is the main page</main>;
}
