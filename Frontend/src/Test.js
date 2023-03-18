import { useQueryClient } from '@tanstack/react-query';
import 'react-toastify/dist/ReactToastify.css';

const Test = () => {
  const query = useQueryClient();
  return (
    <div>
      <button
        onClick={() => {
          console.log(
            query.getQueryCache().queries[0]?.state?.data?.studentDetails
          );
        }}
      >
        On
      </button>
    </div>
  );
};

export default Test;
