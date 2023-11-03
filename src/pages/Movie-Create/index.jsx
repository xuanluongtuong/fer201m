import { useEffect, useState } from "react";
import {
  Breadcrumb,
  Button,
  Card,
  Col,
  Form,
  FormControl,
  Modal,
  Row,
} from "react-bootstrap";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Select from "react-select";
import Swal from "sweetalert2";
import { v4 as uuidv4 } from "uuid";
import { movieApi } from "../../api/movieApi";
import DataMovie from "./DataMovie";

export const movieTypes = [
  {
    label: "Hoạt hình",
    value: "Hoạt hình",
  },
  {
    label: "Phiêu lưu",
    value: "Phiêu lưu",
  },
  {
    label: "Hài hước",
    value: "Hài hước",
  },
  {
    label: "Kinh dị",
    value: "Kinh dị",
  },
  {
    label: "Hành động",
    value: "Hành động",
  },
  {
    label: "Chiến tranh",
    value: "Chiến tranh",
  },
  {
    label: "Lãng mạn",
    value: "Lãng mạn",
  },
  {
    label: "Khoa học viễn tưởng",
    value: "Khoa học viễn tưởng",
  },
  {
    label: "Hồi hộp",
    value: "Hồi hộp",
  },
  {
    label: "Bí ẩn",
    value: "Bí ẩn",
  },
];

const MovieCreate = () => {
  const user = useSelector((state) => state.user);

  const [movies, setMovies] = useState([]);

  const [name, setName] = useState("");
  const [picture, setPicture] = useState("");
  const [trailer, setTrailer] = useState("");
  const [time, setTime] = useState(0);
  const [description, setDescription] = useState("");
  const [types, setTypes] = useState([]);
  const [actors, setActors] = useState([]);

  const [actor, setActor] = useState(null);

  useEffect(() => {
    movieApi.getMovieOfUser({ userId: user.id }).then(({ data }) => {
      setMovies(data);
    });
  }, [user.id]);

  const handleAddActor = () => {
    if (actor.name.trim() === "" || actor.picture.trim() === "") {
      return Swal.fire("Lỗi", "Vui lòng không để trống trường nào!", "error");
    }

    setActors((prev) => [...prev, { ...actor, id: uuidv4() }]);
    setActor(null);
  };

  const handleUploadMovie = () => {
    if (name.trim() === "") {
      return Swal.fire("Lỗi", "Vui lòng không bỏ trống tên phim!", "error");
    }

    if (picture.trim() === "") {
      return Swal.fire("Lỗi", "Vui lòng không bỏ trống ảnh!", "error");
    }

    if (trailer.trim() === "") {
      return Swal.fire("Lỗi", "Vui lòng không bỏ trống trailer!", "error");
    }

    if (!time) return Swal.fire("Lỗi", "Thời lượng phải lớn hơn 0!", "error");

    if (description.trim() === "")
      return Swal.fire("Lỗi", "Vui lòng không bỏ trống mô tả!", "error");

    if (types.length < 1)
      return Swal.fire("Lỗi", "Vui lòng chọn ít nhất 2 thể loại!", "error");

    if (actors.length < 1)
      return Swal.fire("Lỗi", "Vui lòng thêm ít nhất 2 diễn viên!", "error");

    const data = {
      name,
      userId: user.id,
      picture,
      trailer,
      type: types.map((t) => t.value),
      actors: actors.map((act) => ({ name: act.name, picture: act.picture })),
      time,
      description,
      status: 0,
    };

    movieApi
      .createMovie(data)
      .then(({ data }) => {
        setName("");
        setPicture("");
        setTrailer("");
        setTime(0);
        setDescription("");
        setTypes([]);
        setActors([]);
        setMovies((prev) => [...prev, data]);
        Swal.fire(
          "Thành công",
          "Tạo đánh giá phim thành công, vui lòng đợi duyệt!",
          "success"
        );
      })
      .catch(() => {
        Swal.fire("Lỗi", "Có lỗi, vui lòng thử lại sau!", "error");
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
          <Breadcrumb.Item active>Tải lên phim</Breadcrumb.Item>
        </Breadcrumb>
      </div>

      <Card style={{ padding: "1rem" }}>
        <Row>
          <Col md={12}>
            <Form.Group className="mb-3" controlId="name">
              <Form.Label>Tên phim</Form.Label>
              <Form.Control
                type="text"
                placeholder="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={12}>
            <Form.Group className="mb-3" controlId="picture">
              <Form.Label>Ảnh</Form.Label>
              <Form.Control
                type="text"
                placeholder="URL ảnh"
                value={picture}
                onChange={(e) => setPicture(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={12}>
            <Form.Group className="mb-3" controlId="trailer">
              <Form.Label>Trailer</Form.Label>
              <Form.Control
                type="text"
                placeholder="URL youtube"
                value={trailer}
                onChange={(e) => setTrailer(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={12}>
            <Form.Group className="mb-3" controlId="trailer">
              <Form.Label>Thời lượng</Form.Label>
              <Form.Control
                type="number"
                placeholder="giây"
                value={time}
                onChange={(e) => {
                  const t = Number.parseInt(e.target.value);

                  if (t) setTime(t);
                }}
              />
            </Form.Group>
          </Col>
          <Col md={12}>
            <Form.Group className="mb-3" controlId="trailer">
              <Form.Label>Mô tả phim</Form.Label>
              <FormControl
                as="textarea"
                rows={5}
                placeholder="Nội dung..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={12}>
            <Form.Group className="mb-3" controlId="trailer">
              <Form.Label>Thể loại</Form.Label>
              <Select
                isMulti
                name="type"
                options={movieTypes}
                className="basic-multi-select"
                classNamePrefix="select"
                value={types}
                onChange={(e) => setTypes(e)}
              />
            </Form.Group>
          </Col>
          <Row>
            {actors.map((a) => (
              <Col md={2} key={a.id}>
                <Card style={{ padding: "1rem" }}>
                  <img
                    src={a.picture}
                    style={{ width: "100%", height: 160, objectFit: "cover" }}
                  />
                  <div style={{ textAlign: "center" }}>{a.name}</div>
                  <div
                    style={{
                      margin: ".5rem 0",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <Button
                      variant="danger"
                      style={{ padding: "0 .5rem" }}
                      onClick={() =>
                        setActors((prev) =>
                          prev.filter((act) => act.id !== a.id)
                        )
                      }
                    >
                      X
                    </Button>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
          <Col md={12} style={{ margin: "1rem 0" }}>
            <Button onClick={() => setActor({ name: "", picture: "" })}>
              Thêm diễn viên
            </Button>
          </Col>

          <Col
            md={12}
            style={{
              margin: "1rem 0",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Button onClick={handleUploadMovie}>Submit</Button>
          </Col>
        </Row>
      </Card>

      {/* Table */}
      <DataMovie data={movies} />

      {/* Modal */}
      <Modal centered onHide={() => setActor(null)} show={actor}>
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Thêm diễn viên
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="name-actor">
              <Form.Label>Tên diễn viên</Form.Label>
              <Form.Control
                type="text"
                placeholder="name"
                value={actor?.name}
                onChange={(e) =>
                  setActor((prev) => ({ ...prev, name: e.target.value }))
                }
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="picture-actor">
              <Form.Label>Ảnh diễn viên</Form.Label>
              <Form.Control
                type="text"
                placeholder="URL picture"
                value={actor?.picture}
                onChange={(e) =>
                  setActor((prev) => ({ ...prev, picture: e.target.value }))
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setActor(null)}>
            Hủy
          </Button>
          <Button onClick={handleAddActor}>Thêm</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default MovieCreate;
