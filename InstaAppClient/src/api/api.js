import axios from "axios";

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
    console.log(response);
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
  post("http://localhost:3000/api/user/login", object);

const postRegisterData = (object) =>
  post("http://localhost:3000/api/user/register", object);

const getTokenValid = (token) =>
  get(`http://localhost:3000/api/user/checktoken/${token}`);

const sendImage = (data, token) => {
  let token1 = localStorage.getItem("userToken");
  let path = `http://localhost:3000/api/photos/${token1}`;
  post(path, data, token1);
};

const fetchUserData = async (token) => {
  return await get(`http://localhost:3000/api/profile`, token);
};

const patchUserData = async (obj, token) => {
  return patch("http://localhost:3000/api/profile", obj, token);
};

const getPhotos = async (token) => {
  return await get(`http://localhost:3000/api/photos`, token);
};

const editPhoto = async (object) => {
  let token1 = localStorage.getItem("userToken");
  return await patch(
    `http://localhost:3000/api/tags/edit/${object.id}`,
    object,
    token1
  );
};

const sendProfilePicture = async (data) => {
  let token = localStorage.getItem("userToken");
  post("http://localhost:3000/api/profile/upload", data, token);
};

const getAllPhotos = async () => {
  return await get("http://localhost:3000/api/photos");
};

const getUserData = async (mail) => {
  let token = localStorage.getItem("userToken");
  return await get(`http://localhost:3000/api/user/${mail}`, token);
};

const getUserPhotos = async (mail) => {
  let token = localStorage.getItem("userToken");
  return await get(
    `http://localhost:3000/api/profile/getphotos/${mail}`,
    token
  );
};

const filterPhoto = async (filterType, id, params) => {
  let obj = { filterType, id, ...params };
  patch("http://localhost:3000/api/filters", obj);
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
};
