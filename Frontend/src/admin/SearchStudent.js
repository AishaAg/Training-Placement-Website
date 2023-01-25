import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const SearchStudent = () => {
  const [enrollNo, setEnrollNo] = useState('');
  const navigate = useNavigate();
  return (
    <div>
      <label htmlFor="enrollmentNumber">
        Enrollment Number
        <input value={enrollNo} onChange={(e) => setEnrollNo(e.target.value)} />
      </label>
      <button
        type="button"
        onClick={() => {
          if (enrollNo === '') {
            toast('Please enter enrollment number.');
          }
          enrollNo && navigate(`/admin/student/${enrollNo}`, { replace: true });
        }}
      >
        Submit
      </button>
    </div>
  );
};
export default SearchStudent;
