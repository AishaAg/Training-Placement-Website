import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { backendHost } from '../Config';
import errorHandler from '../error/errors';
import { extractFormData } from '../helper/helpers';
import Loading from '../Loading';
import { deleteCompany, getCompanyDetails, setCompanyDetails } from './company';

const CompanyProfile = () => {
  const { company_id } = useParams();
  const navigate = useNavigate();

  const [readOnly, setReadOnly] = useState(true);

  const companyProfileLink = `${backendHost}/admin/company/${company_id}`;

  const query = useQueryClient();

  const companyProfileQuery = useQuery(
    ['companyProfile', company_id],
    () => {
      return getCompanyDetails(companyProfileLink);
    },
    {
      onError: (err) => {
        errorHandler(err, navigate);
      },
    }
  );

  const companyProfileMutation = useMutation(setCompanyDetails, {
    onSuccess: (data) => {
      toast('Details submitted.');
      query.setQueryData(['companyProfile', company_id], (oldData) => {
        Object.assign(oldData.companyDetails, data.companyDetails);
      });
    },
    onError: (err) => {
      errorHandler(err, navigate);
    },
  });

  const deleteCompanyMutation = useMutation(deleteCompany, {
    onSuccess: () => {
      toast('Company deleted.');
      navigate(`/admin/company/profile`);
    },
    onError: (err) => {
      errorHandler(err, navigate);
    },
  });

  const submitForm = async (e) => {
    e.preventDefault();
    setReadOnly(true);
    const compDet = extractFormData(e.target);
    companyProfileMutation.mutate({ companyProfileLink, compDet });
  };

  return companyProfileQuery.isLoading || companyProfileMutation.isLoading ? (
    <Loading />
  ) : (
    <div>
      <form onSubmit={submitForm}>
        <label htmlFor="companyName">
          Company Name:{' '}
          <input
            name="name"
            readOnly={readOnly}
            type="text"
            defaultValue={companyProfileQuery.data?.companyDetails.name}
          />
        </label>
        <br />
        <label htmlFor="companyDescription">
          Company Description:{' '}
          <textarea
            name="company_description"
            readOnly={readOnly}
            defaultValue={
              companyProfileQuery.data?.companyDetails.company_description
            }
          />
        </label>
        <br />
        <br />

        {readOnly ? (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setReadOnly(false);
            }}
          >
            Edit Company Details
          </button>
        ) : (
          <button type="submit">Done</button>
        )}
      </form>
      <button
        type="button"
        onClick={() => {
          deleteCompanyMutation.mutate({ companyId: company_id });
        }}
      >
        Delete Company
      </button>
      <br />
      <button
        type="button"
        onClick={() => {
          navigate(`/admin/company/${company_id}/role/new`, { replace: false }); // TODO : Connect to add new role form
        }}
      >
        Add new Role
      </button>
    </div>
  );
};
export default CompanyProfile;
