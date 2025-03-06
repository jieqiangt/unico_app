import { getAllUsers } from "@/lib/db";
import Link from "next/link";
import UsersTable from "./usersTable";
import { verifyAuthSession } from "@/lib/auth";

export default async function UsersPage() {
  const { user } = await verifyAuthSession();
  if (!user) {
    redirect("/login");
  }

  const users = await getAllUsers();
  return (
    <main>
      <Link href="/admin/users/create">Create User</Link>
      <UsersTable users={users} />
    </main>
  );
}
