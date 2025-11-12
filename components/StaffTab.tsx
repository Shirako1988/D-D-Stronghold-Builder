import React, { useState, useMemo, useEffect } from 'react';
import { UseStrongholdReturn, Staff, JobSlot, ResourceType } from '../types';
import { HIRELING_DATA } from '../constants';

const RESOURCE_SUGGESTIONS: Partial<Record<ResourceType, string>> = {
    servantQuarterSpace: "Baue 'Servants' quarters'.",
    barracksSpace: "Baue 'Barracks'.",
    bedroomSpace: "Baue 'Bedrooms'.",
    suiteSpace: "Baue eine 'Bedroom suite'.",
    food: "Baue eine 'Kitchen'.",
    diningHallSeat: "Baue eine 'Dining hall'.",
    armorySpace: "Baue eine 'Armory'.",
    bath: "Baue ein 'Bath'.",
};

const HirelingForm: React.FC<{ stronghold: UseStrongholdReturn }> = ({ stronghold }) => {
    const { addStaff, resources, staff } = stronghold;
    
    const [hirelingKey, setHirelingKey] = useState(Object.keys(HIRELING_DATA)[0]);
    const [customRole, setCustomRole] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [isVolunteer, setIsVolunteer] = useState(false);

    const { costPerUnit, totalCost } = useMemo(() => {
        if (isVolunteer) {
            const volunteerCostPerWeek = 1.4; // 2sp/day * 7 days / 10 sp/gp
            return {
                costPerUnit: volunteerCostPerWeek,
                totalCost: volunteerCostPerWeek * quantity,
            };
        }
        const hirelingData = HIRELING_DATA[hirelingKey];
        if (!hirelingData) return { costPerUnit: 0, totalCost: 0 };
        
        const cost = hirelingData.cost;
        return {
            costPerUnit: cost,
            totalCost: cost * quantity,
        };
    }, [hirelingKey, quantity, isVolunteer]);
    
    const validationResult = useMemo(() => {
        // If the hireling is a volunteer, bypass all resource checks.
        if (isVolunteer) {
            return { isValid: true, messages: [] };
        }

        const messages: string[] = [];
        const hirelingInfo = HIRELING_DATA[hirelingKey];
        if (!hirelingInfo) return { isValid: false, messages: ["Ungültiger Anstellungstyp ausgewählt."] };

        const totalStaffCount = staff.reduce((acc, s) => acc + s.quantity, 0);

        // 1. Food
        if (resources.food.capacity < resources.food.demand + quantity) {
            messages.push(`Benötigt: ${resources.food.demand + quantity - resources.food.capacity} mehr Nahrung. ${RESOURCE_SUGGESTIONS.food}`);
        }

        // 2. Dining Hall Seats
        if (resources.diningHallSeat.capacity < resources.diningHallSeat.demand + quantity) {
            messages.push(`Benötigt: ${resources.diningHallSeat.demand + quantity - resources.diningHallSeat.capacity} mehr Essensplätze. ${RESOURCE_SUGGESTIONS.diningHallSeat}`);
        }

        // 3. Baths
        const requiredBaths = Math.ceil((totalStaffCount + quantity) / 10);
        if (resources.bath.capacity < requiredBaths) {
            messages.push(`Benötigt: ${requiredBaths - resources.bath.capacity} mehr Bad/Bäder. ${RESOURCE_SUGGESTIONS.bath}`);
        }
        
        // 4. Armory Space
        if (hirelingKey !== 'unskilled' && hirelingKey !== 'skilled') {
            if (resources.armorySpace.capacity < resources.armorySpace.demand + quantity) {
                const needed = resources.armorySpace.demand + quantity - resources.armorySpace.capacity;
                messages.push(`Benötigt: ${needed} mehr Waffenkammer-Plätze. ${RESOURCE_SUGGESTIONS.armorySpace}`);
            }
        }
        
        // 5. Accommodations
        let accommodationType: ResourceType | null = null;
        let accommodationName = '';
        if (hirelingKey === 'unskilled') { accommodationType = 'servantQuarterSpace'; accommodationName = "Dienerquartier-Plätze"; } 
        else if (hirelingKey === 'skilled') { accommodationType = 'bedroomSpace'; accommodationName = "Schlafzimmer-Plätze"; } 
        else if (hirelingInfo.cr <= 0.5) { accommodationType = 'barracksSpace'; accommodationName = "Kasernen-Plätze"; } 
        else if (hirelingInfo.cr <= 2) { accommodationType = 'bedroomSpace'; accommodationName = "Schlafzimmer-Plätze"; } 
        else if (hirelingInfo.cr >= 3) { accommodationType = 'suiteSpace'; accommodationName = "Suiten-Plätze"; }

        if (accommodationType) {
            const resource = resources[accommodationType];
            if (resource.capacity < resource.demand + quantity) {
                const needed = resource.demand + quantity - resource.capacity;
                messages.push(`Benötigt: ${needed} mehr ${accommodationName}. ${RESOURCE_SUGGESTIONS[accommodationType]}`);
            }
        }

        return { isValid: messages.length === 0, messages };
    }, [hirelingKey, quantity, resources, staff, isVolunteer]);


    const handleAddStaff = () => {
        if (quantity > 0 && validationResult.isValid) {
            const hirelingData = HIRELING_DATA[hirelingKey];
            if (!hirelingData) return;

            const newStaff: Omit<Staff, 'id' | 'assignedJobId'> = {
                hirelingType: hirelingData.name,
                hirelingKey: hirelingKey,
                customRole: customRole.trim(),
                quantity,
                costPerUnit,
                totalCost,
                cr: hirelingData.cr,
                isVolunteer,
            };
            addStaff(newStaff);
            setCustomRole('');
            setQuantity(1);
            setIsVolunteer(false);
        }
    };
    
    return (
         <div className="bg-wood/10 p-6 rounded-lg border-2 border-wood-light space-y-6 mb-8">
            <h3 className="text-2xl font-medieval text-wood-dark -mb-2">Hire New Staff</h3>
            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <label className="block font-semibold mb-2 text-wood text-lg">Hireling Type</label>
                    <select value={hirelingKey} onChange={e => setHirelingKey(e.target.value)} className="w-full p-3 border-2 border-gold rounded-md bg-white/80">
                        {Object.entries(HIRELING_DATA).map(([key, data]) => (
                            <option key={key} value={key}>{data.name} ({data.cost} gp/Woche)</option>
                        ))}
                    </select>
                </div>
                 <div>
                    <label className="block font-semibold mb-2 text-wood text-lg">Quantity</label>
                    <input type="number" value={quantity} onChange={e => setQuantity(Math.max(1, parseInt(e.target.value) || 1))} className="w-full p-3 border-2 border-gold rounded-md bg-white/80" />
                </div>
            </div>
             <div>
                <label className="block font-semibold mb-2 text-wood text-lg">Custom Role (Optional)</label>
                <input type="text" value={customRole} onChange={e => setCustomRole(e.target.value)} placeholder="e.g., Spy, Gardener, Guard Captain" className="w-full p-3 border-2 border-gold rounded-md bg-white/80" />
            </div>

            <div>
                <div className="flex items-center space-x-3">
                    <input id="volunteer-check" type="checkbox" checked={isVolunteer} onChange={e => setIsVolunteer(e.target.checked)} className="h-5 w-5 rounded border-gold text-wood focus:ring-wood-light" />
                    <label htmlFor="volunteer-check" className="font-semibold text-wood-dark cursor-pointer">
                        Hire as Volunteer (2 sp/day)
                    </label>
                </div>
                <p className="text-sm text-wood-text/70 mt-1 italic pl-8">
                    Freiwillige können auch ohne ausreichend Ressourcen (Betten, Essen etc.) angeheuert werden.
                </p>
            </div>


            <div className="bg-parchment-light/50 p-4 rounded-lg text-lg">
                <div className="flex justify-between">
                    <span>Total Weekly Cost for Selection:</span>
                    <span className="font-bold">{totalCost.toFixed(2)} gp</span>
                </div>
            </div>
            
            {!validationResult.isValid && (
              <div className="bg-red-200/50 p-4 rounded-lg border border-red-500 text-red-800 space-y-1">
                <h4 className="font-bold text-lg">Voraussetzungen nicht erfüllt:</h4>
                <ul className="list-disc list-inside text-sm">
                  {validationResult.messages.map((msg, i) => <li key={i}>{msg}</li>)}
                </ul>
              </div>
            )}

            <button 
                onClick={handleAddStaff} 
                disabled={!validationResult.isValid}
                className="w-full sm:w-auto bg-gradient-to-br from-wood-light to-wood-dark text-parchment-bg font-bold py-3 px-6 rounded-lg border-2 border-wood-dark hover:from-gold-dark hover:to-gold-light hover:text-wood-dark transition-all duration-300 transform hover:-translate-y-0.5 shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
            >
                ➕ Add Hireling(s)
            </button>
        </div>
    )
}

