import UsersTableRow from "./usersTableRow";

export default async function UsersTable({ users }) {
  return (
    <table>
      <thead>
        <tr>
          <th>User ID</th>
          <th>Username</th>
          <th>Role</th>
          <th>Processing Floor</th>
          <th>Status</th>
          <th>Email</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => {
          return <UsersTableRow user={user} key={user.userId} />;
        })}
      </tbody>
    </table>
  );
}
