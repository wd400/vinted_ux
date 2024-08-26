import mongoose, {Schema, Document, model} from 'mongoose';

interface IApprox extends Document {
  type: string;
  properties: {
    path: Array<string>;
  };
  geometry: {
    type: string;
    coordinates: Array<Array<Array<number>>>;
  };
}

const ApproxSchema: Schema = new Schema({
  type: {type: String, required: true},
  properties: {
    path: {type: [String], required: true}
  },
  geometry: {
    type: {type: String, required: true},
    coordinates: {type: [[[Number]]], required: true}
  }
});

export default mongoose.models.approx || model<IApprox>('approx', ApproxSchema);
