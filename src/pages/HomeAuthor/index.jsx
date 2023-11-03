import { useEffect, useState } from "react";
import {
  Breadcrumb,
  Button,
  Col,
  Form,
  InputGroup,
  Modal,
  Row,
  Table,
} from "react-bootstrap";
import Select from "react-select";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { movieApi } from "../../api/movieApi";
import { movieTypes } from "../Movie-Create";
import Swal from "sweetalert2";

const HomeAuthor = () => {
  const user = useSelector((state) => state.user);
  const [types, setTypes] = useState([]);
  const [allMovies, setAllMovies] = useState([]);
  const [movies, setMovies] = useState([]);

  const [refresh, setRefresh] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [filter, setFilter] = useState({
    type: "0",
    search: "",
  });

  useEffect(() => {
    if (user)
      movieApi.getAllMovies().then(({ data }) => {
        // lọc ra movie của user hiện tại
        const movies = data.filter((movie) => movie.userId === user.id);
        setAllMovies(movies);
        setMovies(movies);
        // Lấy ra các type của movie
        let types = movies.map((movie) => movie.type).flat();

        // Xóa type trùng nhau
        types = [...new Set(types)];

        setTypes(types);
      });
  }, [user, refresh]);

  useEffect(() => {
    setMovies(
      allMovies.filter((movie) => {
        if (filter.type === "0") {
          return movie.name.toLowerCase().includes(filter.search.toLowerCase());
        } else {
          return (
            movie.type.includes(filter.type) &&
            movie.name.toLowerCase().includes(filter.search.toLowerCase())
          );
        }
      })
    );
  }, [filter, allMovies, refresh]);

  const handleSaveMovie = () => {
    movieApi
      .updateMovie({
        movieId: selectedMovie?.id,
        ...selectedMovie,
      })
      .then(() => {
        Swal.fire("Thành Công", "Cập nhật phim thành công!", "success").then(
          () => {
            setRefresh((prev) => prev + 1);
            setSelectedMovie(null);
          }
        );
      });
  };

  return (
    <div>
      <div>
        <Breadcrumb style={{ fontSize: "1.5rem", fontWeight: 600 }}>
          <Breadcrumb.Item href="#" active>
            <Link to={"/"} style={{ textDecoration: "unset" }}>
              <h4>Trang chủ</h4>
            </Link>
          </Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <Row>
        <Col md={6}>
          <Form.Select
            aria-label="Default select example"
            onChange={(e) =>
              setFilter((prev) => ({ ...prev, type: e.target.value }))
            }
          >
            <option value={"0"}>Tất cả</option>
            {types.map((type, index) => (
              <option value={type} key={index}>
                {type}
              </option>
            ))}
          </Form.Select>
        </Col>
        <Col md={6}>
          <InputGroup className="mb-3">
            <Form.Control
              placeholder="Tên phim"
              aria-label="Recipient's username"
              aria-describedby="basic-addon2"
              onChange={(e) =>
                setFilter((prev) => ({ ...prev, search: e.target.value }))
              }
            />
            <InputGroup.Text id="basic-addon2">Search</InputGroup.Text>
          </InputGroup>
        </Col>
      </Row>
      <div>
        <Table responsive striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Ảnh</th>
              <th>Tên phim</th>
              <th>Thời lượng</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {movies.map((movie) => (
              <tr key={movie.id}>
                <td>{movie.id}</td>
                <td>
                  <img
                    style={{ width: 80, height: 80, objectFit: "cover" }}
                    src={movie.picture}
                  />
                </td>
                <td>{movie.name}</td>
                <td>
                  {movie.time / 60}
                  <span style={{ marginLeft: ".25rem" }}>phút</span>
                </td>
                <td>
                  <Link to={`/movie/${movie.id}`}>Chi tiết</Link>
                  <Link
                    style={{ marginLeft: ".5rem" }}
                    to={"#"}
                    onClick={() => setSelectedMovie(movie)}
                  >
                    Chỉnh sửa
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* Modal */}
      <Modal
        centered
        className="modal-lg"
        show={Boolean(selectedMovie)}
        onHide={() => setSelectedMovie(null)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Chỉnh sửa phim</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Col md={12}>
            <Form.Group className="mb-3" controlId="name">
              <Form.Label style={{ fontWeight: 600 }}>Tên phim</Form.Label>
              <Form.Control
                type="text"
                placeholder="name"
                value={selectedMovie?.name}
                onChange={(e) =>
                  setSelectedMovie((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="name">
              <Form.Label style={{ fontWeight: 600 }}>Mô tả</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                placeholder="description"
                value={selectedMovie?.description}
                onChange={(e) =>
                  setSelectedMovie((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="name">
              <Form.Label style={{ fontWeight: 600 }}>Mô tả</Form.Label>
              <Form.Control
                type="text"
                placeholder="picture"
                value={selectedMovie?.picture}
                onChange={(e) =>
                  setSelectedMovie((prev) => ({
                    ...prev,
                    picture: e.target.value,
                  }))
                }
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="name">
              <Form.Label style={{ fontWeight: 600 }}>Trailer</Form.Label>
              <Form.Control
                type="text"
                placeholder="trailer"
                value={selectedMovie?.trailer}
                onChange={(e) =>
                  setSelectedMovie((prev) => ({
                    ...prev,
                    trailer: e.target.value,
                  }))
                }
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="name">
              <Form.Label style={{ fontWeight: 600 }}>Time</Form.Label>
              <Form.Control
                type="number"
                min={0}
                placeholder="time"
                value={selectedMovie?.time}
                onChange={(e) =>
                  setSelectedMovie((prev) => ({
                    ...prev,
                    time: Number.parseInt(e.target.value),
                  }))
                }
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="trailer">
              <Form.Label>Thể loại</Form.Label>
              <Select
                isMulti
                name="type"
                options={movieTypes}
                className="basic-multi-select"
                classNamePrefix="select"
                value={selectedMovie?.type.map((t) => ({ label: t, value: t }))}
                onChange={(e) =>
                  setSelectedMovie((prev) => ({
                    ...prev,
                    type: e.map((t) => t.value),
                  }))
                }
              />
            </Form.Group>
          </Col>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setSelectedMovie(null)}>
            Hủy
          </Button>
          <Button variant="primary" onClick={handleSaveMovie}>
            Lưu
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default HomeAuthor;
