import path from "path";
import getRequestData from "./getRequestData.js";
import { usersController } from "./usersController.js";
import { verifyToken } from "./jwt.js";
import { users } from "./Model.js";
import { decode } from "punycode";
import formidable from "formidable";
import fs from 'fs'

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
      }else if(req.url == '/api/profile/pfp'){
        let token = usersController.getTokenFromUrl(req, res);
        console.log(token);
        console.log(req.headers);
        let data = verifyToken(token)
        console.log(data);
        let imagePath = path.join(__dirname,"uploads", data.email, "profile.png")
        fs.readFile(imagePath, (err, data) => {
          if (err) {
            res.writeHead(404, { "Content-Type": "text/plain" });
            res.end("Image not found");
          } else {
            res.writeHead(200, { "Content-Type": "image/jpeg" });
            res.end(data);
          }
        });
      }
      break;
    case "POST":
      if(req.url == '/api/profile/upload'){
        const form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {
          let oldPath = files.file.path;
          let newPath =
            path.join(__dirname, "uploads", email, "profile.png");
          let rawData = fs.readFileSync(files.file.path);

          fs.copyFile(oldPath, newPath, function (err) {
            if (err) {
              console.log(err);
            } else {
              res.writeHead(200, {
                "Content-Type": "text/plain;charset=utf-8",
              });
              res.end(
                JSON.stringify({
                  status: "200",
                  message: "Plik przesłany pomyślnie",
                })
              );
            }
          })})
      }
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
