import { useEffect, useState } from "react";
import {
  Breadcrumb,
  Button,
  Card,
  Form,
  Modal,
  Row,
  Table,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { userApi } from "../../api/userApi";
import { setUser } from "../../redux/store";
import Swal from "sweetalert2";

const typesUpdate = [
  {
    id: 1,
    name: "Thành viên vàng",
    price: "199.000",
    description: "Quyền lợi đăng tối đa 10 phim trong 1 tháng",
  },
  {
    id: 2,
    name: "Thành viên kim cương",
    price: "399.000",
    description: "Quyền lợi đăng tối đa 20 phim trong 1 tháng",
  },
];

const Profile = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [openModalChangePass, setOpenModalChangePass] = useState(false);
  const [avatar, setAvatar] = useState(user?.avatar);
  const [fullName, setFullName] = useState(user?.fullName);
  const [dob, setDob] = useState(user?.dob);
  const [openModalUpdate, setOpenModalUpdate] = useState(false);
  const [payments, setPayments] = useState([]);

  const [selectType, setSelectType] = useState(1);
  const [canUpdate, setCanUpdate] = useState(false);

  const [passwordForm, setPasswordForm] = useState({
    oldPass: "",
    newPass: "",
    reNewPass: "",
  });

  useEffect(() => {
    if (user?.id)
      userApi
        .getPaymentOfUser({
          userId: user.id,
        })
        .then(({ data }) => {
          const isPending = Boolean(data.find((type) => type.status === 0));
          setCanUpdate(isPending);
          setPayments(data);
        });
  }, [user?.id]);

  const handleUpdateProfile = () => {
    userApi
      .updateUser({
        avatar,
        fullName,
        id: user.id,
        dob,
      })
      .then(({ data }) => {
        Swal.fire(
          "Thành Công",
          "Cập nhật thông tin thành công!",
          "success"
        ).then(() => {
          dispatch(setUser({ user: data }));
        });
      });
  };

  const handleChangePassword = () => {
    if (
      passwordForm.oldPass.trim() === "" ||
      passwordForm.newPass.trim() === "" ||
      passwordForm.reNewPass.trim() === ""
    ) {
      return Swal.fire(
        "Lỗi",
        "Vui lòng điền đủ các trường còn trống!",
        "error"
      );
    }

    if (user.password !== passwordForm.oldPass) {
      return Swal.fire("Lỗi", "Mật khẩu hiện tại không đúng!", "error");
    }

    if (passwordForm.newPass !== passwordForm.reNewPass) {
      return Swal.fire(
        "Lỗi",
        "Mật khẩu mới và Nhập lại mật khẩu mới không khớp!",
        "error"
      );
    }

    userApi
      .changePasswordUser({ password: passwordForm.newPass, id: user.id })
      .then(({ data }) => {
        Swal.fire(
          "Thành Công",
          "Cập nhật mật khẩu mới thành công!",
          "success"
        ).then(() => {
          setPasswordForm({
            newPass: "",
            oldPass: "",
            reNewPass: "",
          });
          setOpenModalChangePass(false);
          dispatch(setUser({ user: data }));
        });
      })
      .catch(() => {
        Swal.fire("Lỗi", "Có lỗi vui lòng thử lại sau!", "error");
      });
  };

  const handleSubmitPayment = () => {
    userApi
      .createPayments({
        createdAt: new Date().valueOf(),
        status: 0,
        type: Number.parseInt(selectType),
        userId: user.id,
        fullName: user.fullName,
      })
      .then(({ data }) => {
        Swal.fire(
          "Thành Công",
          "Gửi phê duyệt nâng cấp tài khoản thành công!",
          "success"
        ).then(() => {
          setOpenModalUpdate(false);
          setPayments((prev) => [...prev, data]);
          setCanUpdate(true);
        });
      })
      .catch((err) => {
        console.log(err);
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
          <Breadcrumb.Item active>Profile</Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <Card style={{ padding: "2rem 1rem" }}>
        <Row>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Ảnh đại diện</Form.Label>
              <Form.Control
                type="text"
                placeholder="url ảnh"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Họ và Tên</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nguyễn Văn A"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Ngày sinh</Form.Label>
              <Form.Control
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Tên đăng nhập</Form.Label>
              <Form.Control
                type="text"
                placeholder="username"
                disabled
                defaultValue={user?.username}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Role</Form.Label>
              <Form.Control
                type="text"
                defaultValue={user?.role?.name}
                disabled
              />
            </Form.Group>
          </Form>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>
              <Button onClick={() => setOpenModalChangePass(true)}>
                Đổi mật khẩu
              </Button>
              {user?.role?.id !== 1 && (
                <Button
                  onClick={() => setOpenModalUpdate(true)}
                  variant="outline-primary"
                  style={{ marginLeft: ".5rem" }}
                  disabled={canUpdate}
                >
                  Nâng cấp tài khoản
                </Button>
              )}
            </div>
            <div>
              <Button onClick={handleUpdateProfile}>Lưu thông tin</Button>
            </div>
          </div>
        </Row>
      </Card>

      {user?.role?.id !== 1 && (
        <Card style={{ marginTop: "1rem" }}>
          <div style={{ padding: "1rem" }}>
            <h3>Lịch sử nâng cấp tài khoản</h3>
          </div>
          <Table responsive striped bordered hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Trạng thái</th>
                <th>Loại tài khoản</th>
                <th>Ngày tạo</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment.id}>
                  <td>{payment.id}</td>
                  <td>
                    {payment.status === 0
                      ? "Chưa duyệt"
                      : payment.status === 1
                      ? "Đã duyệt"
                      : "Từ chối"}
                  </td>
                  <td>
                    {payment.type === 1
                      ? "Tài khoản vàng"
                      : "Tài khoản kim cương"}
                  </td>
                  <td>
                    {new Date(payment.createdAt).toISOString().slice(0, 10)}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card>
      )}

      {/* Modal */}
      <Modal
        centered
        show={openModalChangePass}
        onHide={() => setOpenModalChangePass(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Đổi mật khẩu</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Mật khẩu cũ</Form.Label>
              <Form.Control
                type="password"
                placeholder="******"
                value={passwordForm.oldPass}
                onChange={(e) =>
                  setPasswordForm((prev) => ({
                    ...prev,
                    oldPass: e.target.value,
                  }))
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Mật khẩu mới</Form.Label>
              <Form.Control
                type="password"
                placeholder="******"
                value={passwordForm.newPass}
                onChange={(e) =>
                  setPasswordForm((prev) => ({
                    ...prev,
                    newPass: e.target.value,
                  }))
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Nhập lại mật khẩu mới</Form.Label>
              <Form.Control
                type="password"
                placeholder="******"
                value={passwordForm.reNewPass}
                onChange={(e) =>
                  setPasswordForm((prev) => ({
                    ...prev,
                    reNewPass: e.target.value,
                  }))
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setOpenModalChangePass(false)}
          >
            Hủy
          </Button>
          <Button variant="primary" onClick={handleChangePassword}>
            Lưu
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        centered
        show={openModalUpdate}
        onHide={() => setOpenModalUpdate(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Chọn gói nâng cấp</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Select
            aria-label="Default select example"
            onChange={(e) => setSelectType(e.target.value)}
          >
            {typesUpdate.map((type) => (
              <option
                value={type.id}
                key={type.id}
              >{`${type.name}: ${type.price}đ`}</option>
            ))}
          </Form.Select>
          <div className="mt-2 mb-2">
            {typesUpdate.find((type) => type.id == selectType)?.description}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setOpenModalUpdate(false)}>
            Hủy
          </Button>
          <Button variant="primary" onClick={handleSubmitPayment}>
            Xác nhận thanh toán
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Profile;
