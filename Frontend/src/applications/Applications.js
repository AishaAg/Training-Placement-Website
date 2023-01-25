import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import errorHandler from '../error/errors';
import Loading from '../Loading';
import { getApplications } from './applications';

const Applications = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);

  const getApplicationsQuery = useQuery(['applications'], getApplications, {
    onSuccess: (data) => {
      setApplications(data.applications);
    },
    onError: (err) => {
      errorHandler(err, navigate);
    },
  });

  return getApplicationsQuery.isLoading ? (
    <Loading />
  ) : (
    <div>
      {applications.map(({ role_id, role, company_name }) => (
        <button
          key={role_id}
          onClick={() => {
            navigate(`/student/application/${role_id}`, { replace: true });
          }}
        >
          {company_name} {role}
        </button>
      ))}
    </div>
  );
};

export default Applications;
