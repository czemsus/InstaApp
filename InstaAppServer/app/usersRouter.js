import path from "path";
import fs from "fs/promises";
import getRequestData from "./getRequestData.js";
import { usersController } from "./usersController.js";
import { createToken, verifyToken } from "./jwt.js";
import { sendMail } from "./sendMail.js";
import { fileURLToPath } from "url";

const uploadsDirectory = fileURLToPath(new URL("../uploads/", import.meta.url));

const sendJson = (res, status, data) => {
  res.writeHead(status, { "Content-Type": "application/json;charset=utf-8" });
  res.end(JSON.stringify(data));
};

const usersRouter = async (req, res) => {
  if (req.method === "GET") {
    if (req.url === "/api/user") {
      sendJson(res, 200, {
        status: "200",
        users: await usersController.getUsers(),
      });
      return;
    }

    const confirmationMatch = req.url.match(
      /\/api\/user\/confirm\/(eyJ[A-Za-z0-9-_]+\.eyJ[A-Za-z0-9-_]+\.[A-Za-z0-9-_.+/]*)/,
    );
    if (confirmationMatch) {
      const data = verifyToken(confirmationMatch[1]);
      if (data === "expired") {
        sendJson(res, 200, { message: "Link wygasł" });
      } else {
        await usersController.verifyAccount(data.email);
        sendJson(res, 200, { message: "Konto aktywowane" });
      }
      return;
    }

    const checkTokenMatch = req.url.match(
      /\/api\/user\/checktoken\/(eyJ[A-Za-z0-9-_]+\.eyJ[A-Za-z0-9-_]+\.[A-Za-z0-9-_.+/]*)/,
    );
    if (checkTokenMatch) {
      const data = verifyToken(checkTokenMatch[1]);
      sendJson(res, 200, {
        valid: data !== "expired",
        email: data === "expired" ? undefined : data.email,
      });
      return;
    }

    const emailMatch = req.url.match(
      /\/api\/user\/([^\s@]+@[^\s@]+\.[^\s@]+)$/,
    );
    if (emailMatch) {
      const user = await usersController.getUser(emailMatch[1]);
      sendJson(res, 200, { user: user || false });
    }
    return;
  }

  if (req.method === "POST") {
    if (req.url === "/api/user/register") {
      const data = JSON.parse(await getRequestData(req));
      if (!(await usersController.register(data))) {
        sendJson(res, 409, {
          status: "error",
          msg: "Konto z tym adresem e-mail już istnieje.",
        });
        return;
      }

      const token = await createToken(data.email);
      await sendMail(data.email, token);

      const directoryPath = path.join(uploadsDirectory, data.email);
      await fs.mkdir(directoryPath, { recursive: true });
      await fs.copyFile(
        path.join(uploadsDirectory, "pfp.png"),
        path.join(directoryPath, "profile.png"),
      );

      sendJson(res, 200, {
        status: "success",
        msg: "Konto utworzone. Sprawdź e-mail, aby je potwierdzić.",
      });
      return;
    }

    if (req.url === "/api/user/login") {
      const data = JSON.parse(await getRequestData(req));
      const loginInfo = await usersController.login(data.email, data.password);
      sendJson(res, 200, {
        token: loginInfo.token,
        status: loginInfo.status,
        msg: loginInfo.msg,
      });
    }
  }
};

export default usersRouter;
