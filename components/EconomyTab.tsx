import React, { useState } from 'react';
import { UseStrongholdReturn } from '../types';

const InfoRow: React.FC<{ label: string; value: string | number; tooltip: string }> = ({ label, value, tooltip }) => (
    <div className="flex justify-between items-center py-2 border-b border-wood-light/30" title={tooltip}>
        <span>{label}:</span>
        <span className="font-bold text-lg">{value}</span>
    </div>
);

const EconomyTab: React.FC<{ stronghold: UseStrongholdReturn }> = ({ stronghold }) => {
    const { 
        industrialValue,
        economicValue,
        industrialPotential,
        economicPotential,
        weeklyProfit,
        simulationLog,
        totalMerchantGold,
        merchantGoldSpentThisWeek,
        setMerchantGoldSpentThisWeek,
        strongholdTreasury,
        depositToTreasury,
        withdrawFromTreasury,
    } = stronghold;

    const [transactionAmount, setTransactionAmount] = useState<string>('');

    const handleTransaction = (type: 'deposit' | 'withdraw') => {
        const amount = parseFloat(transactionAmount);
        if (isNaN(amount) || amount <= 0) return;

        if (type === 'deposit') {
            depositToTreasury(amount);
        } else {
            withdrawFromTreasury(amount);
        }
        setTransactionAmount('');
    };

    return (
        <div>
            <h2 className="text-3xl font-medieval text-wood-dark mb-2">💰 Wirtschaft</h2>
            <p className="mb-6">Verwalte die wirtschaftliche Leistung deiner Festung. Industrielle Gebäude produzieren Rohstoffe, die von ökonomischen Gebäuden in Profit umgewandelt werden.</p>
            
            <div className="bg-gold/80 p-6 rounded-lg border-2 border-wood-dark shadow-lg mb-8">
                <h3 className="text-2xl font-semibold text-center mb-4 text-wood-dark">🏰 Schatzkammer der Festung</h3>
                <div className="text-center mb-4">
                    <div className="text-lg text-wood-text">Aktuelles Vermögen</div>
                    <div className={`text-5xl font-bold font-cinzel ${strongholdTreasury < 0 ? 'text-red-800' : 'text-green-800'}`}>
                        {strongholdTreasury.toFixed(2)} GP
                    </div>
                </div>
                <div className="bg-black/10 p-4 rounded space-y-3">
                    <label htmlFor="transaction-amount" className="block font-semibold text-center">Transaktion durchführen</label>
                    <input 
                        id="transaction-amount"
                        type="number"
                        value={transactionAmount}
                        onChange={e => setTransactionAmount(e.target.value)}
                        placeholder="Betrag in GP"
                        className="w-full p-2 border-2 border-gold rounded-md bg-white/80 text-center"
                        min="0"
                    />
                    <div className="flex justify-center space-x-4">
                        <button 
                            onClick={() => handleTransaction('deposit')}
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors shadow-md"
                        >
                            Einzahlen
                        </button>
                        <button 
                            onClick={() => handleTransaction('withdraw')}
                             className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors shadow-md"
                        >
                            Auszahlen
                        </button>
                    </div>
                </div>
            </div>


            <div className="grid md:grid-cols-2 gap-8">
                <div>
                    <div className="bg-gold/80 p-6 rounded-lg border-2 border-wood-dark shadow-lg mb-8">
                        <h3 className="text-2xl font-semibold text-center mb-4 text-wood-dark">Wöchentliche Einnahmen</h3>
                        <div className="space-y-3 bg-black/10 p-4 rounded">
                            <InfoRow label="Industrieller Wert (IV)" value={`${industrialValue.toFixed(0)} GP`} tooltip="Gesamtwert aller industriellen Gebäude." />
                            <InfoRow label="Ökonomischer Wert (EV)" value={`${economicValue.toFixed(0)} GP`} tooltip="Gesamtwert aller ökonomischen Gebäude." />
                            <hr className="border-wood-light/50 my-2" />
                            <InfoRow label="Industrielles Potential" value={`${industrialPotential.toFixed(2)} GP`} tooltip="Eigenständiger Profit aus industriellen Gebäuden. Berechnet als: Industrieller Wert × 0.5%." />
                            <InfoRow label="Ökonomisches Potential" value={`${economicPotential.toFixed(2)} GP`} tooltip="Eigenständiger Profit aus ökonomischen Gebäuden, modifiziert durch industrielle Effizienz. Berechnet als: Ökonomischer Wert × 2.5% × (min(1, Industrieller Wert / Ökonomischer Wert))." />

                            <div className="flex justify-between items-baseline border-t-2 border-wood-light/50 pt-3 mt-3 font-bold text-xl text-green-800" title="Gesamteinnahmen aus beiden Potentialen (Industrielles Potential + Ökonomisches Potential)">
                                <span>Wöchentlicher Gewinn:</span>
                                <span>{weeklyProfit.toFixed(2)} GP</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-gold/80 p-6 rounded-lg border-2 border-wood-dark shadow-lg">
                        <h3 className="text-2xl font-semibold text-center mb-4 text-wood-dark">Handelskapital</h3>
                        <div className="space-y-3 bg-black/10 p-4 rounded">
                            <InfoRow label="Wöchentliches Händlergold" value={`${totalMerchantGold.toFixed(2)} GP`} tooltip="25% des Gesamtwertes aller 'Shop'-Gebäude. Setzt sich wöchentlich zurück." />
                            <div className="py-2">
                                <label className="block font-semibold mb-2 text-wood-text/90">Ausgegebenes Gold diese Woche:</label>
                                <input 
                                    type="number"
                                    value={merchantGoldSpentThisWeek}
                                    onChange={e => {
                                        const val = parseFloat(e.target.value) || 0;
                                        setMerchantGoldSpentThisWeek(Math.max(0, Math.min(val, totalMerchantGold)));
                                    }}
                                    className="w-full p-2 border-2 border-gold rounded-md bg-white/80"
                                    max={totalMerchantGold}
                                    min={0}
                                />
                            </div>
                            <div className="flex justify-between items-baseline border-t-2 border-wood-light/50 pt-3 mt-3 font-bold text-xl text-green-800">
                                <span>Verbleibendes Gold:</span>
                                <span>{(totalMerchantGold - merchantGoldSpentThisWeek).toFixed(2)} GP</span>
                            </div>
                        </div>
                    </div>

                </div>
                <div>
                     <h3 className="text-2xl font-medieval text-wood-dark mb-4">📜 Ereignisprotokoll</h3>
                     <div className="bg-parchment-light/80 p-4 rounded-lg border border-wood-light h-[800px] overflow-y-auto space-y-2 shadow-inner">
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

export default EconomyTab;