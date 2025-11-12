import React, { useState, useEffect } from 'react';
import { UseStrongholdReturn } from '../types';
import { SITE_MODIFIERS, CLIMATE_DESCRIPTIONS, FEATURE_DESCRIPTIONS, getSettlementLabel } from '../constants';

interface SiteTabProps {
  stronghold: UseStrongholdReturn;
}

const FormGroup: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
    <div className="flex-1 min-w-[200px] mb-4">
        <label className="block font-semibold mb-2 text-wood text-lg">{label}</label>
        {children}
    </div>
);

const SiteTab: React.FC<SiteTabProps> = ({ stronghold }) => {
    const { site, setSite, siteModifier } = stronghold;
    const [description, setDescription] = useState('Wähle ein Klima oder fahre mit der Maus über ein Merkmal, um eine Beschreibung zu sehen.');

    useEffect(() => {
        if (site.climate && CLIMATE_DESCRIPTIONS[site.climate]) {
            setDescription(CLIMATE_DESCRIPTIONS[site.climate]);
        } else {
            setDescription('Wähle ein Klima oder fahre mit der Maus über ein Merkmal, um eine Beschreibung zu sehen.');
        }
    }, [site.climate]);


    const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        const { name, value, type } = e.target;
        
        if (type === 'checkbox') {
            const { checked } = e.target as HTMLInputElement;
            const currentFeatures = site.features || [];
            const newFeatures = checked
                ? [...currentFeatures, value]
                : currentFeatures.filter(f => f !== value);
            setSite({ ...site, features: newFeatures });
        } else {
            setSite({ ...site, [name]: value });
        }
    };

    const handleFeatureMouseLeave = () => {
        if (site.climate && CLIMATE_DESCRIPTIONS[site.climate]) {
            setDescription(CLIMATE_DESCRIPTIONS[site.climate]);
        } else {
            setDescription('Wähle ein Klima oder fahre mit der Maus über ein Merkmal, um eine Beschreibung zu sehen.');
        }
    };

    return (
        <div>
            <h2 className="text-3xl font-medieval text-wood-dark mb-2">🏰 Site Selection</h2>
            <p className="mb-6">Wähle den Standort für deine Festung. Der Ort beeinflusst die Endkosten durch verschiedene Modifikatoren.</p>

            <div className="flex flex-wrap gap-6">
                <FormGroup label="Climate/Terrain Type">
                    <select name="climate" value={site.climate} onChange={handleChange} className="w-full p-3 border-2 border-gold rounded-md bg-white/80 focus:border-wood focus:outline-none focus:ring-2 focus:ring-wood-light">
                        <option value="">Wähle Klima/Gelände</option>
                        {Object.entries(SITE_MODIFIERS.climate).map(([key, mod]) => 
                            <option key={key} value={key}>
                                {`${key.charAt(0).toUpperCase() + key.slice(1)} (${mod > 0 ? `+${mod}` : mod}%)`}
                            </option>
                        )}
                    </select>
                </FormGroup>
                <FormGroup label="Primary Settlement">
                    <select name="settlement" value={site.settlement} onChange={handleChange} className="w-full p-3 border-2 border-gold rounded-md bg-white/80 focus:border-wood focus:outline-none focus:ring-2 focus:ring-wood-light">
                        <option value="">Wähle Siedlung</option>
                        {Object.entries(SITE_MODIFIERS.settlement).map(([key, mod]) => 
                            <option key={key} value={key}>
                                {`${getSettlementLabel(key)} (${mod > 0 ? `+${mod}` : mod}%)`}
                            </option>
                        )}
                    </select>
                </FormGroup>
            </div>

            <div className="mb-6">
                <label className="block font-semibold mb-2 text-wood text-lg">Nearby Features</label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {Object.entries(SITE_MODIFIERS.features).map(([key, mod]) => (
                        <label 
                            key={key} 
                            className="flex items-center space-x-2 p-2 rounded hover:bg-parchment-dark/30 cursor-pointer"
                            onMouseEnter={() => setDescription(FEATURE_DESCRIPTIONS[key] || 'Keine Beschreibung verfügbar.')}
                            onMouseLeave={handleFeatureMouseLeave}
                        >
                            <input type="checkbox" name="features" value={key} checked={site.features.includes(key)} onChange={handleChange} className="h-5 w-5 rounded border-gold text-wood focus:ring-wood-light" />
                            <span>{key.charAt(0).toUpperCase() + key.slice(1)} ({mod > 0 ? `+${mod}` : mod}%)</span>
                        </label>
                    ))}
                </div>
            </div>

             <div className="mt-6 bg-blue-900/10 p-4 rounded-lg border-l-4 border-blue-600 min-h-[80px]">
                <h4 className="text-xl font-semibold text-blue-800">📖 Beschreibung</h4>
                <p className="mt-2 text-wood-text/80 italic">{description}</p>
            </div>

            <div className="mt-8 bg-wood/10 border-2 border-wood-light rounded-lg p-4">
                <h3 className="text-xl font-semibold text-wood-dark">Current Site Modifier: 
                    <span className={`ml-2 font-bold ${siteModifier > 0 ? 'text-red-700' : 'text-green-700'}`}>
                        {siteModifier > 0 ? `+${siteModifier}` : siteModifier}%
                    </span>
                </h3>
            </div>
        </div>
    );
};

export default SiteTab;