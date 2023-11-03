import { useEffect, useMemo, useState } from "react";
import { Breadcrumb, Card, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { movieApi } from "../../api/movieApi";
import { useSelector } from "react-redux";

const StatisticAuthor = () => {
  const user = useSelector((state) => state.user);
  const [movies, setMovies] = useState([]);
  const [rates, setRates] = useState([]);

  useEffect(() => {
    let moviesResp;
    if (user?.id)
      movieApi
        .getMovieOfUser({ userId: user?.id })
        .then(({ data }) => {
          setMovies(data);
          moviesResp = data;
          return movieApi.getAllRates();
        })
        .then(({ data }) => {
          // Lấy ra array chỉ gồm movieId
          const arrayOfMovieId = moviesResp.map((movie) => movie.id);

          // Lấy ra tất cả rates và lọc ra những rate thuộc phim của mình
          const ratesOfCurrentUserMovies = data.filter((rate) =>
            arrayOfMovieId.includes(rate.movieId)
          );
          setRates(ratesOfCurrentUserMovies);
        });
  }, [user?.id]);

  const movieActive = useMemo(() => {
    return movies.filter((movie) => movie.status === 1).length;
  }, [movies]);

  const moviePending = useMemo(() => {
    return movies.filter((movie) => movie.status === 0).length;
  }, [movies]);

  return (
    <div>
      <div>
        <Breadcrumb style={{ fontSize: "1.5rem", fontWeight: 600 }}>
          <Breadcrumb.Item href="#">
            <Link to={"/"} style={{ textDecoration: "unset" }}>
              Trang chủ
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item active>Thống kê</Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <Row>
        <Col md={3}>
          <Card border="dark">
            <Card.Header>Số lượng phim</Card.Header>
            <Card.Body>
              <Card.Title>
                Tổng số lượng phim của bạn: {movies.length}
              </Card.Title>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card border="dark">
            <Card.Header>Số lượng đánh giá</Card.Header>
            <Card.Body>
              <Card.Title>Tổng số đánh giá: {rates.length}</Card.Title>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card border="dark">
            <Card.Header>Số lượng phim đang chờ duyệt</Card.Header>
            <Card.Body>
              <Card.Title>
                Tổng số lượng phim chờ duyệt: {moviePending}
              </Card.Title>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card border="dark">
            <Card.Header>Số lượng phim đang hoạt đông</Card.Header>
            <Card.Body>
              <Card.Title>
                Tổng số lượng phim hoạt động: {movieActive}
              </Card.Title>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default StatisticAuthor;
