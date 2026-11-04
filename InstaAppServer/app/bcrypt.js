import bcryptjs from "bcryptjs";
const { hash, compare } = bcryptjs;


export const encryptPass = async (password) => hash(password, 10);

export const decryptPass= async (userpass, encrypted) => {

        let decrypted = await compare(userpass, encrypted)
        return decrypted

    }
