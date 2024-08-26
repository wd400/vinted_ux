import mongoose, { Document, Schema, model } from 'mongoose';

interface IAvatar extends Document {
  email: string;
  address: string;
}

const AvatarSchema: Schema = new Schema({
  email: {type: String, required: true},
    url: {type: String, required: true}
});

export default mongoose.models.avatar || model<IAvatar>('avatar', AvatarSchema);
