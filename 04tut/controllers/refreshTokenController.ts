import User from "../model/User";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";

const handleRefreshToken = async (req: Request, res: Response) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(401);
  console.log(cookies.jwt);
  const refreshToken = cookies.jwt;
  res.clearCookie("jwt", { httpOnly: true, sameSite: "lax", secure: false });
  const foundUser = await User.findOne({ refreshToken }).exec();

  //Detected refresh token reuse
  if (!foundUser) {
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET as string,
      async (
        err: jwt.VerifyErrors | null,
        decoded: jwt.JwtPayload | string | undefined,
      ) => {
        if (!decoded || typeof decoded === "string") return res.sendStatus(403);
        if (err) return res.sendStatus(403);
        const hackedUser = await User.findOne({
          username: decoded.username,
        }).exec();
        if (!hackedUser) return;
        hackedUser.refreshToken = [];
        const result = await hackedUser.save();
        console.log(result);
      },
    );
    return res.sendStatus(403);
  }

  const newRefreshTokenArray =
    foundUser.refreshToken?.filter((rt) => rt !== refreshToken) ?? [];
  //evaluate jwt
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET as string,
    async (
      err: jwt.VerifyErrors | null,
      decoded: jwt.JwtPayload | string | undefined,
    ) => {
      if (err) {
        foundUser.refreshToken = [...newRefreshTokenArray];
        const result = await foundUser.save();
      }
      const payload = decoded as {
        UserInfo: { username: string; roles: number[] };
      };
      if (err || foundUser.username != payload.UserInfo.username)
        return res.sendStatus(403);

      // Refresh token was still valid
      const roles = Object.values(foundUser.roles);
      const accessToken = jwt.sign(
        {
          UserInfo: {
            username: payload.UserInfo.username,
            roles: payload.UserInfo.roles,
          },
        },
        process.env.ACCESS_TOKEN_SECRET as string,
        { expiresIn: "30s" },
      );

      const newRefreshToken = jwt.sign(
        { username: foundUser.username },
        process.env.REFRESH_TOKEN_SECRET as string,
        { expiresIn: "15m" },
      );
      //Saving refreshToken with current user
      foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
      const result = await foundUser.save();

      res.cookie("jwt", newRefreshToken, {
        httpOnly: true,
        sameSite: "lax",
        secure: false,
        maxAge: 24 * 60 * 60 * 1000,
      });
      res.json({ accessToken });
    },
  );
};
export { handleRefreshToken };
