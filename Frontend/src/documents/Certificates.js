import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { toast } from 'react-toastify';
import errorHandler from '../error/errors';
import { deleteDocument, getDocumentIds } from './document';
import UploadDocument from './UploadDocument';

const Certificates = () => {
  const [_, forceRender] = useState(0);
  const navigate = useNavigate();
  const certificateQuery = useQuery(
    ['certificate'],
    () => getDocumentIds({ user: 'student', documentType: 'certificate' }),
    {
      onError: (err) => {
        errorHandler(err, navigate);
      },
    }
  );

  const certificateMutation = useMutation(deleteDocument, {
    onSuccess: (data) => {
      toast(data.message);

      certificateQuery.data.document_ids.splice(
        certificateQuery.data.document_ids.findIndex(
          (e) => e.document_id === data.documentId
        ),
        1
      );
    },
    onError: (err) => {
      errorHandler(err, navigate);
    },
  });
  return (
    <div>
      <h1>Certificates</h1>
      {certificateQuery.data?.document_ids.map((id, ind) => (
        <div key={ind}>
          <Link to={`/student/certificate/${id.document_id}`}>
            {id.document_id}
          </Link>
          {'  '}
          <button
            onClick={(e) => {
              e.preventDefault();
              certificateMutation.mutate({
                user: 'student',
                documentId: id.document_id,
                documentType: 'certificate',
              });
            }}
          >
            Delete Certificate
          </button>
        </div>
      ))}
      OR
      <h3>UPLOAD NEW CERTIFICATE</h3>
      <UploadDocument
        documentType={'certificate'}
        user={'student'}
        forceRender={forceRender}
      />
    </div>
  );
};

export default Certificates;
