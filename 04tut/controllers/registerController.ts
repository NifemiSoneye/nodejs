import User from "../model/User";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
const handleNewUser = async (req: Request, res: Response) => {
  const { user, pwd }: Record<string, string> = req.body;
  if (!user || !pwd)
    return res
      .status(400)
      .json({ Message: "Username and password are required." });
  // check for duplicate usernames in the db
  const duplicate = await User.findOne({ username: user }).exec();
  if (duplicate) return res.sendStatus(409);
  try {
    //encrypt password
    const hashedPwd: string = await bcrypt.hash(pwd, 10);
    //create store new user
    const result = await User.create({
      username: user,
      password: hashedPwd,
    });

    /*     const newUser = new User({
      username: user,
      password: hashedPwd,
    }
)
    const result = await newUser.save */

    console.log(result);
    res.status(201).json({ success: `New User ${user} created!` });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "An error occured";
    res.status(500).json({ message });
  }
};

export { handleNewUser };
