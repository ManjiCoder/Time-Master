import pdfParse from 'pdf-parse';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(400).json({
      error: 'Method Not Allowed!',
    });
  }

  const { pdfData } = req.body;

  if (!pdfData) {
    return res.status(400).json({ error: 'Missing PDF data.' });
  }

  const buffer = Buffer.from(pdfData, 'base64');

  try {
    const data = await pdfParse(buffer);
    // console.log(data.info.Title);
    res.status(200).json({
      text: data.text,
      numPages: data.numpages,
    });
  } catch (error) {
    console.error('Error parsing PDF:', error);
    res.status(500).json({ error: 'Failed to parse PDF.' });
  }
}