const StaffTab: React.FC<{ stronghold: UseStrongholdReturn }> = ({ stronghold }) => {
    const { staff, components, assignStaffToJob, unassignStaffFromJob, removeStaff, resources } = stronghold;
    const [pendingDismissal, setPendingDismissal] = useState<string | null>(null);

    useEffect(() => {
        if (pendingDismissal) {
            const timer = setTimeout(() => setPendingDismissal(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [pendingDismissal]);

    const availableStaff = useMemo(() => staff.filter(s => !s.assignedJobId), [staff]);
    const openPositions = useMemo(() => {
        return components
            .filter(c => c.constructionStatus === 'completed' && c.jobSlots.length > 0)
            .flatMap(c => c.jobSlots.map(j => ({ ...j, componentName: c.name })));
    }, [components]);

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, staffId: string) => {
        e.dataTransfer.setData("staffId", staffId);
    };

    const handleDropOnJob = (e: React.DragEvent<HTMLDivElement>, job: JobSlot) => {
        e.preventDefault();
        if (job.filledBy) return; // Can't drop on a filled slot
        const staffId = e.dataTransfer.getData("staffId");
        if (staffId) {
            const staffMember = staff.find(s => s.id === staffId);
            // Ensure only skilled hirelings can be assigned
            if (staffMember && staffMember.hirelingKey === 'skilled') {
                assignStaffToJob(staffId, job.id);
            }
        }
    };
    
    const handleDropOnAvailable = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const staffId = e.dataTransfer.getData("staffId");
        const staffMember = staff.find(s => s.id === staffId);
        if (staffMember && staffMember.assignedJobId) {
            unassignStaffFromJob(staffId);
        }
    };

    const allowDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };
    
    const handleDismissal = (staffId: string) => {
        if (pendingDismissal === staffId) {
            removeStaff(staffId);
            setPendingDismissal(null);
        } else {
            setPendingDismissal(staffId);
        }
    };

    const ResourceRow: React.FC<{ label: string; resourceKey: ResourceType }> = ({ label, resourceKey }) => {
        const { capacity, demand } = resources[resourceKey];
        const isDeficit = demand > capacity;
        return (
            <div className={`flex justify-between items-baseline p-1 rounded ${isDeficit ? 'bg-red-300/50' : ''}`}>
                <span>{label}:</span>
                <span className={`font-bold text-lg ${isDeficit ? 'text-red-800' : ''}`}>{demand} / {capacity}</span>
            </div>
        );
    };

    const DismissButton: React.FC<{ staffId: string }> = ({ staffId }) => {
        const isPending = pendingDismissal === staffId;
        return (
            <button
                onClick={() => handleDismissal(staffId)}
                title={isPending ? 'Confirm Dismissal' : 'Dismiss Staff'}
                className={`text-sm font-bold transition-all duration-200 rounded px-2 py-1 ${isPending ? 'bg-yellow-500 text-black animate-pulse' : 'text-red-700 hover:bg-red-200'}`}
            >
                {isPending ? 'Confirm?' : '👢'}
            </button>
        );
    };

    return (
        <div>
            <h2 className="text-3xl font-medieval text-wood-dark mb-2">👥 Staff & Hirelings</h2>
            <p className="mb-6">Hire staff and assign them to jobs within your stronghold. Drag and drop 'Skilled Hirelings' to assign them.</p>

            <HirelingForm stronghold={stronghold} />
            
            <div className="bg-wood/10 p-6 rounded-lg border-2 border-wood-light space-y-2 mb-8">
                <h3 className="text-2xl font-medieval text-wood-dark mb-2 text-center">🛏️ Unterkünfte des Personals</h3>
                <ResourceRow label="Dienerquartiere" resourceKey="servantQuarterSpace" />
                <ResourceRow label="Kasernen" resourceKey="barracksSpace" />
                <ResourceRow label="Schlafzimmer" resourceKey="bedroomSpace" />
                <ResourceRow label="Suiten" resourceKey="suiteSpace" />
            </div>


            <div className="grid lg:grid-cols-2 gap-8">
                {/* Available Staff Column */}
                <div onDrop={handleDropOnAvailable} onDragOver={allowDrop}>
                    <h3 className="text-2xl font-medieval text-wood-dark mb-4">✅ Available Staff</h3>
                    <div className="bg-wood/5 p-4 rounded-lg min-h-[300px] border-2 border-dashed border-wood-light/50 space-y-2">
                        {availableStaff.length > 0 ? availableStaff.map(s => {
                            const isSkilled = s.hirelingKey === 'skilled';
                            return (
                                <div key={s.id} 
                                     draggable={isSkilled} 
                                     onDragStart={isSkilled ? (e) => handleDragStart(e, s.id) : undefined}
                                     title={!isSkilled ? "Nur Fachkräfte (Skilled Hirelings) können zugewiesen werden." : s.customRole || s.hirelingType}
                                     className={`p-3 bg-parchment-light rounded shadow-sm border border-gold-dark hover:shadow-md transition-all ${isSkilled ? 'cursor-grab' : 'cursor-not-allowed opacity-70'}`}>
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <div className="font-bold">{s.customRole || s.hirelingType} (x{s.quantity})</div>
                                            <div className="text-sm text-wood-text/80">{s.isVolunteer ? 'Volunteer' : `${s.totalCost.toFixed(2)} gp/week`}</div>
                                        </div>
                                        <DismissButton staffId={s.id} />
                                    </div>
                                </div>
                            )
                        }) : (
                            <div className="flex items-center justify-center h-full text-center text-wood-text/70 italic p-8">
                                No available staff. Hire new staff or unassign them from a job.
                            </div>
                        )}
                    </div>
                </div>

                {/* Open Positions Column */}
                <div>
                    <h3 className="text-2xl font-medieval text-wood-dark mb-4">📋 Open Positions</h3>
                    <div className="bg-wood/5 p-4 rounded-lg min-h-[300px] border border-wood-light/50 space-y-2">
                        {openPositions.length > 0 ? openPositions.map(job => {
                            const assignedStaff = job.filledBy ? staff.find(s => s.id === job.filledBy) : null;
                            return (
                                <div key={job.id} onDrop={(e) => handleDropOnJob(e, job)} onDragOver={allowDrop}
                                     className={`p-3 rounded border ${assignedStaff ? 'bg-green-200/80 border-green-700' : 'bg-parchment/60 border-gray-400 border-dashed hover:bg-parchment'}`}>
                                    <div className="font-semibold text-wood-dark">{job.role} <span className="text-sm font-normal text-wood-text/80">({job.componentName})</span></div>
                                    {assignedStaff ? (
                                         <div draggable onDragStart={(e) => handleDragStart(e, assignedStaff.id)}
                                             className="p-2 mt-1 bg-white rounded shadow-inner cursor-grab">
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <div className="font-bold">{assignedStaff.customRole || assignedStaff.hirelingType}</div>
                                                    <div className="text-xs text-wood-text/80">{assignedStaff.isVolunteer ? 'Volunteer' : `${assignedStaff.totalCost.toFixed(2)} gp/week`}</div>
                                                </div>
                                                <DismissButton staffId={assignedStaff.id} />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center text-gray-500 italic text-sm p-2">Drop staff here</div>
                                    )}
                                </div>
                            )
                        }) : (
                             <div className="flex items-center justify-center h-full text-center text-wood-text/70 italic p-8">
                                No open positions available. Construct buildings that require staff.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StaffTab;