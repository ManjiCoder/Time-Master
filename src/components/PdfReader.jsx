// PdfReader.js

import { getUserInfo } from '@/utils/dateService';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

const PdfReader = () => {
  const dispatch = useDispatch();
  const [pdfText, setPdfText] = useState('');
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = async (e) => {
        const pdfData = e.target.result.split('base64,')[1];

        try {
          const response = await fetch('/api/pdf', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ pdfData }),
          });

          if (response.ok) {
            const data = await response.json();
            setPdfText(data.text);
            dispatch(setPdfText(getUserInfo(data.text)));
            console.log(data.text);
            setNumPages(data.numPages);
          } else {
            console.error('PDF processing failed.');
          }
        } catch (error) {
          console.error('Error processing PDF:', error);
        }
      };

      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <input type='file' onChange={handleFileChange} />
      {pdfText && (
        <div>
          <pre>{pdfText}</pre>
          <p>
            Page {pageNumber} of {numPages}
          </p>
        </div>
      )}
    </div>
  );
};

export default PdfReader;
