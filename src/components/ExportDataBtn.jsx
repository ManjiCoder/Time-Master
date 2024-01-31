import React from 'react';
import { useSelector } from 'react-redux';

const ExportData = () => {
  const attendance = useSelector((state) => state.attendance);

  const downloadTxtFile = () => {
    const jsonData = attendance;

    const jsonContent = JSON.stringify(jsonData, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'MasterTime.json';

    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <button
      className='ml-2 bg-blue-700 px-3 font-bold text-sm py-1.5 rounded-md shadow-md text-white'
      onClick={downloadTxtFile}
    >
      {' '}
      Download
    </button>
  );
};

export default ExportData;
