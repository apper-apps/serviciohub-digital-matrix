import { useState } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import { useLanguage } from '@/contexts/LanguageContext';

const SearchBar = ({ onSearch, placeholder }) => {
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const { t } = useLanguage();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch && query.trim()) {
      onSearch(query.trim());
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="relative"
      animate={{
        width: focused ? 320 : 280
      }}
      transition={{ duration: 0.2 }}
    >
      <div className="relative">
        <ApperIcon 
          name="Search" 
          size={16} 
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400" 
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder || t('Buscar...')}
          className="w-full pl-10 pr-4 py-2.5 border border-surface-300 rounded-lg 
                   bg-white text-surface-900 placeholder-surface-500
                   focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                   transition-all duration-200"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-surface-400 
                     hover:text-surface-600 transition-colors"
          >
            <ApperIcon name="X" size={16} />
          </button>
        )}
      </div>
    </motion.form>
  );
};

export default SearchBar;