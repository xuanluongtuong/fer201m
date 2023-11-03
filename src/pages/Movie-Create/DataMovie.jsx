/* eslint-disable react/prop-types */
import { Badge, Card, Table } from "react-bootstrap";

const DataMovie = ({ data }) => {
  return (
    <div style={{ marginTop: "5rem" }}>
      <h3>Danh sách phim</h3>
      <Card style={{ padding: "1rem" }}>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên</th>
              <th>Ảnh</th>
              <th>Thể loại</th>
              <th>Diễn viên</th>
              <th>Thời Lượng</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {data.reverse().map((movie) => (
              <tr key={movie.id}>
                <td>{movie.id}</td>
                <td>{movie.name}</td>
                <td>
                  <img
                    src={movie.picture}
                    style={{ width: 80, height: 80, objectFit: "cover" }}
                  />
                </td>
                <td>{movie.type.join(", ")}</td>
                <td>{movie.actors.map((act) => act.name).join(", ")}</td>
                <td>{movie.time / 60} phút</td>
                <td>
                  {movie.status === 0 ? (
                    <Badge bg="secondary">Đang xử lý</Badge>
                  ) : movie.status === 1 ? (
                    <Badge bg="success">Đã duyệt</Badge>
                  ) : (
                    <Badge bg="danger">Từ chối</Badge>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>
    </div>
  );
};

export default DataMovie;
