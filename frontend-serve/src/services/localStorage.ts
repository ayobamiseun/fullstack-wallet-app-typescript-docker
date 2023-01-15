export const saveUser = (data: object) => localStorage.setItem('user', JSON.stringify(data));

export const removeUser = () => localStorage.removeItem('user');

export const getUser = () => {
  const data = localStorage.getItem('user');
  return JSON.parse(data || '');
}
