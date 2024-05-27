import { encryptPass } from "./bcrypt.js";

export default class Photo {
  constructor(album, originalName, url) {
    this.id = Date.now();
    this.album = album;
    this.originalName = originalName;
    this.owner = "";
    this.url = url;
    this.lastChange = "original";
    this.history = [{ status: "original", timestamp: Date.now() }];
    this.tags = [];
    this.desc = "";
  }
}

export class User {
  constructor(name, lastname, mail) {
    this.id = users.length;
    this.name = name;
    this.lastname = lastname;
    this.mail = mail;
    this.confirmed = false;
    this.bio = "";
  }
}

let photos = [];
let tagsObjects = [];
let users = [];
let usedTokens = [];

let tags = [
  "#love",
  "#instagood",
  "#fashion",
  "#instagram",
  "#photooftheday",
  "#art",
  "#photography",
  "#beautiful",
  "#nature",
  "#picoftheday",
  "#travel",
  "#happy",
  "#cute",
  "#instadaily",
  "#style",
  "#tbt",
  "#repost",
  "#followme",
  "#summer",
  "#reels",
  "#like4like",
  "#beauty",
  "#fitness",
  "#food",
];

for (let i = 0; i < tags.length; i++) {
  let tag = {
    id: i,
    name: tags[i],
    popularity: parseInt(Math.random() * 500).toFixed(),
  };
  tagsObjects.push(tag);
}

export { photos };
export { tags, tagsObjects, users, usedTokens };
