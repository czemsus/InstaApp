import axios from "axios";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

const post = async (url, object, token) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.post(url, object, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      resolve(response.data);
    } catch (err) {
      reject(err);
    }
  });
};

const get = async (url, token) => {
  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    return response.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const patch = async (url, object, token) => {
  try {
    const response = await axios.patch(url, object, {
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const postLoginData = (object) =>
  post(`${API_BASE_URL}/api/user/login`, object);

const postRegisterData = (object) =>
  post(`${API_BASE_URL}/api/user/register`, object);

const getTokenValid = (token) =>
  get(`${API_BASE_URL}/api/user/checktoken/${token}`);

const sendImage = (data, token) => {
  let token1 = localStorage.getItem("userToken");
  let path = `${API_BASE_URL}/api/photos/${token1}`;
  post(path, data, token1);
};

const fetchUserData = async (token) => {
  return await get(`${API_BASE_URL}/api/profile`, token);
};

const patchUserData = async (obj, token) => {
  return patch(`${API_BASE_URL}/api/profile`, obj, token);
};

const getPhotos = async (token) => {
  return await get(`${API_BASE_URL}/api/photos`, token);
};

const editPhoto = async (object) => {
  let token1 = localStorage.getItem("userToken");
  return await patch(
    `${API_BASE_URL}/api/tags/edit/${object.id}`,
    object,
    token1
  );
};

const sendProfilePicture = async (data) => {
  let token = localStorage.getItem("userToken");
  post(`${API_BASE_URL}/api/profile/upload`, data, token);
};

const getAllPhotos = async () => {
  return await get(`${API_BASE_URL}/api/photos`);
};

const getUserData = async (mail) => {
  let token = localStorage.getItem("userToken");
  return await get(`${API_BASE_URL}/api/user/${mail}`, token);
};

const getUserPhotos = async (mail) => {
  let token = localStorage.getItem("userToken");
  return await get(
    `${API_BASE_URL}/api/profile/getphotos/${mail}`,
    token
  );
};

const filterPhoto = async (filterType, id, params) => {
  let obj = { filterType, id, ...params };
  return await patch(`${API_BASE_URL}/api/filters`, obj);
};

const getMeta = async (id) => {
  return get(`${API_BASE_URL}/api/filters/metadata/${id}`);
};

export {
  postLoginData,
  postRegisterData,
  getTokenValid,
  sendImage,
  fetchUserData,
  patchUserData,
  getPhotos,
  editPhoto,
  sendProfilePicture,
  getAllPhotos,
  getUserData,
  getUserPhotos,
  filterPhoto,
  getMeta,
};
