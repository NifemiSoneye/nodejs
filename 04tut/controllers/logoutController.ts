import User from "../model/User";
import { Request, Response } from "express";
const handleLogout = async (req: Request, res: Response) => {
  //On client , also delete the accessToken

  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); //No content
  const refreshToken = cookies.jwt.trim();
  console.log("Looking for token:", refreshToken);
  //Is refreshToken in db
  const foundUser = await User.findOne({ refreshToken }).exec();
  console.log("Found user:", foundUser);
  if (!foundUser) {
    res.clearCookie("jwt", { httpOnly: true, sameSite: "none", secure: true });
    return res.sendStatus(403);
  }

  //Delete refreshToken in db

  foundUser.refreshToken = "";
  const result = await foundUser.save();
  console.log(result);

  res.clearCookie("jwt", { httpOnly: true, sameSite: "lax", secure: false }); //secure true - only serves on https
  res.sendStatus(204);
};
export { handleLogout };
