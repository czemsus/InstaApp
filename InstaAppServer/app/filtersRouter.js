import FilterController from "./filtersController.js";
import fs from "fs";
import getRequestData from "./getRequestData.js";
import JsonController from "./jsonController.js";

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
          let image = await JsonController.getPhoto(id);

          if (!image?.url || !fs.existsSync(image.url)) {
            res.writeHead(404, { "Content-Type": "application/json" });
            return res.end(
              JSON.stringify({ error: "Image not found on disk" }),
            );
          }

          fs.readFile(image.url, (err, data) => {
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

          let img = await JsonController.getPhoto(data.id);

          if (!img?.url) {
            res.writeHead(404, { "Content-Type": "application/json" });
            return res.end(JSON.stringify({ error: "Photo ID not found" }));
          }

          if (!fs.existsSync(img.url)) {
            res.writeHead(404, { "Content-Type": "application/json" });
            return res.end(
              JSON.stringify({ error: "Image file does not exist on server" }),
            );
          }

          let result;
          switch (data.filterType) {
            case "rotate":
              result = await filtersController.rotateImg(
                img.url,
                data.angle || 0,
              );
              break;
            case "resize":
              result = await filtersController.resizeImg(
                img.url,
                data.width,
                data.height,
              );
              break;
            case "reformat":
              result = await filtersController.reformatImg(
                img.url,
                data.format || "png",
              );
              break;
            case "crop":
              result = await filtersController.cropImg(
                img.url,
                data.w || 200,
                data.h || 200,
                data.l || 20,
                data.t || 20,
              );
              break;
            case "greyscale":
              result = await filtersController.grayscaleImg(img.url);
              break;
            case "flip":
              result = await filtersController.flipImg(img.url);
              break;
            case "flop":
              result = await filtersController.flopImg(img.url);
              break;
            case "negate":
              result = await filtersController.negateImg(img.url);
              break;
            case "tint":
              result = await filtersController.tintImg(
                img.url,
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
