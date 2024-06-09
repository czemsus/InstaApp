import path from "path";
import FilterController from "./filtersController.js";
import { photos } from "./Model.js";
import fs from "fs";
import getRequestData from "./getRequestData.js";
const __dirname = path.resolve();
const filtersController = new FilterController();

const filtersRouter = async (req, res) => {
  switch (req.method) {
    case "GET":
      if (req.url.match(/\/api\/filters\/metadata\/([0-9]+)/)) {
        const idToFind = parseInt(
          req.url.match(/\/api\/filters\/metadata\/([0-9]+)/)[1]
        );
        let a = await filtersController.getMeta(idToFind);
        res.writeHead(200, {
          "Content-Type": "text/plain;charset=utf-8",
        });
        res.end(
          JSON.stringify({
            status: "200",
            meta: a,
          })
        );
        break;
      } else if (req.url.match(/\/api\/getimage\/([0-9]+)/)) {
        let id = req.url.match(/\/api\/getimage\/([0-9]+)/)[1];
        let image = photos.filter((photo) => photo.id == id);
        let imagePath = image[0].url;
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
      break;
    case "DELETE":
      break;
    case "PATCH":
      if (req.url == "/api/filters") {
        let data = await getRequestData(req);
        data = JSON.parse(data);
        let img = photos.filter((photo) => photo.id == data.id);
        console.log(data);
        switch (data.filterType) {
          case "rotate":
            data.angle ? data.angle == data.angle : (data.angle = 0);
            filtersController.rotateImg(img[0].url, data.angle);
            break;
          case "resize":
            data.w ? data.w == data.w : (data.w = 200);
            data.h ? data.h == data.h : (data.h = 0);
            filtersController.resizeImg(img[0].url, data.w, data.h);
            break;
          case "reformat":
            data.format ? data.format == data.format : (data.format = "png");
            filtersController.reformatImg(img[0].url, data.format);
            break;
          case "crop":
            data.w ? data.w == data.w : (data.w = 200);
            data.h ? data.h == data.h : (data.h = 200);
            data.l ? data.l == data.l : (data.l = 20);
            data.t ? data.t == data.t : (data.t = 20);
            filtersController.cropImg(
              img[0].url,
              data.w,
              data.h,
              data.l,
              data.t
            );
            break;
          case "greyscale":
            filtersController.grayscaleImg(img[0].url);
            break;
          case "flip":
            filtersController.flipImg(img[0].url);
            break;
          case "flop":
            filtersController.flopImg(img[0].url);
            break;
          case "negate":
            filtersController.negateImg(img[0].url);
            break;
          case "tint":
            filtersController.tintImg(
              img[0].url,
              data.red,
              data.green,
              data.blue
            );

            break;
        }
      }
      break;
  }
};

export default filtersRouter;
