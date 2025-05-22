// src/utils/auth.js

export const getLoggedInUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const logout = () => {
  localStorage.removeItem('user');
};

export const getUserProgress = () => {
  const data = localStorage.getItem("userProgress");
  return data ? JSON.parse(data) : {};
};

export const updateUserProgress = (sectionKey) => {
  const data = getUserProgress();
  data[sectionKey] = true;
  localStorage.setItem("userProgress", JSON.stringify(data));
};
