import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import errorHandler from '../error/errors';
import { getStudentApplications } from './applications';

const MyApplications = () => {
  const navigate = useNavigate();

  const myApplicationsQuery = useQuery(
    ['myApplications'],
    getStudentApplications,
    {
      onSuccess: (data) => {
        console.log(data);
      },
      onError: (err) => {
        errorHandler(err, navigate);
      },
    }
  );

  return (
    <div>
      <h1>MY APPLICATIONS</h1>
      {myApplicationsQuery.data?.studentApplications.map(
        ({ role_id, role, company_name, selection_status }) => (
          <div key={role_id}>
            <button
              key={role_id}
              onClick={() => {
                navigate(`/student/application/${role_id}`, { replace: false });
              }}
            >
              {company_name} {role} Selection status:{' '}
              {selection_status ? selection_status : 'Under review'}
            </button>
            <br />
          </div>
        )
      )}
    </div>
  );
};

export default MyApplications;
