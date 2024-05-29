import axios from "axios";

const post = async (url, object) => {
  return new Promise(async (resolve, reject) => {
    setTimeout(async () => {
      try {
        const response = await axios.post(url, object);
        resolve(response.data);
      } catch (err) {
        reject(err);
      }
    }, 1000);
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
    console.log("axios", response.data);
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

const sendImage = (data) => {
  let token = localStorage.getItem("userToken");
  let path = `http://localhost:3000/api/photos/${token}`;
  post(path, data);
};

const fetchUserData = async (token) => {
  return await get(`http://localhost:3000/api/profile`, token);
};

const patchUserData = async (obj, token) => {
  console.log(token);
  return patch("http://localhost:3000/api/profile", obj, token);
};

export {
  postLoginData,
  postRegisterData,
  getTokenValid,
  sendImage,
  fetchUserData,
  patchUserData,
};
