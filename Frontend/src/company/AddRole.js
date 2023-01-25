import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { backendHost } from '../Config';
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
      console.log(data);
      navigate(`/admin/company/${company_id}/role/${data.roleId}`, {
        replace: true,
      });
    },
    onError: (err) => {
      errorHandler(err, navigate);
    },
  });

  const submitForm = async (event) => {
    event.preventDefault();
    const roleDet = extractFormData(event.target);
    roleProfileMutation.mutate({ addRoleLink, roleDet });
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
          <input type="text" name="eligible_branches" defaultValue={''} />
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
        <button type="submit">Done</button>
      </form>
    </div>
  );
};
export default AddRole;
