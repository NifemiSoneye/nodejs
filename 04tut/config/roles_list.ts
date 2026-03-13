type RoleNames = "Admin" | "Editor" | "User";

const ROLES_LIST: Record<RoleNames, number> = {
  Admin: 5150,
  Editor: 1984,
  User: 2001,
};

export default ROLES_LIST;
