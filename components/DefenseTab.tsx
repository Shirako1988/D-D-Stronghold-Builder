import React from 'react';
import { UseStrongholdReturn } from '../types';
import { HIRELING_DATA } from '../constants';

const InfoRow: React.FC<{ label: string; value: string | number; tooltip: string }> = ({ label, value, tooltip }) => (
    <div className="flex justify-between items-center py-2 border-b border-wood-light/30" title={tooltip}>
        <span>{label}:</span>
        <span className="font-bold text-lg">{value}</span>
    </div>
);

const DefenseTab: React.FC<{ stronghold: UseStrongholdReturn }> = ({ stronghold }) => {
    const {
        militaryValue,
        defenseBonus,
        attackChanceBonus,
        maxAttackRoll,
        garrisonCR,
        attackCR,
        staff,
        simulationLog,
        industrialValue,
        economicValue,
        simulateNextWeek,
    } = stronghold;

    const socialValueForDisplay = industrialValue + economicValue;

    return (
        <div>
            <h2 className="text-3xl font-medieval text-wood-dark mb-2">🛡️ Verteidigung</h2>
            <p className="mb-6">Analysiere die Verteidigungsstärke deiner Festung und die Wahrscheinlichkeit eines Angriffs. Der Verteidigungsbonus modifiziert die Kampfkraft deiner Garnison.</p>

            <div className="grid md:grid-cols-2 gap-8">
                <div>
                    <div className="bg-red-900/10 p-6 rounded-lg border-2 border-red-800/50 shadow-lg mb-8">
                        <h3 className="text-2xl font-semibold text-center mb-4 text-red-900">Status & Angriffschance</h3>
                        <div className="space-y-3 bg-black/10 p-4 rounded">
                            <InfoRow label="Militärischer Wert (MV)" value={`${militaryValue.toFixed(0)} GP`} tooltip="Gesamtwert aller militärischen Gebäude und Mauern." />
                            <InfoRow label="Formel Wert (IV + EV)" value={`${socialValueForDisplay.toFixed(0)} GP`} tooltip="Gesamtwert aller industriellen und ökonomischen Gebäude (IV + EV)." />
                            <hr className="border-red-800/30 my-2" />
                            <InfoRow label="Verteidigungsbonus" value={`${(defenseBonus * 100).toFixed(1)}%`} tooltip="Stärkt (oder schwächt) deine Garnison basierend auf dem Verhältnis von MV zu (IV+EV)." />
                            <InfoRow label="Angriffschancebonus" value={`${(attackChanceBonus * 100).toFixed(1)}%`} tooltip="Erhöht die Wahrscheinlichkeit eines Angriffs, wenn der soziale Wert den militärischen übersteigt." />
                            <div className="flex justify-between items-baseline border-t-2 border-red-800/40 pt-3 mt-3 font-bold text-xl text-red-800">
                                <span>Angriff bei W100 ≤</span>
                                <span>{maxAttackRoll.toFixed(0)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-blue-900/10 p-6 rounded-lg border-2 border-blue-800/50 shadow-lg mb-8">
                        <h3 className="text-2xl font-semibold text-center mb-4 text-blue-900">Kampfstärke</h3>
                        <div className="space-y-3 bg-black/10 p-4 rounded">
                             <InfoRow label="Garnisons-CR" value={garrisonCR.toFixed(2)} tooltip="Die effektive Kampfstärke deiner stationierten Truppen, modifiziert durch den Verteidigungsbonus." />
                             <InfoRow label="Angreifer-CR (geschätzt)" value={attackCR.toFixed(2)} tooltip="Die geschätzte Stärke eines potenziellen Angreifers, basierend auf dem Gesamtwert deiner Festung." />
                             <div className="pt-2">
                                <h4 className="font-semibold text-center text-sm text-wood-dark mb-1">Garnisons-Zusammensetzung</h4>
                                <div className="max-h-24 overflow-y-auto text-xs space-y-1 pr-2">
                                    {staff.length > 0 ? staff.map(s => (
                                        <div key={s.id} className="flex justify-between">
                                            <span>{s.customRole || s.hirelingType} (x{s.quantity})</span>
                                            <span>CR sum: {(HIRELING_DATA[s.hirelingKey]?.cr * s.quantity).toFixed(2)}</span>
                                        </div>
                                    )) : <p className="italic text-center">Keine Garnison stationiert.</p>}
                                </div>
                             </div>
                        </div>
                    </div>

                    <button 
                        onClick={simulateNextWeek} 
                        className="w-full bg-gradient-to-br from-wood-light to-wood-dark text-parchment-bg font-bold py-4 px-6 rounded-lg border-2 border-wood-dark hover:from-gold-dark hover:to-gold-light hover:text-wood-dark transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg text-xl"
                    >
                        Nächste Woche simulieren 🎲
                    </button>
                </div>

                <div>
                     <h3 className="text-2xl font-medieval text-wood-dark mb-4">📜 Ereignisprotokoll</h3>
                     <div className="bg-parchment-light/80 p-4 rounded-lg border border-wood-light h-[600px] overflow-y-auto space-y-2 shadow-inner">
                        {simulationLog.length > 0 ? (
                            simulationLog.map((log, index) => (
                                <p key={index} className="text-sm text-wood-text border-b border-wood/20 pb-1">{log}</p>
                            )).reverse()
                        ) : (
                            <p className="text-center text-wood-text/70 italic pt-16">Noch keine Ereignisse. Starte die Simulation, um die Woche voranzutreiben.</p>
                        )}
                     </div>
                </div>
            </div>
        </div>
    );
};

export default DefenseTab;
