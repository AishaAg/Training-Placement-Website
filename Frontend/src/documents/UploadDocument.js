import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import errorHandler from '../error/errors';
import { extractFormData } from '../helper/helpers';
import { addDocument } from './document';

const UploadDocument = ({ documentType, user, forceRender = () => {} }) => {
  const navigate = useNavigate();

  const query = useQueryClient();
  const uploadDocumentMutation = useMutation(addDocument, {
    onSuccess: (data) => {
      forceRender(Math.random());
      toast(data.message);
      query.setQueryData([documentType], (oldData) => {
        oldData.document_ids.push({ document_id: data.documentId });
      });
    },
    onError: (err) => {
      errorHandler(err, navigate);
    },
  });
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const document = extractFormData(e.target);
        const data = new FormData();
        data.append(documentType, document[documentType]);
        uploadDocumentMutation.mutate({ data, user, documentType });
      }}
    >
      <label htmlFor="select file">
        Select file:
        <input type={'file'} name={documentType} />
      </label>
      <button type="submit">Submit</button>
    </form>
  );
};

export default UploadDocument;
