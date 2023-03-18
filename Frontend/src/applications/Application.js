import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { branches } from '../Config';
import errorHandler from '../error/errors';
import { extractFormData } from '../helper/helpers';
import Loading from '../Loading';
import { addApplication, getApplication } from './applications';

const Application = () => {
  const { role_id } = useParams();
  const navigate = useNavigate();

  const query = useQueryClient();

  const applicationMutation = useMutation(addApplication, {
    onSuccess: (data) => {
      toast(data.message);
      query.setQueryData(['application', role_id], (oldData) => {
        Object.assign(oldData, data);
      });
    },
    onError: (err) => {
      errorHandler(err, navigate);
    },
  });

  const applicationQuery = useQuery(['application', role_id], getApplication, {
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (err) => {
      errorHandler(err, navigate);
    },
  });

  return applicationQuery.isLoading ? (
    <Loading />
  ) : (
    <div>
      <h2>{applicationQuery.data?.application.name}</h2>
      <h5>{applicationQuery.data?.application.company_description}</h5>
      <div>
        <h6 htmlFor="role">
          Role:
          <p>{applicationQuery.data?.application.role}</p>
        </h6>
        <br />
        <h6 htmlFor="roleDescription">
          Role Description:
          <p>{applicationQuery.data?.application.role_description}</p>
        </h6>
        <br />
        <h6
          hidden={applicationQuery.data?.application.required_cgpa === 0}
          htmlFor="requiredCgpa"
        >
          Minimum required CGPA:
          <p>{applicationQuery.data?.application.required_cgpa}</p>
        </h6>
        <br />
        <h6 htmlFor="eligibleBranches">
          Eligible Branches: <br />
          <ol>
            {branches
              .filter(
                (_, ind) =>
                  applicationQuery.data?.application[`_${ind}`] === true
              )
              .map((branch, ind) => (
                <li key={ind}>{branch} </li>
              ))}
          </ol>
        </h6>
        <br />
        <h6
          hidden={applicationQuery.data?.application.required_experience === 0}
          htmlFor="requiredExperience"
        >
          Minimum required experience:
          <p>{applicationQuery.data?.application.required_experience}</p>
        </h6>
        <br />
        <h6
          hidden={
            applicationQuery.data?.application.active_backlogs >= Infinity
          }
          htmlFor="activeBacklogs"
        >
          Maximum allowed active backlogs:
          <p>{applicationQuery.data?.application.active_backlogs}</p>
        </h6>
        <br />
        <h6 htmlFor="compensation">
          Compensation offered:
          <p>{applicationQuery.data?.application.compensation}</p>
        </h6>
        <br />
        <h6 htmlFor="benefits">
          Benefits:
          <p>{applicationQuery.data?.application.benefits}</p>
        </h6>
        <br />
        <h6 htmlFor="jobLocation">
          Job Location:
          <p>{applicationQuery.data?.application.job_location}</p>
        </h6>
        <br />
        <h6 htmlFor="bondDetails">
          Bond Details:
          <p>{applicationQuery.data?.application.bond_details}</p>
        </h6>
        <br />
        <h6 htmlFor="hiringProcess">
          Hiring Process:
          <p>{applicationQuery.data?.application.hiring_process}</p>
        </h6>
        <br />
        <h6 htmlFor="driveStatus">
          Drive Status:
          <p>{applicationQuery.data?.application.drive_status}</p>
        </h6>
        <br />
        <h6 htmlFor="deadline">
          Application deadline:
          <p>
            {applicationQuery.data?.application.deadline
              .split('T')
              .join(' ')
              .slice(0, 16)}
          </p>
        </h6>
        <br />
        {applicationQuery.data?.application.resume_id === null ? (
          <div>
            <h6 htmlFor="resume">Upload Resume:</h6>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const resume_id = extractFormData(e.target);
                applicationMutation.mutate({
                  role_id,
                  resume_id,
                });
              }}
            >
              <h6 htmlFor="resumeId">
                Select Resume ID:
                <select name="resumeId" defaultValue={''}>
                  <option disabled={true} value="">
                    select
                  </option>
                  {applicationQuery.data?.resume_ids.map((id, ind) => (
                    <option key={ind} value={id.document_id}>
                      {id.document_id}
                    </option>
                  ))}
                </select>
              </h6>
              <button type="submit">Submit Application</button>
              <br />
              <p>OR</p>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  navigate(`/student/resume`, { replace: false });
                }}
              >
                Upload New Resume
              </button>
            </form>
          </div>
        ) : (
          <div>
            <h6>Resume ID:</h6>
            {applicationQuery.data?.application.resume_id}
          </div>
        )}
      </div>
    </div>
  );
};

export default Application;
