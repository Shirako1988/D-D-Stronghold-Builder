import React, { useState, useMemo, useEffect } from 'react';
import { UseStrongholdReturn, StrongholdComponent, Wall } from '../types';
import { calculateConstructionTime } from '../hooks/useStronghold';

type QueueItem = (StrongholdComponent | Wall) & { itemType: 'component' | 'wall' };

const ConstructionTab: React.FC<{ stronghold: UseStrongholdReturn }> = ({ stronghold }) => {
    const { components, walls, startConstruction, completeConstruction, removeComponent, removeWall } = stronghold;
    const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);

    const combinedQueue: QueueItem[] = useMemo(() => {
        const componentItems: QueueItem[] = components.map(c => ({...c, itemType: 'component'}));
        const wallItems: QueueItem[] = walls.map(w => ({...w, itemType: 'wall'}));
        // Sorting by UUID is not meaningful for chronological order, so we just combine them.
        // The order will be stable: all components, then all walls.
        return [...componentItems, ...wallItems];
    }, [components, walls]);

    const pending = combinedQueue.filter(i => i.constructionStatus === 'pending');
    const inProgress = combinedQueue.filter(i => i.constructionStatus === 'in_progress');

    const QueueItemCard: React.FC<{ item: QueueItem }> = ({ item }) => {
        const [isPendingCancel, setIsPendingCancel] = useState(false);
        
        useEffect(() => {
            if (isPendingCancel) {
                const timer = setTimeout(() => setIsPendingCancel(false), 3000); // Revert after 3 seconds
                return () => clearTimeout(timer);
            }
        }, [isPendingCancel]);

        const baseConstructionDays = calculateConstructionTime(item.baseCost);
        const totalDays = Math.ceil(baseConstructionDays * (1 - item.rushPercent / 100));

        const handleCancel = () => {
            if (isPendingCancel) {
                if (item.itemType === 'component') removeComponent(item.id);
                else removeWall(item.id);
            } else {
                setIsPendingCancel(true);
            }
        };

        const handleStart = () => {
            startConstruction(item.id, item.itemType, currentDate);
        };
        
        const handleComplete = () => {
            completeConstruction(item.id, item.itemType);
        };
        
        const { daysElapsed, completionPercentage } = useMemo(() => {
            if (item.constructionStatus !== 'in_progress' || !item.startDate) {
                return { daysElapsed: 0, completionPercentage: 0 };
            }
            const start = new Date(item.startDate);
            const current = new Date(currentDate);
            if (isNaN(start.getTime()) || isNaN(current.getTime())) return { daysElapsed: 0, completionPercentage: 0 };

            const diffTime = Math.max(0, current.getTime() - start.getTime());
            const elapsed = Math.floor(diffTime / (1000 * 60 * 60 * 24));
            const limitedElapsed = Math.min(elapsed, totalDays);
            const percentage = totalDays > 0 ? (limitedElapsed / totalDays) * 100 : 100;
            return { daysElapsed: limitedElapsed, completionPercentage: percentage };
        }, [item.startDate, currentDate, totalDays, item.constructionStatus]);

        return (
            <div className="bg-parchment-light/50 p-4 rounded-md border border-gold-dark space-y-3 shadow-sm">
                <div className="flex justify-between items-start">
                    <div>
                        <div className="font-semibold text-wood text-lg">{item.name} {item.itemType === 'wall' && 'Wall'}</div>
                        <div className="text-sm text-wood-text/80">Cost: {item.totalCost.toFixed(0)} gp | Time: {totalDays} days</div>
                    </div>
                    <button 
                        onClick={handleCancel} 
                        title={isPendingCancel ? 'Confirm Cancellation' : "Cancel Construction"} 
                        className={`font-bold text-xl leading-none transition-all duration-200 ${isPendingCancel ? 'text-white bg-red-600 rounded px-2 text-sm' : 'text-red-700 hover:text-red-500'}`}
                    >
                        {isPendingCancel ? 'Confirm?' : '×'}
                    </button>
                </div>

                {item.constructionStatus === 'in_progress' && (
                    <div>
                        <div className="text-sm flex justify-between text-wood-text/90">
                            <span>Started: {new Date(item.startDate as string).toLocaleDateString()}</span>
                            <span>Progress: {daysElapsed} / {totalDays} days</span>
                        </div>
                        <div className="w-full h-4 bg-parchment rounded-full overflow-hidden border border-wood-light mt-1">
                            <div style={{ width: `${completionPercentage}%` }} className="h-full bg-gradient-to-r from-green-500 to-green-700 transition-all duration-300 text-right pr-2 text-white text-xs flex items-center justify-end">
                                {completionPercentage.toFixed(0)}%
                            </div>
                        </div>
                    </div>
                )}
                
                <div className="flex justify-end space-x-2 pt-2">
                    {item.constructionStatus === 'pending' && (
                        <button onClick={handleStart} className="bg-green-600 hover:bg-green-700 text-white font-bold py-1 px-3 rounded text-sm shadow-sm hover:shadow-md transition-shadow transform hover:-translate-y-px">
                            Start Construction
                        </button>
                    )}
                    {item.constructionStatus === 'in_progress' && (
                        <button onClick={handleComplete} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-sm shadow-sm hover:shadow-md transition-shadow transform hover:-translate-y-px">
                            Mark as Completed
                        </button>
                    )}
                </div>
            </div>
        );
    };

    return (
         <div>
            <h2 className="text-3xl font-medieval text-wood-dark mb-2">🏗️ Construction Projects</h2>
            <p className="mb-6">Manage the construction of your stronghold components. Start projects from the pending queue and mark them as complete once finished.</p>

            <div className="mb-8 bg-wood/10 p-4 rounded-lg border-2 border-wood-light">
                <label htmlFor="currentDate" className="block font-semibold mb-2 text-wood text-lg">📅 Current In-Game Date</label>
                <input id="currentDate" type="date" value={currentDate} onChange={e => setCurrentDate(e.target.value)} className="w-full md:w-auto p-2 rounded border-2 border-gold bg-white/80"/>
                <p className="text-sm mt-2 text-wood-text/80 italic">Set the current date to see construction progress on active projects.</p>
            </div>

            <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                    <h3 className="text-2xl font-medieval text-wood-dark mb-4">⏳ Pending Construction</h3>
                    <div className="space-y-4 bg-wood/5 p-4 rounded-lg max-h-[60vh] overflow-y-auto border border-wood-light/50">
                        {pending.length > 0 ? pending.map(item => <QueueItemCard key={`${item.itemType}-${item.id}`} item={item} />) : <p className="text-center text-wood-text/70 italic py-8">No pending projects. Add rooms or walls to begin.</p>}
                    </div>
                </div>
                 <div>
                    <h3 className="text-2xl font-medieval text-wood-dark mb-4">🛠️ In Progress</h3>
                     <div className="space-y-4 bg-wood/5 p-4 rounded-lg max-h-[60vh] overflow-y-auto border border-wood-light/50">
                        {inProgress.length > 0 ? inProgress.map(item => <QueueItemCard key={`${item.itemType}-${item.id}`} item={item} />) : <p className="text-center text-wood-text/70 italic py-8">No projects currently under construction.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};


export default ConstructionTab;