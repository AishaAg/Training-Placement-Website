import { backendHost } from '../Config';

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
