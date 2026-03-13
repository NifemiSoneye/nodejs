export interface IEmployee {
  firstname: string;
  lastname: string;
}

export interface IRole {
  User: number;
  Editor?: number;
  Admin?: number;
}

export interface IUser {
  username: string;
  roles: IRole;
  password: string;
  refreshToken?: string;
}
