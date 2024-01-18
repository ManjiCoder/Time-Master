// pages/api/pdf.js

import pdfParse from 'pdf-parse';
import { execSync } from 'child_process';

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req, res) => {
  const { pdfData } = req.body;

  if (!pdfData) {
    return res.status(400).json({ error: 'Missing PDF data.' });
  }

  const buffer = Buffer.from(pdfData, 'base64');

  try {
    // Use pdftotext to convert PDF to text
    const textContent = execSync(`pdftotext - -`, { input: buffer });

    const data = await pdfParse(buffer);
    // console.log(data.info.Title);
    res.status(200).json({
      text: textContent.toString(),
      numPages: data.numpages,
    });
  } catch (error) {
    console.error('Error parsing PDF:', error);
    res.status(500).json({ error: 'Failed to parse PDF.' });
  }
};
