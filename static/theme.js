const themeMeta = document.querySelector('meta[name="color-scheme"]');
const themeSelect = document.getElementById('theme');
const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');

function applyTheme(value) {
  const scheme = value === 'light' || value === 'dark' ? value : 'light dark';
  themeMeta.content = scheme;
  themeSelect.value = scheme === 'light dark' ? 'system' : scheme;
}

function labelSystemTheme() {
  themeSelect.querySelector('[value="system"]').textContent = `System (${systemTheme.matches ? 'dark' : 'light'})`;
}

applyTheme(themeMeta.content);
labelSystemTheme();
themeSelect.closest('label').hidden = false;
themeSelect.addEventListener('change', () => {
  applyTheme(themeSelect.value);
  try {
    if (themeSelect.value === 'system') localStorage.removeItem('portfolio-color-scheme');
    else localStorage.setItem('portfolio-color-scheme', themeSelect.value);
  } catch { /* The selection still works when storage is unavailable. */ }
});
systemTheme.addEventListener('change', labelSystemTheme);
window.addEventListener('storage', (event) => {
  if (event.key === 'portfolio-color-scheme' || event.key === null) applyTheme(event.newValue);
});
