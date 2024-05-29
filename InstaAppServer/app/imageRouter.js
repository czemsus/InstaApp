import { photos } from "./Model.js";
import fs from "fs";
import path from "path";
import formidable from "formidable";
import JsonController from "./JsonController.js";
import getRequestData from "./getRequestData.js";
import { verifyToken } from "./jwt.js";
const __dirname = path.resolve();

const imageRouter = async (req, res) => {
  switch (req.method) {
    case "GET":
      if (req.url == "/api/photos") {
        res.writeHead(200, { "Content-Type": "text/plain;charset=utf-8" });
        res.end(
          JSON.stringify({ status: "200", data: JsonController.getPhotos() })
        );
        break;
      } else if (req.url.match(/\/api\/photos\/([0-9]+)/)) {
        const idToFind = parseInt(req.url.match(/\/api\/photos\/([0-9]+)/)[1]);
        const photoById = JsonController.getPhotos().find(
          (obj) => obj.id === idToFind
        );
        if (photoById) {
          res.writeHead(200, { "Content-Type": "text/plain;charset=utf-8" });
          res.end(JSON.stringify({ status: "200", data: photoById }));
        } else {
          ("nie ma");
          res.writeHead(404, { "Content-Type": "text/plain;charset=utf-8" });
          res.end(
            JSON.stringify({
              status: "404",
              message: "Nie ma zdjęcia z takim ID",
            })
          );
        }

        break;
      } else if (req.url.match(/\/api\/photos\/tags\/([0-9]+)/)) {
        const idToFind = parseInt(
          req.url.match(/\/api\/photos\/tags\/([0-9]+)/)[1]
        );
        const photoById = JsonController.getPhotos().find(
          (obj) => obj.id === idToFind
        );
        if (photoById) {
          res.writeHead(200, { "Content-Type": "text/plain;charset=utf-8" });
          res.end(
            JSON.stringify({
              status: "200",
              id: idToFind,
              tags: photoById.tags,
            })
          );
        } else {
          ("nie ma");
          res.writeHead(404, { "Content-Type": "text/plain;charset=utf-8" });
          res.end(
            JSON.stringify({
              status: "404",
              message: "Nie ma zdjęcia z takim ID",
            })
          );
        }

        break;
      }
    case "POST":
      if (
        req.url.match(
          /\/api\/photos\/(eyJ[A-Za-z0-9-_]+\.eyJ[A-Za-z0-9-_]+\.[A-Za-z0-9-_.+/]*)/
        )
      ) {
        const jwt = req.url.match(
          /\/api\/photos\/(eyJ[A-Za-z0-9-_]+\.eyJ[A-Za-z0-9-_]+\.[A-Za-z0-9-_.+/]*)/
        )[1];
        let email = verifyToken(jwt).email;
        console.log(email);
        const form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {
          let oldPath = files.file.path;
          let newPath =
            path.join(__dirname, "uploads", email) + "/" + files.file.name;
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
              JsonController.add("user_album", files.file.name, newPath);
            }
          });
        });
        break;
      }
    case "DELETE":
      if (req.url.match(/\/api\/photos\/([0-9]+)/)) {
        const idToDelete = parseInt(
          req.url.match(/\/api\/photos\/([0-9]+)/)[1]
        );
        const photoToDelete = JsonController.getPhotos().find(
          (obj) => obj.id === idToDelete
        );

        if (photoToDelete) {
          fs.unlink(path.join(photoToDelete.url), (err) => {
            if (err) throw err;
          });
          JsonController.deletePhoto(idToDelete);
          res.writeHead(200, {
            "Content-Type": "text/plain;charset=utf-8",
          });
          res.end(
            JSON.stringify({
              status: "200",
              message: `photo z id ${idToDelete} zostało usunięte`,
            })
          );
        } else {
          res.writeHead(404, {
            "Content-Type": "text/plain;charset=utf-8",
          });
          res.end(
            JSON.stringify({
              status: "404",
              message: `photo z id ${idToDelete} nie zostało znalezione`,
            })
          );
        }
      }
      break;
    case "PATCH":
      if (req.url.match(/\/api\/photos\/([0-9]+)/)) {
        const idToEdit = parseInt(req.url.match(/\/api\/photos\/([0-9]+)/)[1]);
        const photoToEdit = JsonController.getPhotos().find(
          (obj) => obj.id === idToEdit
        );
        photoToEdit.history.push({
          status: `zmienione ${photoToEdit.history.length} raz`,
          timestamp: Date.now(),
        });
        res.writeHead(200, {
          "Content-Type": "text/plain;charset=utf-8",
        });
        res.end(
          JSON.stringify({
            status: "200",
            message: `photo z id ${idToEdit} zostało edytowane`,
          })
        );
      } else if (req.url.match(/\/api\/photos\/tags\/([0-9]+)/)) {
        const idToEdit = parseInt(
          req.url.match(/\/api\/photos\/tags\/([0-9]+)/)[1]
        );
        let data = await getRequestData(req);
        data = JSON.parse(data);
        const photoToEdit = JsonController.getPhotos().find(
          (obj) => obj.id === idToEdit
        );
        let stat, msg;
        if (photoToEdit && !photoToEdit.tags.some((a) => a.name == data.name)) {
          photoToEdit.history.push({
            status: `zmienione ${photoToEdit.history.length} raz`,
            timestamp: Date.now(),
          });
          photoToEdit.tags.push(data);
          stat = 200;
          msg = `dodano tag dla zdjęcia z id ${idToEdit}`;
        } else {
          stat = 200;
          msg = `zdjęcie juz ma ten tag`;
        }

        res.writeHead(stat, {
          "Content-Type": "text/plain;charset=utf-8",
        });
        res.end(
          JSON.stringify({
            status: stat,
            message: msg,
          })
        );
      } else if (req.url.match(/\/api\/photos\/tags\/mass\/([0-9]+)/)) {
        const idToEdit = parseInt(
          req.url.match(/\/api\/photos\/tags\/mass\/([0-9]+)/)[1]
        );
        let data = await getRequestData(req);
        data = JSON.parse(data);
        const photoToEdit = JsonController.getPhotos().find(
          (obj) => obj.id === idToEdit
        );
        let stat = 200;
        let msg = "";
        if (photoToEdit) {
          data.array.forEach((tag) => {
            if (!photoToEdit.tags.some((a) => a.name == tag.name)) {
              photoToEdit.tags.push(tag);
              msg += `dodano tag "${tag.name}" dla zdjęcia z id ${idToEdit}\n`;
            } else {
              msg += `zdjęcie z id ${idToEdit} już ma tag "${tag.name}"\n`;
            }
          });
          photoToEdit.history.push({
            status: `zmienione ${photoToEdit.history.length} raz`,
            timestamp: Date.now(),
          });
        } else {
          stat = 404;
          msg = `Nie znaleziono zdjęcia z id ${idToEdit}`;
        }

        res.writeHead(stat, {
          "Content-Type": "text/plain;charset=utf-8",
        });
        res.end(
          JSON.stringify({
            status: stat,
            message: msg,
          })
        );
      }
  }
};

export default imageRouter;
