import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Loading from '../Loading.js';

const AdminHome = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  return loading ? <Loading /> : <h3>You are at Admin Home!</h3>;
};
export default AdminHome;
