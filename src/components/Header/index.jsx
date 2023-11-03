import { Container, Nav, NavDropdown, Navbar } from "react-bootstrap";
import { BiUser } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { setLogout } from "../../redux/store";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);

  const handleLogout = () => {
    dispatch(setLogout());
    navigate("/");
  };

  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 9999 }}>
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container>
          <Navbar.Brand href="/">Movie Web</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="#">
                <Link
                  style={{ textDecoration: "none", color: "inherit" }}
                  to={"/"}
                >
                  Trang chủ
                </Link>
              </Nav.Link>
              <Nav.Link href="#">
                <Link
                  style={{ textDecoration: "none", color: "inherit" }}
                  to={"/list-movie"}
                >
                  Danh sách phim
                </Link>
              </Nav.Link>
              {(user?.role?.id === 2) && (
                <Nav.Link href="#">
                  <Link
                    style={{ textDecoration: "none", color: "inherit" }}
                    to={"/report"}
                  >
                    Report
                  </Link>
                </Nav.Link>
              )}
              {(user?.role?.id === 2) && (
                <Nav.Link href="#">
                  <Link
                    style={{ textDecoration: "none", color: "inherit" }}
                    to={"/statistics-author"}
                  >
                    Thống kê
                  </Link>
                </Nav.Link>
              )}
              {(user?.role?.id === 2) && (
                <Nav.Link href="#">
                  <Link
                    style={{ textDecoration: "none", color: "inherit" }}
                    to={"/upload-movie"}
                  >
                    Tạo bài review
                  </Link>
                </Nav.Link>
              )}
              {user?.role?.id === 1 && (
                <Nav.Link href="#">
                  <Link
                    style={{ textDecoration: "none", color: "inherit" }}
                    to={"/manage-movie"}
                  >
                    Phê duyệt phim
                  </Link>
                </Nav.Link>
              )}
              {user?.role?.id === 1 && (
                <Nav.Link href="#">
                  <Link
                    style={{ textDecoration: "none", color: "inherit" }}
                    to={"/payment-manage"}
                  >
                    Phê duyệt thanh toán
                  </Link>
                </Nav.Link>
              )}
              {user?.role?.id === 1 && (
                <Nav.Link href="#">
                  <Link
                    style={{ textDecoration: "none", color: "inherit" }}
                    to={"/user-manage"}
                  >
                    Quản lý người dùng
                  </Link>
                </Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
          <Navbar.Collapse className="justify-content-end">
            <Nav>
              {user ? (
                <NavDropdown
                  id="nav-dropdown-dark-example"
                  title={<BiUser size={24} />}
                  menuVariant="dark"
                >
                  <NavDropdown.ItemText>{user.fullName}</NavDropdown.ItemText>
                  <NavDropdown.Divider />
                  <NavDropdown.Item
                    href="#"
                    onClick={() => navigate("/profile")}
                  >
                    Thông tin
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item href="#" onClick={handleLogout}>
                    Đăng xuất
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <Link to={"/login"}>Đăng nhập</Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
};

export default Header;
