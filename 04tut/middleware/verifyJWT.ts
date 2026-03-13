import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

declare global {
  namespace Express {
    interface Request {
      user?: string;
      roles?: number[];
    }
  }
}

const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
  console.log(req.headers);
  const authHeader =
    req.headers.authorization || (req.headers.Authorization as string);
  if (!authHeader?.startsWith("Bearer ")) return res.sendStatus(401);
  const token = authHeader.split(" ")[1];
  console.log("Extracted Token:", token);
  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET as string,
    (err, decoded) => {
      if (err) return res.sendStatus(403);
      const payload = decoded as {
        UserInfo: { username: string; roles: number[] };
      };
      req.user = payload.UserInfo.username;
      req.roles = payload.UserInfo.roles;
      next();
    },
  );
};

export default verifyJWT;
