import React, { useState, useEffect, useMemo, useRef } from 'react';
import { UseStrongholdReturn, ResourceType, StrongholdComponent, Wall, ScaledBonuses, Perk } from '../types';
import { ALL_PERKS, COMPONENTS } from '../constants';

const SummarySection: React.FC<{ title: string; children: React.ReactNode, icon: string }> = ({ title, icon, children }) => (
    <div className="bg-gradient-to-br from-gold/80 to-gold-dark/80 text-wood-dark p-6 rounded-lg border-2 border-wood-dark shadow-lg">
        <h3 className="text-2xl font-semibold text-center mb-4">{icon} {title}</h3>
        <div className="space-y-2 bg-black/10 p-4 rounded">{children}</div>
    </div>
);

const SummaryRow: React.FC<{ label: string; value: string | number; isNegative?: boolean; className?: string }> = ({ label, value, isNegative = false, className }) => (
    <div className={`flex justify-between items-baseline ${className}`}>
        <span>{label}:</span>
        <span className={`font-bold text-lg ${isNegative ? 'text-red-800' : ''}`}>{value}</span>
    </div>
);

const SummaryTotalRow: React.FC<{ label: string; value: string | number; isNegative?: boolean }> = ({ label, value, isNegative = false }) => (
     <div className={`flex justify-between items-baseline border-t-2 border-wood-light/50 pt-2 mt-2 font-bold text-xl ${isNegative ? 'text-red-900' : 'text-green-900'}`}>
        <span>{label}:</span>
        <span>{value}</span>
    </div>
);

const RESOURCE_LABELS: Record<ResourceType, string> = {
    servantQuarterSpace: "Servant Quarters",
    barracksSpace: "Barracks Space",
    bedroomSpace: "Bedrooms",
    suiteSpace: "Suites",
    food: "Food Supply",
    diningHallSeat: "Dining Seats",
    armorySpace: "Armory Space",
    bath: "Baths",
    storage: "Storage (lbs)",
    stallSpace: "Stall Space"
};

const AssetSection: React.FC<{ title: string; value: number; children: React.ReactNode }> = ({ title, value, children }) => (
    <div className="bg-parchment/70 p-4 rounded-lg border border-wood-light shadow-md">
        <div className="flex justify-between items-center pb-2 mb-2 border-b border-wood-light/30">
            <h4 className="text-xl font-semibold text-wood-dark">{title}</h4>
            <span className="font-bold text-wood">{value.toFixed(0)} GP</span>
        </div>
        <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
            {children}
        </div>
    </div>
);

const AssetItem: React.FC<{ item: StrongholdComponent | Wall; isPending: boolean; onDelete: () => void; }> = ({ item, isPending, onDelete }) => (
    <div className="flex justify-between items-center bg-parchment-light/50 p-2 rounded-md">
        <div>
            <div className="font-semibold">{item.name}</div>
            <div className="text-sm text-wood-text/80">{item.totalCost.toFixed(0)} GP</div>
        </div>
        <button
            onClick={onDelete}
            title={isPending ? 'Bestätige Abriss' : 'Abriss'}
            className={`font-bold text-xs py-1 px-2 rounded transition-all duration-200 ${isPending ? 'bg-yellow-500 text-black animate-pulse' : 'bg-red-600 text-white hover:bg-red-700'}`}
        >
            {isPending ? 'Bestätigen?' : 'Abriss'}
        </button>
    </div>
);

