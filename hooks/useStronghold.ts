import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { StrongholdState, Site, StrongholdComponent, Wall, Staff, UseStrongholdReturn, Perk, JobSlot, ResourceType, CalculatedPerk, ScaledBonuses, SaveSlot, SaveSlots } from '../types';
import { SITE_MODIFIERS, HIRELING_DATA, COMPONENTS } from '../constants';

const INITIAL_STATE: StrongholdState = {
  site: { climate: '', settlement: '', features: [] },
  components: [],
  walls: [],
  staff: [],
  simulationLog: [],
  totalDamage: 0,
  merchantGoldSpentThisWeek: 0,
  strongholdTreasury: 0,
};

export const calculateConstructionTime = (baseCost: number): number => {
    if (baseCost <= 0) return 0;
    const days = (baseCost / 10000) * 7;
    return Math.ceil(days);
};

export const calculateScaledBenefits = (componentName: string, category: string, area: number) => {
    const data = COMPONENTS[category]?.[componentName];
    if (!data) return { resources: {}, jobs: [], perks: [] };
    
    let baseArea: number;
    if (data.minSize) {
        baseArea = data.minSize.length * data.minSize.width;
    } else {
        baseArea = Math.pow((data.ss || 1) * 20, 2);
    }

    const scalingFactor = baseArea > 0 ? area / baseArea : 1;

    const scaledResources: Partial<Record<ResourceType, number>> = {};
    if (data.provides) {
        for (const [key, value] of Object.entries(data.provides)) {
            const calculated = Math.floor(value * scalingFactor);
            if (calculated > 0) {
                 scaledResources[key as ResourceType] = calculated;
            }
        }
    }

    const scaledJobs: { role: string, count: number }[] = [];
    if (data.jobs) {
        data.jobs.forEach(job => {
            const calculated = Math.floor(job.count * scalingFactor);
            if(calculated > 0) {
                scaledJobs.push({ role: job.role, count: calculated });
            }
        });
    }
    
    const scaledPerks: CalculatedPerk[] = [];
    if (data.perks) {
        data.perks.forEach(perk => {
            if (!perk.baseBonus) {
                 if (area > 0) scaledPerks.push({ ...perk });
            } else {
                const calculated = Math.floor(perk.baseBonus * scalingFactor);
                if (calculated > 0) {
                    scaledPerks.push({ ...perk, finalBonus: calculated });
                }
            }
        });
    }

    return { resources: scaledResources, jobs: scaledJobs, perks: scaledPerks };
};


