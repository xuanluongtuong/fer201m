import { useEffect, useState } from "react";
import { Breadcrumb, Button, Card, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { userApi } from "../../api/userApi";
import Swal from "sweetalert2";

const PaymentManage = () => {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    userApi.getAllPayments({ status: 0 }).then(({ data }) => {
      setPayments(data);
    });
  }, []);

  const updateStatusPayment = (id, status) => {
    userApi
      .updatePayment({
        paymentId: id,
        status,
      })
      .then(({ data }) => {
        setPayments((prev) => prev.filter((payment) => payment.id !== id));

        if (status === 1)
          return userApi.updateStatusUser({ id: data.userId, type: data.type });
        if (status === 2)
          Swal.fire(
            "Thành Công",
            "Từ chối nâng cấp tài khoản thành công!",
            "success"
          );
      })
      .then((resp) => {
        if (resp) {
          Swal.fire(
            "Thành Công",
            "Phê duyệt nâng cấp tài khoản thành công!",
            "success"
          );
        }
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
          <Breadcrumb.Item active>Phê thanh toán</Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <div style={{ margin: "2rem 0" }}>
        <Card style={{ padding: "1rem" }}>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Người dùng</th>
                <th>Gói đăng ký</th>
                <th>Ngày gửi</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment.id}>
                  <td>{payment.id}</td>
                  <td>{payment?.fullName}</td>
                  <td>
                    {payment?.type === 1
                      ? "Thành viên vàng"
                      : "Thành viên kim cương"}
                  </td>
                  <td>
                    {new Date(payment?.createdAt).toISOString().slice(0, 10)}
                  </td>
                  <td>
                    <Button onClick={() => updateStatusPayment(payment.id, 1)}>
                      Chấp nhận
                    </Button>
                    <Button
                      onClick={() => updateStatusPayment(payment.id, 2)}
                      variant="danger"
                      style={{ marginLeft: "1rem" }}
                    >
                      Từ chối
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card>
      </div>
    </div>
  );
};

export default PaymentManage;
