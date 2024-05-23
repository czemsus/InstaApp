import { photos } from "./Model.js";
import Photo from "./Model.js";

export default class JsonController {
  static images = photos

  constructor() {

  }
  static add = (album, originalName, url) => {
    let photo = new Photo(album, originalName, url);
    this.images.push(photo);
  }

  static deletePhoto(id) {
    this.images = photos.filter((obj) => obj.id !== id);
  }

  static getPhotos() {
    return this.images
  }
};
