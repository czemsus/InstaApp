import { photos } from "./Model.js";
import fs from "fs";
import path from "path";
import { tagsObjects } from "./Model.js";
import TagsController from "./tagsController.js";
import getRequestData from "./getRequestData.js";
import JsonController from "./JsonController.js";
const __dirname = path.resolve();
const tagsController = new TagsController();
const jsonController = new JsonController();

const tagsRouter = async (req, res) => {
  switch (req.method) {
    case "GET":
      if (req.url == "/api/tags/raw") {
        res.writeHead(200, {
          "Content-Type": "text/plain;charset=utf-8",
        });
        res.end(
          JSON.stringify({
            status: "200",
            tags: tagsController.getRawTags(),
          })
        );
        break;
      } else if (req.url == "/api/tags") {
        res.writeHead(200, {
          "Content-Type": "text/plain;charset=utf-8",
        });
        res.end(
          JSON.stringify({
            status: "200",
            tags: tagsController.getTags(),
          })
        );
        break;
      } else if (req.url.match(/\/api\/tags\/([0-9]+)/)) {
        const idToFind = parseInt(req.url.match(/\/api\/tags\/([0-9]+)/)[1]);
        res.writeHead(200, {
          "Content-Type": "text/plain;charset=utf-8",
        });
        res.end(
          JSON.stringify({
            status: "200",
            tag: tagsController.findTag(idToFind),
          })
        );
      }
      break;
    case "POST":
      if (req.url == "/api/tags") {
        let data = await getRequestData(req);
        data = JSON.parse(data);
        tagsController.addtag(data.name, data.popularity);
        res.writeHead(200, {
          "Content-Type": "text/plain;charset=utf-8",
        });
        res.end(
          JSON.stringify({
            status: "200",
            message: tagsController.message,
          })
        );
        break;
      }
      break;
    case "DELETE":
      if (req.url.match(/\/api\/photos\/([0-9]+)/)) {
        const idToDelete = parseInt(
          req.url.match(/\/api\/photos\/([0-9]+)/)[1]
        );
        const photoToDelete = photos.find((obj) => obj.id === idToDelete);

        if (photoToDelete) {
          fs.unlink(path.join(photoToDelete.url), (err) => {
            if (err) throw err;
          });
          jsonController.deletePhoto(idToDelete);
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
      if (req.url.match(/\/api\/tags\/edit\/([0-9]+)/)) {
        const idToEdit = parseInt(
          req.url.match(/\/api\/tags\/edit\/([0-9]+)/)[1]
        );
        let data = await getRequestData(req);
        data = JSON.parse(data);
        JsonController.editPhoto(data.id, {
          tags: data.tags,
          desc: data.desc,
        });
        res.writeHead(404, {
          "Content-Type": "text/plain;charset=utf-8",
        });
        res.end(
          JSON.stringify({
            status: "404",
            message: `zdjęcie zostało edytowane zostało edytowane`,
          })
        );
      }
      break;
  }
};

export default tagsRouter;
