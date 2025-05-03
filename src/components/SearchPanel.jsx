import { useState } from 'react';
import NavigationControls from './NavigationControls';
import FileDropZone from './FileDropZone';

const SearchPanel = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="search-panel">
      {/* Поисковая строка */}
      <div className="search-box">
        <input
          type="text"
          placeholder="Search Everywhere"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <span className="shortcut-hint">Double ⇧</span>
      </div>

      {/* Навигационные контролы */}
      <NavigationControls />

      {/* Зона перетаскивания файлов */}
      <FileDropZone />
    </div>
  );
};
