import { csvToJSON } from '@/utils/csvToJson';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(400).json({
      error: 'Method Not Allowed!',
    });
  }
  const csvData = req.body;

  if (!csvData) {
    return res.status(400).json({ error: 'Missing CSV data.' });
  }

  try {
    const query = req.query.q.split('-');
    let year = parseInt(query[1]);
    let month = query[0];
    const timeLog = csvToJSON(year, csvData);
    // console.log({ timeLog });
    res.status(200).json({
      year,
      month,
      data: timeLog,
    });
  } catch (error) {
    console.error('Error parsing CSV:', error);
    res.status(500).json({ error: 'Failed to parse CSV.' });
  }
}
