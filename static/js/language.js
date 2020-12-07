function getBrowserLocales(options = {}) {
  const defaultOptions = {
    languageCodeOnly: false,
  };

  const opt = {
    ...defaultOptions,
    ...options,
  };

  const browserLocales =
    navigator.languages === undefined
      ? [navigator.language]
      : navigator.languages;

  if (!browserLocales) {
    return undefined;
  }

  return browserLocales.map((locale) => {
    const trimmedLocale = locale.trim();

    return opt.languageCodeOnly ? trimmedLocale.split(/-|_/)[0] : trimmedLocale;
  });
}

function redirect() {
  location.pathname = `/${localStorage.getItem('language')}${location.pathname}`;
}

const pathArray = location.pathname.split("/");
// If there is no language path in url
if (pathArray[1] !== "en" && pathArray[1] !== "zh-CN") {
  const language = localStorage.getItem("language");
  
  // If there is language setting in localStorage,
  // redirect to that language version of current path
  if (language === "en" || language === "zh-CN") {
    localStorage.setItem("language", language);
    redirect();
  }
  // Else, get browser language code and save it to localStorage,
  // redirect to that language version of current path
  else {
    const languages = getBrowserLocales({ languageCodeOnly: true });
    for (let lang of languages) {
      if (lang === "en") {
        localStorage.setItem("language", "en");
        redirect();
        break;
      } else if (lang === "zh") {
        localStorage.setItem("language", "zh-CN");
        redirect();
        break;
      }
    }
    // If no language matches, fallback to `en`
    updateLanguage("en");
    redirect();
  }
}
// Update the localstorage value
else {
  localStorage.setItem("language", pathArray[1]);
}
