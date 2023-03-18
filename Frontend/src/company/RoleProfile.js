import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { backendHost, branches } from '../Config';
import errorHandler from '../error/errors';
import { extractFormData, formatDateTime } from '../helper/helpers';
import Loading from '../Loading';
import { deleteRole, getRoleDetails, setRoleDetails } from './role';

const RoleProfile = () => {
  const navigate = useNavigate();
  const { role_id } = useParams();
  const roleProfileLink = `${backendHost}/admin/company/role/${role_id}`;

  const [readOnly, setReadOnly] = useState(true);
  const [selectAll, setSelectAll] = useState(false);

  const query = useQueryClient();

  const roleProfileQuery = useQuery(
    ['roleProfile', role_id],
    () => {
      return getRoleDetails(roleProfileLink);
    },
    {
      onSuccess: (data) => {
        setSelectAll(
          branches.reduce(
            (prev, _, ind) => prev && data.roleDetails[`_${ind}`],
            true
          )
        );
      },
      onError: (err) => {
        errorHandler(err, navigate);
      },
    }
  );

  const deleteRoleMutation = useMutation(deleteRole, {
    onSuccess: () => {
      toast('Role deleted.');
      navigate(
        `/admin/company/${roleProfileQuery.data?.roleDetails.company_id}`
      );
    },
    onError: (err) => {
      errorHandler(err, navigate);
    },
  });

  const roleProfileMutation = useMutation(setRoleDetails, {
    onSuccess: (data) => {
      toast('Details submitted.');
      query.setQueryData(['roleProfile', role_id], (oldData) => {
        Object.assign(oldData.roleDetails, data.roleDetails);
      });
    },
    onError: (err) => {
      errorHandler(err, navigate);
    },
  });

  const submitForm = async (event) => {
    event.preventDefault();
    setReadOnly(true);
    const eligibleBranches = Object.fromEntries(
      Array.from(event.target.querySelectorAll('input[type="checkbox"]')).map(
        (ele) => [`_${ele.id}`, ele.checked]
      )
    );
    const roleDet = extractFormData(event.target);
    roleDet.active_backlogs = roleDet.active_backlogs || Infinity;
    roleDet.deadline = roleDet.deadline.split('T').join(' ') + ':00+0530';
    roleProfileMutation.mutate({
      roleProfileLink,
      roleDet,
      eligibleBranches: eligibleBranches,
    });
  };

  return roleProfileQuery.isLoading ? (
    <Loading />
  ) : (
    <div>
      <h2>{roleProfileQuery.data?.roleDetails.name}</h2>
      <h5>{roleProfileQuery.data?.roleDetails.company_description}</h5>
      <form onSubmit={submitForm}>
        <label htmlFor="role">
          Role:
          <input
            readOnly={readOnly}
            type="text"
            name="role"
            required={true}
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
          <div>
            <div hidden={readOnly}>
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
                  <input
                    id={ind}
                    type={'checkbox'}
                    disabled={readOnly}
                    defaultChecked={
                      roleProfileQuery.data?.roleDetails[`_${ind}`]
                    }
                  />{' '}
                  {branch} <br />
                </div>
              );
            })}
          </div>
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
        <label htmlFor="deadline">
          Application deadline:
          <input
            type="datetime-local"
            name="deadline"
            readOnly={readOnly}
            defaultValue={formatDateTime(
              roleProfileQuery.data?.roleDetails.deadline
            )}
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
      <button
        type="button"
        onClick={() => {
          deleteRoleMutation.mutate({ roleId: role_id });
        }}
      >
        Delete Role
      </button>
    </div>
  );
};
export default RoleProfile;
