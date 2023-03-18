import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'react-toastify';
import errorHandler from '../error/errors.js';
import { signup } from './auth.js';

const Signup = () => {
  localStorage.clear();
  const [enrollNo, setEnrollNo] = useState('');
  const signupMutation = useMutation(signup, {
    onSuccess: (data) => {
      toast(`Email sent to ${data.starredEmail}`);
    },
    onError: (err) => {
      errorHandler(err);
    },
  });
  const submitForm = async (event) => {
    event.preventDefault();
    signupMutation.mutate({ enrollNo });
  };
  return (
    <>
      <form onSubmit={submitForm}>
        <h3>SIGN UP</h3>
        <label htmlFor="enrollment number">
          Enrollment Number:
          <input
            onChange={(e) => setEnrollNo(e.target.value)}
            value={enrollNo}
          />
        </label>
        <br />
        <button type="submit">Submit</button>
      </form>
    </>
  );
};
export default Signup;
