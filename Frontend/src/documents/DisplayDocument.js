import { Document, Page } from 'react-pdf/dist/esm/entry.parcel2';
import { useState } from 'react';
import { backendHost } from '../Config';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';

const DisplayDocument = () => {
  const [numPages, setNumPages] = useState(null);
  const [pageIndex, setPageIndex] = useState(1);
  const { user, document_type, document_id } = useParams();

  return (
    <div>
      <Document
        file={{
          url: `${backendHost}/${user}/documents/${document_type}/${document_id}`,
          withCredentials: true,
        }}
        // onLoadSuccess={({ numPages }) => {
        //   setNumPages(numPages);
        // }}
        onSourceSuccess={console.log}
        onLoadError={(err) => {
          toast(err.message);
        }}
      >
        <Page
          pageNumber={1}
          renderTextLayer={false}
          renderAnnotationLayer={false}
        />
      </Document>
      <p>
        Page {pageIndex} of {numPages}
      </p>
    </div>
  );
};
export default DisplayDocument;
