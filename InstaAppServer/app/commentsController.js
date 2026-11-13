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

  static async deleteComment(photoId, commentId, userEmail) {
    const parsedPhotoId = Number(photoId);
    const parsedCommentId = Number(commentId);
    if (
      !Number.isSafeInteger(parsedPhotoId) ||
      parsedPhotoId <= 0 ||
      !Number.isSafeInteger(parsedCommentId) ||
      parsedCommentId <= 0
    ) {
      throw new Error("Invalid comment or photo ID");
    }

    if (typeof userEmail !== "string" || !userEmail.trim()) {
      throw new Error("Invalid userEmail");
    }

    const result = await query(
      `DELETE FROM comments AS c
       USING photos AS p
       WHERE c.id = $1
         AND c.photo_id = $2
         AND p.id = c.photo_id
         AND (c.user_email = $3 OR p.album = $3)
       RETURNING c.id`,
      [parsedCommentId, parsedPhotoId, userEmail.trim()],
    );
    if (result.rowCount > 0) {
      return true;
    }

    const existing = await query(
      "SELECT 1 FROM comments WHERE id = $1 AND photo_id = $2",
      [parsedCommentId, parsedPhotoId],
    );
    return existing.rowCount > 0 ? false : null;
  }
}
