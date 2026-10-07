import path from "path";
import JsonController from "./jsonController.js";
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
    await this.processImage(filePath, (image) => image.rotate(parseInt(angle)));
  }

  async resizeImg(filePath, w, h) {
    await this.processImage(filePath, (image) =>
      image.resize({
        width: parseInt(w),
        height: parseInt(h),
      })
    );
  }

  async reformatImg(filePath, format) {
    await this.processImage(filePath, (image) => image.toFormat(format));
  }

  async cropImg(filePath, w, h, l, t) {
    await this.processImage(filePath, (image) =>
      image.extract({
        width: parseInt(w),
        height: parseInt(h),
        left: parseInt(l),
        top: parseInt(t),
      })
    );
  }

  async grayscaleImg(filePath) {
    await this.processImage(filePath, (image) => image.grayscale());
  }

  async flipImg(filePath) {
    await this.processImage(filePath, (image) => image.flip());
  }

  async flopImg(filePath) {
    await this.processImage(filePath, (image) => image.flop());
  }

  async negateImg(filePath) {
    await this.processImage(filePath, (image) => image.negate());
  }

  async tintImg(filePath, red, green, blue) {
    await this.processImage(filePath, (image) =>
      image.tint({ r: parseInt(red), g: parseInt(green), b: parseInt(blue) })
    );
  }

  async processImage(filePath, transformFunction) {
    try {
      const imageBuffer = await fs.promises.readFile(filePath);
      const processedImageBuffer = await transformFunction(
        sharp(imageBuffer)
      ).toBuffer();
      await fs.promises.writeFile(filePath, processedImageBuffer);
    } catch (error) {
      throw new Error(`Failed to process image: ${error.message}`);
    }
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
