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
    this.images = photos.filter((obj) => obj.id != id);
  }

  static getPhotos() {
    return this.images;
  }

  static editPhoto(id, obj) {
    let photo = this.images.find((photo) => photo.id == id);

    if (photo) {
      if (obj.tags !== undefined) photo.tags = obj.tags;
      if (obj.desc !== undefined) photo.desc = obj.desc;
      if (obj.history !== undefined) photo.history = obj.history;
      return photo;
    } else {
      console.error(`Photo with id ${id} not found in memory`);
      return null;
    }
  }
}
