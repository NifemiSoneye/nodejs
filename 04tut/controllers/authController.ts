import User from "../model/User";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const handleLogin = async (req: Request, res: Response) => {
  const cookies = req.cookies;
  const { user, pwd }: { user: string; pwd: string } = req.body;
  if (!user || !pwd)
    return res
      .status(400)
      .json({ Message: "Username and password are required." });
  const foundUser = await User.findOne({ username: user }).exec();
  if (!foundUser) return res.sendStatus(401); // unauthorized
  //evaluate password
  const match = await bcrypt.compare(pwd, foundUser.password);
  if (match) {
    const roles: number[] = Object.values(foundUser.roles).filter(Boolean);
    // create JWTs
    const accessToken = jwt.sign(
      {
        UserInfo: {
          username: foundUser.username,
          roles: roles,
        },
      },
      process.env.ACCESS_TOKEN_SECRET as string,
      { expiresIn: "60s" },
    );
    const newRefreshToken = jwt.sign(
      { username: foundUser.username },
      process.env.REFRESH_TOKEN_SECRET as string,
      { expiresIn: "15m" },
    );

    const newRefreshTokenArray = !cookies?.jwt
      ? (foundUser.refreshToken ?? [])
      : (foundUser.refreshToken?.filter((rt) => rt !== cookies.jwt) ?? []);

    if (cookies.jwt)
      res.clearCookie("jwt", {
        httpOnly: true,
        sameSite: "lax",
        secure: false,
      });
    //Saving refreshToken with current user
    foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
    const result = await foundUser.save();
    console.log(result);
    res.cookie("jwt", newRefreshToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.json({ accessToken });
  } else {
    res.sendStatus(401);
  }
};

export { handleLogin };
