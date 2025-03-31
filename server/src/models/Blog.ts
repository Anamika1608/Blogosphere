import mongoose, { Document } from 'mongoose';
import { UserDocument } from './User';

export interface BlogDocument extends Document {
  title: string;
  content: string;
  author: UserDocument['_id'];
  createdAt: Date;
  updatedAt: Date;
}

const BlogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<BlogDocument>('Blog', BlogSchema);