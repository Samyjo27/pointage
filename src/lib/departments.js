const STORAGE_KEY = 'tt_departments';

const DEFAULT_DEPARTMENTS = ['Direction', 'RH', 'Informatique'];

export const getDepartments = () => {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    if (Array.isArray(raw) && raw.length > 0) return raw;
  } catch {}
  return DEFAULT_DEPARTMENTS;
};

export const addDepartment = (name) => {
  const list = getDepartments();
  if (!name || !name.trim()) return list;
  if (list.includes(name.trim())) return list;
  const next = [...list, name.trim()];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
};

export const setDepartments = (list) => {
  const next = Array.isArray(list) ? list : DEFAULT_DEPARTMENTS;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
};


