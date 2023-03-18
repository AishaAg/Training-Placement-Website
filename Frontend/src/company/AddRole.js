import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { backendHost, branches } from '../Config';
import errorHandler from '../error/errors';
import { extractFormData } from '../helper/helpers';
import Loading from '../Loading';
import { getCompanyDetails } from './company';
import { addRoleDetails } from './role';

const AddRole = () => {
  const navigate = useNavigate();
  const { company_id } = useParams();
  const addRoleLink = `${backendHost}/admin/company/${company_id}/role/`;
  const companyProfileLink = `${backendHost}/admin/company/${company_id}`;

  const [selectAll, setSelectAll] = useState(false);

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

  const roleProfileMutation = useMutation(addRoleDetails, {
    onSuccess: (data) => {
      toast('Details saved.');
      navigate(`/admin/company/role/${data.roleId}`, {
        replace: false,
      });
    },
    onError: (err) => {
      errorHandler(err, navigate);
    },
  });

  const submitForm = async (event) => {
    event.preventDefault();
    const eligibleBranches = Object.fromEntries(
      Array.from(event.target.querySelectorAll('input[type="checkbox"]')).map(
        (ele) => [`_${ele.id}`, ele.checked]
      )
    );
    const roleDet = extractFormData(event.target);
    roleDet.deadline = roleDet.deadline.split('T').join(' ') + ':00';
    roleDet.active_backlogs = roleDet.active_backlogs || Infinity;
    roleProfileMutation.mutate({
      addRoleLink,
      roleDet,
      eligibleBranches: eligibleBranches,
    });
  };

  return companyProfileQuery.isLoading ? (
    <Loading />
  ) : (
    <div>
      <h2>{companyProfileQuery.data?.companyDetails.name}</h2>
      <h5>{companyProfileQuery.data?.companyDetails.company_description}</h5>

      <h3>ADD NEW ROLE</h3>
      <form onSubmit={submitForm}>
        <label htmlFor="role">
          Role:
          <input type="text" name="role" defaultValue={''} />
        </label>{' '}
        <br />
        <label htmlFor="roleDescription">
          Role Description:
          <input type="Descriptiontext" name="role_description" />
        </label>{' '}
        <br />
        <label htmlFor="requiredCgpa">
          Minimum required CGPA:
          <input
            type="number"
            min={0}
            max={10}
            step={0.01}
            name="required_cgpa"
          />
        </label>{' '}
        <br />
        <label htmlFor="eligibleBranches">
          Eligible Branches:
          <br />
          <div>
            <div>
              <button
                type="button"
                onClick={() => {
                  branches.forEach((_, ind) => {
                    document.getElementById(ind).checked = !selectAll;
                  });
                  setSelectAll(!selectAll);
                }}
              >
                Select {!selectAll ? 'All' : 'None'}
              </button>
            </div>
            {branches.map((branch, ind) => {
              return (
                <div key={ind}>
                  <input id={ind} type={'checkbox'} /> {branch} <br />
                </div>
              );
            })}
          </div>
        </label>{' '}
        <br />
        <label htmlFor="requiredExperience">
          Minimum required experience:
          <input type="number" min={0} step={1} name="required_experience" />
        </label>{' '}
        <br />
        <label htmlFor="activeBacklogs">
          Maximum allowed active backlogs:
          <input type="number" min={0} step={1} name="active_backlogs" />
        </label>{' '}
        <br />
        <label htmlFor="compensation">
          Compensation offered:
          <input type="number" min={0} name="compensation" />
        </label>{' '}
        <br />
        <label htmlFor="benefits">
          Benefits:
          <input type="text" name="benefits" />
        </label>{' '}
        <br />
        <label htmlFor="jobLocation">
          Job Location:
          <input type="text" name="job_location" />
        </label>{' '}
        <br />
        <label htmlFor="bondDetails">
          Bond Details:
          <input type="text" name="bond_details" />
        </label>{' '}
        <br />
        <label htmlFor="hiringProcess">
          Hiring Process:
          <input type="text" name="hiring_process" />
        </label>{' '}
        <br />
        <label htmlFor="driveStatus">
          Drive Status:
          <input type="text" name="drive_status" />
        </label>{' '}
        <br />
        <label htmlFor="deadline">
          Application deadline:
          <input type="datetime-local" name="deadline" />
        </label>{' '}
        <br />
        <button type="submit">Done</button>
      </form>
    </div>
  );
};
export default AddRole;
