class ToggleTheme {
  selectors = {
    toggleButton: '[data-js-toggle-theme-button]',
  }
  themes = {
    dark: 'dark',
    light: 'light',
  }
  storageKeys = {
    theme: 'theme',
  }

  constructor() {
    this.toggleButtonElement = document.querySelector(this.selectors.toggleButton)

    this.setInitialTheme()
    this.bindEvents()
  }

  setInitialTheme = () => {
    const theme = localStorage.getItem(this.storageKeys.theme)

    if (theme === this.themes.light || theme === this.themes.dark) {
      this.setTheme(theme)
    }
  }

  saveThemeToLocalStorage = (theme) => {
    localStorage.setItem(this.storageKeys.theme, theme)
  }

  onToggleButtonClick = () => {
    const themeIsDark = document.documentElement.dataset.jsTheme === this.themes.dark

    if (themeIsDark) {
      this.setTheme(this.themes.light)
      this.saveThemeToLocalStorage(this.themes.light)
    } else {
      this.setTheme(this.themes.dark)
      this.saveThemeToLocalStorage(this.themes.dark)
    }
  }

  setTheme = (theme) => {
    document.documentElement.dataset.jsTheme = theme
  }

  bindEvents = () => {
    this.toggleButtonElement.addEventListener('click', this.onToggleButtonClick)
  }
}

export default ToggleTheme
