// pages/api/pdf.js

import pdfParse from 'pdf-parse';

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req, res) => {
  const { pdfData } = req.body;

  if (!pdfData) {
    return res.status(400).json({ error: 'Missing PDF data.' });
  }

  const buffer = Buffer.from(pdfData, 'base64');

  try {
    const data = await pdfParse(buffer);
    res.status(200).json({ text: data.text, numPages: data.numPages });
  } catch (error) {
    console.error('Error parsing PDF:', error);
    res.status(500).json({ error: 'Failed to parse PDF.' });
  }
};
