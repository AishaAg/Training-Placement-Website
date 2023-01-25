export const setStudentDetails = async ({ link, studDet }) => {
  const res = await fetch(link, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',

    body: JSON.stringify({ studDet }),
  });
  if (!res.ok) {
    const err = new Error((await res.json()).message);
    err.code = res.status;
    throw err;
  }
  return res.json();
};

export const getStudentDetails = async (link) => {
  const res = await fetch(link, {
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
