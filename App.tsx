
import React, { useState } from 'react';
import Header from './components/Header';
import Tabs from './components/Tabs';
import SiteTab from './components/SiteTab';
import RoomsTab from './components/RoomsTab';
import WallsTab from './components/WallsTab';
import StaffTab from './components/StaffTab';
import EconomyTab from './components/EconomyTab';
import DefenseTab from './components/DefenseTab';
import ConstructionTab from './components/ConstructionTab';
import SummaryTab from './components/SummaryTab';
import { useStronghold } from './hooks/useStronghold';
// FIX: Import TabId from the newly organized types.ts file.
import { TabId } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>('site');
  const stronghold = useStronghold();

  const renderTabContent = () => {
    switch (activeTab) {
      case 'site':
        return <SiteTab stronghold={stronghold} />;
      case 'rooms':
        return <RoomsTab stronghold={stronghold} />;
      case 'walls':
        return <WallsTab stronghold={stronghold} />;
      case 'staff':
        return <StaffTab stronghold={stronghold} />;
      case 'economy':
        return <EconomyTab stronghold={stronghold} />;
      case 'defense':
        return <DefenseTab stronghold={stronghold} />;
      case 'construction':
        return <ConstructionTab stronghold={stronghold} />;
      case 'summary':
        return <SummaryTab stronghold={stronghold} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen p-2 md:p-4 lg:p-6">
      <div className="container mx-auto max-w-7xl p-2 sm:p-5 bg-parchment-bg/90 border-8 border-wood rounded-2xl shadow-2xl shadow-wood-dark/30">
        <Header />
        <div className="text-center font-semibold text-wood-dark bg-gold/50 py-2 -mt-4 mb-4 border-b-2 border-t-2 border-wood/20">
          {stronghold.activeSaveName ? (
            <>
              Aktives Bollwerk: <span className="font-medieval text-xl">{stronghold.activeSaveName}</span>
            </>
          ) : (
            <>
              Aktives Bollwerk: <span className="font-medieval text-xl italic text-wood-text/80">Neues, ungespeichertes Bollwerk</span>
            </>
          )}
        </div>
        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="bg-parchment-bg/95 border-x-3 border-b-3 border-wood rounded-b-lg p-4 sm:p-8 min-h-[500px]">
          {renderTabContent()}
        </main>
      </div>
    </div>
  );
};

export default App;
