import { backendHost } from '../Config';

export const getRoleNames = async ({ queryKey }) => {
  const companyId = queryKey[2];
  const roleName = queryKey[1];
  const res = await fetch(
    `${backendHost}/admin/company/role/role-names?role=${roleName}&company_id=${companyId}`,
    {
      method: 'GET',
      credentials: 'include',
    }
  );
  if (!res.ok) {
    const err = new Error((await res.json()).message);
    err.code = res.status;
    throw err;
  }
  return res.json();
};

export const getCompanyNames = async ({ queryKey }) => {
  const companyName = queryKey[1];
  const res = await fetch(
    `${backendHost}/admin/company/company-names/${companyName}`,
    {
      method: 'GET',
      credentials: 'include',
    }
  );
  if (!res.ok) {
    const err = new Error((await res.json()).message);
    err.code = res.status;
    throw err;
  }
  return res.json();
};

export const getCompanyDetails = async (companyProfileLink) => {
  const res = await fetch(companyProfileLink, {
    method: 'GET',
    credentials: 'include',
  });
  if (!res.ok) {
    const err = new Error((await res.json()).message);
    err.code = res.status;
    throw err;
  }
  return res.json();
};

export const setCompanyDetails = async ({ companyProfileLink, compDet }) => {
  const res = await fetch(companyProfileLink, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',

    body: JSON.stringify({ compDet }),
  });
  if (!res.ok) {
    const err = new Error((await res.json()).message);
    err.code = res.status;
    throw err;
  }
  return res.json();
};

export const addCompanyDetails = async ({ addCompanyLink, compDet }) => {
  const res = await fetch(addCompanyLink, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ compDet }),
  });
  if (!res.ok) {
    const err = new Error((await res.json()).message);
    err.code = res.status;
    throw err;
  }
  return res.json();
};

export const deleteCompany = async ({ companyId }) => {
  const res = await fetch(`${backendHost}/admin/company/${companyId}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!res.ok) {
    const err = new Error((await res.json()).message);
    err.code = res.status;
    throw err;
  }
  return;
};
