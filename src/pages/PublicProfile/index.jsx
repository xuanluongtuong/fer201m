import { useEffect, useState } from "react";
import { Badge, Card, Col, Row } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { userApi } from "../../api/userApi";

import blankAvatar from "../../assets/images/blank_avatar.jpg";

const PublicProfile = () => {
  const { userId } = useParams();
  const [user, setUsser] = useState(null);

  useEffect(() => {
    userApi.getUserById({ id: userId }).then(({ data }) => {
      setUsser(data);
    });
  }, [userId]);

  console.log(user);

  return (
    <div>
      <Card style={{ padding: "2rem 1rem" }}>
        <div className="d-flex justify-content-center">
          <img
            style={{
              width: 100,
              height: 100,
              borderRadius: "50%",
              border: "1px solid #ccc",
            }}
            src={user?.avatar || blankAvatar}
          />
        </div>
        <div className="d-flex justify-content-center mt-3">
          <Badge bg={user?.type === null ? "secondary" : user?.type === 1 ? "warning" : "info"}>
            {user?.type === null ? "Thành viên thường" : user?.type === 1 ? "Thành viên vàng" : "Thành viên kim cương"}
          </Badge>
        </div>
        <Row style={{ marginTop: "2rem" }}>
          <Col md="6" style={{ marginTop: ".5rem"}}>
            <span style={{ fontWeight: 600 }}>Họ tên:</span>
            <span style={{ marginLeft: ".5rem" }}>{user?.fullName}</span>
          </Col>
          <Col md="6" style={{ marginTop: ".5rem"}}>
            <span style={{ fontWeight: 600 }}>Giới tính:</span>
            <span style={{ marginLeft: ".5rem" }}>{user?.gender === 0 ? "Nam" : "Nữ"}</span>
          </Col>
          <Col md="6" style={{ marginTop: ".5rem"}}>
            <span style={{ fontWeight: 600 }}>Vai trò:</span>
            <span style={{ marginLeft: ".5rem" }}>{user?.role?.name}</span>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default PublicProfile;
