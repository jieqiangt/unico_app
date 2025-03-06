import Modal from "@/components/generics/modal";
import CreateUserForm from "./createUserForm";
export default async function CreateUserModal({
  classes,
  roleOptions,
  userId,
}) {
  return (
    <Modal
      dialogClassName={classes["createUser-modal"]}
      backgroundClassName={classes["createUser-background"]}
    >
      <CreateUserForm
        classes={classes}
        roleOptions={roleOptions}
        userId={userId}
      />
    </Modal>
  );
}
