export default function UserTable({ users }) {
  if (users.length === 0) {
    return <p className="empty-text">No users found</p>;
  }

  return (
    <table className="admin-table">
      <thead>
        <tr>
          <th>Email</th>
          <th>Role</th>
        </tr>
      </thead>
      <tbody>
        {users.map(u => (
          <tr key={u.id}>
            <td>{u.email}</td>
            <td>{u.role}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}