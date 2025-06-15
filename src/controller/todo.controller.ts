import { Request, Response, NextFunction } from "express";
import { ObjectId } from "mongodb";
import { todoSchema } from "../validations/todo.validations";

import { getCollection } from "../config/db";
import { Todo } from "./todo.types";
import { TodoStatus } from "./todo.constant";

const collection = () => getCollection<any>("todos");

const toObjectId = (id: string): ObjectId => {
  try {
    return new ObjectId(id);
  } catch {
    throw { status: 400, message: "Invalid ID format" };
  }
};

export const createTodo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const parsed = todoSchema.parse(req.body);
    const todoToInsert: Todo = { ...parsed, done: false };
    const result = await collection().insertOne(todoToInsert);
    res.status(201).json({
      _id: result.insertedId,
      ...todoToInsert,
      message: "Todo has been created.",
    });
  } catch (err: any) {
    next({ status: 400, message: err?.errors || "Invalid request data" });
  }
};

export const getTodos = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { type, limit = "10", lastJobId } = req.query;

    const parsedLimit = Number(limit) || 10;
    const filter: Record<string, any> = {};

    if (type === TodoStatus.DONE) {
      filter.done = true;
    } else if (type === TodoStatus.UPCOMING) {
      filter.done = { $ne: true };
    }

    if (lastJobId) {
      try {
        filter._id = { $gt: new ObjectId(lastJobId as string) };
      } catch {
        return res.status(400).json({ message: "Invalid 'lastJobId' format." });
      }
    }

    const todos = await collection()
      .find(filter)
      .sort({ _id: 1 })
      .limit(parsedLimit)
      .toArray();

    const hasMore = todos.length === parsedLimit;

    res.status(200).json({
      todos,
      hasMore,
    });
  } catch (error) {
    next({
      status: 500,
      message: "Failed to fetch todos",
    });
  }
};

export const getTodoById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const _id = toObjectId(req.params.id);
    const todo = await collection().findOne({ _id });
    if (todo) return res.json({ todo });

    throw { status: 404, message: "Todo not found" };
  } catch (err) {
    next(err);
  }
};

export const updateTodo = async (
  req: Request<{ id: string }, any, Todo>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const _id = toObjectId(req.params.id);
    const parsed = todoSchema.parse(req.body);
    console.log(parsed);
    const result = await collection().findOneAndUpdate(
      { _id },
      { $set: parsed },
      { returnDocument: "after" }
    );

    if (result) {
      res.status(200).json({ result, message: "Todo has been updated" });
      return;
    }

    res.status(404).json({ message: "Todo not found" });
  } catch (err: any) {
    next({
      status: 400,
      message: err?.errors || err.message || "Update failed",
    });
  }
};

export const deleteTodo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const _id = toObjectId(req.params.id);
    const result = await collection().deleteOne({ _id });
    if (result.deletedCount)
      return res.status(200).json({ message: "Todo deleted" });

    throw { status: 404, message: "Todo not found" };
  } catch (err) {
    next(err);
  }
};

export const toggleDone = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const _id = toObjectId(req.params.id);

    const todo = await collection().findOne({ _id });

    if (todo) {
      const result = await collection().findOneAndUpdate(
        { _id },
        { $set: { done: !todo.done } },
        { returnDocument: "after" }
      );

      if (result)
        return res.status(200).json({ success: true, updatedTodo: result });

      throw { status: 404, message: "Todo not found after update" };
    }

    throw { status: 404, message: "Todo not found" };
  } catch (err) {
    next(err);
  }
};
