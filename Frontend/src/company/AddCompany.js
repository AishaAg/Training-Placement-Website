import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { backendHost } from '../Config';
import errorHandler from '../error/errors';
import { extractFormData } from '../helper/helpers';
import { addCompanyDetails } from './company';

const AddCompany = () => {
  const navigate = useNavigate();
  const addCompanyLink = `${backendHost}/admin/company/profile`;

  const companyProfileMutation = useMutation(addCompanyDetails, {
    onSuccess: (data) => {
      toast('Details saved.');
      navigate(`/admin/company/${data.companyId}`, {
        replace: true,
      });
    },
    onError: (err) => {
      errorHandler(err, navigate);
    },
  });

  const submitForm = async (e) => {
    e.preventDefault();
    const compDet = extractFormData(e.target);
    companyProfileMutation.mutate({ addCompanyLink, compDet });
  };

  return (
    <div>
      <h3>ADD NEW COMPANY</h3>
      <form onSubmit={submitForm}>
        <label htmlFor="companyName">
          Company name:
          <input type="text" name="name" defaultValue={''} />
        </label>
        <br />
        <label htmlFor="companyDescription">
          Company description:
          <textarea name="company_description" defaultValue={''} />
        </label>
        <br />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default AddCompany;
