import React, { useState, useMemo, useEffect } from 'react';
import { UseStrongholdReturn, StrongholdComponent, ComponentClassification, ResourceType, CalculatedPerk } from '../types';
import { COMPONENTS, ROOM_DESCRIPTIONS, getClassificationForComponent, PERK_EXPLANATIONS, RESOURCE_EXPLANATIONS, JOB_EXPLANATION_GENERIC } from '../constants';
import { calculateConstructionTime, calculateScaledBenefits } from '../hooks/useStronghold';

interface RoomsTabProps {
  stronghold: UseStrongholdReturn;
}

const getMinSideLength = (ss: number): number => {
    const side = 20 * ss;
    return Math.max(5, Math.round(side / 5) * 5);
};

const RESOURCE_LABELS: Record<ResourceType, string> = {
    servantQuarterSpace: "Dienerquartiere",
    barracksSpace: "Kasernenplätze",
    bedroomSpace: "Schlafplätze",
    suiteSpace: "Suitenplätze",
    food: "Nahrung",
    diningHallSeat: "Essensplätze",
    armorySpace: "Waffenkammerplätze",
    bath: "Bäder",
    storage: "Lagerplatz (lbs)",
    stallSpace: "Stallplätze"
};


const generateComponentSummary = (name: string, category: string): string => {
    const data = COMPONENTS[category]?.[name];
    if (!data) return '';

    const parts: string[] = [];
    const resourceLabels: Record<ResourceType, string> = {
        servantQuarterSpace: "Dienerplatz",
        barracksSpace: "Kasernenplatz",
        bedroomSpace: "Schlafplatz",
        suiteSpace: "Suite-Platz",
        food: "Nahrung",
        diningHallSeat: "Essensplatz",
        armorySpace: "Waffenkammerplatz",
        bath: "Bad",
        storage: "Lagerplatz",
        stallSpace: "Stallplatz"
    };

    if (data.provides) {
        const providesString = Object.entries(data.provides)
            .map(([key, value]) => `+${value} ${resourceLabels[key as ResourceType]}${value > 1 ? 'e' : ''}`)
            .join(', ');
        if (providesString) parts.push(providesString);
    }

    if (data.jobs) {
        const jobsString = data.jobs.map(j => `${j.count} ${j.role}${j.count > 1 ? '(e)' : ''}`).join(', ');
        if (jobsString) parts.push(jobsString);
    }

    if (data.perks) {
        const perksString = data.perks.map(p => p.name.replace(/Bonus \+\d/, '').trim()).join(', ');
        if (perksString) parts.push(perksString);
    }

    if (parts.length === 0) return '';
    return `(${parts.join(' | ')})`;
};

