import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Unauthorize = () => {
  const navigate = useNavigate();
  return (
    <div>
      <div style={{ marginTop: "2rem" }}>
        <h1 style={{ textAlign: "center" }}>Unauthorize</h1>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Button onClick={() => navigate("/")}>Back to Home</Button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorize;
