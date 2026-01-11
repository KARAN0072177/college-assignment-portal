import mongoose, { Schema, models, model } from "mongoose";

export interface IAssignment {
  title: string;
  subject: string;
  description?: string;

  fileName: string;
  fileUrl: string;
  s3Key: string;
  fileType: string;
  fileSize: number;

  studentId: mongoose.Types.ObjectId;
  submittedAt: Date;
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

  description: {
    type: String,
    trim: true,
  },

  fileName: {
    type: String,
    required: true,
  },

  fileUrl: {
    type: String,
    required: true,
  },

  s3Key: {
    type: String,
    required: true,
    unique: true,
  },

  fileType: {
    type: String,
    required: true,
  },

  fileSize: {
    type: Number,
    required: true,
  },

  studentId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  submittedAt: {
    type: Date,
    default: Date.now,
  },
});

const Assignment =
  models.Assignment || model<IAssignment>("Assignment", AssignmentSchema);

export default Assignment;