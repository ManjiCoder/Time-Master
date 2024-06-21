import FeatureReqModel from '@/models/FeatureRequest';
import dbConnect from '@/utils/db';

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'POST':
      const { msg, formType } = req.body;

      if (!msg || !formType) {
        return res.status(400).json({ error: 'Missing data.' });
      }

      try {
        await dbConnect();
        const featureMsg = await FeatureReqModel.create(req.body);
        // console.log(featureMsg);
        res.status(200).json({
          msg: 'Form Submitted Successfully.',
        });
      } catch (error) {
        // console.error('Form Submitted Unsuccessfully!', error);
        res.status(500).json({ error: 'Form Submitted Unsuccessfully!' });
      }
      break;
    case 'GET':
      try {
        await dbConnect();
        const { sortBy, filter, page = 1, limit = 2 } = req.query;
        const findObj = {};
        const ignoreObj = { __v: 0, updatedAt: 0 };
        const sortObj = { createdAt: -1 };
        const skip = (page - 1) * Number(limit);
        console.log(skip);
        if (sortBy === 'oldest') {
          sortObj.createdAt = 1;
        }
        if (filter) {
          findObj.formType = filter;
        }
        const feedbacks = await FeatureReqModel.find(findObj, ignoreObj)
          .sort(sortObj)
          .skip(skip)
          .limit(Number(limit));
        if (feedbacks.length === 0) {
          return res.status(200).json({ msg: 'No data found!' });
        }
        res.status(200).json({
          feedbacks,
        });
      } catch (error) {
        res.status(500).json({ error: 'Internal Server Error.' });
      }
      break;
    default:
      return res.status(400).json({
        error: 'Method Not Allowed!',
      });
  }
}
