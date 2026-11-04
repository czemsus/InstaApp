import path from "path";
import getRequestData from "./getRequestData.js";
import { usersController } from "./usersController.js";
import { verifyToken } from "./jwt.js";
import formidable from "formidable";
import fs from "fs";
import JsonController from "./jsonController.js";
import { fileURLToPath } from "url";

const uploadsDirectory = fileURLToPath(new URL("../uploads/", import.meta.url));

const profileRouter = async (req, res) => {
  switch (req.method) {
    case "GET":
      if (req.url == "/api/profile") {
        let token = usersController.getTokenFromUrl(req, res);
        let decoded = verifyToken(token);
        if (decoded != "expired") {
          let user = await usersController.getUser(decoded.email);
          if (!user) {
            res.writeHead(404, {
              "Content-Type": "application/json;charset=utf-8",
            });
            res.end(JSON.stringify({ msg: "Nie znaleziono użytkownika" }));
            return;
          }
          res.writeHead(200, {
            "Content-Type": "text/plain;charset=utf-8",
          });
          res.end(
            JSON.stringify({
              email: user.mail,
              name: user.name,
              lastname: user.lastname,
              bio: user.bio,
              picture: user.image,
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
      } else if (req.url.split("?")[0] == "/api/profile/pfp") {
        let token = usersController.getTokenFromUrl(req, res);
        let data = verifyToken(token);
        if (data === "expired") {
          res.writeHead(401, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Invalid or expired token" }));
          return;
        }
        let imagePath = path.join(
          uploadsDirectory,
          data.email,
          "profile.png"
        );
        fs.readFile(imagePath, (err, data) => {
          if (err) {
            res.writeHead(404, { "Content-Type": "text/plain" });
            res.end("Image not found");
          } else {
            res.writeHead(200, { "Content-Type": "image/jpeg" });
            res.end(data);
          }
        });
      } else if (
        req.url.match(
          /\/api\/profile\/getprofilepicture\/([^\s@]+@[^\s@]+\.[^\s@]+)$/
        )
      ) {
        let emailMatch = req.url.match(
          /\/api\/profile\/getprofilepicture\/([^\s@]+@[^\s@]+\.[^\s@]+)$/
        );
        let email = emailMatch[1];
        let imagePath = path.join(uploadsDirectory, email, "profile.png");
        fs.readFile(imagePath, (err, data) => {
          if (err) {
            res.writeHead(404, { "Content-Type": "text/plain" });
            res.end("Image not found");
          } else {
            res.writeHead(200, { "Content-Type": "image/jpeg" });
            res.end(data);
          }
        });
      } else if (
        req.url.match(/\/api\/profile\/getphotos\/([^\s@]+@[^\s@]+\.[^\s@]+)$/)
      ) {
        let emailMatch = req.url.match(
          /\/api\/profile\/getphotos\/([^\s@]+@[^\s@]+\.[^\s@]+)$/
        );
        let email = emailMatch[1];
        let photos = await JsonController.getPhotos();
        let photos1 = photos.filter((photo) => photo.album == email);
        res.writeHead(200, {
          "Content-Type": "text/plain;charset=utf-8",
        });
        res.end(
          JSON.stringify({
            photos: photos1,
          })
        );
      }
      break;
    case "POST":
      if (req.url == "/api/profile/upload") {
        let token = usersController.getTokenFromUrl(req, res);
        let data = verifyToken(token);
        if (data === "expired") {
          res.writeHead(401, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Invalid or expired token" }));
          return;
        }
        let email = data.email;
        const form = new formidable.IncomingForm();
        form.parse(req, async (err, fields, files) => {
          try {
            if (err) {
              res.writeHead(400, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ error: "Invalid upload form" }));
              return;
            }

            const uploadedFile = Array.isArray(files.file)
              ? files.file[0]
              : files.file;
            if (!uploadedFile || !uploadedFile.type?.startsWith("image/")) {
              res.writeHead(400, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ error: "An image file is required" }));
              return;
            }

            const profileDirectory = path.join(
              uploadsDirectory,
              email,
            );
            await fs.promises.mkdir(profileDirectory, { recursive: true });
            const profilePath = path.join(profileDirectory, "profile.png");
            const temporaryPath = path.join(
              profileDirectory,
              `profile-${Date.now()}.tmp`,
            );

            try {
              await fs.promises.copyFile(uploadedFile.path, temporaryPath);
              await fs.promises.rename(temporaryPath, profilePath);
            } catch (error) {
              await fs.promises.rm(temporaryPath, { force: true });
              throw error;
            }

            res.writeHead(200, {
              "Content-Type": "application/json;charset=utf-8",
            });
            res.end(
              JSON.stringify({
                status: "success",
                message: "Zdjęcie profilowe zostało zaktualizowane.",
              }),
            );
          } catch (error) {
            console.error("Profile picture upload failed:", error);
            if (!res.headersSent) {
              res.writeHead(500, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ error: "Profile picture upload failed" }));
            }
          }
        });
      }
      break;
    case "DELETE":
      break;
    case "PATCH":
      if (req.url == "/api/profile") {
        let data = await getRequestData(req);
        data = JSON.parse(data);
        let token = usersController.getTokenFromUrl(req, res);
        let decoded = verifyToken(token);
        if (decoded != "expired") {
          await usersController.modifyUserData(
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
