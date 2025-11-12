
import React from 'react';
import { TabId } from '../types';
import { TABS } from '../constants';

interface TabsProps {
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
}

const Tabs: React.FC<TabsProps> = ({ activeTab, setActiveTab }) => (
  <nav className="flex flex-col sm:flex-row bg-wood rounded-t-lg overflow-hidden">
    {TABS.map(tab => (
      <button
        key={tab.id}
        onClick={() => setActiveTab(tab.id)}
        className={`flex-1 p-4 font-cinzel text-base font-semibold cursor-pointer transition-all duration-300 ease-in-out border-b-2 sm:border-b-0 sm:border-r-2 border-wood-dark last:border-r-0
          ${activeTab === tab.id
            ? 'bg-parchment-light text-wood'
            : 'bg-wood-light text-parchment-bg hover:bg-gold-dark'
          }`}
      >
        {tab.icon} {tab.label}
      </button>
    ))}
  </nav>
);

export default Tabs;
