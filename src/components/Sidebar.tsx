'use client';
import { useEffect, useRef } from 'react';

interface SidebarProps {
  isSidebarLoading: boolean;
  latestItems: any[];
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  title: string;
  subtitle: string;
}

const Sidebar: React.FC<SidebarProps> = ({
  isSidebarLoading,
  latestItems,
  sidebarOpen,
  setSidebarOpen,

  title,
  subtitle,
}) => {
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [setSidebarOpen]);



  return (
    <div
      ref={sidebarRef}
      className={`fixed inset-y-0 right-0 w-full md:w-1/3 lg:w-1/4 bg-white shadow-lg transform ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out overflow-y-auto`}
    >
      <div className="p-6">
        <button
          onClick={() => setSidebarOpen(false)}
          className="absolute top-4 right-4 text-primaryDark hover:text-primary"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h3 className="text-lg font-semibold text-primaryDark">{title}</h3>
        <h3 className="text-sm text-gray-600">{subtitle}</h3>

        {isSidebarLoading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <ul className="space-y-2">
            {latestItems.map((item, idx) => (
              <li key={idx} className="p-4 bg-secondaryLight rounded-lg shadow-md">
                <a href={item.url} className="block" target="_blank" rel="noreferrer">
                  <p className="text-lg font-semibold text-primaryDark">{item.title}</p>
                  <p className="text-sm text-gray-600">
                    {item.total_item_price.currency_code} {item.total_item_price.amount.toFixed(2)}
                  </p>
                  {item.photos.length > 0 && (
                    <img src={item.photos[0].url} alt={item.title} className="w-full h-32 object-cover rounded-lg mt-2" />
                  )}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
