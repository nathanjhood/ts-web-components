const initializeTheme = () => {
  // On page load or when changing themes, best to add inline in `head` to avoid FOUC
  if (
    localStorage['theme'] === 'dark' ||
    (!('theme' in localStorage) &&
      window.matchMedia('(prefers-color-scheme: dark)').matches)
  ) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};

const getTheme = () => {
  return localStorage['theme'];
};

const setThemeLight = () => {
  // Whenever the user explicitly chooses light mode
  localStorage['theme'] = 'light';
};

const setThemeDark = () => {
  // Whenever the user explicitly chooses dark mode
  localStorage['theme'] = 'dark';
};

const setTheme = (theme: 'light' | 'dark') => {
  if (getTheme() !== theme) setTheme(theme);
};

const removeTheme = () => {
  // Whenever the user explicitly chooses to respect the OS preference
  localStorage.removeItem('theme');
};
