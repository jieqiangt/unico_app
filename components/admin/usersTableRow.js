import { handleDeleteUser } from "@/lib/actions";

export default async function UsersTableRow({ user }) {
  return (
    <tr>
      <th>{user.userId}</th>
      <th>{user.username}</th>
      <th>{user.role}</th>
      <th>{user.processingFloor}</th>
      <th>{user.status}</th>
      <th>{user.email}</th>
      <th>
        <form action={handleDeleteUser.bind(null, user.userId)}>
          {user.role === "admin" ? (
            <button disabled>Delete</button>
          ) : (
            <button type="submit">Delete</button>
          )}
        </form>
      </th>
    </tr>
  );
}