const CalculatedBenefitsDisplay: React.FC<{
    area: number;
    benefits: {
        resources: Partial<Record<ResourceType, number>>;
        jobs: { role: string; count: number }[];
        perks: CalculatedPerk[];
    };
    componentName: string;
    calculatedBaseCost: number;
}> = ({ area, benefits, componentName, calculatedBaseCost }) => {
    const { resources, jobs, perks } = benefits;
    
    const isShop = componentName.toLowerCase().includes('shop');
    const merchantGold = calculatedBaseCost * 0.25;
    
    const hasBenefits = Object.keys(resources).length > 0 || jobs.length > 0 || perks.length > 0 || (isShop && merchantGold > 0);

    return (
        <div className="bg-blue-900/10 p-4 rounded-lg border-l-4 border-blue-600">
            <h4 className="text-xl font-semibold text-blue-800">Kalkulierte Vorteile (bei {area} sq ft)</h4>
            {hasBenefits ? (
                 <div className="mt-2 text-wood-text/90 space-y-2">
                    {Object.entries(resources).map(([key, value]) => (
                        <div key={key} className="border-t border-blue-600/20 pt-2 mt-2 first:border-t-0 first:mt-0 first:pt-0">
                            <p><strong>Ressource:</strong> +{value} {RESOURCE_LABELS[key as ResourceType]}</p>
                            <p className="text-sm text-wood-text/80 italic pl-4">{(RESOURCE_EXPLANATIONS as Record<string, string>)[key] || 'Regeltechnische Erklärung nicht verfügbar.'}</p>
                        </div>
                    ))}
                    {jobs.map((job, index) => (
                         <div key={index} className="border-t border-blue-600/20 pt-2 mt-2 first:border-t-0 first:mt-0 first:pt-0">
                            <p><strong>Arbeitsplätze:</strong> {job.count} {job.role}(s)</p>
                            <p className="text-sm text-wood-text/80 italic pl-4">{JOB_EXPLANATION_GENERIC}</p>
                         </div>
                    ))}
                    {perks.map((perk, index) => (
                        <div key={index} className="border-t border-blue-600/20 pt-2 mt-2 first:border-t-0 first:mt-0 first:pt-0">
                            <p><strong>Fähigkeit:</strong> {perk.name} {perk.finalBonus ? `+${perk.finalBonus}` : ''}</p>
                            <p className="text-sm text-wood-text/80 italic pl-4">{PERK_EXPLANATIONS[perk.id] || perk.description}</p>
                        </div>
                    ))}
                    {isShop && merchantGold > 0 && (
                        <div className="border-t border-blue-600/20 pt-2 mt-2">
                            <p><strong>Wirtschaft:</strong> +{merchantGold.toFixed(0)} GP Händlergold/Woche</p>
                            <p><strong>Wirtschaft:</strong> Max. Gegenstandswert {merchantGold.toFixed(0)} GP</p>
                        </div>
                    )}
                </div>
            ) : (
                <p className="mt-2 text-wood-text/80 italic">Dieser Raum bietet bei der aktuellen Größe keine direkten Vorteile.</p>
            )}
        </div>
    );
};


