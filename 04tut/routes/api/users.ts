import express from "express";
import verifyRoles from "../../middleware/VerifyRoles";
import ROLES_LIST from "../../config/roles_list";
import { usersController } from "../../controllers/usersController";
const router = express.Router();

router
  .route("/")
  .get(verifyRoles(ROLES_LIST.Admin), usersController.getAllUsers)
  .delete(verifyRoles(ROLES_LIST.Admin), usersController.deleteUser);

router
  .route("/:id")
  .get(verifyRoles(ROLES_LIST.Admin), usersController.getUser);

export default router;
