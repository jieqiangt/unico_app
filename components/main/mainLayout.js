import { verifyAuthSession } from "@/lib/auth";
import "@/app/globals.scss";
import MainHeader from "./mainHeader";
import { redirect } from "next/navigation";

export default async function MainLayout({ children }) {
  const { user } = await verifyAuthSession();
  if (!user) {
    redirect("/login");
  }
  const roleId = user.roleId;
  return (
    <html lang="en">
      <body>
        <MainHeader roleId={roleId} />
        {children}
      </body>
    </html>
  );
}
