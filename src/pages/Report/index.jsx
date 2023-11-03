import { useEffect, useState } from "react";
import { Breadcrumb, Button, Table } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { movieApi } from "../../api/movieApi";
import Swal from "sweetalert2";

const Report = () => {
  const user = useSelector((state) => state.user);
  const [reports, setReports] = useState([]);

  useEffect(() => {
    if (user?.id)
      movieApi
        .getReportsOfAuthor({
          authorId: user.id,
        })
        .then(({ data }) => {
          setReports(data);
        });
  }, [user?.id]);

  const handleRemoveReport = (id) => {
    Swal.fire({
      title: "Xác nhận từ chối?",
      showCancelButton: true,
      confirmButtonText: "Từ chối",
      confirmButtonColor: "red",
    }).then(({ isConfirmed }) => {
      if (isConfirmed) {
        movieApi
          .rejectReport({
            reportId: id,
          })
          .then(({ data }) => {
            setReports((prev) => prev.filter((rp) => rp.id !== data.id));
          });
      }
    });
  };

  const handleAcceptReport = ({ reportId }) => {
    movieApi.acceptReport({ reportId }).then(({ data }) => {
      movieApi
        .removeComment({
          commentId: data.commentId,
        })
        .then(() => {
          Swal.fire("Thành Công", "Xóa đánh giá thành công!", "success").then(
            () => {
              setReports((prev) => prev.filter((rp) => rp.id !== data.id));
            }
          );
        });
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
          <Breadcrumb.Item active>Report</Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên phim</th>
            <th>Sao đánh giá</th>
            <th>Bình luận</th>
            <th>Người báo cáo</th>
            <th>Lý dó</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((report) => (
            <tr key={report.id}>
              <td>{report.id}</td>
              <td>{report.movieName}</td>
              <td>{report.star}</td>
              <td>{report.commentText}</td>
              <td>{report.movieName}</td>
              <td>{report.reporterName}</td>
              <td>{report.reason}</td>
              <td>
                <Button
                  onClick={() =>
                    handleAcceptReport({
                      reportId: report.id,
                    })
                  }
                >
                  Xóa bình luận
                </Button>
                <Button
                  variant="danger"
                  style={{ marginLeft: ".5rem" }}
                  onClick={() => handleRemoveReport(report.id)}
                >
                  Từ chối
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default Report;
