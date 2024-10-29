import express, { Request, Response } from "express";
import "dotenv/config";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import bcrypt from "bcrypt";
import { getUsers } from "./db/userQueries";
import { addUser } from "./db/userQueries";
import { findUserByMail } from "./db/userQueries";
import jwt from "jsonwebtoken";
import { Secret } from "jsonwebtoken";

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

    const checkMail = await findUserByMail(email);

    if (checkMail) {
      res.status(200).send("Mail already registered");
      return;
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

    const user = await findUserByMail(email);

    if (!user) {
      res.status(404).send("User not found");
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      res.send("Invalid Password");
    }

    const token = jwt.sign(user, process.env.MY_SECRET as string, {
      algorithm: "HS256",
      expiresIn: "1h",
    });

    res
      .cookie("token", token, {
        httpOnly: true,
      })
      .send({ message: "Successfully loged in" });
  } catch (error) {
    res.status(500).json({ error: "Failed to login user" });
  }

  return;
});
