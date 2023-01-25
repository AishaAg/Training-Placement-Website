import { useMutation } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import errorHandler from '../error/errors.js';
import Loading from '../Loading.js';
import { login } from './auth.js';

const Login = () => {
  const navigate = useNavigate();

  const loginMutation = useMutation(login, {
    onSuccess: (data) => {
      navigate(data.admin ? '/admin' : '/student', {
        replace: true,
      });
    },
    onError: (err) => {
      errorHandler(err, navigate);
    },
  });

  return loginMutation.isLoading ? (
    <Loading />
  ) : (
    <div>
      <Link to="/signup">sign up</Link>
      <p>OR</p>
      <h3>LOGIN</h3>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target);
          loginMutation.mutate(Object.fromEntries(formData.entries()));
        }}
      >
        <label htmlFor="email">
          Email or Enrollment number:
          <input name="user" />
        </label>
        <br />
        <label htmlFor="password">
          Password:
          <input type="password" name="password" />
        </label>
        <br />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};
export default Login;
