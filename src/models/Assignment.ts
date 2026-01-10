import mongoose, { Schema, models, model } from "mongoose";

export interface IAssignment {
  title: string;
  subject: string;
  studentId: mongoose.Types.ObjectId;
  createdAt: Date;
}

const AssignmentSchema = new Schema<IAssignment>({
  title: {
    type: String,
    required: true,
    trim: true,
  },

  subject: {
    type: String,
    required: true,
    trim: true,
  },

  studentId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Assignment =
  models.Assignment || model<IAssignment>("Assignment", AssignmentSchema);

export default Assignment;