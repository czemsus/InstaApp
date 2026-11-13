import { createServer } from "http";
import imageRouter from "./app/imageRouter.js";
import tagsRouter from "./app/tagsRouter.js";
import filtersRouter from "./app/filtersRouter.js";
import usersRouter from "./app/usersRouter.js";
import profileRouter from "./app/profileRouter.js";
import commentsRouter from "./app/commentsRouter.js";
import "dotenv/config";
import { initializeDatabase } from "./app/database.js";

const PORT = process.env.PORT || 3000;

const server = createServer(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Request-Method", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PATCH, PUT, DELETE",
  );
  res.setHeader("Access-Control-Allow-Headers", "*, Authorization");

  if (req.method === "OPTIONS") {
    res.writeHead(200);
    res.end();
    return;
  }

  try {
    const url = req.url;

    if (
      new URL(url, "http://localhost").pathname.match(
        /^\/api\/photos\/[0-9]+\/comments(?:\/[0-9]+)?\/?$/,
      )
    ) {
      await commentsRouter(req, res);
    } else if (url.includes("/api/photos")) {
      await imageRouter(req, res);
    } else if (url.includes("/api/tags")) {
      await tagsRouter(req, res);
    } else if (url.includes("/api/filters") || url.includes("/api/getimage")) {
      await filtersRouter(req, res);
    } else if (url.includes("/api/user")) {
      await usersRouter(req, res);
    } else if (url.includes("/api/profile") || url.includes("/api/logout")) {
      await profileRouter(req, res);
    } else if (url.includes("/api/comments")) {
      await commentsRouter(req, res);
    } else {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Endpoint not found" }));
    }
  } catch (error) {
    console.error("Server Error:", error);
    if (!res.headersSent) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Internal Server Error" }));
    }
  }
});

await initializeDatabase();

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
