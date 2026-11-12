import { query } from "./database.js";

export default class CommentsController {
  static async getComments(photoId) {
    const parsedPhotoId = Number(photoId);
    if (!Number.isSafeInteger(parsedPhotoId) || parsedPhotoId <= 0) {
      throw new Error("Missing photoId");
    }

    const result = await query(
      "SELECT * FROM comments WHERE photo_id = $1 ORDER BY created_at ASC",
      [parsedPhotoId],
    );
    return result.rows.map((comment) => ({
      id: Number(comment.id),
      photoId: Number(comment.photo_id),
      userEmail: comment.user_email,
      content: comment.content,
      createdAt: comment.created_at,
    }));
  }
}
