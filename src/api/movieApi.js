import axios from "axios";
import { URL } from "./index";

export const movieApi = {
  getAllMovie: ({ take, skip, status }) => {
    let url = `${URL}/movies?_start=${take * skip}&_limit=${take}&`;

    if (status !== null || status !== undefined) url += `&status=${status}`;
    return axios.get(url);
  },
  getMovieById: ({ id }) => {
    return axios.get(`${URL}/movies/${id}`);
  },
  getRatesOfMovie: ({ id }) => {
    return axios.get(`${URL}/movies/${id}/rates`);
  },
  createMovie: (data) => {
    return axios.post(`${URL}/movies`, data);
  },
  updateMovie: ({
    movieId,
    name,
    description,
    time,
    type,
    trailer,
    picture,
  }) => {
    return axios.patch(`${URL}/movies/${movieId}`, {
      name,
      description,
      time,
      type,
      trailer,
      picture,
    });
  },
  createRate: ({ star, comment, userId, movieId, likes }) => {
    return axios.post(`${URL}/rates`, {
      star,
      comment,
      userId,
      movieId,
      likes,
    });
  },
  updateRate: ({ star, comment, id }) => {
    return axios.patch(`${URL}/rates/${id}`, { star, comment });
  },
  getMovieOfUser: ({ userId }) => {
    return axios.get(`${URL}/movies?userId=${userId}`);
  },
  updateStatusMovie: ({ movieId, status }) => {
    return axios.patch(`${URL}/movies/${movieId}`, { status });
  },
  getAllMovies: () => {
    return axios.get(`${URL}/movies`);
  },
  reportComment: ({
    authorMovieId,
    movieId,
    movieName,
    reporterId,
    reporterName,
    commentId,
    commentText,
    star,
    reason,
    status,
  }) => {
    return axios.post(`${URL}/reports`, {
      authorMovieId,
      movieId,
      movieName,
      reporterId,
      reporterName,
      commentId,
      commentText,
      star,
      reason,
      status,
    });
  },
  getReportsOfAuthor: ({ authorId }) => {
    return axios.get(`${URL}/reports?authorMovieId=${authorId}&status=0`);
  },
  rejectReport: ({ reportId }) => {
    return axios.patch(`${URL}/reports/${reportId}`, { status: 2 });
  },
  acceptReport: ({ reportId }) => {
    return axios.patch(`${URL}/reports/${reportId}`, { status: 1 });
  },
  removeComment: ({ commentId }) => {
    return axios.delete(`${URL}/rates/${commentId}`);
  },
  likeComments: ({ commentId, likes }) => {
    return axios.patch(`${URL}/rates/${commentId}`, { likes });
  },
  getAllRates: () => {
    return axios.get(`${URL}/rates`);
  },
};
