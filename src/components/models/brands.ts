
import mongoose, { Document, Schema, model } from 'mongoose';

interface IBrand extends Document {
    _id: number;

  name: string;
}

const BrandSchema: Schema = new Schema({
    _id: {type: Number  
        , required: true},

    

  name: {type: String, required: true},
});

interface Brand {
  _id: number;
  name: string;
}

export type { Brand, IBrand };

export default mongoose.models.brand || model<IBrand>('brand', BrandSchema);
