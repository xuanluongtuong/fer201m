import axios from "axios";
import { URL } from ".";

export const userApi = {
  getAll: () => {
    return axios.get(`${URL}/users`);
  },
  registerApi: ({ fullName, username, password, dob, gender, type = null }) => {
    return axios.post(`${URL}/users`, {
      username,
      password,
      fullName,
      avatar: "",
      dob,
      gender,
      role: {
        id: 3,
        name: "User",
      },
      type,
    });
  },
  getUserById: ({ id }) => {
    return axios.get(`${URL}/users/${id}`);
  },
  updateUser: ({ avatar, fullName, id, dob }) => {
    return axios.patch(`${URL}/users/${id}`, { avatar, fullName, dob });
  },
  changePasswordUser: ({ id, password }) => {
    return axios.patch(`${URL}/users/${id}`, { password });
  },
  createPayments: ({ type, userId, createdAt, status, fullName }) => {
    return axios.post(`${URL}/payments`, {
      userId,
      type,
      status,
      createdAt,
      fullName,
    });
  },
  getPaymentOfUser: ({ userId }) => {
    return axios.get(`${URL}/payments?userId=${userId}`);
  },
  getAllPayments: ({ status }) => {
    let url = `${URL}/payments`;
    if (status !== null && status !== undefined) url += `?status=${status}`;

    return axios.get(url);
  },
  updatePayment: ({ paymentId, status }) => {
    return axios.patch(`${URL}/payments/${paymentId}`, { status });
  },
  updateStatusUser: ({ id, type }) => {
    return axios.patch(`${URL}/users/${id}`, { type });
  },
  toggleAccount: ({ userId, isBanned }) => {
    return axios.patch(`${URL}/users/${userId}`, { isBanned })
  }
};
