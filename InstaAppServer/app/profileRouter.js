import path from "path";
import getRequestData from "./getRequestData.js";
import { usersController } from "./usersController.js";
import { verifyToken } from "./jwt.js";
import { users } from "./Model.js";
import { decode } from "punycode";

const __dirname = path.resolve();

const profileRouter = async (req, res) => {
  switch (req.method) {
    case "GET":
      if (req.url == "/api/profile") {
        let token = usersController.getTokenFromUrl(req, res);
        if (token != "expired") {
          let decoded = verifyToken(token);

          let user = users.find((user) => user.mail == decoded.email);
          res.writeHead(200, {
            "Content-Type": "text/plain;charset=utf-8",
          });
          res.end(
            JSON.stringify({
              email: user.mail,
              name: user.name,
              lastname: user.lastname,
              bio: user.bio,
              picture: user.picture,
            })
          );
        } else {
          res.writeHead(200, {
            "Content-Type": "text/plain;charset=utf-8",
          });
          res.end(
            JSON.stringify({
              msg: "token wygasł",
            })
          );
        }
      } else if (req.url == "/api/logout") {
      }
      break;
    case "POST":
      break;
    case "DELETE":
      break;
    case "PATCH":
      if (req.url == "/api/profile") {
        let data = await getRequestData(req);
        data = JSON.parse(data);
        let token = usersController.getTokenFromUrl(req, res);
        if (token != "expired") {
          let decoded = verifyToken(token);
          usersController.modifyUserData(
            decoded.email,
            data.name,
            data.lastname,
            data.bio
          );
          res.writeHead(200, {
            "Content-Type": "text/plain;charset=utf-8",
          });
          res.end(
            JSON.stringify({
              msg: "udana zmiana danych",
            })
          );
        } else {
          res.writeHead(200, {
            "Content-Type": "text/plain;charset=utf-8",
          });
          res.end(
            JSON.stringify({
              msg: "token wygasł",
            })
          );
        }
      }
      break;
  }
};

export default profileRouter;
