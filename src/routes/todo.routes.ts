import express from "express";
import {
  createTodo,
  deleteTodo,
  getTodoById,
  getTodos,
  toggleDone,
  updateTodo,
} from "../controller/todo.controller";

const router = express.Router();

const asyncHandler =
  (fn: any) =>
  (req: express.Request, res: express.Response, next: express.NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);

router
  .route("/todos")
  .get(asyncHandler(getTodos))
  .post(asyncHandler(createTodo));

router
  .route("/todos/:id")
  .get(asyncHandler(getTodoById))
  .put(asyncHandler(updateTodo))
  .delete(asyncHandler(deleteTodo));

router.patch("/todos/:id/done", asyncHandler(toggleDone));

export default router;
