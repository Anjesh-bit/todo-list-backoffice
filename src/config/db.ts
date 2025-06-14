import { MongoClient, ServerApiVersion } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const dbUserName = process.env.DB_USER_NAME as string;
const dbPassword = process.env.DB_PASS as string;
const dbName = process.env.DB_NAME as string;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const mongoClient = new MongoClient(
  `mongodb+srv://${dbUserName}:${dbPassword}@${dbName}.cv9ka.mongodb.net/?retryWrites=true&w=majority`,
  {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  }
);

const connect = async (): Promise<void> => {
  try {
    await mongoClient.connect();
    await mongoClient.db("GoldTree").command({ ping: 1 });
    console.log("You are successfully connected to MongoDB!");
  } catch (e) {
    console.error(`Error Establishing Connection: ${e}`);
  }
};

export { mongoClient, connect };
