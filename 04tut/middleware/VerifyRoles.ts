import { Request, Response, NextFunction } from "express";

const verifyRoles = (...allowedRoles: number[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req?.roles) return res.sendStatus(401);
    const rolesArray = [...allowedRoles];
    const result = req.roles
      .map((role) => rolesArray.includes(role) === true)
      .find((val) => val);
    if (!result) return res.sendStatus(401);
    next();
  };
};

export default verifyRoles;
