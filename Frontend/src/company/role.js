import { backendHost } from '../Config';

export const getRoleDetails = async (roleProfileLink) => {
  const res = await fetch(roleProfileLink, {
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

export const setRoleDetails = async ({
  roleProfileLink,
  roleDet,
  eligibleBranches,
}) => {
  const res = await fetch(roleProfileLink, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',

    body: JSON.stringify({ roleDet, eligibleBranches }),
  });
  if (!res.ok) {
    const err = new Error((await res.json()).message);
    err.code = res.status;
    throw err;
  }
  return res.json();
};

export const deleteRole = async ({ roleId }) => {
  const res = await fetch(`${backendHost}/admin/company/role/${roleId}`, {
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

export const addRoleDetails = async ({
  addRoleLink,
  roleDet,
  eligibleBranches,
}) => {
  const res = await fetch(addRoleLink, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',

    body: JSON.stringify({ roleDet, eligibleBranches }),
  });
  if (!res.ok) {
    const err = new Error((await res.json()).message);
    err.code = res.status;
    throw err;
  }
  return res.json();
};
