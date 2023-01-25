import Home from './Home';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import About from './About';
import SetPassword from './auth/SetPassword';
import Signup from './auth/SignUp';
import Login from './auth/Login';
import StudentProfile from './student/StudentProfile';
import StudentHome from './student/StudentHome';
import AdminHome from './admin/AdminHome';
import SearchStudent from './admin/SearchStudent';
import SearchCompany from './company/SearchCompany';
import CompanyProfile from './company/CompanyProfile';
import AddCompany from './company/AddCompany';
import Test from './Test';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';
import AddRole from './company/AddRole';
import RoleProfile from './company/RoleProfile';
import Applications from './applications/Applications';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: Infinity,
      staleTime: Infinity,
      retry: 0,
    },
  },
});
const App = () => {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ToastContainer />
        <Routes>
          <Route path="/" exact element={<Home />} />
          <Route path="/student" exact element={<StudentHome />} />
          <Route path="/admin" exact element={<AdminHome />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/about" element={<About />} />
          <Route path="/set-password/:token" element={<SetPassword />} />
          <Route path="/student/profile" element={<StudentProfile />} />
          <Route path="/test" element={<Test />} />
          <Route
            path="/admin/student/profile"
            exact
            element={<SearchStudent />}
          />
          <Route
            path="/admin/student/:enrollment_number"
            element={<StudentProfile admin={true} />}
          />
          <Route
            path="/admin/company/profile"
            exact
            element={<SearchCompany />}
          />
          <Route
            path="/admin/company/:company_id"
            element={<CompanyProfile />}
          />
          <Route path="/admin/company/profile/new" element={<AddCompany />} />
          <Route
            path="/admin/company/:company_id/role/new"
            element={<AddRole />}
          />
          <Route
            path="/admin/company/:company_id/role/:role_id"
            element={<RoleProfile />}
          />
          <Route
            path="/student/applications"
            exact
            element={<Applications />}
          />
        </Routes>
      </QueryClientProvider>
    </BrowserRouter>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
