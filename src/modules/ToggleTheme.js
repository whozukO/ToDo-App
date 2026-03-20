import { STORAGE_KEYS } from '@/utils/constants.js'

class ToggleTheme {
  selectors = {
    toggleButton: '[data-js-toggle-theme-button]',
  }

  themes = {
    dark: 'dark',
    light: 'light',
  }

  constructor() {
    this.toggleButtonElement = document.querySelector(this.selectors.toggleButton)

    this.setInitialTheme()
    this.bindEvents()
  }

  setInitialTheme = () => {
    const theme = localStorage.getItem(STORAGE_KEYS.theme)

    if (theme === this.themes.light || theme === this.themes.dark) {
      this.setTheme(theme)
    }
  }

  saveThemeToLocalStorage = (theme) => {
    localStorage.setItem(STORAGE_KEYS.theme, theme)
  }

  onToggleButtonClick = () => {
    const themeIsDark = document.documentElement.dataset.theme === this.themes.dark

    if (themeIsDark) {
      this.setTheme(this.themes.light)
      this.saveThemeToLocalStorage(this.themes.light)
    } else {
      this.setTheme(this.themes.dark)
      this.saveThemeToLocalStorage(this.themes.dark)
    }
  }

  setTheme = (theme) => {
    document.documentElement.dataset.theme = theme
  }

  bindEvents = () => {
    this.toggleButtonElement.addEventListener('click', this.onToggleButtonClick)
  }
}

export default ToggleTheme
