export const extractFormData = (form) => {
  const inputElements = Array.from(
    form.querySelectorAll('input,select,textarea')
  );
  return Object.fromEntries(
    inputElements.map((ele) => {
      switch (ele.type) {
        case 'number':
        case 'tel':
          return [ele.name, Number(ele.value)];
        case 'date':
          return [ele.name, new Date(ele.value)];
        case 'checkbox':
          return [ele.key, ele.value];
        default:
          return [ele.name, ele.value];
      }
    })
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
