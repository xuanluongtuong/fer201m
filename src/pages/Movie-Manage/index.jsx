import { useEffect, useState } from "react";
import { Breadcrumb, Button, Card, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { movieApi } from "../../api/movieApi";
import Swal from "sweetalert2";

const MovieManage = () => {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(0);
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    movieApi
      .getAllMovie({
        status: 0,
        take: 10,
        skip: page,
      })
      .then(({ data }) => {
        setMovies(data);
      });
  }, [page]);

  const handleConfirmAccept = (movieId) => {
    movieApi.updateStatusMovie({ movieId, status: 1 }).then(({ data }) => {
      Swal.fire(
        "Thành công",
        "Phê duyệt đánh giá phim thành công!",
        "success"
      ).then(() => {
        setMovies((prev) => prev.filter((mov) => mov.id !== data.id));
      });
    });
  };

  const handleConfirmReject = (movieId) => {
    Swal.fire({
      title: "Xác nhận từ chối?",
      showCancelButton: true,
      confirmButtonText: "Từ chối",
      confirmButtonColor: "red",
    }).then((resp) => {
      if (resp.isConfirmed) {
        movieApi.updateStatusMovie({ movieId, status: 2 }).then(({ data }) => {
          Swal.fire(
            "Thành công",
            "Từ chối đánh giá phim thành công!",
            "success"
          ).then(() => {
            setMovies((prev) => prev.filter((mov) => mov.id !== data.id));
          });
        });
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
          <Breadcrumb.Item active>Phê duyệt phim</Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <div style={{ margin: "2rem 0" }}>
        <Card style={{ padding: "1rem" }}>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Tên</th>
                <th>Ảnh</th>
                <th>Thể loại</th>
                <th>Thời lượng</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {movies.map((movie) => (
                <tr key={movie.id}>
                  <td>{movie.id}</td>
                  <td>{movie.name}</td>
                  <td>
                    <img
                      style={{ width: 80, height: 80 }}
                      src={movie.picture}
                    />
                  </td>
                  <td>{movie.type.join(", ")}</td>
                  <td>
                    <a href="#" onClick={() => setMovie(movie)}>
                      Detail
                    </a>
                  </td>
                  <td>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-evenly",
                      }}
                    >
                      <Button
                        style={{ height: 40 }}
                        onClick={() => handleConfirmAccept(movie.id)}
                      >
                        Duyệt
                      </Button>
                      <Button
                        variant="danger"
                        style={{ height: 40 }}
                        onClick={() => handleConfirmReject(movie.id)}
                      >
                        Từ chối
                      </Button>
                    </div>
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

export default MovieManage;
