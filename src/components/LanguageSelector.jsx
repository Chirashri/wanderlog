const LanguageSelector = ({ lang, setLang }) => {
  return (
    <select
      value={lang}
      onChange={(e) => setLang(e.target.value)}
      className="px-3 py-2 rounded-lg border border-gray-400 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <option value="en">🇬🇧 English</option>
      <option value="hi">🇮🇳 Hindi</option>
      <option value="fr">🇫🇷 French</option>
      <option value="es">🇪🇸 Spanish</option>
    </select>
  );
};

export default LanguageSelector;
