import { backendHost } from '../Config';

export const getStudentApplications = async () => {
  const res = await fetch(`${backendHost}/student/application/all`, {
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

export const getApplications = async () => {
  const res = await fetch(`${backendHost}/student/applications`, {
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

export const getApplication = async ({ queryKey }) => {
  const res = await fetch(`${backendHost}/student/application/${queryKey[1]}`, {
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

export const addApplication = async ({ resume_id, role_id }) => {
  const res = await fetch(`${backendHost}/student/application/${role_id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ resume_id }),
  });
  if (!res.ok) {
    const err = new Error((await res.json()).message);
    err.code = res.status;
    throw err;
  }
  return res.json();
};
