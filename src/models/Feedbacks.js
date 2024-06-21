import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const feedbackSchema = new Schema(
  {
    formType: {
      type: String,
    },
    msg: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
const FeedbacksModel =
  mongoose.models.feedbacks || mongoose.model('feedbacks', feedbackSchema);
export default FeedbacksModel;
