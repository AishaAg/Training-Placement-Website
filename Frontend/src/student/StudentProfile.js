import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { backendHost, branches, genders, programs } from '../Config.js';
import errorHandler from '../error/errors.js';
import { extractFormData, formatDate } from '../helper/helpers.js';
import Loading from '../Loading.js';
import { getStudentDetails, setStudentDetails } from './student.js';

// TODO MAKE REQUIRED FIELDS COMPULSORY

const StudentProfile = ({ admin }) => {
  const navigate = useNavigate();
  const currYear = new Date().getFullYear();
  const { enrollment_number } = useParams();
  const link = `${backendHost + (admin ? '/admin' : '')}/student/${
    enrollment_number ?? ''
  }`;

  const [readOnly, setReadOnly] = useState(false);

  const query = useQueryClient();
  const studentProfileQuery = useQuery(
    ['studentDetails', enrollment_number],
    () => {
      return getStudentDetails(link);
    },
    {
      onSuccess: (data) => {
        setReadOnly(!admin && data.studentDetails.admin_verified);
      },
      onError: (err) => {
        errorHandler(err, navigate);
      },
    }
  );

  const studentProfileMutation = useMutation(setStudentDetails, {
    onSuccess: (data) => {
      toast('Details submitted.');
      query.setQueryData(['studentDetails', enrollment_number], (oldData) => {
        Object.assign(oldData, data);
      });
    },
    onError: (err) => {
      errorHandler(err, navigate);
    },
  });

  return studentProfileMutation.isLoading || studentProfileQuery.isLoading ? (
    <Loading />
  ) : (
    <div>
      <h2>PROFILE</h2>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          const studDet = extractFormData(event.target);
          studentProfileMutation.mutate({ studDet, link });
        }}
      >
        <fieldset>
          <legend>Personal Information</legend>
          <label htmlFor="name">
            Name:
            <input
              defaultValue={studentProfileQuery.data?.studentDetails.name}
              required={true}
              readOnly={readOnly}
              type="text"
              name="name"
            />
          </label>
          <br />
          <label htmlFor="date_of_birth">
            Date of birth:
            <input
              defaultValue={formatDate(
                studentProfileQuery.data?.studentDetails.date_of_birth
              )}
              required={true}
              readOnly={readOnly}
              type="date"
              name="date_of_birth"
            />
          </label>
          <br />
          <label htmlFor="gender">
            Gender:
            <select
              name="gender"
              id="gender"
              defaultValue={
                studentProfileQuery.data?.studentDetails.gender ?? ''
              }
            >
              <option disabled={true} value="">
                select
              </option>
              {genders.map((g, i) => (
                <option key={i} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </label>
          <br />
          <label htmlFor="contact">
            Contact Number:
            <input
              defaultValue={studentProfileQuery.data?.studentDetails.contact}
              required={true}
              readOnly={readOnly}
              type="tel"
              pattern="[0-9]{10}"
              name="contact"
            />
          </label>
          <br />
        </fieldset>
        <fieldset>
          <legend>Academic Information</legend>
          <label htmlFor="program">
            Program:
            <select
              name="program"
              id="program"
              defaultValue={
                studentProfileQuery.data?.studentDetails.program ?? ''
              }
            >
              <option value="" disabled={true}>
                select
              </option>
              {programs.map((p, i) => (
                <option key={i} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </label>
          <br />
          <label htmlFor="branch">
            Branch:
            <select
              name="branch"
              id="branch"
              defaultValue={
                studentProfileQuery.data?.studentDetails.branch ?? ''
              }
            >
              <option value="" disabled={true}>
                select
              </option>
              {branches.map((p, i) => (
                <option key={i} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </label>
          <br />
          <label htmlFor="semester">
            Semester:
            <input
              required={true}
              readOnly={readOnly}
              type="number"
              min={1}
              max={8}
              step={1}
              name="semester"
              defaultValue={studentProfileQuery.data?.studentDetails.semester}
            />
          </label>
          <br />
          <label htmlFor="batch">
            Batch:
            <input
              required={true}
              readOnly={readOnly}
              placeholder="select year of joining"
              type="number"
              min={currYear - 12}
              max={currYear}
              step={1}
              name="batch"
              defaultValue={studentProfileQuery.data?.studentDetails.batch}
            />
          </label>
          <br />
          <label htmlFor="cgpa">
            CGPA:
            <input
              required={true}
              readOnly={readOnly}
              type="number"
              min={0}
              max={10}
              step={0.01}
              name="cgpa"
              defaultValue={studentProfileQuery.data?.studentDetails.cgpa}
            />
          </label>
          <br />
          <label htmlFor="active backlogs">
            Number of active backlogs:
            <input
              required={true}
              readOnly={readOnly}
              type="number"
              min={0}
              step={1}
              name="active_backlogs"
              defaultValue={
                studentProfileQuery.data?.studentDetails.active_backlogs
              }
            />
          </label>
          <br />
        </fieldset>
        {readOnly ? <></> : <button type="submit">Submit</button>}
      </form>
      <label htmlFor="admin verified">
        Admin Verified
        <button
          required={true}
          readOnly={!admin}
          type="text"
          defaultValue={'false'}
          name="adminVerified"
        />
      </label>
    </div>
  );
};
export default StudentProfile;
