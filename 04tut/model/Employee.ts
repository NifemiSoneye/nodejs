import mongoose, { Schema, Document } from "mongoose";
import { IEmployee } from "../types/index";

interface IEmployeeDocument extends IEmployee, Document {}

const employeeSchema = new Schema<IEmployeeDocument>({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
});

export default mongoose.model<IEmployeeDocument>("Employee", employeeSchema);
