import { backendHost } from '../Config';

export const setStudentDetails = async ({
  admin,
  enrollment_number,
  studDet,
}) => {
  const res = await fetch(
    `${backendHost + (admin ? '/admin' : '')}/student/profile/${
      enrollment_number ?? ''
    }`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',

      body: JSON.stringify({ studDet }),
    }
  );
  if (!res.ok) {
    const err = new Error((await res.json()).message);
    err.code = res.status;
    throw err;
  }
  return res.json();
};

export const getStudentDetails = async ({ queryKey }) => {
  const res = await fetch(
    `${backendHost + (queryKey[1] ? '/admin' : '')}/student/profile/${
      queryKey[2] ?? ''
    }`,
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

export const setAdminVerified = async ({
  admin_verified,
  enrollment_number,
}) => {
  const res = await fetch(
    `${backendHost}/admin/student/profile/${enrollment_number}/admin_verified`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ admin_verified }),
    }
  );
  if (!res.ok) {
    const err = new Error((await res.json()).message);
    err.code = res.status;
    throw err;
  }
  return res.json();
};

export const setStudentBlocked = async ({ blocked, enrollment_number }) => {
  const res = await fetch(
    `${backendHost}/admin/student/profile/${enrollment_number}/blocked`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ blocked }),
    }
  );
  if (!res.ok) {
    const err = new Error((await res.json()).message);
    err.code = res.status;
    throw err;
  }
  return res.json();
};
