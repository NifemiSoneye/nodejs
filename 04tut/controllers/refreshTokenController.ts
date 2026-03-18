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
  if (!foundUser) return res.sendStatus(403); // forbidden
  //evaluate jwt
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET as string,
    (
      err: jwt.VerifyErrors | null,
      decoded: jwt.JwtPayload | string | undefined,
    ) => {
      const payload = decoded as {
        UserInfo: { username: string; roles: number[] };
      };
      if (err || foundUser.username != payload.UserInfo.username)
        return res.sendStatus(403);
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
      res.json({ accessToken });
    },
  );
};
export { handleRefreshToken };
