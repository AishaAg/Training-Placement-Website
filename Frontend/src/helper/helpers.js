export const extractFormData = (form) => {
  const inputElements = Array.from(
    form.querySelectorAll('input,select,textarea')
  );
  return Object.fromEntries(
    inputElements
      .map((ele) => {
        if (!ele.value) {
          return [ele.name, ''];
        }
        switch (ele.type) {
          case 'number':
          case 'tel':
            return [ele.name, Number(ele.value)];
          case 'date':
            return [ele.name, new Date(ele.value)];
          case 'checkbox':
            return [ele.name, ele.checked];
          case 'file':
            return [ele.name, ele.files[0]];
          default:
            return [ele.name, ele.value];
        }
      })
      .filter(([e]) => e)
  );
};

export const formatDate = (date) => {
  return date
    ? new Date(
        new Date(date).getTime() - new Date(date).getTimezoneOffset() * 60000
      )
        .toISOString()
        .split('T')[0]
    : '';
};

export const formatDateTime = (date) => {
  return date
    ? new Date(
        new Date(date).getTime() - new Date(date).getTimezoneOffset() * 60000
      )
        .toISOString()
        .split('T')
        .join(' ')
        .slice(0, 19)
    : '';
};
