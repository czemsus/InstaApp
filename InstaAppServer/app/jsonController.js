import { query } from "./database.js";

const mapPhoto = (row) => ({
  id: Number(row.id),
  album: row.album,
  originalName: row.original_name,
  owner: row.owner,
  url: row.url,
  lastChange: row.last_change,
  history: row.history,
  tags: row.tags,
  desc: row.description ?? undefined,
  likesCount: Number(row.likes_count ?? 0),
  likedByUser: Boolean(row.liked_by_user ?? false),
});

export default class JsonController {
  static async add(album, originalName, url, tags, desc) {
    const timestamp = Date.now();
    const result = await query(
      `INSERT INTO photos (album, original_name, owner, url, last_change, history, tags, description)
       VALUES ($1, $2, '', $3, 'original', $4, $5, $6)
       RETURNING *`,
      [
        album,
        originalName,
        url,
        JSON.stringify([{ status: "original", timestamp }]),
        JSON.stringify(tags),
        desc ?? null,
      ],
    );
    return mapPhoto(result.rows[0]);
  }

  static async deletePhoto(id) {
    const result = await query("DELETE FROM photos WHERE id = $1 RETURNING *", [
      id,
    ]);
    return result.rows[0] ? mapPhoto(result.rows[0]) : null;
  }

  static async getPhotos(userEmail = null) {
    const result = await query(
      `SELECT photos.*,
              (SELECT COUNT(*) FROM photo_likes
               WHERE photo_likes.photo_id = photos.id) AS likes_count,
              EXISTS (
                SELECT 1 FROM photo_likes
                WHERE photo_likes.photo_id = photos.id
                  AND photo_likes.user_email = $1
              ) AS liked_by_user
       FROM photos
       ORDER BY id`,
      [userEmail],
    );
    return result.rows.map(mapPhoto);
  }

  static async setPhotoLike(id, userEmail, liked) {
    if (liked) {
      await query(
        `INSERT INTO photo_likes (photo_id, user_email)
         VALUES ($1, $2)
         ON CONFLICT (photo_id, user_email) DO NOTHING`,
        [id, userEmail],
      );
    } else {
      await query(
        "DELETE FROM photo_likes WHERE photo_id = $1 AND user_email = $2",
        [id, userEmail],
      );
    }

    const result = await query(
      "SELECT COUNT(*) AS likes_count FROM photo_likes WHERE photo_id = $1",
      [id],
    );
    return Number(result.rows[0].likes_count);
  }

  static async getPhoto(id) {
    const result = await query("SELECT * FROM photos WHERE id = $1", [id]);
    return result.rows[0] ? mapPhoto(result.rows[0]) : null;
  }

  static async editPhoto(id, updates) {
    const photo = await this.getPhoto(id);
    if (!photo) {
      return null;
    }

    const updated = {
      ...photo,
      ...(updates.tags !== undefined ? { tags: updates.tags } : {}),
      ...(updates.desc !== undefined ? { desc: updates.desc } : {}),
      ...(updates.history !== undefined ? { history: updates.history } : {}),
      ...(updates.lastChange !== undefined
        ? { lastChange: updates.lastChange }
        : {}),
    };

    const result = await query(
      `UPDATE photos
       SET tags = $2, description = $3, history = $4, last_change = $5
       WHERE id = $1
       RETURNING *`,
      [
        id,
        JSON.stringify(updated.tags),
        updated.desc ?? null,
        JSON.stringify(updated.history),
        updated.lastChange,
      ],
    );
    return result.rows[0] ? mapPhoto(result.rows[0]) : null;
  }
}
