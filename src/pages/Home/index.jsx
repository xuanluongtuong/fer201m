import { Breadcrumb, Button, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

import MyCarousel from "../../components/Carousel";

import CardMovie from "../../components/CardMovie";
import { useEffect, useState } from "react";
import { movieApi } from "../../api/movieApi";
import { userApi } from "../../api/userApi";
const home=1
const Home = () => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [take, setTake] = useState(8);
  const [skip, setSkip] = useState(0);
  const [isMore, setIsMore] = useState(true);
  const [movieSlider, setMovieSlider] = useState([]);

  useEffect(() => {
    movieApi.getAllMovie({ take, skip, status: 1 }).then(({ data }) => {
      if (data.length < take) setIsMore(false);
      setMovies((prev) => [...prev, ...data]);
    });
  }, [take, skip]);

  useEffect(() => {
    Promise.all([fetchAllMovie(), fetchAllUser()]).then((resp) => {

      // Lấy ra userId của những thành viên vàng hoặc kim cương
      const userIds = resp[1].data
        .sort((a, b) => b.type - a.type)
        .filter((user) => user.type !== null)
        .map((user) => user.id);

      const hotMovies = resp[0].data.filter(movie => userIds.includes(movie.userId));

      const onLy5Movies = hotMovies.slice(0,5);
      setMovieSlider(onLy5Movies.map(movie => ({ image: movie.picture, name: movie.name})))
    });
  }, []);

  const fetchAllMovie = () => movieApi.getAllMovies();
  const fetchAllUser = () => userApi.getAll();

  return (
    <div>
      <div>
        <Breadcrumb>
          <Breadcrumb.Item href="#">
            <Link to={"/"} style={{ textDecoration: "unset" }}>
              <h4>Trang chủ</h4>
            </Link>
          </Breadcrumb.Item>
        </Breadcrumb>
      </div>

      <MyCarousel
        data={movieSlider}
      />

      <div style={{ margin: "5rem 0" }}>
        <h4 style={{ marginBottom: "2rem" }}>Top phim hot</h4>
        <Row>
          {movies.map((movie) => (
            <CardMovie
              key={movie.id}
              image={movie.picture}
              description={movie.description}
              name={movie.name}
              md={3}
              handleViewMore={() => navigate(`/movie/${movie.id}`)}
            />
          ))}
        </Row>
        {isMore && (
          <div
            style={{ display: "flex", justifyContent: "center" }}
            onClick={() => setSkip((prev) => prev + 1)}
          >
            <Button>Tải thêm</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
