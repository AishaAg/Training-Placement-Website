import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Test = () => {
  const notify = () => toast('yooo');
  return (
    <div>
      Toast
      <button onClick={notify}>pop up</button>
    </div>
  );
};

export default Test;
