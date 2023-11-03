import { Carousel } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const MyCarousel = ({ data = [] }) => {
  const navigate = useNavigate();

  return (
    <div
      style={{ display: "flex", justifyContent: "center", margin: "2rem 0" }}
    >
      <div
        style={{
          height: 700,
          maxWidth: 1400,
          width: "100%",
          borderRadius: 8,
          overflow: "hidden",
        }}
      >
        <Carousel>
          {data.map((item, index) => (
            <Carousel.Item key={index}>
              <div
                style={{
                  position: "relative",
                  top: 0,
                  bottom: 0,
                  left: 0,
                  right: 0,
                  maxHeight: "100%",
                  cursor: "pointer",
                }}
                onClick={() => navigate(`/movie/${item.id}`)}
              >
                <img
                  src={item?.image}
                  style={{
                    width: "100%",
                    height: "700px",
                    objectFit: "cover",
                  }}
                />
              </div>
              <Carousel.Caption>
                <h3>{item?.name}</h3>
              </Carousel.Caption>
            </Carousel.Item>
          ))}
        </Carousel>
      </div>
    </div>
  );
};

export default MyCarousel;
