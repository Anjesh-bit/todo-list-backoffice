import { ObjectId } from "mongodb";

export type Todo = {
  _id?: ObjectId;
  name: string;
  description: string;
  date: Date;
  done?: boolean;
};
