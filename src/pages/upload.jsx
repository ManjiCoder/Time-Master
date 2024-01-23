// PdfReader.js
import { setPdfData } from "@/redux/slices/attendanceSlice";
import { getUserInfo } from "@/utils/dateService";
import { Baloo_Bhai_2 } from "next/font/google";
import React, { useState } from "react";
import { useDispatch } from "react-redux";

const inter = Baloo_Bhai_2({ subsets: ["latin"] });

const PdfReader = () => {
  const [pdfText, setPdfText] = useState("");
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const dispatch = useDispatch();

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

  return (
    <main
      className={`bg-slate-300 text-slate-800 min-h-screen pb-10 ${inter.className} p-4`}
    >
      <h2 className="text-2xl font-semibold">Upload</h2>

      <input type="file" onChange={handleFileChange} />
      {pdfText && (
        <div>
          <pre>{pdfText}</pre>
          <p>
            Page {pageNumber} of {numPages}
          </p>
        </div>
      )}
    </main>
  );
};

export default PdfReader;
