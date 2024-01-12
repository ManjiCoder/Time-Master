import React from 'react';

const FileUploader = ({ onFileChange }) => {
  const handleChange = (event) => {
    const file = event.target.files[0];
    onFileChange(file);
  };

  return (
    <div>
      <input type="file" accept=".pdf" onChange={handleChange} />
    </div>
  );
};

export default FileUploader;
