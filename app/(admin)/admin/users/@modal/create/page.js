import CreateUserModal from "@/components/admin/createUserModal";
import classes from "../../page.module.scss";
import { getRoleOptions } from "@/lib/db";
import { verifyAuthSession } from "@/lib/auth";

export default async function CreateUserModalPage() {
  const { user } = await verifyAuthSession();
  if (!user) {
    redirect("/login");
  }

  const userId = user.id;

  const roleOptions = await getRoleOptions();
  return (
    <CreateUserModal
      classes={classes}
      roleOptions={roleOptions}
      userId={userId}
    />
  );
}
