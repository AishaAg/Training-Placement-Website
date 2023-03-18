import { backendHost } from '../Config';

export const getProforma = async () => {
  const res = await fetch(`${backendHost}/student/proforma`, {
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
