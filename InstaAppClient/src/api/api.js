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

const get = async (url) => {
  return new Promise(async (resolve, reject) => {
    setTimeout(async () => {
      try {
        const response = await axios.get(url);
        console.log("axios", response.data);
        resolve(response.data);
      } catch (err) {
        console.log(err);
        reject(err);
      }
    }, 500);
  });
};

const postLoginData = (object) =>
  post("http://localhost:3000/api/user/login", object);

const postRegisterData = (object) =>
  post("http://localhost:3000/api/user/register", object);

const getTokenValid = (token) =>
  get(`http://localhost:3000/api/user/checktoken/${token}`);

const uploadPhoto = (file) => post('http://localhost:3000/api/photos',file)

export { postLoginData, postRegisterData, getTokenValid, uploadPhoto };
