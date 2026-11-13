import CommentsController from "./commentsController.js";
import getRequestData from "./getRequestData.js";
import { verifyToken } from "./jwt.js";

const sendJson = (res, status, data) => {
  res.writeHead(status, { "Content-Type": "application/json;charset=utf-8" });
  res.end(JSON.stringify(data));
};

const commentsRouter = async (req, res) => {
  const requestPath = new URL(req.url, "http://localhost").pathname;
  const match = requestPath.match(
    /^\/api\/photos\/([0-9]+)\/comments(?:\/([0-9]+))?\/?$/,
  );
  if (!match) {
    sendJson(res, 404, { error: "Endpoint Not Found" });
    return;
  }

  const photoId = Number(match[1]);
  const commentId = match[2] ? Number(match[2]) : null;
  if (
    !Number.isSafeInteger(photoId) ||
    photoId <= 0 ||
    (commentId !== null &&
      (!Number.isSafeInteger(commentId) || commentId <= 0))
  ) {
    sendJson(res, 400, { error: "Invalid photo or comment ID" });
    return;
  }

  if (req.method === "GET" && commentId === null) {
    const authorization = req.headers.authorization;
    const token = authorization?.startsWith("Bearer ")
      ? authorization.slice(7)
      : null;
    if (token && verifyToken(token) === "expired") {
      sendJson(res, 401, { error: "Invalid or expired token" });
      return;
    }

    try {
      const comments = await CommentsController.getComments(photoId);
      sendJson(res, 200, { status: "200", data: comments });
    } catch (error) {
      console.error("Failed to fetch comments:", error);
      sendJson(res, 500, { error: "Failed to fetch comments" });
    }
    return;
  }

  if (req.method === "POST" && commentId === null) {
    const authorization = req.headers.authorization;
    const token = authorization?.startsWith("Bearer ")
      ? authorization.slice(7)
      : null;
    const tokenData = token ? verifyToken(token) : "expired";
    if (tokenData === "expired") {
      sendJson(res, 401, { error: "Authentication required" });
      return;
    }

    let data;
    try {
      data = JSON.parse(await getRequestData(req));
    } catch {
      sendJson(res, 400, { error: "Request body must be valid JSON" });
      return;
    }

    if (
      !data ||
      typeof data !== "object" ||
      typeof data.content !== "string" ||
      !data.content.trim() ||
      data.content.trim().length > 1000
    ) {
      sendJson(res, 400, {
        error: "Comment content must contain 1 to 1000 characters",
      });
      return;
    }

    try {
      const comment = await CommentsController.addComment(
        photoId,
        tokenData.email,
        data.content,
      );
      sendJson(res, 201, { status: "success", data: comment });
    } catch (error) {
      console.error("Failed to create comment:", error);
      if (error.code === "23503") {
        sendJson(res, 404, {
          error: "Nie znaleziono zdjęcia lub użytkownika dla komentarza.",
        });
        return;
      }
      sendJson(res, 500, { error: "Failed to create comment" });
    }
    return;
  }

  if (req.method === "DELETE" && commentId !== null) {
    const authorization = req.headers.authorization;
    const token = authorization?.startsWith("Bearer ")
      ? authorization.slice(7)
      : null;
    const tokenData = token ? verifyToken(token) : "expired";
    if (tokenData === "expired") {
      sendJson(res, 401, { error: "Authentication required" });
      return;
    }

    try {
      const deleted = await CommentsController.deleteComment(
        photoId,
        commentId,
        tokenData.email,
      );
      if (deleted === null) {
        sendJson(res, 404, { error: "Comment not found" });
      } else if (!deleted) {
        sendJson(res, 403, {
          error: "Only the comment author or photo author can delete it",
        });
      } else {
        sendJson(res, 200, { status: "success" });
      }
    } catch (error) {
      console.error("Failed to delete comment:", error);
      sendJson(res, 500, { error: "Failed to delete comment" });
    }
    return;
  }

  res.setHeader("Allow", commentId === null ? "GET, POST" : "DELETE");
  sendJson(res, 405, { error: "Method Not Allowed" });
};

export default commentsRouter;
