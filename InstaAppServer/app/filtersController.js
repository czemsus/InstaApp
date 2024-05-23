import path from "path";
import JsonController from "./JsonController.js";
import sharp from "sharp";
import fs from "fs";

const __dirname = path.resolve();

export default class FilterController {
  constructor() {}

  getMeta(id) {
    return new Promise(async (resolve, reject) => {
      try {
        let image = JsonController.getPhotos().find((obj) => obj.id === id);
        if (!image) {
          reject(new Error("Image not found"));
          return;
        }

        const imagePath = path.join(image.url);
        if (!fs.existsSync(imagePath)) {
          reject(new Error("Image file not found"));
          return;
        }

        let meta = await sharp(imagePath).metadata();
        resolve(meta);
      } catch (err) {
        reject(err);
      }
    });
  }

  async rotateImg(filePath, angle) {
    let obj = this.getFilename(filePath);
    const outputFilename = `${obj.name}_rotated.${obj.type}`;
    const outputPath = path.join(__dirname, "uploads", outputFilename);
    await sharp(filePath).rotate(angle).toFile(outputPath);
  }

  async resizeImg(filePath, w, h) {
    let obj = this.getFilename(filePath);
    const outputFilename = `${obj.name}_resized.${obj.type}`;
    const outputPath = path.join(__dirname, "uploads", outputFilename);
    await sharp(filePath)
      .resize({
        width: w,
        height: h,
      })
      .toFile(outputPath);
  }

  async reformatImg(filePath, format) {
    let obj = this.getFilename(filePath);
    const outputFilename = `${obj.name}_reformated.${format}`;
    const outputPath = path.join(__dirname, "uploads", outputFilename);
    await sharp(filePath).toFormat(format).toFile(outputPath);
  }

  async cropImg(filePath, w, h, l, t) {
    let obj = this.getFilename(filePath);
    const outputFilename = `${obj.name}_cropped.${obj.type}`;
    const outputPath = path.join(__dirname, "uploads", outputFilename);
    await sharp(filePath)
      .extract({ width: w, height: h, left: l, top: t })
      .toFile(outputPath);
  }

  async grayscaleImg(filePath) {
    let obj = this.getFilename(filePath);
    const outputFilename = `${obj.name}_grayscaled.${obj.type}`;
    const outputPath = path.join(__dirname, "uploads", outputFilename);
    await sharp(filePath).grayscale().toFile(outputPath);
  }

  async flipImg(filePath) {
    let obj = this.getFilename(filePath);
    const outputFilename = `${obj.name}_flipped.${obj.type}`;
    const outputPath = path.join(__dirname, "uploads", outputFilename);
    await sharp(filePath).flip().toFile(outputPath);
  }

  async flopImg(filePath) {
    let obj = this.getFilename(filePath);
    const outputFilename = `${obj.name}_flopped.${obj.type}`;
    const outputPath = path.join(__dirname, "uploads", outputFilename);
    await sharp(filePath).flop().toFile(outputPath);
  }

  async negateImg(filePath) {
    let obj = this.getFilename(filePath);
    const outputFilename = `${obj.name}_negated.${obj.type}`;
    const outputPath = path.join(__dirname, "uploads", outputFilename);
    await sharp(filePath).negate().toFile(outputPath);
  }

  async tintImg(filePath, red, green, blue) {
    let obj = this.getFilename(filePath);
    const outputFilename = `${obj.name}_tinted.${obj.type}`;
    const outputPath = path.join(__dirname, "uploads", outputFilename);
    await sharp(filePath)
      .tint({ r: red, g: green, b: blue })
      .toFile(outputPath);
  }

  getFilename(filePath) {
    const pattern = /(.*)\/(.*)/;
    const matches = filePath.match(pattern);
    const file = matches[2];
    const pattern1 = /(.*)\.(.*)/;
    const matches1 = file.match(pattern1);
    const filename = matches1[1];
    const filetype = matches1[2];
    return { name: filename, type: filetype };
  }
}
