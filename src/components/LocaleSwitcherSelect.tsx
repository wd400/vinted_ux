import React, { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';

interface LocaleSwitcherSelectProps {
  children: React.ReactNode;
  selectedLocale: string;
  onSelectChange: (locale: string) => void;
}

const LocaleSwitcherSelect: React.FC<LocaleSwitcherSelectProps> = ({
  children,
  selectedLocale,
  onSelectChange,
}) => {
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLocaleChange = (locale: string) => {
    onSelectChange(locale);
    setDropdownVisible(false); // Close the dropdown
  };

  const currentLocale = selectedLocale.toUpperCase();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownVisible(false);
      }
    };

    if (isDropdownVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownVisible]);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        className={clsx(
          'inline-flex items-center px-2 py-3 text-gray-400',
          isDropdownVisible && 'opacity-30 transition-opacity'
        )}
        onClick={() => setDropdownVisible(!isDropdownVisible)}
        type="button"
      >
        {currentLocale} ⏷
      </button>

      {isDropdownVisible && (
        <div className="absolute right-0 z-10 mt-2 w-40 rounded-md border border-gray-300 bg-white text-black shadow-lg">
          <ul className="py-1">
            {React.Children.map(children, (child) => (
              <li
                key={(child as React.ReactElement).props.value}
                className={clsx(
                  'cursor-pointer px-4 py-2 hover:bg-gray-100',
                  selectedLocale ===
                  (child as React.ReactElement).props.value && 'font-semibold'
                )}
                onClick={() =>
                  handleLocaleChange((child as React.ReactElement).props.value)
                }
              >
                {(child as React.ReactElement).props.children}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default LocaleSwitcherSelect;