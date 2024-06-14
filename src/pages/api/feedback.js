import FeatureReqModel from '@/models/FeatureRequest';
import dbConnect from '@/utils/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(400).json({
      error: 'Method Not Allowed!',
    });
  }
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
    console.error('Form Submitted Unsuccessfully!', error);
    res.status(500).json({ error: 'Form Submitted Unsuccessfully!' });
  }
}
