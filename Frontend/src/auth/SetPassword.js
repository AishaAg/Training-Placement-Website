import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import errorHandler from '../error/errors';
import { setPassword } from './auth';

const SetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [pass, setPass] = useState(null);
  const [confirmPass, setConfirmPass] = useState(null);
  const [passStatus, setPassStatus] = useState('');

  const setPasswordMutation = useMutation(setPassword, {
    onSuccess: (data) => {
      toast('Password set.');
      navigate(data.admin ? '/admin' : '/student', { replace: true });
    },
    onError: (err) => {
      errorHandler(err, navigate);
    },
  });

  const submitForm = async (event) => {
    event.preventDefault();
    setPassStatus('');
    if (pass !== confirmPass) {
      setPassStatus('This field does not match the password.');
      return;
    } else if (pass === '' || pass === null) {
      setPassStatus('Password field is empty.');
      return;
    }
    setPasswordMutation.mutate({ token, password: pass });
  };

  return (
    <>
      <form onSubmit={submitForm}>
        <h3>SET PASSWORD</h3>
        <label htmlFor="password">
          Password:
          <input
            type="password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
          />
        </label>
        <br />
        <label htmlFor="confirm password">
          Confirm Password:
          <input
            type="password"
            value={confirmPass}
            onChange={(e) => setConfirmPass(e.target.value)}
          />
          <p>{passStatus}</p>
        </label>
        <button type="submit">Submit</button>
      </form>
    </>
  );
};
export default SetPassword;
