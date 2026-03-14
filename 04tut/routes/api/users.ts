import express from "express";
import verifyRoles from "../../middleware/VerifyRoles";
import ROLES_LIST from "../../config/roles_list";
import {
  getAllUsers,
  deleteUser,
  getUser,
} from "../../controllers/usersController";
const router = express.Router();

router
  .route("/")
  .get(verifyRoles(ROLES_LIST.Admin), getAllUsers)
  .delete(verifyRoles(ROLES_LIST.Admin), deleteUser);

router.route("/:id").get(verifyRoles(ROLES_LIST.Admin), getUser);

export default router;
