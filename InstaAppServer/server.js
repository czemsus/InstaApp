import { createServer } from "http";
import imageRouter from "./app/imageRouter.js";
import tagsRouter from "./app/tagsRouter.js";
import filtersRouter from "./app/filtersRouter.js";
import usersRouter from "./app/usersRouter.js";
import profileRouter from "./app/profileRouter.js";
import "dotenv/config";
createServer(async (req, res) => {
  //images

  if (req.url.search("/api/photos") != -1) {
    await imageRouter(req, res);
  } else if (req.url.search("/api/tags") != -1) {
    await tagsRouter(req, res);
  } else if (req.url.search("/api/filters") != -1) {
    await filtersRouter(req, res);
  } else if (req.url.search("/api/getimage") != -1) {
    await filtersRouter(req, res);
  } else if (req.url.search("/api/user") != -1) {
    await usersRouter(req, res);
  } else if (req.url.search("/api/profile") != -1) {
    await profileRouter(req, res);
  } else if (req.url.search("/api/logout") != -1) {
    await profileRouter(req, res);
  }
}).listen(process.env.APP_PORT, () => console.log("listen on 3000"));
