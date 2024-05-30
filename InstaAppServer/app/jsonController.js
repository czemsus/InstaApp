import { photos } from "./Model.js";
import Photo from "./Model.js";

export default class JsonController {
  static images = photos;

  constructor() {}
  static add = (album, originalName, url, tags, desc) => {
    let photo = new Photo(album, originalName, url, tags, desc);
    this.images.push(photo);
  };

  static deletePhoto(id) {
    this.images = photos.filter((obj) => obj.id !== id);
  }

  static getPhotos() {
    return this.images;
  }
}
