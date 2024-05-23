import bcryptjs from "bcryptjs";
const { hash, compare } = bcryptjs;


export const encryptPass= async (password, user) => {

    let encryptedPassword = await hash(password, 10);
    user.pass = encryptedPassword

    }

export const decryptPass= async (userpass, encrypted) => {

        let decrypted = await compare(userpass, encrypted)
        return decrypted

    }
