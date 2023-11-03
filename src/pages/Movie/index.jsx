import { useEffect, useMemo } from "react";
import { useState } from "react";
import {
  Breadcrumb,
  Button,
  Card,
  Col,
  FormControl,
  Modal,
  Row,
} from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import StarsRating from "react-star-rate";
import { movieApi } from "../../api/movieApi";
import Comment from "./Comment";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";

const Movie = () => {
  const { id } = useParams();
  const user = useSelector((state) => state.user);
  const [movie, setMovie] = useState(null);
  const [rates, setRates] = useState([]);
  const [open, setOpen] = useState(false);

  const [uStar, setUStar] = useState(null);
  const [uComment, setUComment] = useState(null);
  const [isRated, setIsRated] = useState(false);

  useEffect(() => {
    movieApi.getMovieById({ id }).then(({ data }) => {
      setMovie(data);
    });

    movieApi.getRatesOfMovie({ id }).then(({ data }) => {
      setRates(data);

      const userRate = data.find((r) => r.userId === user?.id);
      if (userRate) {
        setUStar(userRate?.star);
        setUComment(userRate?.comment);
        setIsRated(true);
      }
    });
  }, [id, user?.id]);

  const avg = useMemo(() => {
    const total = rates.reduce((prev, cur) => prev + cur.star, 0);
    return total / rates.length;
  }, [rates]);

  const handleHideModal = () => {
    setOpen(false);
  };

  const handleCreateRate = () => {
    if (!uStar || !uComment || uComment?.trim() === "") {
      return;
    }

    movieApi
      .createRate({
        star: uStar,
        comment: uComment,
        movieId: id,
        userId: user.id,
      })
      .then(({ data }) => {
        setRates((prev) => [...prev, data]);
        Swal.fire("Thành Công", "Đã tạo đánh giá!", "success").then(() => {
          setOpen(false);
          setIsRated(true);
        });
      });
  };

  const handleUpdateRate = () => {
    if (!uStar || !uComment || uComment?.trim() === "") {
      return;
    }

    const curRate = rates.find((r) => r.userId === user.id);

    movieApi
      .updateRate({
        star: uStar,
        comment: uComment,
        id: curRate.id,
      })
      .then(({ data }) => {
        setRates((prev) =>
          prev.map((rate) => (rate.id === data.id ? data : rate))
        );
        Swal.fire("Thành Công", "Đã cập nhật đánh giá!", "success").then(() => {
          setOpen(false);
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
          <Breadcrumb.Item active>Chi tiết</Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <Row>
        <Col md={4} style={{ padding: "1rem 0" }}>
          <img
            src={movie?.picture}
            style={{ width: "100%", height: 600, objectFit: "contain" }}
          />
        </Col>
        <Col md={8} style={{ padding: "1rem 0 1rem 1rem" }}>
          <h1>{movie?.name}</h1>
          <div>
            <StarsRating value={avg} disabled /> {`(${rates.length})`}
          </div>
          <div className="mb-1">
            <span style={{ fontWeight: 600, marginRight: ".5rem" }}>
              Thời lượng:
            </span>
            {Math.ceil(movie?.time / 60)} phút
          </div>
          <div className="mb-1">
            <span style={{ fontWeight: 600, marginRight: ".5rem" }}>
              Thể loại:
            </span>
            {movie?.type.join(", ")}
          </div>
          <div className="mb-1">
            <span style={{ fontWeight: 600, marginRight: ".5rem" }}>
              Mô tả:
            </span>
            {movie?.description}
          </div>
        </Col>
      </Row>

      <div style={{ margin: "2rem 0" }}>
        <h3 style={{ marginBottom: "1rem" }}>Trailer</h3>
        <Row style={{ justifyContent: "center" }}>
          <iframe
            height="600"
            src={`https://www.youtube.com/embed/${movie?.trailer.replace(
              "https://www.youtube.com/watch?v=",
              ""
            )}`}
            style={{ width: "1200px" }}
          ></iframe>
        </Row>
      </div>

      <Row style={{ margin: "4rem 0" }}>
        <h3 style={{ marginBottom: "1rem" }}>Diễn viên chính</h3>
        {movie?.actors.slice(0, 3).map((actor, index) => (
          <Col key={index} style={{ padding: "0 2rem" }} md={4}>
            <Card style={{ width: "100%" }}>
              <Card.Img
                variant="top"
                src={actor.picture}
                style={{ width: "100%", height: 400, objectFit: "cover" }}
              />
              <Card.Body>
                <Card.Title>{actor.name}</Card.Title>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Row>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "1rem",
          }}
        >
          <h3 style={{ marginBottom: "1rem" }}>Đánh giá</h3>
          {user && <Button onClick={() => setOpen(true)}>Viết đánh giá</Button>}
        </div>
        {rates.map((rate) => (
          <Comment rate={rate} key={rate.id} movie={movie} />
        ))}
      </Row>

      {/* Modal */}
      <Modal centered show={open} onHide={handleHideModal}>
        <Modal.Header closeButton>
          <Modal.Title>Đánh giá của bạn</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <StarsRating
              value={uStar || 0}
              onChange={(value) => setUStar(value)}
            />
          </div>
          <FormControl
            as="textarea"
            rows={5}
            placeholder="Nội dung..."
            defaultValue={uComment || ""}
            onChange={(e) => setUComment(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleHideModal}>
            Hủy
          </Button>
          <Button
            variant="primary"
            onClick={isRated ? handleUpdateRate : handleCreateRate}
          >
            Lưu
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Movie;
