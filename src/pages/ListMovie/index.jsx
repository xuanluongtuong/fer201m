import { useEffect } from "react";
import { useState } from "react";
import { movieApi } from "../../api/movieApi";
import { Breadcrumb, Col, Form, InputGroup, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import CardMovie from "../../components/CardMovie";

const ListMovie = () => {
  const navigate = useNavigate();
  const [types, setTypes] = useState([]);
  const [movies, setMovies] = useState([]);
  const [filter, setFilter] = useState({
    type: "0",
    search: "",
  });

  useEffect(() => {
    fetchAllTypes();
  }, []);

  useEffect(() => {
    fetchAllMovie({ filter });
  }, [filter]);

  const fetchAllTypes = () => {
    movieApi.getAllMovies().then(({ data }) => {
      const listTypes = data.map((movie) => movie.type).flat();
      const dataTypes = [...new Set(listTypes)];
      setTypes(dataTypes);
    });
  };

  const fetchAllMovie = ({ filter }) => {
    movieApi.getAllMovies().then(({ data }) => {
      setMovies(
        data.filter((movie) => {
          if (filter.type === "0") {
            return movie.name
              .toLowerCase()
              .includes(filter.search.toLowerCase());
          } else {
            return (
              movie.name.toLowerCase().includes(filter.search.toLowerCase()) &&
              movie.type.includes(filter.type)
            );
          }
        })
      );
    });
  };

  return (
    <div>
      <div>
        <Breadcrumb style={{ fontSize: "1.5rem", fontWeight: 600 }}>
          <Breadcrumb.Item href="#">
            <Link to={"/"} style={{ textDecoration: "unset" }}>
              <h4>Trang chủ</h4>
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item active>Danh sách phim</Breadcrumb.Item>
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
    </div>
  );
};

export default ListMovie;