const RoomBuilderForm: React.FC<{ stronghold: UseStrongholdReturn }> = ({ stronghold }) => {
    const [category, setCategory] = useState(Object.keys(COMPONENTS)[0]);
    const [componentName, setComponentName] = useState(Object.keys(COMPONENTS[category])[0]);
    const [classification, setClassification] = useState<ComponentClassification>(getClassificationForComponent(componentName));
    
    const { minLength, minWidth } = useMemo(() => {
        const componentData = COMPONENTS[category]?.[componentName];
        if (componentData?.minSize) {
            return { minLength: componentData.minSize.length, minWidth: componentData.minSize.width };
        }
        const ss = componentData?.ss || 1;
        const side = getMinSideLength(ss);
        return { minLength: side, minWidth: side };
    }, [category, componentName]);
    
    const [length, setLength] = useState(minLength);
    const [width, setWidth] = useState(minWidth);
    const [rushPercent, setRushPercent] = useState(0);

    const { siteModifier, addComponent } = stronghold;

    useEffect(() => {
        const componentData = COMPONENTS[category]?.[componentName];
        if (componentData?.minSize) {
            setLength(componentData.minSize.length);
            setWidth(componentData.minSize.width);
        } else {
            const newMinSide = getMinSideLength(componentData?.ss || 1);
            setLength(newMinSide);
            setWidth(newMinSide);
        }
        setClassification(getClassificationForComponent(componentName));
    }, [category, componentName]);

    const { area, costPerSqFt, calculatedBaseCost, adjustedCost, totalCost, constructionDays, description, scaledBenefits } = useMemo(() => {
        const componentData = COMPONENTS[category]?.[componentName];
        if (!componentData) {
            return { area: 0, costPerSqFt: 0, calculatedBaseCost: 0, adjustedCost: 0, totalCost: 0, constructionDays: 0, description: 'Component not found.', scaledBenefits: { resources: {}, jobs: [], perks: [] } };
        }
        
        const baseSsArea = Math.pow(componentData.ss * 20, 2);
        const costPerSqFt = baseSsArea > 0 ? componentData.cost / baseSsArea : 0;
        
        const currentArea = length * width;
        const newBaseCost = currentArea * costPerSqFt;

        const costWithSiteMod = newBaseCost * (1 + siteModifier / 100);
        const totalCostWithRush = costWithSiteMod * (1 + rushPercent / 100);
        
        const baseDays = calculateConstructionTime(costWithSiteMod);
        const days = Math.ceil(baseDays * (1 - rushPercent / 100));
        
        const desc = ROOM_DESCRIPTIONS[category]?.[componentName] || 'Select a room type to see its description.';

        const benefits = calculateScaledBenefits(componentName, category, currentArea);
        
        return { 
            area: currentArea, 
            costPerSqFt,
            calculatedBaseCost: newBaseCost, 
            adjustedCost: costWithSiteMod, 
            totalCost: totalCostWithRush, 
            constructionDays: days, 
            description: desc,
            scaledBenefits: benefits
        };
    }, [length, width, category, componentName, siteModifier, rushPercent]);

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newCategory = e.target.value;
        setCategory(newCategory);
        setComponentName(Object.keys(COMPONENTS[newCategory])[0]);
    };

    const handleAddComponent = () => {
        const newComponent: Omit<StrongholdComponent, 'id' | 'jobSlots'> = {
            name: componentName,
            category,
            classification,
            length,
            width,
            area,
            baseCost: adjustedCost,
            rushPercent,
            totalCost,
            constructionStatus: 'pending',
            startDate: undefined,
        };
        addComponent(newComponent);
    };

    const handleDimensionBlur = (
        currentValue: number,
        setter: React.Dispatch<React.SetStateAction<number>>,
        minDimension: number
    ) => {
        let value = Math.max(minDimension, currentValue);
        value = Math.round(value / 5) * 5;
        setter(value);
    };

    return (
        <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
                 <div>
                    <label htmlFor="componentCategory" className="block font-semibold mb-2 text-wood text-lg">Category</label>
                    <select id="componentCategory" value={category} onChange={handleCategoryChange} className="w-full p-3 border-2 border-gold rounded-md bg-white/80 focus:border-wood focus:outline-none focus:ring-2 focus:ring-wood-light">
                        {Object.keys(COMPONENTS).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="componentSelect" className="block font-semibold mb-2 text-wood text-lg">Component</label>
                    <select id="componentSelect" value={componentName} onChange={e => setComponentName(e.target.value)} className="w-full p-3 border-2 border-gold rounded-md bg-white/80 focus:border-wood focus:outline-none focus:ring-2 focus:ring-wood-light">
                        {Object.keys(COMPONENTS[category]).map(name => 
                            <option key={name} value={name}>
                                {name} {generateComponentSummary(name, category)}
                            </option>
                        )}
                    </select>
                </div>
            </div>
            
            <div>
                <label htmlFor="classification" className="block font-semibold mb-2 text-wood text-lg">Classification</label>
                <select id="classification" value={classification} onChange={e => setClassification(e.target.value as ComponentClassification)} className="w-full p-3 border-2 border-gold rounded-md bg-white/80 focus:border-wood focus:outline-none focus:ring-2 focus:ring-wood-light">
                    <option value="military">Militärisch</option>
                    <option value="industrial">Industriell</option>
                    <option value="economic">Ökonomisch</option>
                    <option value="social">Sozial</option>
                </select>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="length" className="block font-semibold mb-2 text-wood text-lg">Length (feet)</label>
                    <input type="number" id="length" value={length} 
                        onChange={e => setLength(parseInt(e.target.value) || 0)} 
                        onBlur={() => handleDimensionBlur(length, setLength, minLength)}
                        step="5" min={minLength} 
                        className="w-full p-3 border-2 border-gold rounded-md bg-white/80 focus:border-wood focus:outline-none focus:ring-2 focus:ring-wood-light" />
                </div>
                <div>
                    <label htmlFor="width" className="block font-semibold mb-2 text-wood text-lg">Width (feet)</label>
                    <input type="number" id="width" value={width} 
                        onChange={e => setWidth(parseInt(e.target.value) || 0)}
                        onBlur={() => handleDimensionBlur(width, setWidth, minWidth)}
                        step="5" min={minWidth}
                        className="w-full p-3 border-2 border-gold rounded-md bg-white/80 focus:border-wood focus:outline-none focus:ring-2 focus:ring-wood-light" />
                </div>
            </div>
            
             <div className="bg-wood/10 p-4 rounded-lg border-l-4 border-wood-light space-y-2">
                <div className="flex justify-between"><strong>Area:</strong> <span>{area} sq ft</span></div>
                <div className="flex justify-between"><strong>Cost per sq ft:</strong> <span>{costPerSqFt.toFixed(2)} gp</span></div>
                <div className="flex justify-between"><strong>Calculated Base Cost:</strong> <span>{calculatedBaseCost.toFixed(0)} gp</span></div>
                <div className="flex justify-between"><strong>Adjusted Cost (Site Mod):</strong> <span>{adjustedCost.toFixed(0)} gp</span></div>
            </div>

            <CalculatedBenefitsDisplay 
                area={area} 
                benefits={scaledBenefits} 
                componentName={componentName}
                calculatedBaseCost={calculatedBaseCost}
            />

            <div className="bg-green-900/10 p-4 rounded-lg border-l-4 border-green-600 space-y-4">
                <h4 className="text-xl font-semibold text-green-800">🏗️ Construction Options</h4>
                <div>
                    <label htmlFor="componentRushCharge" className="block font-semibold mb-2 text-wood text-lg">⚡ Rush Charge</label>
                    <select id="componentRushCharge" value={rushPercent} onChange={e => setRushPercent(parseInt(e.target.value))} className="w-full p-3 border-2 border-gold rounded-md bg-white/80 focus:border-wood focus:outline-none focus:ring-2 focus:ring-wood-light">
                        {[0, 10, 20, 30, 40, 50, 60, 70].map(p => <option key={p} value={p}>{p === 0 ? "Standard Construction (0%)" : `Rush ${p}% (+${p}% cost, -${p}% time)`}</option>)}
                    </select>
                </div>
                 <div className="flex justify-between font-bold"><span>⏱️ Construction Time:</span> <span>{constructionDays} days</span></div>
                <div className="flex justify-between font-bold text-lg"><span>💰 Total Cost (with Rush):</span> <span>{totalCost.toFixed(0)} gp</span></div>
            </div>

             <div className="bg-blue-900/10 p-4 rounded-lg border-l-4 border-blue-600">
                <h4 className="text-xl font-semibold text-blue-800">📖 Room Description</h4>
                <p className="mt-2 text-wood-text/80 italic">{description}</p>
            </div>

            <button onClick={handleAddComponent} className="w-full sm:w-auto bg-gradient-to-br from-wood-light to-wood-dark text-parchment-bg font-bold py-3 px-6 rounded-lg border-2 border-wood-dark hover:from-gold-dark hover:to-gold-light hover:text-wood-dark transition-all duration-300 transform hover:-translate-y-0.5 shadow-md">
                ➕ Add to Stronghold
            </button>
        </div>
    );
};

const RoomsTab: React.FC<RoomsTabProps> = ({ stronghold }) => {
    return (
        <div>
            <h2 className="text-3xl font-medieval text-wood-dark mb-2">🏠 Room Builder</h2>
            <p className="mb-6">Select rooms to build your stronghold. Costs are calculated based on a base cost, affected by site modifiers and rush charges.</p>
            <RoomBuilderForm stronghold={stronghold} />
        </div>
    );
};

export default RoomsTab;