/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { userApi } from "../../api/userApi";
import { AiFillStar, AiOutlineLike } from "react-icons/ai";

import blankAvatar from "../../assets/images/blank_avatar.jpg";
import { useNavigate } from "react-router-dom";
import { Button, Form, Modal } from "react-bootstrap";
import { movieApi } from "../../api/movieApi";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import { BsFlag } from "react-icons/bs";

const Comment = ({ rate, movie }) => {
  const [user, setUser] = useState(null);
  const currentUser = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [openReport, setOpenReport] = useState(false);
  const [text, setText] = useState("");
  const [likesRate, setLikesRate] = useState(rate.likes);
  const [isLike, setIsLike] = useState(false);

  useEffect(() => {
    if (user?.id) setIsLike(rate.likes.includes(user?.id));
  }, [user?.id, rate.likes]);

  useEffect(() => {
    userApi.getUserById({ id: rate.userId }).then(({ data }) => {
      setUser(data);
    });
  }, [rate.userId]);

  const handleSubmitReport = () => {
    const value = text.trim();
    if (value === "") return;

    const data = {
      authorMovieId: movie?.userId,
      movieId: movie.id,
      movieName: movie.name,
      reporterId: currentUser?.id,
      reporterName: currentUser?.fullName,
      commentId: rate.id,
      commentText: rate.comment,
      star: rate.star,
      reason: value,
      status: 0,
    };

    movieApi.reportComment(data).then(({ data }) => {
      Swal.fire("Thành Công", "Báo cáo đánh giá thành công", "success").then(
        () => {
          setText("");
          setOpenReport(false);
        }
      );
    });
  };

  const handleLike = () => {
    // Nếu đã like thì unlike và ngược lại
    if (isLike) {
      const likes = rate.likes.filter((userId) => userId != user?.id);

      movieApi
        .likeComments({
          commentId: rate.id,
          likes,
        })
        .then(({ data }) => {
          setLikesRate(data.likes);
          setIsLike(false);
        });
    } else {
      const likes = [...rate.likes, user?.id];
      movieApi
        .likeComments({
          commentId: rate.id,
          likes,
        })
        .then(({ data }) => {
          setLikesRate(data.likes);
          setIsLike(true);
        });
    }
  };

  return (
    <div
      style={{
        border: "1px solid #ccc",
        padding: ".5rem",
        borderRadius: 6,
        marginBottom: "1rem",
        backgroundColor: "rgba(0,0,0,0.05)",
      }}
    >
      <div style={{ display: "flex" }}>
        <div className="d-flex w-100 justify-content-between">
          <div className="d-flex">
            <img
              src={user?.avatar || blankAvatar}
              style={{
                width: 50,
                height: 50,
                objectFit: "contain",
                borderRadius: "50%",
              }}
            />
            <div style={{ marginLeft: "1rem" }}>
              <div
                style={{ fontWeight: 600, cursor: "pointer" }}
                onClick={() => navigate(`/public-profile/${rate.userId}`)}
              >
                {user?.fullName}
              </div>
              {Array.from({ length: rate?.star }, (v, i) => (
                <AiFillStar color="#FFD966" key={i} />
              ))}
            </div>
          </div>
          <div>
            <Button
              variant={isLike ? "primary" : "outline-primary"}
              style={{ marginRight: ".5rem" }}
              onClick={handleLike}
            >
              <AiOutlineLike />
              <span>{likesRate.length}</span>
            </Button>
            <Button
              variant="outline-danger"
              onClick={() => setOpenReport(true)}
            >
              <BsFlag />
            </Button>
          </div>
        </div>
      </div>
      <div style={{ marginTop: ".5rem" }}>{rate?.comment}</div>

      <Modal centered show={openReport} onHide={() => setOpenReport(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Báo cáo bình luận</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            as="textarea"
            placeholder="Leave a comment here"
            style={{ height: "100px" }}
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setOpenReport(false)}>
            Hủy
          </Button>
          <Button variant="primary" onClick={handleSubmitReport}>
            Gửi báo cáo
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Comment;
