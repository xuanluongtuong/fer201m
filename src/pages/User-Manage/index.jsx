import { useEffect, useState } from "react";
import { Badge, Breadcrumb, Button, Table } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { userApi } from "../../api/userApi";

const UserManage = () => {
  const user = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    if (user?.id)
      userApi.getAll().then(({ data }) => {
        setUsers(data.filter((u) => u.id !== user?.id));
      });
  }, [user?.id, refresh]);

  const handleToggleAccount = (id, isBanned) => {
    userApi.toggleAccount({ userId: id, isBanned }).then(() => {
      setRefresh((prev) => prev + 1);
    });
  };

  return (
    <div>
      <div>
        <Breadcrumb style={{ fontSize: "1.5rem", fontWeight: 600 }}>
          <Breadcrumb.Item href="#">
            <Link to={"/"} style={{ textDecoration: "unset" }}>
              Trang chủ
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item active>Quản lý người dùng</Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <div>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Họ tên</th>
              <th>Username</th>
              <th>Giới tính</th>
              <th>Vai trò</th>
              <th>Trạng thái</th>
              <th>Loại tài khoản</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.fullName}</td>
                <td>{u.username}</td>
                <td>{u.gender === 0 ? "Nữ" : "Nam"}</td>
                <td>{u.role.name}</td>
                <td>
                  {u.isBanned ? (
                    <Badge bg="danger">Đã khóa</Badge>
                  ) : (
                    <Badge bg="primary">Đang hoạt động</Badge>
                  )}
                </td>
                <td>
                  {u.type === 1
                    ? "Thành viên vàng"
                    : u.type
                    ? "Thành viên kim cương"
                    : "Thành viên thường"}
                </td>
                <td>
                  {u.isBanned ? (
                    <Button
                      variant="primary"
                      onClick={() => handleToggleAccount(u.id, false)}
                    >
                      Mở khóa tài khoản
                    </Button>
                  ) : (
                    <Button
                      variant="danger"
                      onClick={() => handleToggleAccount(u.id, true)}
                    >
                      Khóa tài khoản
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default UserManage;
