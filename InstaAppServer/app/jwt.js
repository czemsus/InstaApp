import jsonwebtoken from "jsonwebtoken";
import "dotenv/config";

const { sign, verify } = jsonwebtoken;

export const createToken = async (mail) => {
  let token = await sign(
    {
      email: mail,
    },
    process.env.SECRET_KEY,
    {
      expiresIn: "2s",
    }
  );
  return token;
};

export const verifyToken = (token) => {
  try {
    let decoded = verify(token, process.env.SECRET_KEY);
    return decoded;
  } catch (ex) {
    return "expired";
  }
};
