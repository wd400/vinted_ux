import mongoose, { Document, Schema, model } from 'mongoose';

interface IUser extends Document {
    customerId: string;
  email: string;
  emailVerified: Date;
  pro_until: Number;
  taxId: string;

}

const UserSchema: Schema = new Schema({
customerId: {type: String},
  pro_until: {type: Number, required: true, min: 0,
    default: 0,
  },
  email: {type: String, required: true,
    unique: true,

  },
  emailVerified: {type: Date, required: false},
  taxId: {type: String, required: false},
});


export default mongoose.models.user || model<IUser>('user', UserSchema);
