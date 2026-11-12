import fs from "fs/promises";
import path from "path";
import formidable from "formidable";
import JsonController from "./jsonController.js";
import getRequestData from "./getRequestData.js";
import { verifyToken } from "./jwt.js";
import { fileURLToPath } from "url";

const uploadsDirectory = fileURLToPath(new URL("../uploads/", import.meta.url));

const parseForm = (req) =>
  new Promise((resolve, reject) => {
    new formidable.IncomingForm().parse(req, (error, fields, files) => {
      if (error) {
        reject(error);
      } else {
        resolve({ fields, files });
      }
    });
  });

const imageRouter = async (req, res) => {
  switch (req.method) {
    case "GET": {
      if (req.url === "/api/photos") {
        const authorization = req.headers.authorization;
        const token = authorization?.startsWith("Bearer ")
          ? authorization.slice(7)
          : null;
        const tokenData = token ? verifyToken(token) : null;
        if (token && tokenData === "expired") {
          res.writeHead(401, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Invalid or expired token" }));
          return;
        }

        const photos = await JsonController.getPhotos(tokenData?.email ?? null);
        res.writeHead(200, {
          "Content-Type": "application/json;charset=utf-8",
        });
        res.end(JSON.stringify({ status: "200", data: photos }));
        return;
      }

      const tagsMatch = req.url.match(/\/api\/photos\/tags\/([0-9]+)/);
      const photoMatch = req.url.match(/\/api\/photos\/([0-9]+)/);
      const id = Number((tagsMatch || photoMatch)?.[1]);
      if (tagsMatch || photoMatch) {
        const photo = await JsonController.getPhoto(id);
        if (!photo) {
          res.writeHead(404, {
            "Content-Type": "application/json;charset=utf-8",
          });
          res.end(
            JSON.stringify({
              status: "404",
              message: "Nie ma zdjęcia z takim ID",
            }),
          );
          return;
        }

        res.writeHead(200, {
          "Content-Type": "application/json;charset=utf-8",
        });
        res.end(
          JSON.stringify(
            tagsMatch
              ? { status: "200", id, tags: photo.tags }
              : { status: "200", data: photo },
          ),
        );
      }
      return;
    }

    case "POST": {
      const tokenMatch = req.url.match(
        /\/api\/photos\/(eyJ[A-Za-z0-9-_]+\.eyJ[A-Za-z0-9-_]+\.[A-Za-z0-9-_.+/]*)/,
      );
      if (!tokenMatch) {
        return;
      }

      const tokenData = verifyToken(tokenMatch[1]);
      if (tokenData === "expired") {
        res.writeHead(401, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Invalid or expired token" }));
        return;
      }

      const { fields, files } = await parseForm(req);
      const uploadedFile = Array.isArray(files.file)
        ? files.file[0]
        : files.file;
      if (!uploadedFile) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "An image file is required" }));
        return;
      }

      const directory = path.join(uploadsDirectory, tokenData.email);
      const filePath = path.join(directory, path.basename(uploadedFile.name));
      await fs.mkdir(directory, { recursive: true });
      await fs.copyFile(uploadedFile.path, filePath);

      try {
        await JsonController.add(
          tokenData.email,
          uploadedFile.name,
          filePath,
          JSON.parse(fields.tags || "[]"),
          fields.description,
        );
      } catch (error) {
        await fs.rm(filePath, { force: true });
        throw error;
      }

      res.writeHead(200, { "Content-Type": "application/json;charset=utf-8" });
      res.end(
        JSON.stringify({
          status: "200",
          message: "Plik przesłany pomyślnie",
        }),
      );
      return;
    }

    case "DELETE": {
      const match = req.url.match(/\/api\/photos\/([0-9]+)/);
      if (!match) {
        return;
      }
      const id = Number(match[1]);
      const photo = await JsonController.deletePhoto(id);
      if (!photo) {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            status: "404",
            message: `photo z id ${id} nie zostało znalezione`,
          }),
        );
        return;
      }

      try {
        await fs.unlink(photo.url);
      } catch (error) {
        if (error.code !== "ENOENT") {
          throw error;
        }
      }
      res.writeHead(200, { "Content-Type": "application/json;charset=utf-8" });
      res.end(
        JSON.stringify({
          status: "200",
          message: `photo z id ${id} zostało usunięte`,
        }),
      );
      return;
    }

    case "PATCH": {
      const likeMatch = req.url.match(/^\/api\/photos\/([0-9]+)\/like$/);
      if (likeMatch) {
        const authorization = req.headers.authorization;
        const token = authorization?.startsWith("Bearer ")
          ? authorization.slice(7)
          : null;
        const tokenData = token ? verifyToken(token) : "expired";
        if (tokenData === "expired") {
          res.writeHead(401, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Authentication required" }));
          return;
        }

        const data = JSON.parse(await getRequestData(req));
        if (typeof data.liked !== "boolean") {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({ error: "A boolean liked value is required" }),
          );
          return;
        }

        const id = Number(likeMatch[1]);
        const photo = await JsonController.getPhoto(id);
        if (!photo) {
          res.writeHead(404, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Photo not found" }));
          return;
        }

        const likesCount = await JsonController.setPhotoLike(
          id,
          tokenData.email,
          data.liked,
        );
        res.writeHead(200, {
          "Content-Type": "application/json;charset=utf-8",
        });
        res.end(
          JSON.stringify({
            status: "success",
            liked: data.liked,
            likesCount,
          }),
        );
        return;
      }

      const photoMatch = req.url.match(/\/api\/photos\/([0-9]+)/);
      if (photoMatch) {
        const id = Number(photoMatch[1]);
        const photo = await JsonController.getPhoto(id);
        if (!photo) {
          res.writeHead(404, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: `Photo with id ${id} not found` }));
          return;
        }
        photo.history.push({
          status: `zmienione ${photo.history.length} raz`,
          timestamp: Date.now(),
        });
        await JsonController.editPhoto(id, { history: photo.history });
        res.writeHead(200, {
          "Content-Type": "application/json;charset=utf-8",
        });
        res.end(
          JSON.stringify({
            status: "200",
            message: `photo z id ${id} zostało edytowane`,
          }),
        );
        return;
      }

      const tagMatch = req.url.match(/\/api\/photos\/tags\/([0-9]+)/);
      const massTagMatch = req.url.match(/\/api\/photos\/tags\/mass\/([0-9]+)/);
      if (!tagMatch && !massTagMatch) {
        return;
      }

      const id = Number((massTagMatch || tagMatch)[1]);
      const data = JSON.parse(await getRequestData(req));
      const photo = await JsonController.getPhoto(id);
      let status = 200;
      let message = "";

      if (massTagMatch) {
        if (photo) {
          for (const tag of data.array || []) {
            if (!photo.tags.some((item) => item.name === tag.name)) {
              photo.tags.push(tag);
              message += `dodano tag "${tag.name}" dla zdjęcia z id ${id}\n`;
            } else {
              message += `zdjęcie z id ${id} już ma tag "${tag.name}"\n`;
            }
          }
          photo.history.push({
            status: `zmienione ${photo.history.length} raz`,
            timestamp: Date.now(),
          });
          await JsonController.editPhoto(id, {
            tags: photo.tags,
            history: photo.history,
          });
        } else {
          status = 404;
          message = `Nie znaleziono zdjęcia z id ${id}`;
        }
      } else if (photo && !photo.tags.some((item) => item.name === data.name)) {
        photo.history.push({
          status: `zmienione ${photo.history.length} raz`,
          timestamp: Date.now(),
        });
        photo.tags.push(data);
        await JsonController.editPhoto(id, {
          tags: photo.tags,
          history: photo.history,
        });
        message = `dodano tag dla zdjęcia z id ${id}`;
      } else {
        message = "zdjęcie juz ma ten tag";
      }

      res.writeHead(status, {
        "Content-Type": "application/json;charset=utf-8",
      });
      res.end(JSON.stringify({ status, message }));
      return;
    }
  }
};

export default imageRouter;
