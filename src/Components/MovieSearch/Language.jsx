import React, { useEffect, useState } from 'react';
import '../../styles/MovieSearch/Language.css';

const LanguageDropdown = () => {
  const [languages, setLanguages] = useState([]);
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/configuration/languages?api_key=YOUR_API_KEY`)
      .then(res => res.json())
      .then(data => {
        const sorted = data.sort((a, b) => a.english_name.localeCompare(b.english_name));
        setLanguages(sorted);
      });
  }, []);

  const filteredLanguages = languages.filter(lang =>
    lang.english_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="lang-dropdown" onClick={() => setOpen(!open)}>
      <span>🌐 Language ▾</span>
      {open && (
        <div className="lang-list" onClick={e => e.stopPropagation()}>
          <input
            type="text"
            placeholder="Search language..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <ul>
            {filteredLanguages.map(lang => (
              <li key={lang.iso_639_1}>{lang.english_name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default LanguageDropdown;
