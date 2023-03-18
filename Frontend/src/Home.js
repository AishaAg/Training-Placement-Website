import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { backendHost } from './Config';
import { toast } from 'react-toastify';

const Home = () => {
  // const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();
  const getNotices = async () => {
    try {
      const res = await fetch(`${backendHost}/get-notices`, {
        method: 'GET',
        credentials: 'include',
      });
      console.log(res);
      if (res.ok) {
        // setLoggedIn(true);
      } else {
        // setLoggedIn(false);
        const response = await res.json();
        toast(response.message);
        if (res.status === 401 || res.status === 498) {
          navigate('/login', { replace: false });
        }
      }
    } catch (e) {
      toast('Some error occured.');
    }
  };
  useEffect(() => {
    getNotices();
  }, []);
  return <h3>You are logged in</h3>;
};

export default Home;
