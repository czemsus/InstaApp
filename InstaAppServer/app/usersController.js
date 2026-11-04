import { query } from "./database.js";
import { decryptPass, encryptPass } from "./bcrypt.js";
import { createToken } from "./jwt.js";

const mapUser = (row) => ({
  id: Number(row.id),
  name: row.name,
  lastname: row.lastname,
  mail: row.mail,
  pass: row.pass,
  confirmed: row.confirmed,
  bio: row.bio,
  image: row.image,
});

export const usersController = {
  register: async (data) => {
    const encryptedPassword = await encryptPass(data.password);
    try {
      await query(
        `INSERT INTO users (name, lastname, mail, pass)
         VALUES ($1, $2, $3, $4)`,
        [data.name, data.lastname, data.email, encryptedPassword],
      );
      return true;
    } catch (error) {
      if (error.code === "23505") {
        return false;
      }
      throw error;
    }
  },

  getTokenFromUrl: (req) => {
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      return req.headers.authorization.split(" ")[1];
    }
    return undefined;
  },

  getUser: async (email) => {
    const result = await query("SELECT * FROM users WHERE mail = $1", [email]);
    return result.rows[0] ? mapUser(result.rows[0]) : null;
  },

  getUsers: async () => {
    const result = await query("SELECT * FROM users ORDER BY id");
    return result.rows.map(mapUser);
  },

  login: async (email, pass) => {
    const user = await usersController.getUser(email);
    if (user) {
      if (await decryptPass(pass, user.pass)) {
        if (user.confirmed) {
          const token = await createToken(email);
          return { token, msg: "Udane logowanie", status: "success" };
        }
        return {
          token: null,
          msg: "Konto nie zostało potwierdzone",
          status: "error",
        };
      }
      return { token: null, msg: "Hasła się nie zgadzają", status: "error" };
    }
    return {
      token: null,
      msg: "Nie ma użytkownika z takim mailem",
      status: "error",
    };
  },

  verifyAccount: async (mail) => {
    await query("UPDATE users SET confirmed = TRUE WHERE mail = $1", [mail]);
  },

  modifyUserData: async (email, name, lastname, bio) => {
    const result = await query(
      `UPDATE users
       SET name = CASE WHEN $2::text IS NULL OR $2 = '' THEN name ELSE $2 END,
           lastname = CASE WHEN $3::text IS NULL OR $3 = '' THEN lastname ELSE $3 END,
           bio = COALESCE($4, bio)
       WHERE mail = $1
       RETURNING *`,
      [email, name || null, lastname || null, bio],
    );
    return result.rows[0] ? mapUser(result.rows[0]) : null;
  },
};
