import express, { Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT;

app.listen(port, () => {
  console.log("server running on port " + port);
});

app.get("/", (req: Request, res: Response) => {
  res.send("Server is running");
});
