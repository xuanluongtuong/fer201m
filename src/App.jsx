import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Layout from "./layout";
import { useSelector } from "react-redux";
import Movie from "./pages/Movie";
import Profile from "./pages/Profile";
import MovieCreate from "./pages/Movie-Create";
import Unauthorize from "./pages/Unauthorize";
import MovieManage from "./pages/Movie-Manage";
import PublicProfile from "./pages/PublicProfile";
import ListMovie from "./pages/ListMovie";
import PaymentManage from "./pages/Payment-Manage";
import HomeAuthor from "./pages/HomeAuthor";
import Report from "./pages/Report";
import StatisticAuthor from "./pages/StatisticAuthor";
import UserManage from "./pages/User-Manage";

function App() {
  const user = useSelector((state) => state.user);

  return (
    <div>
      <Routes>
        <Route
          path="/"
          element={
            <Layout>{user?.role?.id !== 2 ? <Home /> : <HomeAuthor />}</Layout>
          }
        />
        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to={"/"} />}
        />
        <Route
          path="/register"
          element={!user ? <Register /> : <Navigate to={"/"} />}
        />
        <Route
          path="/movie/:id"
          element={
            <Layout>
              <Movie />
            </Layout>
          }
        />
        <Route
          path="/profile"
          element={
            user ? (
              <Layout>
                <Profile />
              </Layout>
            ) : (
              <Navigate to={"/login"} />
            )
          }
        />
        <Route
          path="/upload-movie"
          element={
            user && (user?.role?.id === 2 || user?.role?.id === 1) ? (
              <Layout>
                <MovieCreate />
              </Layout>
            ) : (
              <Navigate to={"/unauthorize"} />
            )
          }
        />
        <Route
          path="/manage-movie"
          element={
            user && user?.role?.id === 1 ? (
              <Layout>
                <MovieManage />
              </Layout>
            ) : (
              <Navigate to={"/unauthorize"} />
            )
          }
        />
        <Route
          path="/payment-manage"
          element={
            user && user?.role?.id === 1 ? (
              <Layout>
                <PaymentManage />
              </Layout>
            ) : (
              <Navigate to={"/unauthorize"} />
            )
          }
        />
        <Route
          path="/user-manage"
          element={
            user && user?.role?.id === 1 ? (
              <Layout>
                <UserManage />
              </Layout>
            ) : (
              <Navigate to={"/unauthorize"} />
            )
          }
        />
        <Route
          path="/report"
          element={
            user && user?.role?.id === 2 ? (
              <Layout>
                <Report />
              </Layout>
            ) : (
              <Navigate to={"/unauthorize"} />
            )
          }
        />
        <Route
          path="/statistics-author"
          element={
            user && user?.role?.id === 2 ? (
              <Layout>
                <StatisticAuthor />
              </Layout>
            ) : (
              <Navigate to={"/unauthorize"} />
            )
          }
        />
        <Route
          path="/public-profile/:userId"
          element={
            <Layout>
              <PublicProfile />
            </Layout>
          }
        />
        <Route
          path="/list-movie"
          element={
            <Layout>
              <ListMovie />
            </Layout>
          }
        />
        <Route path="/unauthorize" element={<Unauthorize />} />
      </Routes>
    </div>
  );
}

export default App;
