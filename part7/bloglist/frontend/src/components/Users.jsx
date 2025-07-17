const Users = ({ users }) => {
  return (
    <table>
      {users.length > 0 ? (
        users.map((user) => (
          <>
            <tr key={user.id}>
              <th></th>
              <th>blogs created</th>
            </tr>
            <tr>
              <td>{user.name}</td>
              <td>{user.blogs.length}</td>
            </tr>
          </>
        ))
      ) : (
        <p className="text-gray-500">No users available</p>
      )}
    </table>
  );
};

export default Users;
