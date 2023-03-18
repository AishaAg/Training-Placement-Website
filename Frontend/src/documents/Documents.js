import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import errorHandler from '../error/errors';
import { deleteDocument, getDocumentIds } from './document';
import UploadDocument from './UploadDocument';

const Documents = () => {
  const navigate = useNavigate();
  const [_, forceRender] = useState(0);
  const documentQuery = useQuery(
    ['document'],
    () => getDocumentIds({ user: 'student', documentType: 'document' }),
    {
      onSuccess: console.log,
      onError: (err) => {
        errorHandler(err, navigate);
      },
    }
  );

  const documentMutation = useMutation(deleteDocument, {
    onSuccess: (data) => {
      toast(data.message);
      documentQuery.data.document_ids.splice(
        documentQuery.data.document_ids.findIndex(
          (e) => e.document_id === data.documentId
        ),
        1
      );
      console.log(documentQuery.data);
    },
    onError: (err) => {
      errorHandler(err, navigate);
    },
  });
  return (
    <div>
      <h1>Documents</h1>
      {documentQuery.data?.document_ids.map((id, ind) => (
        <div key={ind}>
          <Link to={`/student/document/${id.document_id}`}>
            {id.document_id}
          </Link>
          {'  '}
          <button
            onClick={(e) => {
              e.preventDefault();
              documentMutation.mutate({
                user: 'student',
                documentId: id.document_id,
                documentType: 'document',
              });
            }}
          >
            Delete document
          </button>
        </div>
      ))}
      OR
      <h3>UPLOAD NEW DOCUMENT</h3>
      <UploadDocument
        documentType={'document'}
        user={'student'}
        forceRender={forceRender}
      />
    </div>
  );
};

export default Documents;