const SaveLoadManager: React.FC<{ stronghold: UseStrongholdReturn }> = ({ stronghold }) => {
    const { saveSlots, activeSaveName, saveAsNewSlot, loadSlot, deleteSlot, renameSlot, copySlot, exportSlot } = stronghold;
    const [newSaveName, setNewSaveName] = useState('');
    
    const [editingName, setEditingName] = useState<string | null>(null);
    const [currentEditedName, setCurrentEditedName] = useState('');
    const [pendingDeleteName, setPendingDeleteName] = useState<string | null>(null);

    useEffect(() => {
        if (pendingDeleteName) {
            const timer = setTimeout(() => setPendingDeleteName(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [pendingDeleteName]);

    const handleSaveAs = () => {
        if (newSaveName.trim()) {
            if (saveAsNewSlot(newSaveName.trim())) {
                setNewSaveName('');
            }
        }
    };

    const handleStartRename = (name: string) => {
        setEditingName(name);
        setCurrentEditedName(name);
        setPendingDeleteName(null);
    };

    const handleConfirmRename = () => {
        if (editingName && currentEditedName.trim()) {
            if (renameSlot(editingName, currentEditedName.trim())) {
                setEditingName(null);
            }
        }
    };
    
    const handleCancelRename = () => {
        setEditingName(null);
    };

    const handleDeleteClick = (name: string) => {
        if (pendingDeleteName === name) {
            deleteSlot(name);
            setPendingDeleteName(null);
        } else {
            setEditingName(null);
            setPendingDeleteName(name);
        }
    };


    return (
        <div className="mt-12 bg-gradient-to-br from-parchment to-parchment-dark p-6 rounded-lg border-2 border-wood shadow-lg">
            <h3 className="text-2xl font-semibold text-center mb-4 text-wood-dark">💾 Spielstände Verwalten</h3>
            <div className="space-y-4">
                <div className="bg-black/10 p-4 rounded space-y-3">
                    <label htmlFor="new-save-name" className="block font-semibold text-center">Neuen Spielstand anlegen</label>
                    <div className="flex space-x-2">
                        <input
                            id="new-save-name"
                            type="text"
                            value={newSaveName}
                            onChange={e => setNewSaveName(e.target.value)}
                            placeholder="Name des Spielstands"
                            className="w-full p-2 border-2 border-gold rounded-md bg-white/80"
                        />
                        <button onClick={handleSaveAs} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded whitespace-nowrap">Speichern als...</button>
                    </div>
                </div>

                <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                    {saveSlots.length > 0 ? saveSlots.map(slot => (
                        <div key={slot.name} className={`p-3 rounded border-2 flex flex-col sm:flex-row justify-between items-center gap-2 ${slot.name === activeSaveName ? 'bg-gold-light border-wood-dark' : 'bg-parchment-light border-gold-dark'}`}>
                            {editingName === slot.name ? (
                                <div className="flex-1 w-full sm:w-auto">
                                    <input 
                                        type="text"
                                        value={currentEditedName}
                                        onChange={e => setCurrentEditedName(e.target.value)}
                                        onKeyDown={e => e.key === 'Enter' && handleConfirmRename()}
                                        autoFocus
                                        className="w-full p-1 border-2 border-wood rounded-md bg-white"
                                    />
                                </div>
                            ) : (
                                <div>
                                    <p className="font-bold">{slot.name}</p>
                                    <p className="text-xs text-wood-text/80">Zuletzt gespeichert: {new Date(slot.lastSaved).toLocaleString()}</p>
                                </div>
                            )}
                            
                            {editingName === slot.name ? (
                                <div className="flex space-x-1">
                                    <button onClick={handleConfirmRename} className="bg-green-600 hover:bg-green-700 text-white text-xs font-bold py-1 px-2 rounded">Speichern</button>
                                    <button onClick={handleCancelRename} className="bg-gray-500 hover:bg-gray-600 text-white text-xs font-bold py-1 px-2 rounded">Abbrechen</button>
                                </div>
                            ) : (
                                <div className="flex space-x-1 flex-wrap justify-center">
                                    <button onClick={() => loadSlot(slot.name)} className="bg-green-600 hover:bg-green-700 text-white text-xs font-bold py-1 px-2 rounded">Laden</button>
                                    <button onClick={() => handleStartRename(slot.name)} className="bg-gray-500 hover:bg-gray-600 text-white text-xs font-bold py-1 px-2 rounded">Umbenennen</button>
                                    <button onClick={() => copySlot(slot.name)} className="bg-purple-500 hover:bg-purple-600 text-white text-xs font-bold py-1 px-2 rounded">Kopieren</button>
                                    <button onClick={() => exportSlot(slot.name)} className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold py-1 px-2 rounded">Exportieren</button>
                                    <button 
                                        onClick={() => handleDeleteClick(slot.name)} 
                                        className={`text-xs font-bold py-1 px-2 rounded transition-all duration-200 ${pendingDeleteName === slot.name ? 'bg-yellow-500 text-black animate-pulse' : 'bg-red-600 text-white hover:bg-red-700'}`}
                                    >
                                        {pendingDeleteName === slot.name ? 'Bestätigen?' : 'Löschen'}
                                    </button>
                                </div>
                            )}
                        </div>
                    )) : <p className="text-center italic text-wood-text/70">Keine Spielstände vorhanden.</p>}
                </div>
            </div>
        </div>
    );
};


const SummaryTab: React.FC<{ stronghold: UseStrongholdReturn }> = ({ stronghold }) => {
    const { 
        components, walls, totalDamage, militaryValue, industrialValue, economicValue, socialValue,
        totalValue, totalArea, totalConstructionDays, weeklyUpkeep, weeklyProfit, resources, getAllPerks,
        importStronghold, startNewStronghold, removeComponent, removeWall, repairDamage, saveCurrentSlot, activeSaveName
    } = stronghold;
    
    const [pendingDeletion, setPendingDeletion] = useState<{ type: 'component' | 'wall', id: string } | null>(null);
    const [repairAmount, setRepairAmount] = useState<number>(0);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (pendingDeletion) {
            const timer = setTimeout(() => setPendingDeletion(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [pendingDeletion]);
    
    useEffect(() => { setRepairAmount(Math.ceil(totalDamage)); }, [totalDamage]);

    const handleRepair = () => {
        if (repairAmount > 0) {
            repairDamage(repairAmount);
            setRepairAmount(0);
        }
    };

    const handleDelete = (type: 'component' | 'wall', id: string) => {
        if (pendingDeletion?.id === id) {
            type === 'component' ? removeComponent(id) : removeWall(id);
            setPendingDeletion(null);
        } else {
            setPendingDeletion({ type, id });
        }
    };

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target?.result;
            if (typeof text === 'string') {
                importStronghold(text);
            }
        };
        reader.onerror = () => {
            alert("Error reading file.");
        };
        reader.readAsText(file);
        
        event.target.value = '';
    };

    const completedComponents = components.filter(c => c.constructionStatus === 'completed');
    const completedWalls = walls.filter(w => w.constructionStatus === 'completed');
    const netWeeklyIncome = weeklyProfit - weeklyUpkeep;
    const { staticPerks, scaledBonuses } = getAllPerks();
    
    const groupedComponents = useMemo(() => {
        const groups: Record<string, StrongholdComponent[]> = { military: [], industrial: [], economic: [], social: [] };
        completedComponents.forEach(c => { groups[c.classification]?.push(c); });
        return groups;
    }, [completedComponents]);

    const perkSources = useMemo(() => {
        const sources: Record<string, string[]> = {};
        Object.values(COMPONENTS).forEach(categoryData => {
            Object.entries(categoryData).forEach(([componentName, data]) => {
                data.perks?.forEach(perk => {
                    if (!sources[perk.id]) sources[perk.id] = [];
                    if (!sources[perk.id].includes(componentName)) sources[perk.id].push(componentName);
                });
            });
        });
        return sources;
    }, []);

    const PerkDisplay: React.FC<{ perk: Perk; bonus?: number; isActive: boolean; sources: string; }> = ({ perk, bonus, isActive, sources }) => (
        <div title={`${perk.description}\nWird bereitgestellt von: ${sources}`} className={`p-2 rounded border-2 transition-colors ${isActive ? 'bg-green-200/80 border-green-700' : 'bg-parchment/60 border-wood-light/50'}`}>
            <div className="font-bold">{perk.name} {bonus ? `+${bonus}` : ''}</div>
            <div className={`text-sm italic ${isActive ? 'text-green-900/80' : 'text-wood-text/70'}`}>{isActive ? 'Aktiv' : 'Inaktiv'}</div>
        </div>
    );

    return (
        <div>
            <h2 className="text-3xl font-medieval text-wood-dark mb-2">📊 Stronghold Summary</h2>
            <p className="mb-6">A complete overview of your fortress, its construction, and its ongoing costs.</p>

            <div className="grid md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                <div className="space-y-8">
                    <SummarySection title="Asset Values" icon="💎">
                        <SummaryRow label="Militärischer Wert" value={`${militaryValue.toFixed(0)} gp`} />
                        <SummaryRow label="Industrieller Wert" value={`${industrialValue.toFixed(0)} gp`} />
                        <SummaryRow label="Ökonomischer Wert" value={`${economicValue.toFixed(0)} gp`} />
                        <SummaryRow label="Sozialer Wert" value={`${socialValue.toFixed(0)} gp`} />
                        <div className="flex justify-between items-baseline border-t-2 border-wood-light/50 pt-2 mt-2 font-bold text-xl">
                            <span>TOTAL VALUE:</span>
                            <span>{`${totalValue.toFixed(0)} gp`}</span>
                        </div>
                    </SummarySection>

                    <SummarySection title="Weekly Finances" icon="💰">
                        <SummaryRow label="Profit (from buildings)" value={`${weeklyProfit.toFixed(2)} gp/Woche`} />
                        <SummaryRow label="Total Upkeep" value={`-${weeklyUpkeep.toFixed(2)} gp/Woche`} isNegative={true} />
                        <SummaryTotalRow label="NET WEEKLY INCOME" value={`${netWeeklyIncome.toFixed(2)} gp/Woche`} isNegative={netWeeklyIncome < 0}/>
                    </SummarySection>

                     <SummarySection title="Beschädigungen" icon="🩹">
                        <SummaryRow label="Gesamtschaden" value={`${totalDamage.toFixed(0)} GP`} isNegative={totalDamage > 0} />
                        {totalDamage > 0 && (
                            <div className="mt-4 pt-3 border-t-2 border-wood-light/30 space-y-2">
                                <label htmlFor="repair-amount" className="block text-center font-semibold">Schaden reparieren:</label>
                                <div className="flex items-center space-x-2">
                                <input id="repair-amount" type="number" value={repairAmount} onChange={(e) => setRepairAmount(Math.max(0, Math.min(Math.ceil(totalDamage), parseInt(e.target.value) || 0)))} className="w-full p-2 border-2 border-gold rounded-md bg-white/80"/>
                                <button onClick={handleRepair} className="p-2 rounded bg-green-600 text-white font-bold hover:bg-green-700 transition-colors whitespace-nowrap">Reparieren</button>
                                </div>
                            </div>
                        )}
                    </SummarySection>
                </div>
                 <div className="space-y-8">
                    <SummarySection title="Resource Management" icon="📦">
                        {(Object.keys(resources) as ResourceType[]).map((key) => {
                            const resource = resources[key as ResourceType];
                            if (!resource || (resource.capacity === 0 && resource.demand === 0 && key !== 'storage')) return null;
                            const isDeficit = resource.demand > resource.capacity;
                            return <SummaryRow key={key} label={RESOURCE_LABELS[key]} value={key === 'storage' ? `${resource.capacity}` : `${resource.demand} / ${resource.capacity}`} isNegative={isDeficit} className={isDeficit ? 'bg-red-300/50 -mx-2 px-2 rounded' : ''}/>;
                        })}
                    </SummarySection>

                    <SummarySection title="Construction Details" icon="🏗️">
                        <SummaryRow label="Total Area" value={`${totalArea} sq ft`} />
                        <SummaryRow label="Remaining Build Time" value={`${totalConstructionDays} days`} />
                         <SummaryRow label="Workers Required (Est.)" value={`${Math.ceil(totalArea / 100)}`} />
                    </SummarySection>
                </div>
                <div className="space-y-8 lg:col-span-2 xl:col-span-1">
                    <SummarySection title="Fähigkeiten der Festung" icon="🌟">
                        <div className="space-y-2">
                             {ALL_PERKS.map(perk => {
                                const activeScaledBonus = scaledBonuses[perk.id];
                                const isActiveStatic = staticPerks.some(p => p.id === perk.id);
                                const isActive = !!activeScaledBonus || isActiveStatic;
                                const bonusValue = activeScaledBonus?.totalBonus;
                                const sourceList = perkSources[perk.id]?.join(', ') || 'Unbekannt';
                                return <PerkDisplay key={perk.id} perk={perk} bonus={bonusValue} isActive={isActive} sources={sourceList}/>;
                            })}
                        </div>
                    </SummarySection>
                </div>
            </div>

            <div className="mt-12">
                <h2 className="text-3xl font-medieval text-wood-dark mb-4 text-center">🏰 Anlagen der Festung</h2>
                <div className="grid md:grid-cols-2 gap-6">
                    <AssetSection title="Militärische Gebäude" value={militaryValue}>{groupedComponents.military.length > 0 ? groupedComponents.military.map(c => <AssetItem key={c.id} item={c} onDelete={() => handleDelete('component', c.id)} isPending={pendingDeletion?.id === c.id} />) : <p className="text-center italic text-wood-text/70">Keine</p>}</AssetSection>
                    <AssetSection title="Industrielle Gebäude" value={industrialValue}>{groupedComponents.industrial.length > 0 ? groupedComponents.industrial.map(c => <AssetItem key={c.id} item={c} onDelete={() => handleDelete('component', c.id)} isPending={pendingDeletion?.id === c.id} />) : <p className="text-center italic text-wood-text/70">Keine</p>}</AssetSection>
                    <AssetSection title="Ökonomische Gebäude" value={economicValue}>{groupedComponents.economic.length > 0 ? groupedComponents.economic.map(c => <AssetItem key={c.id} item={c} onDelete={() => handleDelete('component', c.id)} isPending={pendingDeletion?.id === c.id} />) : <p className="text-center italic text-wood-text/70">Keine</p>}</AssetSection>
                    <AssetSection title="Soziale Gebäude" value={socialValue}>{groupedComponents.social.length > 0 ? groupedComponents.social.map(c => <AssetItem key={c.id} item={c} onDelete={() => handleDelete('component', c.id)} isPending={pendingDeletion?.id === c.id} />) : <p className="text-center italic text-wood-text/70">Keine</p>}</AssetSection>
                    <div className="md:col-span-2"><AssetSection title="Mauern & Befestigungen" value={completedWalls.reduce((acc, w) => acc + w.totalCost, 0)}>{completedWalls.length > 0 ? completedWalls.map(w => <AssetItem key={w.id} item={w} onDelete={() => handleDelete('wall', w.id)} isPending={pendingDeletion?.id === w.id} />) : <p className="text-center italic text-wood-text/70">Keine</p>}</AssetSection></div>
                </div>
            </div>

            <div className="mt-12 bg-gradient-to-br from-parchment to-parchment-dark p-6 rounded-lg border-2 border-wood shadow-lg">
                <h3 className="text-2xl font-semibold text-center mb-4 text-wood-dark">Aktionen</h3>
                <div className="flex flex-wrap justify-center items-center gap-4">
                    <div className="text-center">
                        <button onClick={saveCurrentSlot} disabled={!activeSaveName} className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                            💾 Speichern
                        </button>
                        <p className="text-xs italic text-wood-text/70 mt-1">(Optional, alle Änderungen werden automatisch gespeichert)</p>
                    </div>
                     <button onClick={handleImportClick} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors">📤 Importieren</button>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".json" style={{ display: 'none' }} />
                    <button onClick={startNewStronghold} className="bg-red-700 hover:bg-red-800 text-white font-bold py-3 px-6 rounded-lg transition-colors">🗑️ Neues Bollwerk beginnen</button>
                </div>
            </div>

            <SaveLoadManager stronghold={stronghold} />
        </div>
    );
};

export default SummaryTab;