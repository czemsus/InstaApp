import fs from "fs";
import TagsController from "./tagsController.js";
import getRequestData from "./getRequestData.js";
import JsonController from "./jsonController.js";

const tagsController = new TagsController();

const tagsRouter = async (req, res) => {
  try {
    switch (req.method) {
      case "GET":
        if (req.url === "/api/tags/raw") {
          res.writeHead(200, {
            "Content-Type": "application/json;charset=utf-8",
          });
          return res.end(
            JSON.stringify({
              status: "200",
              tags: tagsController.getRawTags(),
            }),
          );
        } else if (req.url === "/api/tags") {
          res.writeHead(200, {
            "Content-Type": "application/json;charset=utf-8",
          });
          return res.end(
            JSON.stringify({
              status: "200",
              tags: tagsController.getTags(),
            }),
          );
        } else if (req.url.match(/\/api\/tags\/([0-9]+)/)) {
          const idToFind = parseInt(req.url.match(/\/api\/tags\/([0-9]+)/)[1]);
          res.writeHead(200, {
            "Content-Type": "application/json;charset=utf-8",
          });
          return res.end(
            JSON.stringify({
              status: "200",
              tag: tagsController.findTag(idToFind),
            }),
          );
        }
        break;

      case "POST":
        if (req.url === "/api/tags") {
          let data = await getRequestData(req);
          data = JSON.parse(data);
          tagsController.addtag(data.name, data.popularity);
          res.writeHead(200, {
            "Content-Type": "application/json;charset=utf-8",
          });
          return res.end(
            JSON.stringify({
              status: "200",
              message: tagsController.message,
            }),
          );
        }
        break;

      case "DELETE":
        if (req.url.match(/\/api\/photos\/([0-9]+)/)) {
          const idToDelete = parseInt(
            req.url.match(/\/api\/photos\/([0-9]+)/)[1],
          );
          const photoToDelete = await JsonController.getPhoto(idToDelete);

          if (photoToDelete) {
            await JsonController.deletePhoto(idToDelete);
            if (fs.existsSync(photoToDelete.url)) {
              await fs.promises.unlink(photoToDelete.url);
            }
            res.writeHead(200, {
              "Content-Type": "application/json;charset=utf-8",
            });
            return res.end(
              JSON.stringify({
                status: "200",
                message: `Photo with ID ${idToDelete} deleted successfully`,
              }),
            );
          } else {
            res.writeHead(404, {
              "Content-Type": "application/json;charset=utf-8",
            });
            return res.end(
              JSON.stringify({
                status: "404",
                message: `Photo with ID ${idToDelete} not found`,
              }),
            );
          }
        }
        break;

      case "PATCH":
        if (req.url.match(/\/api\/tags\/edit\/([0-9]+)/)) {
          const idToEdit = parseInt(
            req.url.match(/\/api\/tags\/edit\/([0-9]+)/)[1],
          );
          let rawData = await getRequestData(req);
          let data = JSON.parse(rawData);

          const updatedPhoto = await JsonController.editPhoto(idToEdit || data.id, {
            tags: data.tags,
            desc: data.description ?? data.desc,
            history: data.history,
          });

          if (!updatedPhoto) {
            res.writeHead(404, {
              "Content-Type": "application/json;charset=utf-8",
            });
            return res.end(
              JSON.stringify({
                status: "404",
                message: `Photo with ID ${idToEdit} not found`,
              }),
            );
          }

          res.writeHead(200, {
            "Content-Type": "application/json;charset=utf-8",
          });
          return res.end(
            JSON.stringify({
              status: "200",
              message: "Photo updated successfully",
              photo: updatedPhoto,
            }),
          );
        }
        break;
    }

    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Route not found in tagsRouter" }));
  } catch (error) {
    console.error("tagsRouter Error:", error);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: error.message }));
  }
};

export default tagsRouter;
