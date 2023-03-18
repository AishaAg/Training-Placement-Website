import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import errorHandler from '../error/errors';
import { getProforma } from './proforma';

const Proforma = () => {
  const navigate = useNavigate();
  const proformaQuery = useQuery(['proforma'], getProforma, {
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (err) => {
      errorHandler(err, navigate);
    },
  });

  return (
    <div>
      <h1>MY APPLICATIONS</h1>
      {proformaQuery.data?.proforma.map(({ role_id, role, company_name }) => (
        <div key={role_id}>
          <button
            key={role_id}
            onClick={() => {
              navigate(`/student/application/${role_id}`, { replace: false });
            }}
          >
            {company_name} {role}
          </button>
          <br />
        </div>
      ))}
    </div>
  );
};

export default Proforma;
