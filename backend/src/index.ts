import express, { Request, Response } from "express";
import "dotenv/config";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import { getUsers } from "./db/userQueries";
import { addUser } from "./db/userQueries";
import { findUsers } from "./db/userQueries";

const app = express();
const port = process.env.PORT;

app.use(cors({ credentials: true }));
app.use(cookieParser());
app.use(bodyParser.json());

app.listen(port, () => {
  console.log("server running on port " + port);
});

//test
app.get("/", async (req: Request, res: Response) => {
  try {
    const data = await getUsers();

    if (!Array.isArray(data)) {
      res.status(500).json({ error: "Data format error" });
    }
    res.send(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "failed to fetch users" });
  }

  return;
});

//registration
app.post("/api/signUp", async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ error: "All field are required" });
    }

    const newUser = await addUser(name, email, password);

    res.status(201).json({
      message: "User created successfully",
      user: newUser,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to register user" });
  }

  return;
});

//login
app.post("/api/signIn", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: "All field are required" });
    }

    const user = findUsers(email, password);

    res.send(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to login user" });
  }

  return;
});
