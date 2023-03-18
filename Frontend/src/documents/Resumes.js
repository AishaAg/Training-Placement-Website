import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import errorHandler from '../error/errors';
import { deleteDocument, getDocumentIds } from './document';
import UploadDocument from './UploadDocument';

const Resumes = () => {
  const navigate = useNavigate();
  const [_, forceRender] = useState(0);

  const resumeQuery = useQuery(
    ['resume'],
    () => getDocumentIds({ user: 'student', documentType: 'resume' }),
    {
      onSuccess: (data) => {},
      onError: (err) => {
        errorHandler(err, navigate);
      },
    }
  );

  const resumeIDsMutation = useMutation(deleteDocument, {
    onSuccess: (data) => {
      toast(data.message);
      resumeQuery.data.document_ids.splice(
        resumeQuery.data.document_ids.findIndex(
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
      <h1>Resumes</h1>
      {resumeQuery.data?.document_ids.map((id, ind) => (
        <div key={ind}>
          <Link to={`/student/resume/${id.document_id}`}>{id.document_id}</Link>
          {'  '}
          <button
            onClick={(e) => {
              e.preventDefault();
              resumeIDsMutation.mutate({
                user: 'student',
                documentId: id.document_id,
                documentType: 'resume',
              });
            }}
          >
            Delete Resume
          </button>
        </div>
      ))}
      OR
      <h3>UPLOAD NEW RESUME</h3>
      <UploadDocument
        documentType={'resume'}
        user={'student'}
        forceRender={forceRender}
      />
    </div>
  );
};

export default Resumes;
