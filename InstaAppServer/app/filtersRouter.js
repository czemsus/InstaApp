import path from "path";
import FilterController from "./filtersController.js";
import { photos } from "./Model.js";
import fs from "fs";
import getRequestData from "./getRequestData.js";

const __dirname = path.resolve();
const filtersController = new FilterController();

const filtersRouter = async (req, res) => {
  try {
    switch (req.method) {
      case "GET":
        if (req.url.match(/\/api\/filters\/metadata\/([0-9]+)/)) {
          const idToFind = parseInt(
            req.url.match(/\/api\/filters\/metadata\/([0-9]+)/)[1],
          );
          let metaData = await filtersController.getMeta(idToFind);

          res.writeHead(200, {
            "Content-Type": "application/json;charset=utf-8",
          });
          return res.end(
            JSON.stringify({
              status: "200",
              meta: metaData,
            }),
          );
        } else if (req.url.match(/\/api\/getimage\/([0-9]+)/)) {
          let id = req.url.match(/\/api\/getimage\/([0-9]+)/)[1];
          let image = photos.filter((photo) => photo.id == id);

          if (!image.length || !image[0].url || !fs.existsSync(image[0].url)) {
            res.writeHead(404, { "Content-Type": "application/json" });
            return res.end(
              JSON.stringify({ error: "Image not found on disk" }),
            );
          }

          fs.readFile(image[0].url, (err, data) => {
            if (err) {
              res.writeHead(404, { "Content-Type": "text/plain" });
              res.end("Image not found");
            } else {
              res.writeHead(200, { "Content-Type": "image/jpeg" });
              res.end(data);
            }
          });
          return;
        }
        break;

      case "PATCH":
        if (req.url === "/api/filters") {
          let rawData = await getRequestData(req);
          let data = JSON.parse(rawData);

          let img = photos.filter((photo) => photo.id == data.id);

          if (!img.length || !img[0].url) {
            res.writeHead(404, { "Content-Type": "application/json" });
            return res.end(JSON.stringify({ error: "Photo ID not found" }));
          }

          if (!fs.existsSync(img[0].url)) {
            res.writeHead(404, { "Content-Type": "application/json" });
            return res.end(
              JSON.stringify({ error: "Image file does not exist on server" }),
            );
          }

          let result;
          switch (data.filterType) {
            case "rotate":
              result = await filtersController.rotateImg(
                img[0].url,
                data.angle || 0,
              );
              break;
            case "resize":
              result = await filtersController.resizeImg(
                img[0].url,
                data.width,
                data.height,
              );
              break;
            case "reformat":
              result = await filtersController.reformatImg(
                img[0].url,
                data.format || "png",
              );
              break;
            case "crop":
              result = await filtersController.cropImg(
                img[0].url,
                data.w || 200,
                data.h || 200,
                data.l || 20,
                data.t || 20,
              );
              break;
            case "greyscale":
              result = await filtersController.grayscaleImg(img[0].url);
              break;
            case "flip":
              result = await filtersController.flipImg(img[0].url);
              break;
            case "flop":
              result = await filtersController.flopImg(img[0].url);
              break;
            case "negate":
              result = await filtersController.negateImg(img[0].url);
              break;
            case "tint":
              result = await filtersController.tintImg(
                img[0].url,
                data.red,
                data.green,
                data.blue,
              );
              break;
            default:
              res.writeHead(400, { "Content-Type": "application/json" });
              return res.end(JSON.stringify({ error: "Invalid filterType" }));
          }

          res.writeHead(200, { "Content-Type": "application/json" });
          return res.end(
            JSON.stringify({
              status: "success",
              message: "Filter applied successfully",
              data: result,
            }),
          );
        }
        break;

      default:
        res.writeHead(405, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ error: "Method Not Allowed" }));
    }

    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Endpoint Not Found" }));
  } catch (error) {
    console.error("Router error:", error.message);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: error.message }));
  }
};

export default filtersRouter;
