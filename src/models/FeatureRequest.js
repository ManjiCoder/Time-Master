import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const featureReqSchema = new Schema({
  formType: {
    type: String,
    default: 'Feature-Request',
  },
  msg: {
    type: String,
    required: true,
  },
});
const FeatureReqModel =
  mongoose.models.feedbacks || mongoose.model('feedbacks', featureReqSchema);
export default FeatureReqModel;
