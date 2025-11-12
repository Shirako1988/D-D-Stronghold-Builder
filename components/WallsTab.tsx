import React, { useState, useMemo } from 'react';
import { UseStrongholdReturn, Wall } from '../types';
import { WALL_COSTS, WALL_DURABILITY, MATERIAL_DESCRIPTIONS } from '../constants';
import { calculateConstructionTime } from '../hooks/useStronghold';


const WallsTab: React.FC<{ stronghold: UseStrongholdReturn }> = ({ stronghold }) => {
    const { addWall } = stronghold;
    const [wallType, setWallType] = useState('stone');
    const [length, setLength] = useState(20);
    const [height, setHeight] = useState(10);
    const [thickness, setThickness] = useState(1);
    const [rushPercent, setRushPercent] = useState(0);

    const { volume, baseCostPerFt, baseTotalCost, totalCost, constructionDays, durability, description } = useMemo(() => {
        const vol = length * height * thickness;
        const costPerFt = WALL_COSTS[wallType] || 0;
        const baseCost = vol * costPerFt;
        const total = baseCost * (1 + rushPercent / 100);
        const days = Math.ceil(calculateConstructionTime(baseCost) * (1 - rushPercent / 100));
        const dur = WALL_DURABILITY[wallType] ? {
            hp: (WALL_DURABILITY[wallType].hp / 5) * thickness,
            ac: WALL_DURABILITY[wallType].ac,
            damageThreshold: WALL_DURABILITY[wallType].damageThreshold
        } : null;
        const desc = MATERIAL_DESCRIPTIONS[wallType] || 'Select a material to see its description.';
        return { volume: vol, baseCostPerFt: costPerFt, baseTotalCost: baseCost, totalCost: total, constructionDays: days, durability: dur, description: desc };
    }, [wallType, length, height, thickness, rushPercent]);
    
    const handleAddWall = () => {
        const newWall: Omit<Wall, 'id'> = {
            type: wallType,
            name: wallType.charAt(0).toUpperCase() + wallType.slice(1),
            length,
            height,
            thickness,
            baseCost: baseTotalCost,
            rushPercent,
            totalCost,
            constructionStatus: 'pending',
            startDate: undefined,
        };
        addWall(newWall);
    };

    const durabilityHpDisplay = useMemo(() => {
        if (!durability || durability.hp === null) return 'N/A';
        const hp = durability.hp;
        if (hp % 1 === 0) {
            return hp.toFixed(0);
        }
        return hp.toFixed(1);
    }, [durability]);

    return (
         <div>
            <h2 className="text-3xl font-medieval text-wood-dark mb-2">🧱 Free-Standing Walls</h2>
            <p className="mb-6">Design fortified walls around your stronghold. Cost is calculated per cubic foot.</p>
            
            <div className="space-y-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div>
                        <label className="block font-semibold mb-2 text-wood text-lg">Wall Type</label>
                        <select value={wallType} onChange={e => setWallType(e.target.value)} className="w-full p-3 border-2 border-gold rounded-md bg-white/80">
                            {Object.keys(WALL_COSTS).map(type => <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>)}
                        </select>
                    </div>
                     <div>
                        <label className="block font-semibold mb-2 text-wood text-lg">Length (ft)</label>
                        <input type="number" value={length} onChange={e => setLength(Math.max(1, parseInt(e.target.value) || 1))} className="w-full p-3 border-2 border-gold rounded-md bg-white/80"/>
                    </div>
                     <div>
                        <label className="block font-semibold mb-2 text-wood text-lg">Height (ft)</label>
                        <input type="number" value={height} onChange={e => setHeight(Math.max(1, parseInt(e.target.value) || 1))} className="w-full p-3 border-2 border-gold rounded-md bg-white/80"/>
                    </div>
                     <div>
                        <label className="block font-semibold mb-2 text-wood text-lg">Thickness (ft)</label>
                        <input type="number" step="0.5" value={thickness} onChange={e => setThickness(Math.max(0.5, parseFloat(e.target.value) || 0.5))} className="w-full p-3 border-2 border-gold rounded-md bg-white/80"/>
                    </div>
                </div>

                 <div className="bg-wood/10 p-4 rounded-lg border-l-4 border-wood-light space-y-2">
                    <div className="flex justify-between"><strong>Volume:</strong> <span>{volume.toFixed(1)} cubic ft</span></div>
                    <div className="flex justify-between"><strong>Base Cost (per cubic ft):</strong> <span>{baseCostPerFt.toFixed(2)} gp</span></div>
                    <div className="flex justify-between font-bold"><strong>Base Total Cost:</strong> <span>{baseTotalCost.toFixed(0)} gp</span></div>
                 </div>

                 <div className="bg-green-900/10 p-4 rounded-lg border-l-4 border-green-600 space-y-4">
                     <h4 className="text-xl font-semibold text-green-800">🏗️ Construction Options</h4>
                     <label className="block font-semibold mb-2 text-wood text-lg">⚡ Rush Charge</label>
                     <select value={rushPercent} onChange={e => setRushPercent(parseInt(e.target.value))} className="w-full p-3 border-2 border-gold rounded-md bg-white/80">
                         {[0, 10, 20, 30, 40, 50, 60, 70].map(p => <option key={p} value={p}>{p === 0 ? "Standard Construction (0%)" : `Rush ${p}% (+${p}% cost, -${p}% time)`}</option>)}
                     </select>
                     <div className="flex justify-between font-bold"><span>⏱️ Construction Time:</span> <span>{constructionDays} days</span></div>
                     <div className="flex justify-between font-bold text-lg"><span>💰 Total Cost (with Rush):</span> <span>{totalCost.toFixed(0)} gp</span></div>
                 </div>

                 <div className="bg-blue-900/10 p-4 rounded-lg border-l-4 border-blue-600">
                    <h4 className="text-xl font-semibold text-blue-800">📖 Material Description</h4>
                    <p className="mt-2 text-wood-text/80 italic">{description}</p>
                 </div>
                 
                 <div className="bg-red-900/10 p-4 rounded-lg border-l-4 border-red-600">
                     <h4 className="text-xl font-semibold text-red-800">🛡️ Wall Durability (per 5'x5' segment)</h4>
                     {durability ? (
                        <div className="mt-2 grid grid-cols-3 gap-4 text-center">
                            <div><div className="font-bold text-lg">{durabilityHpDisplay}</div><div>HP</div></div>
                            <div><div className="font-bold text-lg">{durability.ac}</div><div>AC</div></div>
                            <div><div className="font-bold text-lg">{durability.damageThreshold}</div><div>Threshold</div></div>
                        </div>
                     ) : <p>Select a wall type.</p>}
                 </div>

                <button onClick={handleAddWall} className="w-full sm:w-auto bg-gradient-to-br from-wood-light to-wood-dark text-parchment-bg font-bold py-3 px-6 rounded-lg border-2 border-wood-dark hover:from-gold-dark hover:to-gold-light hover:text-wood-dark transition-all duration-300 transform hover:-translate-y-0.5 shadow-md">
                    ➕ Add Wall Section
                </button>
            </div>
        </div>
    );
};


export default WallsTab;