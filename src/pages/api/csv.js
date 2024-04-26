import { format } from 'date-fns';

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
    const timeLog = {};
    const csvText = csvData.split('\n');
    const titles = csvText.shift().split(',');
    csvText.map((vl) => {
      let timeStamp;
      const payload = {};
      vl.split(',').map((v, i) => {
        if (i === 0) {
          timeStamp = new Date(`${v} ${year}`).setHours(0, 0, 0, 0);
          payload.Date = format(timeStamp, 'yyyy-MM-dd');
        } else {
          payload[titles[i]] = v === '' ? '-' : v;
        }
      });
      delete payload.Difference;
      timeLog[timeStamp] = payload;
    });

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
