import { users, User } from "./Model.js";
import { decryptPass, encryptPass } from "./bcrypt.js";
import { createToken } from "./jwt.js";

export const usersController = {
  register: (data) => {
    if (!users.some((user) => user.mail == data.email)) {
      let user = new User(data.name, data.lastname, data.email);
      encryptPass(data.password, user);
      users.push(user);

      return true;
    } else {
      return false;
    }
  },

  getTokenFromUrl: (req, res) => {
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      let token = req.headers.authorization.split(" ")[1];
      return token;
    }
  },

  login: async (email, pass) => {
    let user = users.find((user) => user.mail == email);
    if (user) {
      if (await decryptPass(pass, user.pass)) {
        if (user.confirmed) {
          let token = await createToken(email);
          return { token: token, msg: "Udane logowanie", status: "success" };
        } else {
          return {
            token: null,
            msg: "Konto nie zostało potwierdzone",
            status: "error",
          };
        }
      } else {
        return { token: null, msg: "Hasła się nie zgadzają", status: "error" };
      }
    } else {
      return {
        token: null,
        msg: "Nie ma użytkownika z takim mailem",
        status: "error",
      };
    }
  },

  verifyAccount: (mail) => {
    let userToVerify = users.find((user) => user.mail == mail);
    userToVerify.confirmed = true;
  },
  modifyUserData(email, name, lastname) {
    let user = users.find((user) => user.mail == email);
    user.name = name;
    user.lastname = lastname;
  },
};
