import express from "express";
import verifyRoles from "../../middleware/VerifyRoles";
import ROLES_LIST from "../../config/roles_list";
import employeesController from "../../controllers/employeesController";
const router = express.Router();

router

  .route("/")
  .get(employeesController.getAllEmployees)
  .post(
    verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),
    employeesController.createNewEmployee,
  )
  .put(
    verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),
    employeesController.updateEmployee,
  )
  .delete(verifyRoles(ROLES_LIST.Admin), employeesController.deleteEmployee);

router.route("/:id").get(employeesController.getEmployee);

export default router;
