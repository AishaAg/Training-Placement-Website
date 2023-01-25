import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { backendHost, branches } from '../Config';
import errorHandler from '../error/errors';
import { extractFormData } from '../helper/helpers';
import Loading from '../Loading';
import { getCompanyDetails } from './company';
import { getRoleDetails, setRoleDetails } from './role';

const RoleProfile = () => {
  const navigate = useNavigate();
  const { company_id, role_id } = useParams();
  const companyProfileLink = `${backendHost}/admin/company/${company_id}`;
  const roleProfileLink = `${backendHost}/admin/company/${company_id}/role/${role_id}`;

  const [readOnly, setReadOnly] = useState(true);

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

  const roleProfileQuery = useQuery(
    ['roleProfile', role_id],
    () => {
      return getRoleDetails(roleProfileLink);
    },
    {
      onError: (err) => {
        errorHandler(err, navigate);
      },
    }
  );

  const roleProfileMutation = useMutation(setRoleDetails, {
    onSuccess: (data) => {
      toast('Details submitted.');
      query.setQueryData(['roleProfile', role_id], (oldData) => {
        Object.assign(oldData, data.roleDetails);
      });
    },
    onError: (err) => {
      errorHandler(err, navigate);
    },
  });

  const submitForm = async (event) => {
    event.preventDefault();
    setReadOnly(true);
    const roleDet = extractFormData(event.target);
    console.log(roleDet);
    roleProfileMutation.mutate({ roleProfileLink, roleDet });
  };

  return companyProfileQuery.isLoading ? (
    <Loading />
  ) : (
    <div>
      <h2>{companyProfileQuery.data?.companyDetails.name}</h2>
      <h5>{companyProfileQuery.data?.companyDetails.company_description}</h5>
      <form onSubmit={submitForm}>
        <label htmlFor="role">
          Role:
          <input
            readOnly={readOnly}
            type="text"
            name="role"
            defaultValue={roleProfileQuery.data?.roleDetails.role}
          />
        </label>{' '}
        <br />
        <label htmlFor="roleDescription">
          Role Description:
          <textarea
            readOnly={readOnly}
            name="role_description"
            defaultValue={roleProfileQuery.data?.roleDetails.role_description}
          />
        </label>{' '}
        <br />
        <label htmlFor="requiredCgpa">
          Minimum required CGPA:
          <input
            readOnly={readOnly}
            type="number"
            min={0}
            max={10}
            step={0.01}
            name="required_cgpa"
            defaultValue={roleProfileQuery.data?.roleDetails.required_cgpa}
          />
        </label>{' '}
        <br />
        <label htmlFor="eligibleBranches">
          Eligible Branches: <br />
          {branches.map((branch, ind) => {
            return (
              <>
                <input
                  type={'checkbox'}
                  onClick={readOnly ? 'return false' : 'return true'}
                  key={ind}
                  name={branch}
                  defaultChecked={
                    roleProfileQuery.data?.roleDetails.eligible_branches.ind
                  }
                />{' '}
                {branch} <br />
              </>
            );
          })}
          {/* <textarea
            readOnly={readOnly}
            name="eligible_branches"
            defaultValue={roleProfileQuery.data?.roleDetails.eligible_branches}
          /> */}
        </label>{' '}
        <br />
        <label htmlFor="requiredExperience">
          Minimum required experience:
          <input
            readOnly={readOnly}
            type="number"
            min={0}
            step={1}
            name="required_experience"
            defaultValue={
              roleProfileQuery.data?.roleDetails.required_experience
            }
          />
        </label>{' '}
        <br />
        <label htmlFor="activeBacklogs">
          Maximum allowed active backlogs:
          <input
            readOnly={readOnly}
            type="number"
            min={0}
            step={1}
            name="active_backlogs"
            defaultValue={roleProfileQuery.data?.roleDetails.active_backlogs}
          />
        </label>{' '}
        <br />
        <label htmlFor="compensation">
          Compensation offered:
          <input
            readOnly={readOnly}
            type="number"
            min={0}
            name="compensation"
            defaultValue={roleProfileQuery.data?.roleDetails.compensation}
          />
        </label>{' '}
        <br />
        <label htmlFor="benefits">
          Benefits:
          <textarea
            readOnly={readOnly}
            name="benefits"
            defaultValue={roleProfileQuery.data?.roleDetails.benefits}
          />
        </label>{' '}
        <br />
        <label htmlFor="jobLocation">
          Job Location:
          <textarea
            readOnly={readOnly}
            name="job_location"
            defaultValue={roleProfileQuery.data?.roleDetails.job_location}
          />
        </label>{' '}
        <br />
        <label htmlFor="bondDetails">
          Bond Details:
          <textarea
            readOnly={readOnly}
            name="bond_details"
            defaultValue={roleProfileQuery.data?.roleDetails.bond_details}
          />
        </label>{' '}
        <br />
        <label htmlFor="hiringProcess">
          Hiring Process:
          <textarea
            readOnly={readOnly}
            name="hiring_process"
            defaultValue={roleProfileQuery.data?.roleDetails.hiring_process}
          />
        </label>{' '}
        <br />
        <label htmlFor="driveStatus">
          Drive Status:
          <textarea
            readOnly={readOnly}
            name="drive_status"
            defaultValue={roleProfileQuery.data?.roleDetails.drive_status}
          />
        </label>{' '}
        <br />
        {readOnly ? (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setReadOnly(false);
            }}
          >
            Edit Role Details
          </button>
        ) : (
          <button type="submit">Done</button>
        )}
      </form>
    </div>
  );
};
export default RoleProfile;
