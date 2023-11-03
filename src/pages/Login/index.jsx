import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import { userApi } from "../../api/userApi";
import { useDispatch } from "react-redux";
import { setLogin } from "../../redux/store";
import Swal from "sweetalert2";

const Login = () => {
  
  const dispatch = useDispatch();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState({
    username: "",
    password: "",
  });

  const handleLogin = async () => {
    let isError = false;
    if (username.trim() === "") {
      setError((prev) => ({
        ...prev,
        username: "Tên đăng nhập không được để trống",
      }));
      isError = true;
    }
    if (password.trim() === "") {
      setError((prev) => ({
        ...prev,
        password: "Mật khẩu không được để trống",
      }));
      isError = true;
    }

    if (isError) return;

    const { data: users } = await userApi.getAll();

    const user = users.find((u) => u.username === username);

    if (!user) {
      return setError({
        username: "Tên đăng nhập không tồn tại",
      });
    }

    if (user.password !== password) {
      return setError({
        password: "Mật khẩu không đúng",
      });
    }

    if (user.isBanned) {
      return Swal.fire(
        "Thất bại",
        "Tài khoản của bạn đã bị khóa!",
        "error"
      );
    }

    dispatch(setLogin({ user }));
  };

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div
        style={{
          maxWidth: "500px",
          width: "100%",
          marginTop: "12rem",
          padding: "2rem",
          borderRadius: 6,
          border: "1px solid #ccc",
        }}
      >
        <h3 style={{ textAlign: "center" }}>Đăng nhập</h3>
        <Form>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label style={{ color: error.username && "red" }}>
              Tên đăng nhập
            </Form.Label>
            <Form.Control
              type="email"
              placeholder="username"
              style={{ borderColor: error.username && "red" }}
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setError((prev) => ({ ...prev, username: "" }));
              }}
            />
            {error.username && (
              <Form.Label style={{ fontSize: ".8rem", color: "red" }}>
                {error.username}
              </Form.Label>
            )}
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label style={{ color: error.password && "red" }}>
              Mật khẩu
            </Form.Label>
            <Form.Control
              type="password"
              placeholder="password"
              style={{ borderColor: error.password && "red" }}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError((prev) => ({ ...prev, password: "" }));
              }}
            />
            {error.password && (
              <Form.Label style={{ fontSize: ".8rem", color: "red" }}>
                {error.password}
              </Form.Label>
            )}
          </Form.Group>
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              marginTop: "2rem",
            }}
          >
            <Button variant="primary" type="button" onClick={handleLogin}>
              Đăng nhập
            </Button>
          </div>
          <div className="d-flex justify-content-center mt-4">
            <span>
              Bạn không có tài khoản? <Link to="/register">Đăng ký</Link>
            </span>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Login;
