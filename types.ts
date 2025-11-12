
export type TabId = 'site' | 'rooms' | 'walls' | 'staff' | 'economy' | 'defense' | 'construction' | 'summary';

export type ComponentClassification = 'military' | 'industrial' | 'economic' | 'social';

export type ResourceType = 
    | 'servantQuarterSpace'
    | 'barracksSpace'
    | 'bedroomSpace'
    | 'suiteSpace'
    | 'food'
    | 'diningHallSeat'
    | 'armorySpace'
    | 'bath'
    | 'storage'
    | 'stallSpace';

export interface Perk {
    id: string;
    name: string;
    description: string;
    baseBonus?: number;
}

export interface CalculatedPerk extends Perk {
    finalBonus?: number;
}

export interface ComponentData {
    cost: number;
    ss: number;
    minSize?: { length: number, width: number };
    provides?: Partial<Record<ResourceType, number>>;
    jobs?: { role: string, count: number }[];
    perks?: Perk[];
}

export interface JobSlot {
    id: string;
    role: string;
    filledBy: string | null;
}

export interface Site {
    climate: string;
    settlement: string;
    features: string[];
}

export interface StrongholdComponent {
    id: string;
    name: string;
    category: string;
    classification: ComponentClassification;
    length: number;
    width: number;
    area: number;
    baseCost: number;
    rushPercent: number;
    totalCost: number;
    constructionStatus: 'pending' | 'in_progress' | 'completed';
    startDate?: string;
    jobSlots: JobSlot[];
}

export interface Wall {
    id: string;
    type: string;
    name: string;
    length: number;
    height: number;
    thickness: number;
    baseCost: number;
    rushPercent: number;
    totalCost: number;
    constructionStatus: 'pending' | 'in_progress' | 'completed';
    startDate?: string;
}

export interface Staff {
    id: string;
    hirelingType: string;
    hirelingKey: string;
    customRole: string;
    quantity: number;
    costPerUnit: number;
    totalCost: number;
    cr: number;
    isVolunteer: boolean;
    assignedJobId: string | null;
}

export interface StrongholdState {
    site: Site;
    components: StrongholdComponent[];
    walls: Wall[];
    staff: Staff[];
    simulationLog: string[];
    totalDamage: number;
    merchantGoldSpentThisWeek: number;
    strongholdTreasury: number;
}

export interface ScaledBonuses {
    [perkId: string]: {
        name: string;
        description: string;
        totalBonus: number;
    };
}

export interface SaveSlot {
    name: string;
    lastSaved: string;
    state: StrongholdState;
}

export type SaveSlots = SaveSlot[];

export interface UseStrongholdReturn extends StrongholdState {
    setSite: (newSite: Site) => void;
    addComponent: (component: Omit<StrongholdComponent, 'id' | 'jobSlots'>) => void;
    removeComponent: (id: string) => void;
    addWall: (wall: Omit<Wall, 'id'>) => void;
    removeWall: (id: string) => void;
    addStaff: (staffToAdd: Omit<Staff, 'id' | 'assignedJobId'>) => void;
    removeStaff: (id: string) => void;
    assignStaffToJob: (staffId: string, jobId: string) => void;
    unassignStaffFromJob: (staffId: string) => void;
    startNewStronghold: () => void;
    exportSlot: (name: string) => void;
    importStronghold: (fileContent: string) => void;
    startConstruction: (id: string, type: 'component' | 'wall', startDate: string) => void;
    completeConstruction: (id: string, type: 'component' | 'wall') => void;
    simulateNextWeek: () => void;
    repairDamage: (amount: number) => void;
    setMerchantGoldSpentThisWeek: (amount: number) => void;
    depositToTreasury: (amount: number) => void;
    withdrawFromTreasury: (amount: number) => void;
    saveSlots: SaveSlots;
    activeSaveName: string | null;
    saveCurrentSlot: () => void;
    saveAsNewSlot: (name: string) => boolean;
    loadSlot: (name: string) => void;
    deleteSlot: (name: string) => void;
    renameSlot: (oldName: string, newName: string) => boolean;
    copySlot: (name: string) => void;
    siteModifier: number;
    componentsTotal: number;
    wallsTotal: number;
    grandTotal: number;
    totalArea: number;
    staffTotalWeekly: number;
    maintenanceWeekly: number;
    weeklyUpkeep: number;
    totalConstructionDays: number;
    militaryValue: number;
    industrialValue: number;
    economicValue: number;
    socialValue: number;
    totalValue: number;
    industrialPotential: number;
    economicPotential: number;
    weeklyProfit: number;
    defenseBonus: number;
    attackChanceBonus: number;
    maxAttackRoll: number;
    garrisonCR: number;
    attackCR: number;
    resources: Record<ResourceType, { capacity: number; demand: number }>;
    getAllPerks: () => { staticPerks: Perk[]; scaledBonuses: ScaledBonuses };
    totalMerchantGold: number;
}
