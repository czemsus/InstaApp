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

export {
  postLoginData,
  postRegisterData,
  getTokenValid,
  sendImage,
  fetchUserData,
};