export const useStronghold = (): UseStrongholdReturn => {
  const [state, setState] = useState<StrongholdState>(INITIAL_STATE);
  const [saveSlots, setSaveSlots] = useState<SaveSlots>([]);
  const [activeSaveName, setActiveSaveName] = useState<string | null>(null);

  // Load from localStorage on initial mount
  useEffect(() => {
    try {
        // --- Migration from old single-save format ---
        const oldStateRaw = localStorage.getItem('strongholdBuilder');
        const savesRaw = localStorage.getItem('strongholdSaves');

        if (oldStateRaw && !savesRaw) {
            const oldState = JSON.parse(oldStateRaw);
            const legacySave: SaveSlot = {
                name: 'Autosave (Legacy)',
                lastSaved: new Date().toISOString(),
                state: oldState,
            };
            setSaveSlots([legacySave]);
            setActiveSaveName(legacySave.name);
            setState(oldState);
            localStorage.removeItem('strongholdBuilder');
            return; // Exit after migration
        }
      
        // --- Normal loading ---
        const loadedSaves: SaveSlots = savesRaw ? JSON.parse(savesRaw) : [];
        setSaveSlots(loadedSaves);

        const loadedActiveName = localStorage.getItem('activeStrongholdSaveName');
        const activeSave = loadedSaves.find(s => s.name === loadedActiveName);

        if (activeSave) {
            setActiveSaveName(activeSave.name);
            setState(activeSave.state);
        } else if (loadedSaves.length > 0) {
            setActiveSaveName(loadedSaves[0].name);
            setState(loadedSaves[0].state);
        }

    } catch (error) {
      console.error("Failed to parse state from localStorage", error);
    }
  }, []);

  // Autosave to the active slot whenever state changes
  useEffect(() => {
    if (activeSaveName) {
        const updatedSlots = saveSlots.map(slot => 
            slot.name === activeSaveName 
            ? { ...slot, state: state, lastSaved: new Date().toISOString() } 
            : slot
        );
        localStorage.setItem('strongholdSaves', JSON.stringify(updatedSlots));
        localStorage.setItem('activeStrongholdSaveName', activeSaveName);
    }
  }, [state, activeSaveName, saveSlots]);

  const saveCurrentSlot = useCallback(() => {
      if (!activeSaveName) return;
      const updatedSlots = saveSlots.map(slot => 
          slot.name === activeSaveName 
          ? { ...slot, state: state, lastSaved: new Date().toISOString() } 
          : slot
      );
      setSaveSlots(updatedSlots);
      localStorage.setItem('strongholdSaves', JSON.stringify(updatedSlots));
  }, [state, activeSaveName, saveSlots]);

  const saveAsNewSlot = useCallback((name: string) => {
      if (!name || saveSlots.some(s => s.name === name)) {
          alert("A save with this name already exists or the name is invalid.");
          return false;
      }
      const newSave: SaveSlot = {
          name,
          lastSaved: new Date().toISOString(),
          state: state,
      };
      const newSaveSlots = [...saveSlots, newSave];
      setSaveSlots(newSaveSlots);
      setActiveSaveName(name);
      localStorage.setItem('strongholdSaves', JSON.stringify(newSaveSlots));
      localStorage.setItem('activeStrongholdSaveName', name);
      return true;
  }, [state, saveSlots]);

  const loadSlot = useCallback((name: string) => {
      const slotToLoad = saveSlots.find(s => s.name === name);
      if (slotToLoad) {
          setState(slotToLoad.state);
          setActiveSaveName(name);
          localStorage.setItem('activeStrongholdSaveName', name);
      }
  }, [saveSlots]);
  
  const deleteSlot = useCallback((name: string) => {
      const newSaveSlots = saveSlots.filter(s => s.name !== name);
      setSaveSlots(newSaveSlots);
      localStorage.setItem('strongholdSaves', JSON.stringify(newSaveSlots));
      if (activeSaveName === name) {
          setActiveSaveName(null);
          setState(INITIAL_STATE);
          localStorage.removeItem('activeStrongholdSaveName');
      }
  }, [saveSlots, activeSaveName]);

  const renameSlot = useCallback((oldName: string, newName: string) => {
      if (!newName || saveSlots.some(s => s.name === newName)) {
        alert("Ein Spielstand mit diesem Namen existiert bereits oder der Name ist ungültig.");
        return false;
      }
      const newSaveSlots = saveSlots.map(s => s.name === oldName ? { ...s, name: newName } : s);
      setSaveSlots(newSaveSlots);
      localStorage.setItem('strongholdSaves', JSON.stringify(newSaveSlots));
      if (activeSaveName === oldName) {
          setActiveSaveName(newName);
          localStorage.setItem('activeStrongholdSaveName', newName);
      }
      return true;
  }, [saveSlots, activeSaveName]);

  const copySlot = useCallback((name: string) => {
      const slotToCopy = saveSlots.find(s => s.name === name);
      if (!slotToCopy) return;

      let newName = `Kopie von ${name}`;
      let counter = 1;
      while (saveSlots.some(s => s.name === newName)) {
          counter++;
          newName = `Kopie von ${name} (${counter})`;
      }

      const newSave: SaveSlot = {
          ...slotToCopy,
          name: newName,
          lastSaved: new Date().toISOString(),
      };
      
      const newSaveSlots = [...saveSlots, newSave];
      setSaveSlots(newSaveSlots);
      localStorage.setItem('strongholdSaves', JSON.stringify(newSaveSlots));
  }, [saveSlots]);

  const exportSlot = useCallback((name: string) => {
    const slotToExport = saveSlots.find(s => s.name === name);
    if (!slotToExport) return;

    const data = JSON.stringify(slotToExport, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const fileName = `${name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [saveSlots]);

    const importStronghold = useCallback((fileContent: string) => {
        try {
            const importedSlot: SaveSlot = JSON.parse(fileContent);

            if (!importedSlot.name || !importedSlot.state || !importedSlot.lastSaved) {
                alert('Ungültiges Speicherformat.');
                return;
            }

            let newName = importedSlot.name;
            let counter = 1;
            while (saveSlots.some(s => s.name === newName)) {
                newName = `${importedSlot.name} (Importiert ${counter})`;
                counter++;
            }

            const newSave: SaveSlot = { ...importedSlot, name: newName };
            const newSaveSlots = [...saveSlots, newSave];
            setSaveSlots(newSaveSlots);
            
            // Directly update state and active name without relying on loadSlot's potentially stale closure
            setState(newSave.state);
            setActiveSaveName(newSave.name);
            
            localStorage.setItem('strongholdSaves', JSON.stringify(newSaveSlots));
            localStorage.setItem('activeStrongholdSaveName', newSave.name);

        } catch (error) {
            console.error("Fehler beim Importieren der Speicherdatei", error);
            alert("Fehler beim Importieren der Speicherdatei. Sie könnte beschädigt sein oder ein falsches Format haben.");
        }
    }, [saveSlots]); // `loadSlot` removed from dependencies

  const setSite = useCallback((newSite: Site) => {
    setState(prevState => ({ ...prevState, site: newSite }));
  }, []);

  const addComponent = useCallback((component: Omit<StrongholdComponent, 'id' | 'jobSlots'>) => {
      const { jobs: scaledJobs } = calculateScaledBenefits(component.name, component.category, component.area);

      const jobSlots: JobSlot[] = [];
      scaledJobs.forEach(job => {
          for (let i = 0; i < job.count; i++) {
              const uniqueId = `${component.name}-${job.role}-${i}-${crypto.randomUUID()}`;
              jobSlots.push({ id: uniqueId, role: job.role, filledBy: null });
          }
      });
      
      setState(prevState => ({
          ...prevState,
          components: [...prevState.components, { ...component, id: crypto.randomUUID(), jobSlots }],
      }));
  }, []);

  const removeComponent = useCallback((id: string) => {
    setState(prevState => {
      const componentToRemove = prevState.components.find(c => c.id === id);
      if (!componentToRemove) return prevState;

      const staffToUnassign = componentToRemove.jobSlots.map(j => j.filledBy).filter(Boolean);
      const updatedStaff = prevState.staff.map(s => staffToUnassign.includes(s.id) ? { ...s, assignedJobId: null } : s);

      return { ...prevState, components: prevState.components.filter(c => c.id !== id), staff: updatedStaff };
    });
  }, []);

  const addWall = useCallback((wall: Omit<Wall, 'id'>) => {
    setState(prevState => ({ ...prevState, walls: [...prevState.walls, { ...wall, id: crypto.randomUUID() }] }));
  }, []);
  
  const removeWall = useCallback((id: string) => {
    setState(prevState => ({ ...prevState, walls: prevState.walls.filter(w => w.id !== id) }));
  }, []);

  const addStaff = useCallback((staffToAdd: Omit<Staff, 'id' | 'assignedJobId'>) => {
    const hirelingInfo = HIRELING_DATA[staffToAdd.hirelingKey];
    if (!hirelingInfo) return;

    const staffWithId: Staff = { ...staffToAdd, id: crypto.randomUUID(), cr: hirelingInfo.cr, assignedJobId: null };

    setState(prevState => {
        const existingStaff = prevState.staff.find(s => s.hirelingKey === staffWithId.hirelingKey && s.customRole === staffWithId.customRole && s.isVolunteer === staffWithId.isVolunteer && s.assignedJobId === null);
        if (existingStaff) {
            return { ...prevState, staff: prevState.staff.map(s => s.id === existingStaff.id ? { ...s, quantity: s.quantity + staffWithId.quantity, totalCost: s.totalCost + staffWithId.totalCost } : s) };
        } else {
            return { ...prevState, staff: [...prevState.staff, staffWithId] };
        }
    });
  }, []);

  const removeStaff = useCallback((id: string) => {
    setState(prevState => {
      const staffToRemove = prevState.staff.find(s => s.id === id);
      if (!staffToRemove) return prevState;
      let updatedComponents = prevState.components;
      if (staffToRemove.assignedJobId) {
          updatedComponents = prevState.components.map(c => ({ ...c, jobSlots: c.jobSlots.map(j => j.id === staffToRemove.assignedJobId ? { ...j, filledBy: null } : j) }));
      }
      return { ...prevState, staff: prevState.staff.filter(s => s.id !== id), components: updatedComponents };
    });
  }, []);

  const assignStaffToJob = useCallback((staffId: string, jobId: string) => {
      setState(prevState => {
          let targetComponentId: string | null = null;
          const updatedComponents = prevState.components.map(c => ({ ...c, jobSlots: c.jobSlots.map(j => { if (j.id === jobId) { targetComponentId = c.id; return { ...j, filledBy: staffId }; } return j; }) }));
          if (!targetComponentId) return prevState;
          const updatedStaff = prevState.staff.map(s => s.id === staffId ? { ...s, assignedJobId: jobId } : s);
          return { ...prevState, components: updatedComponents, staff: updatedStaff };
      });
  }, []);

  const unassignStaffFromJob = useCallback((staffId: string) => {
      setState(prevState => {
          const staffMember = prevState.staff.find(s => s.id === staffId);
          if (!staffMember || !staffMember.assignedJobId) return prevState;
          const jobId = staffMember.assignedJobId;
          const updatedComponents = prevState.components.map(c => ({ ...c, jobSlots: c.jobSlots.map(j => j.id === jobId ? { ...j, filledBy: null } : j) }));
          const updatedStaff = prevState.staff.map(s => s.id === staffId ? { ...s, assignedJobId: null } : s);
          return { ...prevState, components: updatedComponents, staff: updatedStaff };
      });
  }, []);

  const startNewStronghold = useCallback(() => {
    const confirmed = window.confirm('Are you sure you want to start a new stronghold? This will clear the current editor but will not delete any saved games.');
    if (confirmed) {
      setState(INITIAL_STATE);
      setActiveSaveName(null);
      localStorage.removeItem('activeStrongholdSaveName');
    }
  }, []);

  const startConstruction = useCallback((id: string, type: 'component' | 'wall', startDate: string) => {
    setState(prevState => (type === 'component') ? { ...prevState, components: prevState.components.map(c => c.id === id ? { ...c, constructionStatus: 'in_progress', startDate: startDate } : c) } : { ...prevState, walls: prevState.walls.map(w => w.id === id ? { ...w, constructionStatus: 'in_progress', startDate: startDate } : w) });
  }, []);

  const completeConstruction = useCallback((id: string, type: 'component' | 'wall') => {
    setState(prevState => (type === 'component') ? { ...prevState, components: prevState.components.map(c => c.id === id ? { ...c, constructionStatus: 'completed' } : c) } : { ...prevState, walls: prevState.walls.map(w => w.id === id ? { ...w, constructionStatus: 'completed' } : w) });
  }, []);

  const repairDamage = useCallback((amount: number) => {
    setState(prevState => ({ ...prevState, totalDamage: Math.max(0, prevState.totalDamage - amount), simulationLog: [...prevState.simulationLog, `Reparatur: ${amount.toFixed(0)} GP wurden für Reparaturen aufgewendet.`] }));
  }, []);

  const setMerchantGoldSpentThisWeek = useCallback((amount: number) => { setState(prevState => ({ ...prevState, merchantGoldSpentThisWeek: amount })); }, []);
  const depositToTreasury = useCallback((amount: number) => { if (amount <= 0) return; setState(prevState => ({ ...prevState, strongholdTreasury: prevState.strongholdTreasury + amount, simulationLog: [...prevState.simulationLog, `Einzahlung: ${amount.toFixed(2)} GP in die Schatzkammer eingezahlt.`] })); }, []);
  const withdrawFromTreasury = useCallback((amount: number) => { if (amount <= 0) return; setState(prevState => ({ ...prevState, strongholdTreasury: prevState.strongholdTreasury - amount, simulationLog: [...prevState.simulationLog, `Auszahlung: ${amount.toFixed(2)} GP aus der Schatzkammer entnommen.`] })); }, []);

  const siteModifier = useMemo(() => {
    const climateMod = SITE_MODIFIERS.climate[state.site.climate as keyof typeof SITE_MODIFIERS.climate] || 0;
    const settlementMod = SITE_MODIFIERS.settlement[state.site.settlement as keyof typeof SITE_MODIFIERS.settlement] || 0;
    const featuresMod = (state.site.features || []).reduce((sum, feature) => sum + (SITE_MODIFIERS.features[feature as keyof typeof SITE_MODIFIERS.features] || 0), 0);
    return climateMod + settlementMod + featuresMod;
  }, [state.site]);

  const componentsTotal = useMemo(() => state.components.reduce((sum, c) => sum + c.totalCost, 0), [state.components]);
  const wallsTotal = useMemo(() => state.walls.reduce((sum, w) => sum + w.totalCost, 0), [state.walls]);
  const grandTotal = useMemo(() => componentsTotal + wallsTotal, [componentsTotal, wallsTotal]);
  const totalArea = useMemo(() => state.components.reduce((sum, c) => sum + c.area, 0), [state.components]);
  const staffTotalWeekly = useMemo(() => state.staff.reduce((sum, s) => sum + s.totalCost, 0), [state.staff]);
  
  const maintenanceWeekly = useMemo(() => {
      const completedComponentsTotal = state.components.filter(c => c.constructionStatus === 'completed').reduce((sum, c) => sum + c.totalCost, 0);
      const completedWallsTotal = state.walls.filter(w => w.constructionStatus === 'completed').reduce((sum, w) => sum + w.totalCost, 0);
      return (completedComponentsTotal + completedWallsTotal) * 0.01 / 52;
  }, [state.components, state.walls]);

  const weeklyUpkeep = useMemo(() => staffTotalWeekly + maintenanceWeekly, [staffTotalWeekly, maintenanceWeekly]);
  
  const totalConstructionDays = useMemo(() => {
    const componentDays = state.components.filter(c => c.constructionStatus !== 'completed').reduce((sum, c) => sum + Math.ceil(calculateConstructionTime(c.baseCost) * (1 - c.rushPercent / 100)), 0);
    const wallDays = state.walls.filter(w => w.constructionStatus !== 'completed').reduce((sum, w) => sum + Math.ceil(calculateConstructionTime(w.baseCost) * (1 - w.rushPercent / 100)), 0);
    return componentDays + wallDays;
  }, [state.components, state.walls]);

    const baseMilitaryValue = useMemo(() => state.components.filter(c => c.classification === 'military' && c.constructionStatus === 'completed').reduce((sum, c) => sum + c.baseCost, 0) + state.walls.filter(w => w.constructionStatus === 'completed').reduce((sum, w) => sum + w.baseCost, 0), [state.components, state.walls]);
    const baseIndustrialValue = useMemo(() => state.components.filter(c => c.classification === 'industrial' && c.constructionStatus === 'completed').reduce((sum, c) => sum + c.baseCost, 0), [state.components]);
    const baseEconomicValue = useMemo(() => state.components.filter(c => c.classification === 'economic' && c.constructionStatus === 'completed').reduce((sum, c) => sum + c.baseCost, 0), [state.components]);
    const baseSocialValue = useMemo(() => state.components.filter(c => c.classification === 'social' && c.constructionStatus === 'completed').reduce((sum, c) => sum + c.baseCost, 0), [state.components]);

    const damageShare = state.totalDamage > 0 ? state.totalDamage / 3 : 0;
    const militaryValue = Math.max(0, baseMilitaryValue - damageShare);
    const industrialValue = Math.max(0, baseIndustrialValue - damageShare);
    const economicValue = Math.max(0, baseEconomicValue - damageShare);
    const socialValue = baseSocialValue;
    const formulaSV = industrialValue + economicValue;
    const totalValue = militaryValue + industrialValue + economicValue + socialValue;

    const industrialPotential = useMemo(() => industrialValue * 0.005, [industrialValue]);
    const economicPotential = useMemo(() => economicValue * 0.025 * (economicValue > 0 ? Math.min(1, industrialValue / economicValue) : 0), [economicValue, industrialValue]);
    const weeklyProfit = useMemo(() => industrialPotential + economicPotential, [industrialPotential, economicPotential]);

    const totalMerchantGold = useMemo(() => state.components.filter(c => c.constructionStatus === 'completed' && c.name.toLowerCase().includes('shop')).reduce((sum, c) => sum + c.baseCost, 0) * 0.25, [state.components]);

    const defenseBonus = useMemo(() => militaryValue === 0 ? (formulaSV > 0 ? -0.9 : 0) : Math.max(-0.9, 2 - (formulaSV / militaryValue)), [militaryValue, formulaSV]);
    const attackChanceBonus = useMemo(() => militaryValue === 0 ? (formulaSV > 0 ? 3.0 : -0.9) : Math.max(-0.9, (formulaSV / (2 * militaryValue)) - 0.9), [militaryValue, formulaSV]);
    const maxAttackRoll = useMemo(() => Math.max(2, Math.min(100, Math.round(25 * (attackChanceBonus + 1)))), [attackChanceBonus]);

    const baseGarrisonCR = useMemo(() => state.staff.reduce((sum, s) => sum + (s.cr * s.quantity), 0), [state.staff]);
    const garrisonCR = useMemo(() => Math.max(0, baseGarrisonCR * (1 + defenseBonus)), [baseGarrisonCR, defenseBonus]);
    const attackCR = useMemo(() => Math.max(0.5, Math.min(30, totalValue / 2000)), [totalValue]);

    const simulateNextWeek = useCallback(() => {
        setState(prevState => {
            const baseMV = prevState.components.filter(c => c.classification === 'military' && c.constructionStatus === 'completed').reduce((s, c) => s + c.baseCost, 0) + prevState.walls.filter(w => w.constructionStatus === 'completed').reduce((s, w) => s + w.baseCost, 0);
            const baseIV = prevState.components.filter(c => c.classification === 'industrial' && c.constructionStatus === 'completed').reduce((s, c) => s + c.baseCost, 0);
            const baseEV = prevState.components.filter(c => c.classification === 'economic' && c.constructionStatus === 'completed').reduce((s, c) => s + c.baseCost, 0);
            const baseSV_social = prevState.components.filter(c => c.classification === 'social' && c.constructionStatus === 'completed').reduce((s,c) => s + c.baseCost, 0);
            const dmgShare = prevState.totalDamage > 0 ? prevState.totalDamage / 3 : 0;
            const currentMV = Math.max(0, baseMV - dmgShare);
            const currentIV = Math.max(0, baseIV - dmgShare);
            const currentEV = Math.max(0, baseEV - dmgShare);
            const currentSV_social = baseSV_social;
            const currentFormulaSV = currentIV + currentEV;
            const currentTV = currentMV + currentIV + currentEV + currentSV_social;
            const currentDefenseBonus = currentMV === 0 ? (currentFormulaSV > 0 ? -0.9 : 0) : Math.max(-0.9, 2 - (currentFormulaSV / currentMV));
            const currentAttackChanceBonus = currentMV === 0 ? (currentFormulaSV > 0 ? 3.0 : -0.9) : Math.max(-0.9, (currentFormulaSV / (2 * currentMV)) - 0.9);
            const currentMaxAttackRoll = Math.max(2, Math.min(100, Math.round(25 * (currentAttackChanceBonus + 1))));
            const currentBaseGarrisonCR = prevState.staff.reduce((s, st) => s + (st.cr * st.quantity), 0);
            const currentGarrisonCR = Math.max(0, currentBaseGarrisonCR * (1 + currentDefenseBonus));
            const currentAttackCR = Math.max(0.5, Math.min(30, currentTV / 2000));

            let newState = JSON.parse(JSON.stringify(prevState));
            const newLog: string[] = [...(newState.simulationLog || [])];
            const weekNumber = Math.floor((newState.simulationLog || []).filter((l: string) => l.includes('(Wirtschaft)')).length) + 1;

            const industrialPotSim = currentIV * 0.005;
            const efficiency = currentEV > 0 ? Math.min(1, currentIV / currentEV) : 0;
            const economicPotSim = currentEV * 0.025 * efficiency;
            const profit = industrialPotSim + economicPotSim;
            newLog.push(`Woche ${weekNumber} (Wirtschaft): Einnahmen von ${profit.toFixed(2)} GP erzielt.`);
            const staffCost = prevState.staff.reduce((sum, s) => sum + s.totalCost, 0);
            const completedComponentsTotal = prevState.components.filter(c => c.constructionStatus === 'completed').reduce((sum, c) => sum + c.totalCost, 0);
            const completedWallsTotal = prevState.walls.filter(w => w.constructionStatus === 'completed').reduce((sum, w) => sum + w.totalCost, 0);
            const maintenanceCost = (completedComponentsTotal + completedWallsTotal) * 0.01 / 52;
            const totalUpkeep = staffCost + maintenanceCost;
            const netIncome = profit - totalUpkeep;
            const previousTreasury = newState.strongholdTreasury || 0;
            newState.strongholdTreasury = previousTreasury + netIncome;
            newLog.push(`Woche ${weekNumber} (Wirtschaft): Nettoeinkommen von ${netIncome.toFixed(2)} GP. Neues Vermögen: ${newState.strongholdTreasury.toFixed(2)} GP.`);
            const currentShopValue = prevState.components.filter(c => c.constructionStatus === 'completed' && c.name.toLowerCase().includes('shop')).reduce((sum, c) => sum + c.baseCost, 0);
            const currentTotalMerchantGold = currentShopValue * 0.25;
            newLog.push(`Woche ${weekNumber} (Wirtschaft): Händlergold wurde auf ${currentTotalMerchantGold.toFixed(2)} GP zurückgesetzt.`);
            newState.merchantGoldSpentThisWeek = 0;

            const attackRoll = Math.random() * 100 + 1;
            if (attackRoll <= currentMaxAttackRoll) {
                let damageGP = 0;
                if (currentGarrisonCR <= 0) { damageGP = currentTV * 2; } else { damageGP = (currentTV * (currentAttackCR / currentGarrisonCR)) / 10; }
                const minDamage = currentTV * 0.01;
                const maxDamage = currentTV * 2;
                damageGP = Math.max(minDamage, Math.min(maxDamage, damageGP));
                newLog.push(`Woche ${weekNumber} (Verteidigung): 🚨 ANGRIFF! Festung erleidet ${damageGP.toFixed(0)} GP Schaden. (Angreifer CR: ${currentAttackCR.toFixed(2)} vs. Garnison CR: ${currentGarrisonCR.toFixed(2)})`);
                newState.totalDamage += damageGP;
            } else {
                newLog.push(`Woche ${weekNumber} (Verteidigung): Kein Angriff (Wurf: ${attackRoll.toFixed(0)} vs. Ziel: ${currentMaxAttackRoll.toFixed(0)}).`);
            }
            newState.simulationLog = newLog;
            return newState;
        });
    }, []);

    const resources = useMemo(() => {
        const capacity: Record<ResourceType, number> = { servantQuarterSpace: 0, barracksSpace: 0, bedroomSpace: 0, suiteSpace: 0, food: 0, diningHallSeat: 0, armorySpace: 0, bath: 0, storage: 0, stallSpace: 0 };
        const demand: Record<ResourceType, number> = { servantQuarterSpace: 0, barracksSpace: 0, bedroomSpace: 0, suiteSpace: 0, food: 0, diningHallSeat: 0, armorySpace: 0, bath: 0, storage: 0, stallSpace: 0 };

        state.components.filter(c => c.constructionStatus === 'completed').forEach(c => {
            let canProvide = !c.jobSlots.length || c.jobSlots.every(slot => slot.filledBy !== null);
            if (canProvide) {
                const { resources: scaledResources } = calculateScaledBenefits(c.name, c.category, c.area);
                for (const [resource, value] of Object.entries(scaledResources)) { capacity[resource as ResourceType] += value; }
            }
        });

        let totalStaffCount = 0;
        state.staff.filter(s => !s.isVolunteer).forEach(s => {
            totalStaffCount += s.quantity;
            if (s.hirelingKey === 'unskilled') { demand.servantQuarterSpace += s.quantity; } 
            else if (s.hirelingKey === 'skilled') { demand.bedroomSpace += s.quantity; } 
            else if (s.cr <= 0.5) { demand.barracksSpace += s.quantity; } 
            else if (s.cr <= 2) { demand.bedroomSpace += s.quantity; } 
            else if (s.cr >= 3) { demand.suiteSpace += s.quantity; }
            if (s.hirelingKey !== 'unskilled' && s.hirelingKey !== 'skilled') { demand.armorySpace += s.quantity; }
        });
        demand.food = totalStaffCount;
        demand.diningHallSeat = totalStaffCount;
        demand.bath = Math.ceil(totalStaffCount / 10);

        return {
            servantQuarterSpace: { capacity: capacity.servantQuarterSpace, demand: demand.servantQuarterSpace }, barracksSpace: { capacity: capacity.barracksSpace, demand: demand.barracksSpace }, bedroomSpace: { capacity: capacity.bedroomSpace, demand: demand.bedroomSpace }, suiteSpace: { capacity: capacity.suiteSpace, demand: demand.suiteSpace }, food: { capacity: capacity.food, demand: demand.food }, diningHallSeat: { capacity: capacity.diningHallSeat, demand: demand.diningHallSeat }, armorySpace: { capacity: capacity.armorySpace, demand: demand.armorySpace }, bath: { capacity: capacity.bath, demand: demand.bath }, storage: { capacity: capacity.storage, demand: 0 }, stallSpace: { capacity: capacity.stallSpace, demand: 0 },
        };
    }, [state.components, state.staff]);

    const getAllPerks = useCallback(() => {
        const staticPerks: Perk[] = [];
        const scaledBonuses: ScaledBonuses = {};
        const activeStaticPerkIds = new Set<string>();

        state.components.filter(c => c.constructionStatus === 'completed').forEach(c => {
            const { perks: scaledPerks } = calculateScaledBenefits(c.name, c.category, c.area);
            scaledPerks.forEach(perk => {
                if (perk.baseBonus && perk.finalBonus) {
                    if (!scaledBonuses[perk.id]) { scaledBonuses[perk.id] = { name: perk.name, description: perk.description, totalBonus: 0 }; }
                    scaledBonuses[perk.id].totalBonus += perk.finalBonus;
                } else if (!activeStaticPerkIds.has(perk.id)) {
                    activeStaticPerkIds.add(perk.id);
                    staticPerks.push(perk);
                }
            });
        });
        return { staticPerks, scaledBonuses };
    }, [state.components]);

  return {
    ...state,
    setSite, addComponent, removeComponent, addWall, removeWall, addStaff, removeStaff, assignStaffToJob, unassignStaffFromJob,
    startNewStronghold, exportSlot, importStronghold, startConstruction, completeConstruction, simulateNextWeek, repairDamage,
    setMerchantGoldSpentThisWeek, depositToTreasury, withdrawFromTreasury,
    saveSlots, activeSaveName, saveCurrentSlot, saveAsNewSlot, loadSlot, deleteSlot, renameSlot, copySlot,
    siteModifier, componentsTotal, wallsTotal, grandTotal, totalArea, staffTotalWeekly, maintenanceWeekly, weeklyUpkeep,
    totalConstructionDays, militaryValue, industrialValue, economicValue, socialValue, totalValue,
    industrialPotential, economicPotential, weeklyProfit, defenseBonus, attackChanceBonus, maxAttackRoll,
    garrisonCR, attackCR, resources, getAllPerks, totalMerchantGold,
  };
};