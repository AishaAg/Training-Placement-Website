import { toast } from 'react-toastify';

// TODO
const errorHandler = (err, navigate = () => {}) => {
  toast(err.message);
  if (err.link) {
    navigate(err.link);
  }
  switch (err.code) {
    case 400:
      break;
    case 401:
    case 498:
      navigate('/login', { replace: false });
      break;
    case 403:
      navigate('/student/profile');
      break;
    case 409:
      break;
    case 432:
      break;
    case 410:
      break;
    case 433:
      break;
    case 500:
      break;
  }
};

export default errorHandler;
