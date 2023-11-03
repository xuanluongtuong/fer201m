import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { userApi } from "../../api/userApi";
import Swal from "sweetalert2";

const Register = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState(1);
  const [error, setError] = useState({
    fullName: "",
    username: "",
    password: "",
    dob: "",
  });

  const handleRegister = async () => {
    let isError = false;
    if (fullName.trim() === "") {
      setError((prev) => ({
        ...prev,
        fullName: "Họ và tên không được để trống",
      }));
      isError = true;
    }

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

    if (dob.trim() === "") {
      setError((prev) => ({
        ...prev,
        dob: "Ngày sinh không được để trống",
      }));
      isError = true;
    }

    if (isError) return;

    const { data: users } = await userApi.getAll();

    const user = users.find((u) => u.username === username);

    if (user)
      return setError((prev) => ({
        ...prev,
        username: "Tên đăng nhập đã tồn tại",
      }));

    userApi.registerApi({ fullName, username, password, dob, gender }).then((resp) => {
      if (resp.status === 201)
        Swal.fire("Đăng ký thành công!", "Trở về đăng nhập!", "success").then(
          () => {
            navigate("/login");
          }
        );
    });
  };

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div
        style={{
          maxWidth: "500px",
          width: "100%",
          marginTop: "8rem",
          padding: "2rem",
          borderRadius: 6,
          border: "1px solid #ccc",
        }}
      >
        <h3 style={{ textAlign: "center" }}>Tạo tài khoản</h3>
        <Form>
          <Form.Group className="mb-3" controlId="formBasicName">
            <Form.Label style={{ color: error.fullName && "red" }}>
              Họ và Tên <span style={{ color: "red" }}>*</span>
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="fullName"
              style={{ borderColor: error.fullName && "red" }}
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
                setError((prev) => ({ ...prev, fullName: "" }));
              }}
            />
            {error.fullName && (
              <Form.Label style={{ fontSize: ".8rem", color: "red" }}>
                {error.fullName}
              </Form.Label>
            )}
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label style={{ color: error.username && "red" }}>
              Tên đăng nhập <span style={{ color: "red" }}>*</span>
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="username"
              style={{ borderColor: error.username && "red" }}
              value={username}
              onChange={(e) => {
                setUserName(e.target.value);
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
              Mật khẩu <span style={{ color: "red" }}>*</span>
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

          <Form.Group className="mb-3">
            <Form.Label style={{ color: error.dob && "red" }}>
              Ngày sinh <span style={{ color: "red" }}>*</span>
            </Form.Label>
            <Form.Control
              type="date"
              placeholder="username"
              style={{ borderColor: error.dob && "red" }}
              value={dob}
              onChange={(e) => setDob(e.target.value)}
            />
            {error.dob && (
              <Form.Label style={{ fontSize: ".8rem", color: "red" }}>
                {error.dob}
              </Form.Label>
            )}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              Giới tính <span style={{ color: "red" }}>*</span>
            </Form.Label>
            <Form.Check
              name="gender"
              value={1}
              type="radio"
              label="Nam"
              checked={gender === 1}
              onChange={(e) => setGender(Number.parseInt(e.target.value))}
            />
            <Form.Check
              name="gender"
              value={0}
              type="radio"
              label="Nữ"
              checked={gender === 0}
              onChange={(e) => setGender(Number.parseInt(e.target.value))}
            />
          </Form.Group>
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              marginTop: "2rem",
            }}
          >
            <Button variant="primary" type="button" onClick={handleRegister}>
              Đăng ký
            </Button>
          </div>
          <div className="d-flex justify-content-center mt-4">
            <span>
              Bạn đã có tài khoản? <Link to="/login">Đăng nhập</Link>
            </span>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Register;
