// PdfReader.js
import { setPdfData } from '@/redux/slices/attendanceSlice';
import { setMonth, setYear } from '@/redux/slices/dateSlice';
import { setHolidays } from '@/redux/slices/holidaysSlice';
import { csvToJson } from '@/utils/csvToJson';
import {
  getHolidaysList,
  getTimeLogs,
  getUserInfo,
  monthNameToIndex,
} from '@/utils/dateService';
import { toastifyOptions } from '@/utils/toastify';
import { Baloo_Bhai_2 } from 'next/font/google';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

const inter = Baloo_Bhai_2({ subsets: ['latin'] });

const PdfReader = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [pdfText, setPdfText] = useState('');
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
            const payload = getUserInfo(data.text);
            dispatch(setPdfData(payload));
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

  const handleFileChangeUpload = async (file) => {
    const toastId = toast.loading('Please wait...');
    const maxFileSizeBytes = 5 * 1024 * 1024; // 5 MB limit
    const fileSize = file.size;
    if (fileSize > maxFileSizeBytes) {
      setSelectedFile(null);
      return toast.update(
        toastId,
        toastifyOptions('error', 'File must be under 5MB!')
      );
    }
    if (file) {
      const isCSVFile = file.type === 'text/csv';
      const fileTypeName = isCSVFile ? 'CSV' : 'PDF';
      let year;
      let month;
      const reader = new FileReader();

      reader.onload = async (e) => {
        const pdfData = e.target.result.split('base64,')[1];

        try {
          if (isCSVFile) {
            const names = file.name.replace('.csv', '').split('-');
            month = names[0];
            year = names[1];
            const timeLogs = csvToJson(year, e.target.result);
            const payload = getTimeLogs(
              year,
              monthNameToIndex[month],
              timeLogs
            );

            // console.table(payload);
            dispatch(setPdfData({ year, month, data: payload }));
            dispatch(setYear(year));
            dispatch(setMonth(month));
            toast.update(
              toastId,
              toastifyOptions(
                'success',
                `${fileTypeName} Uploaded Successfully!`
              )
            );
            router.push('/attendance');
          } else {
            const response = await fetch('/api/pdf', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ pdfData }),
            });

            if (response.ok) {
              const data = await response.json();
              // console.log(data);
              setPdfText(data.text);
              if (data.text.toLowerCase().includes('holiday list')) {
                const payload = getHolidaysList(data.text);
                dispatch(setHolidays(payload));
                // setNumPages(data.numPages);
              } else {
                const payload = getUserInfo(data.text);
                if (
                  Object.keys(payload.data).length === 0 ||
                  !payload.month ||
                  !payload.year
                ) {
                  throw new Error('PDF processing failed.');
                }
                dispatch(setPdfData(payload));
                dispatch(setYear(payload.year));
                dispatch(setMonth(payload.month));
                setNumPages(data.numPages);
              }

              toast.update(
                toastId,
                toastifyOptions(
                  'success',
                  `${fileTypeName} Uploaded Successfully!`
                )
              );
              router.push('/attendance');
            } else {
              toast.update(
                toastId,
                toastifyOptions('error', `${fileTypeName} processing failed.`)
              );
              console.error(`${fileTypeName} processing failed.`);
            }
          }
        } catch (error) {
          toast.update(
            toastId,
            toastifyOptions('error', `Error processing ${fileTypeName}`)
          );
          console.error(`Error processing ${fileTypeName}:`, error);
        }
      };

      if (isCSVFile) {
        reader.readAsText(file);
      } else {
        reader.readAsDataURL(file);
      }
    }
  };

  return (
    <main
      className={`min-h-screen bg-slate-300 pb-10 text-slate-800 dark:bg-slate-900 dark:text-white ${inter.className} p-4`}
    >
      <h2 className='text-2xl font-semibold'>Upload</h2>
      <div className='container mx-auto mt-5 bg-slate-200 dark:bg-slate-950'>
        <div
          {...getRootProps()}
          className={`rounded-md border-4 border-dashed p-6 ${
            isDragActive ? 'border-green-500' : 'border-gray-400'
          }`}
        >
          <input {...getInputProps()} accept='.pdf, .csv' />
          <p className='text-center'>
            {isDragActive
              ? 'Drop the file here'
              : 'Drag and drop a file here, or click to select a file'}
          </p>
        </div>
      </div>

      {selectedFile && (
        <div className='mt-4'>
          <p>Selected File: {selectedFile.name}</p>
          {/* You can display additional file information here */}
        </div>
      )}

      {pdfText && (
        <div>
          <pre className='text-balance'>{pdfText}</pre>
          <p>
            Page {pageNumber} of {numPages}
          </p>
        </div>
      )}
    </main>
  );
};

export default PdfReader;
