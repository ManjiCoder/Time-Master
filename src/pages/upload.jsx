// PdfReader.js
import { setPdfData } from "@/redux/slices/attendanceSlice";
import { getUserInfo } from "@/utils/dateService";
import { Baloo_Bhai_2 } from "next/font/google";
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { useDispatch } from "react-redux";

const inter = Baloo_Bhai_2({ subsets: ["latin"] });

const PdfReader = () => {
  const dispatch = useDispatch();
  const [pdfText, setPdfText] = useState("");
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [selectedFile, setSelectedFile] = useState(null);

  const onDrop = (acceptedFiles) => {
    // Handle the dropped file(s)
    const file = acceptedFiles[0];
    setSelectedFile(file);
    // console.log(file);
    handleFileChangeUpload(file);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleFileChange = async (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = async (e) => {
        const pdfData = e.target.result.split("base64,")[1];

        try {
          const response = await fetch("/api/pdf", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ pdfData }),
          });

          if (response.ok) {
            const data = await response.json();
            setPdfText(data.text);
            const payload = getUserInfo(data.text);
            dispatch(setPdfData(payload));
            setNumPages(data.numPages);
          } else {
            console.error("PDF processing failed.");
          }
        } catch (error) {
          console.error("Error processing PDF:", error);
        }
      };

      reader.readAsDataURL(file);
    }
  };

  const handleFileChangeUpload = async (file) => {
    if (file) {
      const reader = new FileReader();

      reader.onload = async (e) => {
        const pdfData = e.target.result.split("base64,")[1];

        try {
          const response = await fetch("/api/pdf", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ pdfData }),
          });

          if (response.ok) {
            const data = await response.json();
            setPdfText(data.text);
            const payload = getUserInfo(data.text);
            dispatch(setPdfData(payload));
            setNumPages(data.numPages);
          } else {
            console.error("PDF processing failed.");
          }
        } catch (error) {
          console.error("Error processing PDF:", error);
        }
      };

      reader.readAsDataURL(file);
    }
  };

  return (
    <main
      className={`bg-slate-300 text-slate-800 min-h-screen pb-10 ${inter.className} p-4`}
    >
      <h2 className="text-2xl font-semibold">Upload</h2>
      <div className="container mx-auto mt-5">
        <div
          {...getRootProps()}
          className={`p-6 border-4 border-dashed rounded-md ${
            isDragActive ? "border-green-500" : "border-gray-400"
          }`}
        >
          <input {...getInputProps()} />
          <p className="text-center">
            {isDragActive
              ? "Drop the file here"
              : "Drag and drop a file here, or click to select a file"}
          </p>
        </div>

        {selectedFile && (
          <div className="mt-4">
            <p>Selected File: {selectedFile.name}</p>
            {/* You can display additional file information here */}
          </div>
        )}
      </div>
      {/* <input type="file" onChange={handleFileChange} /> */}
      {pdfText && (
        <div>
          <pre className="text-balance">{pdfText}</pre>
          <p>
            Page {pageNumber} of {numPages}
          </p>
        </div>
      )}
    </main>
  );
};

export default PdfReader;
