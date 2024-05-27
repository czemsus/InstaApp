import path from "path";
import { User, users } from "./Model.js";
import getRequestData from "./getRequestData.js";

import { usersController } from "./usersController.js";
import { createToken, verifyToken } from "./jwt.js";
import { decryptPass } from "./bcrypt.js";
import { sendMail } from "./sendMail.js";

const __dirname = path.resolve();

const usersRouter = async (req, res) => {
  switch (req.method) {
    case "GET":
      if (req.url == "/api/user") {
        res.writeHead(200, {
          "Content-Type": "text/plain;charset=utf-8",
        });
        res.end(
          JSON.stringify({
            status: "200",
            users: users,
          })
        );
        break;
      } else if (
        req.url.match(
          /\/api\/user\/confirm\/(eyJ[A-Za-z0-9-_]+\.eyJ[A-Za-z0-9-_]+\.[A-Za-z0-9-_.+/]*)/
        )
      ) {
        const jwt = req.url.match(
          /\/api\/user\/confirm\/(eyJ[A-Za-z0-9-_]+\.eyJ[A-Za-z0-9-_]+\.[A-Za-z0-9-_.+/]*)/
        )[1];

        if (verifyToken(jwt) == "expired") {
          res.writeHead(200, {
            "Content-Type": "text/plain;charset=utf-8",
          });
          res.end(
            JSON.stringify({
              message: "Link wygasł",
            })
          );
        } else {
          res.writeHead(200, {
            "Content-Type": "text/plain;charset=utf-8",
          });
          res.end(
            JSON.stringify({
              message: "Konto aktywowane",
            })
          );
          let data = verifyToken(jwt);
          usersController.verifyAccount(data.email);
        }
      } else if (
        req.url.match(
          /\/api\/user\/checktoken\/(eyJ[A-Za-z0-9-_]+\.eyJ[A-Za-z0-9-_]+\.[A-Za-z0-9-_.+/]*)/
        )
      ) {
        const jwt = req.url.match(
          /\/api\/user\/checktoken\/(eyJ[A-Za-z0-9-_]+\.eyJ[A-Za-z0-9-_]+\.[A-Za-z0-9-_.+/]*)/
        )[1];
        let email = verifyToken(jwt).email;
        let valid;
        if (verifyToken(jwt) == "expired") {
          valid = false;
        } else {
          valid = true;
        }
        res.writeHead(200, {
          "Content-Type": "text/plain;charset=utf-8",
        });
        res.end(
          JSON.stringify({
            valid: valid,
            email: email,
          })
        );
      }
      break;
    case "POST":
      if (req.url == "/api/user/register") {
        let data = await getRequestData(req);
        data = JSON.parse(data);
        if (usersController.register(data)) {
          let token = await createToken(data.email);
          sendMail(data.email, token);

          res.writeHead(200, {
            "Content-Type": "text/plain;charset=utf-8",
          });
          res.end(
            JSON.stringify({
              content: `Potwiedź konto : http://localhost:3000/api/user/confirm/${token}`,
            })
          );
        } else {
          let msg = "juz jest taki mail";
          res.writeHead(200, {
            "Content-Type": "text/plain;charset=utf-8",
          });
          res.end(
            JSON.stringify({
              message: msg,
            })
          );
        }

        break;
      } else if (req.url == "/api/user/login") {
        let data = await getRequestData(req);
        data = JSON.parse(data);
        let loginInfo = await usersController.login(data.email, data.password);
        res.writeHead(200, {
          "Content-Type": "text/plain;charset=utf-8",
        });
        res.end(
          JSON.stringify({
            token: loginInfo.token,
            status: loginInfo.status,
            msg: loginInfo.msg,
          })
        );
        return;
      }
    case "DELETE":
      break;
    case "PATCH":
      break;
  }
};

export default usersRouter;
