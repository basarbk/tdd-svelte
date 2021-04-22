const setItem = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const getItem = (key) => {
  const stored = localStorage.getItem(key);
  if (!stored) {
    return null;
  }

  try {
    return JSON.parse(stored);
  } catch (err) {
    return stored;
  }
};

const clear = () => {
  localStorage.clear();
};

export default {
  setItem,
  getItem,
  clear,
};
