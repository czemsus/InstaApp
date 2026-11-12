import { query } from "./database.js";

export default class CommentsController {
  static async addComment(photoId, userEmail, content) {
    const parsedPhotoId = Number(photoId);
    if (!Number.isSafeInteger(parsedPhotoId) || parsedPhotoId <= 0) {
      throw new Error("Invalid photoId");
    }

    if (typeof userEmail !== "string" || !userEmail.trim()) {
      throw new Error("Invalid userEmail");
    }

    if (typeof content !== "string" || !content.trim()) {
      throw new Error("Comment content is required");
    }

    const result = await query(
      `INSERT INTO comments (photo_id, user_email, content)
       VALUES ($1, $2, $3)
       RETURNING id, photo_id, user_email, content, created_at`,
      [parsedPhotoId, userEmail.trim(), content.trim()],
    );
    const comment = result.rows[0];

    return {
      id: Number(comment.id),
      photoId: Number(comment.photo_id),
      userEmail: comment.user_email,
      content: comment.content,
      createdAt: comment.created_at,
    };
  }

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
