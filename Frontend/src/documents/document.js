import { backendHost } from '../Config';

export const getDocumentIds = async ({ user, documentType }) => {
  const res = await fetch(`${backendHost}/${user}/documents/${documentType}`, {
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

export const addDocument = async ({ data, user, documentType }) => {
  const res = await fetch(`${backendHost}/${user}/documents/${documentType}`, {
    method: 'POST',
    credentials: 'include',
    body: data,
  });
  if (!res.ok) {
    const err = new Error((await res.json()).message);
    err.code = res.status;
    throw err;
  }

  return res.json();
};

export const deleteDocument = async ({ user, documentType, documentId }) => {
  const res = await fetch(
    `${backendHost}/${user}/documents/${documentType}/${documentId}`,
    {
      method: 'DELETE',
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
