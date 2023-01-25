import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AddCompany from './AddCompany';
import { useQuery } from '@tanstack/react-query';
import { getCompanyNames, getRoleNames } from './company';
import errorHandler from '../error/errors';

const SearchCompany = () => {
  const [roleName, setRoleName] = useState('');
  const [companyOptions, setCompanyOptions] = useState([]);
  const [roleOptions, setRoleOptions] = useState([]);
  const [addNewForm, setAddNewForm] = useState(false);
  const [companyId, setCompanyId] = useState('');
  const [companyName, setCompanyName] = useState('');

  const navigate = useNavigate();

  const companyNamesQuery = useQuery(
    ['companyNames', companyName],
    getCompanyNames,
    {
      onSuccess: (data) => {
        setCompanyOptions(data.companies);
      },
      onError: (err) => {
        errorHandler(err, navigate);
      },
    }
  );

  const roleNamesQuery = useQuery(
    ['roleNames', roleName, companyId],
    getRoleNames,
    {
      onSuccess: (data) => {
        setRoleOptions(data.roles);
      },
      onError: (err) => {
        errorHandler(err, navigate);
      },
    }
  );

  useEffect(() => {
    // TODO synchronize company name and role searches
    if (companyNamesQuery.isSuccess)
      setCompanyOptions(companyNamesQuery.data.companies);
  }, [companyName]);

  useEffect(() => {
    if (roleNamesQuery.isSuccess) setRoleOptions(roleNamesQuery.data.roles);
  }, [roleName]);

  return (
    <div>
      <label htmlFor="company name">
        Company Name:
        <input
          id="companyName"
          type="search"
          list="company_options"
          value={companyName}
          onChange={(e) => {
            setCompanyName(e.target.value);
            // getCompanyNames(e.target.value);
          }}
        />
        <datalist id="company_options">
          {companyOptions.map(({ id, name }) => (
            <option key={id} value={name}>
              {name}
            </option>
          ))}
        </datalist>
      </label>
      <br />
      <label htmlFor="role">
        Role:
        <input
          type="search"
          value={roleName}
          list="role_options"
          onChange={(e) => {
            setRoleName(e.target.value);
            companyOptions.length === 1
              ? setCompanyId(companyOptions[0].id)
              : setCompanyId('');
            // getRoleNames();
          }}
        />
        <datalist id="role_options">
          {roleOptions.map(({ id, role }) => (
            <option key={id} value={role}>
              {role}
            </option>
          ))}
        </datalist>
      </label>
      <br />
      <button
        type="button"
        onClick={() => {
          if (companyOptions.length === 1)
            navigate(`/admin/company/${companyId}/role/${roleOptions[0].id}`, {
              replace: true,
            });
          else {
            toast('No records found.');
          }
        }}
      >
        Submit
      </button>
      <h3>OR</h3>
      <button type="button" onClick={() => setAddNewForm(!addNewForm)}>
        Add New Company
      </button>
      <div hidden={!addNewForm}>
        <AddCompany />
      </div>
    </div>
  );
};
export default SearchCompany;
