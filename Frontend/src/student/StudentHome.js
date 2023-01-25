import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Loading from '../Loading.js';

const StudentHome = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  return loading ? <Loading /> : <h3>You are at Student Home!</h3>;
};
export default StudentHome;
