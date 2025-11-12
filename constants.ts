import { ComponentClassification, Perk, ResourceType, TabId, ComponentData } from "./types";

export const TABS: { id: TabId; label: string, icon: string }[] = [
    { id: 'site', label: 'Site Selection', icon: '🏰' },
    { id: 'rooms', label: 'Rooms', icon: '🏠' },
    { id: 'walls', label: 'Walls', icon: '🧱' },
    { id: 'staff', label: 'Staff', icon: '👥' },
    { id: 'economy', label: 'Wirtschaft', icon: '💰' },
    { id: 'defense', label: 'Verteidigung', icon: '🛡️' },
    { id: 'construction', label: 'Construction', icon: '🏗️' },
    { id: 'summary', label: 'Summary', icon: '📊' }
];

export const PERK_LIST: Record<string, Perk> = {
    SMITHING: { id: "SMITHING", name: "Smithing", description: "Enables crafting of all forged items." },
    ALCHEMY: { id: "ALCHEMY", name: "Alchemy", description: "Enables brewing of all potions." },
    SCROLL_Scribing: { id: "SCROLL_Scribing", name: "Scroll Scribing", description: "Enables crafting of all scrolls." },
    TINKERING: { id: "TINKERING", name: "Tinkering", description: "Enables crafting of cloth, leather, wood items, ammo, and adventuring gear." },
    RESEARCH: { id: "RESEARCH", name: "Research Bonus", description: "Grants a bonus to Downtime Activity: Research." },
    INTIMIDATION: { id: "INTIMIDATION", name: "Intimidation Bonus", description: "Grants a bonus to Intimidation skill checks made within the stronghold." },
    EXOTIC_MOUNTS: { id: "EXOTIC_MOUNTS", name: "Exotic Mounts", description: "Enables the purchase and stabling of exotic mounts." },
    FLYING_MOUNTS: { id: "FLYING_MOUNTS", name: "Flying Mounts", description: "Enables the purchase and stabling of flying mounts." },
    SHIPBUILDING: { id: "SHIPBUILDING", name: "Shipbuilding", description: "Enables the construction of water or air vehicles up to the size of the drydock." },
    COMMERCE: { id: "COMMERCE", name: "Commerce", description: "Unlocks buying and selling goods within the stronghold." },
};

export const PERK_EXPLANATIONS: Record<string, string> = {
    SMITHING: "Regeltechnisch: Spieler können die Herstellung von metallischen Waffen, Rüstungen und Werkzeugen an die Fachkraft (Schmied) auslagern. Es gelten die normalen Herstellungsregeln (Zeit- und Kostenaufwand gemäß Spielerhandbuch), als würde ein Spieler den Gegenstand selbst herstellen. Die Arbeit wird lediglich delegiert.",
    ALCHEMY: "Regeltechnisch: Spieler können das Brauen von Tränken und alchemistischen Substanzen an die Fachkraft (Alchemist) auslagern. Es gelten die normalen Herstellungsregeln (Zeit- und Kostenaufwand gemäß Spielerhandbuch), als würde ein Spieler den Gegenstand selbst herstellen. Die Arbeit wird lediglich delegiert.",
    SCROLL_Scribing: "Regeltechnisch: Spieler können die Herstellung von magischen Schriftrollen an die Fachkraft (Schreiber) auslagern. Es gelten die normalen Herstellungsregeln (Zeit- und Kostenaufwand gemäß Spielerhandbuch), als würde ein Spieler den Gegenstand selbst herstellen. Die Arbeit wird lediglich delegiert.",
    TINKERING: "Regeltechnisch: Spieler können die Herstellung von Gegenständen aus Stoff, Leder, Holz sowie Munition und Abenteuerausrüstung an die Fachkraft (Handwerker) auslagern. Es gelten die normalen Herstellungsregeln (Zeit- und Kostenaufwand gemäß Spielerhandbuch), als würde ein Spieler den Gegenstand selbst herstellen. Die Arbeit wird lediglich delegiert.",
    RESEARCH: "Regeltechnisch: Gewährt einen Bonus auf Würfe für die Downtime-Aktivität 'Forschung'. Dieser Bonus ist kumulativ mit anderen Bibliotheken und reduziert die Zeit oder erhöht die Erfolgswahrscheinlichkeit, um spezifische Informationen zu finden.",
    INTIMIDATION: "Regeltechnisch: Gewährt einen Bonus auf Fertigkeitswürfe für Einschüchtern, die innerhalb der Festung gemacht werden (z.B. bei Verhören). Der Bonus ist kumulativ.",
    EXOTIC_MOUNTS: "Regeltechnisch: Schaltet die Möglichkeit frei, exotische (nicht-fliegende) Reittiere zu erwerben und zu zähmen. Die Kosten und Verfügbarkeit werden vom Spielleiter bestimmt.",
    FLYING_MOUNTS: "Regeltechnisch: Schaltet die Möglichkeit frei, flugfähige Reittiere zu erwerben und zu zähmen. Die Kosten und Verfügbarkeit werden vom Spielleiter bestimmt.",
    SHIPBUILDING: "Regeltechnisch: Ermöglicht den Bau von Wasser- oder Luftfahrzeugen bis zur Größe des Trockendocks. Die Baukosten und -zeit folgen den entsprechenden Regeln.",
    COMMERCE: "Regeltechnisch: Spieler können Gegenstände an Händler verkaufen, aber nur bis zum maximal verfügbaren Händlergold. Sie können auch Gegenstände kaufen, deren Einzelwert das Händlergold nicht übersteigt (z.B. bei 100 GP Händlergold können keine Gegenstände über 100 GP gekauft werden). Das Händlergold beträgt 25% des Basiswerts aller fertiggestellten Geschäfte und wird wöchentlich zurückgesetzt."
};

export const RESOURCE_EXPLANATIONS: Record<ResourceType, string> = {
    servantQuarterSpace: "Regeltechnisch: Stellt Unterkünfte für ungelernte Arbeitskräfte (Unskilled Hirelings) bereit. Jeder ungelernte Arbeiter (der kein Freiwilliger ist) benötigt einen Platz.",
    barracksSpace: "Regeltechnisch: Stellt Unterkünfte für niederrangiges militärisches Personal (CR 1/2 oder niedriger) bereit. Jeder Soldat dieser Stufe (der kein Freiwilliger ist) benötigt einen Platz.",
    bedroomSpace: "Regeltechnisch: Stellt Unterkünfte für gelernte Arbeitskräfte (Skilled Hirelings) und erfahrenes Personal (CR 1-2) bereit. Jeder Arbeiter dieser Stufe (der kein Freiwilliger ist) benötigt einen Platz.",
    suiteSpace: "Regeltechnisch: Stellt luxuriöse Unterkünfte für hochrangiges Personal oder Anführer (CR 3 oder höher) bereit. Jede Person dieser Stufe (die kein Freiwilliger ist) benötigt einen Platz.",
    food: "Regeltechnisch: Produziert Nahrung für die Bewohner der Festung. Jedes angestellte Personalmitglied (Hireling), das kein Freiwilliger ist, verbraucht pro Woche eine Einheit Nahrung.",
    diningHallSeat: "Regeltechnisch: Stellt einen Sitzplatz in einem Speisesaal bereit. Jedes angestellte Personalmitglied (das kein Freiwilliger ist) benötigt einen Sitzplatz, um Mahlzeiten einnehmen zu können.",
    armorySpace: "Regeltechnisch: Stellt Platz zur Lagerung von Waffen und Rüstungen bereit. Jedes militärische Personalmitglied (Creature CR, exklusive Freiwillige) benötigt einen Platz in der Waffenkammer.",
    bath: "Regeltechnisch: Stellt sanitäre Einrichtungen bereit. Pro 10 Personalmitglieder (exklusive Freiwillige) wird ein Bad benötigt, um die Hygiene und Moral aufrechtzuerhalten.",
    storage: "Regeltechnisch: Bietet allgemeinen Lagerplatz für Güter, Materialien und Vorräte. Der Wert wird in Pfund (lbs) an Kapazität angegeben.",
    stallSpace: "Regeltechnisch: Stellt einen Platz für ein Reittier oder ein ähnliches Tier bereit. Die Größe bestimmt, welche Art von Tier untergebracht werden kann."
};

export const JOB_EXPLANATION_GENERIC: string = "Regeltechnisch: Diese Position muss mit einer geeigneten Fachkraft (Skilled Hireling) besetzt werden, damit das Gebäude seine Ressourcen und Fähigkeiten vollumfänglich bereitstellen kann.";


export const ALL_PERKS = Object.values(PERK_LIST);

export const COMPONENTS: {
  [category: string]: {
    [name: string]: ComponentData;
  };
} = {
    "Living Quarters": {
        "Bedrooms, basic": { cost: 700, ss: 1, provides: { bedroomSpace: 2 } },
        "Bedrooms, fancy": { cost: 4000, ss: 1, provides: { bedroomSpace: 2 } },
        "Bedrooms, luxury": { cost: 20000, ss: 2, provides: { bedroomSpace: 2 } },
        "Bedroom suite, basic": { cost: 800, ss: 1, provides: { suiteSpace: 1 } },
        "Bedroom suite, fancy": { cost: 5000, ss: 1, provides: { suiteSpace: 1 } },
        "Bedroom suite, luxury": { cost: 25000, ss: 2, provides: { suiteSpace: 1 } },
        "Servants' quarters": { cost: 400, ss: 1, minSize: { length: 30, width: 30 }, provides: { servantQuarterSpace: 8 } },
        "Barracks": { cost: 400, ss: 1, minSize: { length: 30, width: 30 }, provides: { barracksSpace: 8 } },
        "Common area, basic": { cost: 500, ss: 1 },
        "Common area, fancy": { cost: 3000, ss: 1 },
    },
    "Food & Dining": {
        "Kitchen, basic": { cost: 2000, ss: 1, provides: { food: 15 }, jobs: [{ role: 'Cook', count: 1 }] },
        "Kitchen, fancy": { cost: 12000, ss: 1, provides: { food: 15 }, jobs: [{ role: 'Cook', count: 1 }] },
        "Kitchen, luxury": { cost: 50000, ss: 2, provides: { food: 30 }, jobs: [{ role: 'Cook', count: 1 }] },
        "Dining hall, basic": { cost: 2000, ss: 2, provides: { diningHallSeat: 20 } },
        "Dining hall, fancy": { cost: 12000, ss: 2, provides: { diningHallSeat: 20 } },
        "Dining hall, luxury": { cost: 50000, ss: 2, provides: { diningHallSeat: 20 } },
    },
    "Military": {
        "Armory, basic": { cost: 500, ss: 1, provides: { armorySpace: 10 } },
        "Armory, fancy": { cost: 2000, ss: 1, provides: { armorySpace: 20 } },
        "Guard post": { cost: 300, ss: 0.5 },
        "Gatehouse": { cost: 1000, ss: 0.5 },
        "Barbican": { cost: 1000, ss: 1 },
        "Training area, combat": { cost: 1000, ss: 1 },
        "Training area, rogue": { cost: 2000, ss: 1 },
    },
    "Crafting": {
        "Smithy, basic": { cost: 500, ss: 1, jobs: [{ role: 'Smith', count: 1 }], perks: [PERK_LIST.SMITHING] },
        "Smithy, fancy": { cost: 2000, ss: 1, jobs: [{ role: 'Smith', count: 2 }], perks: [PERK_LIST.SMITHING] },
        "Alchemical laboratory, basic": { cost: 700, ss: 1, jobs: [{ role: 'Alchemist', count: 1 }], perks: [PERK_LIST.ALCHEMY] },
        "Alchemical laboratory, fancy": { cost: 3000, ss: 1, jobs: [{ role: 'Alchemist', count: 2 }], perks: [PERK_LIST.ALCHEMY] },
        "Magic laboratory, basic": { cost: 500, ss: 1, jobs: [{ role: 'Inscriber', count: 1 }], perks: [PERK_LIST.SCROLL_Scribing] },
        "Magic laboratory, fancy": { cost: 3000, ss: 1, jobs: [{ role: 'Inscriber', count: 2 }], perks: [PERK_LIST.SCROLL_Scribing] },
        "Workplace, basic": { cost: 500, ss: 1, jobs: [{ role: 'Tinkerer', count: 1 }], perks: [PERK_LIST.TINKERING] },
        "Workplace, fancy": { cost: 2000, ss: 1, jobs: [{ role: 'Tinkerer', count: 2 }], perks: [PERK_LIST.TINKERING] },
    },
    "Utilities": {
        "Bath, basic": { cost: 400, ss: 0.5, provides: { bath: 1 } },
        "Bath, fancy": { cost: 2000, ss: 1, provides: { bath: 1 } },
        "Bath, luxury": { cost: 10000, ss: 2, provides: { bath: 1 } },
        "Storage, basic": { cost: 250, ss: 1, provides: { storage: 500 } },
        "Storage, fancy": { cost: 1000, ss: 1, provides: { storage: 500 } },
        "Storage, luxury": { cost: 3000, ss: 1, provides: { storage: 500 } },
        "Labyrinth": { cost: 500, ss: 1 },
    },
    "Special & Civic": {
        "Library, basic": { cost: 500, ss: 1, perks: [{ ...PERK_LIST.RESEARCH, baseBonus: 1 }] },
        "Library, fancy": { cost: 3000, ss: 1, perks: [{ ...PERK_LIST.RESEARCH, baseBonus: 2 }] },
        "Library, luxury": { cost: 15000, ss: 2, perks: [{ ...PERK_LIST.RESEARCH, baseBonus: 3 }] },
        "Throne room, basic": { cost: 2000, ss: 1 },
        "Throne room, fancy": { cost: 12000, ss: 1 },
        "Throne room, luxury": { cost: 80000, ss: 2 },
        "Courtyard, basic": { cost: 1000, ss: 1 },
        "Courtyard, fancy": { cost: 6000, ss: 1 },
        "Courtyard, luxury": { cost: 30000, ss: 1 },
        "Chapel, basic": { cost: 1000, ss: 1, jobs: [{ role: 'Priest', count: 1 }] },
        "Chapel, fancy": { cost: 6000, ss: 2, jobs: [{ role: 'Priest', count: 1 }] },
        "Chapel, luxury": { cost: 25000, ss: 3, jobs: [{ role: 'Priest', count: 1 }] },
        "Prison cell": { cost: 500, ss: 0.5 },
        "Torture chamber": { cost: 3000, ss: 1, jobs: [{ role: 'Torturer', count: 1 }], perks: [{ ...PERK_LIST.INTIMIDATION, baseBonus: 1 }] },
        "Stable, basic": { cost: 1000, ss: 1, provides: { stallSpace: 4 } },
        "Stable, fancy": { cost: 3000, ss: 1, provides: { stallSpace: 4 }, perks: [PERK_LIST.EXOTIC_MOUNTS] },
        "Stable, luxury": { cost: 9000, ss: 1, provides: { stallSpace: 4 }, perks: [PERK_LIST.FLYING_MOUNTS] },
        "Trophy hall, basic": { cost: 1000, ss: 1 },
        "Trophy hall, fancy (museum)": { cost: 6000, ss: 1 },
        "Auditorium, fancy": { cost: 2000, ss: 1 },
        "Auditorium, luxury": { cost: 10000, ss: 1 },
        "Study/Office, basic": { cost: 200, ss: 0.5 },
        "Study/Office, fancy": { cost: 2500, ss: 1 },
        "Study/Office, luxury": { cost: 15000, ss: 1.5 },
    },
    "Commercial": {
        "Dock, basic": { cost: 500, ss: 1 },
        "Dock, extended": { cost: 3000, ss: 2 },
        "Dock, extended dry": { cost: 15000, ss: 2, perks: [PERK_LIST.SHIPBUILDING] },
        "Shop, basic": { cost: 400, ss: 1, perks: [PERK_LIST.COMMERCE] },
        "Shop, fancy": { cost: 4000, ss: 1, perks: [PERK_LIST.COMMERCE] },
        "Shop, luxury": { cost: 16000, ss: 1, perks: [PERK_LIST.COMMERCE] },
        "Tavern, basic": { cost: 900, ss: 1 },
        "Tavern, fancy": { cost: 4000, ss: 1 },
        "Tavern, luxury": { cost: 20000, ss: 1 },
    }
};

export const COMPONENT_CLASSIFICATIONS: Record<string, ComponentClassification> = {
    // Military
    "Barracks": "military",
    "Armory, basic": "military",
    "Armory, fancy": "military",
    "Guard post": "military",
    "Gatehouse": "military",
    "Barbican": "military",
    "Training area, combat": "military",
    "Training area, rogue": "military",
    "Prison cell": "military",
    "Torture chamber": "military",
    // Industrial
    "Smithy, basic": "industrial",
    "Smithy, fancy": "industrial",
    "Alchemical laboratory, basic": "industrial",
    "Alchemical laboratory, fancy": "industrial",
    "Magic laboratory, basic": "industrial",
    "Magic laboratory, fancy": "industrial",
    "Workplace, basic": "industrial",
    "Workplace, fancy": "industrial",
    "Stable, basic": "industrial",
    "Stable, fancy": "industrial",
    "Stable, luxury": "industrial",
    "Kitchen, basic": "industrial",
    "Kitchen, fancy": "industrial",
    "Kitchen, luxury": "industrial",
    // Economic
    "Shop, basic": "economic",
    "Shop, fancy": "economic",
    "Shop, luxury": "economic",
    "Tavern, basic": "economic",
    "Tavern, fancy": "economic",
    "Tavern, luxury": "economic",
    "Dock, basic": "economic",
    "Dock, extended": "economic",
    "Dock, extended dry": "economic",
    // Social
    "Library, basic": "social",
    "Library, fancy": "social",
    "Library, luxury": "social",
};

export const getClassificationForComponent = (name: string): ComponentClassification => {
    return COMPONENT_CLASSIFICATIONS[name] || 'social';
};


// Costs are per week
export const HIRELING_DATA: Record<string, { name: string, cost: number, cr: number }> = {
    'unskilled': { name: 'Unskilled Hireling', cost: 1.5, cr: 0.125 }, // 6gp/month -> 1.5gp/week
    'skilled': { name: 'Skilled Hireling', cost: 15, cr: 0.25 }, // 60gp/month -> 15gp/week
    'cr_1_8': { name: 'CR 1/8 Creature', cost: 15, cr: 0.125 },
    'cr_1_4': { name: 'CR 1/4 Creature', cost: 30, cr: 0.25 },
    'cr_1_2': { name: 'CR 1/2 Creature', cost: 60, cr: 0.5 },
    'cr_1': { name: 'CR 1 Creature', cost: 120, cr: 1 },
    'cr_2': { name: 'CR 2 Creature', cost: 240, cr: 2 },
    'cr_3': { name: 'CR 3 Creature', cost: 360, cr: 3 },
    'cr_4': { name: 'CR 4 Creature', cost: 480, cr: 4 },
    'cr_5': { name: 'CR 5 Creature', cost: 600, cr: 5 },
    'cr_6': { name: 'CR 6 Creature', cost: 720, cr: 6 },
    'cr_7': { name: 'CR 7 Creature', cost: 840, cr: 7 },
    'cr_8': { name: 'CR 8 Creature', cost: 960, cr: 8 },
    'cr_9': { name: 'CR 9 Creature', cost: 1080, cr: 9 },
    'cr_10': { name: 'CR 10 Creature', cost: 1200, cr: 10 },
    'cr_11': { name: 'CR 11 Creature', cost: 1320, cr: 11 },
    'cr_12': { name: 'CR 12 Creature', cost: 1440, cr: 12 },
    'cr_13': { name: 'CR 13 Creature', cost: 1560, cr: 13 },
    'cr_14': { name: 'CR 14 Creature', cost: 1680, cr: 14 },
    'cr_15': { name: 'CR 15 Creature', cost: 1800, cr: 15 },
    'cr_16': { name: 'CR 16 Creature', cost: 1920, cr: 16 },
    'cr_17': { name: 'CR 17 Creature', cost: 2040, cr: 17 },
    'cr_18': { name: 'CR 18 Creature', cost: 2160, cr: 18 },
    'cr_19': { name: 'CR 19 Creature', cost: 2280, cr: 19 },
    'cr_20': { name: 'CR 20 Creature', cost: 2400, cr: 20 },
};


export const SITE_MODIFIERS = {
    climate: { cold: 5, temperate: 0, warm: -5, aquatic: 15, desert: 10, forest: 0, hill: -5, marsh: 10, mountains: 0, plains: -5, underground: 10, exotic: 15, mobile: -5 },
    settlement: { smallTown_under1: 0, smallTown_1to16: 2, smallTown_17to48: 4, smallTown_49to112: 7, smallTown_113plus: 10, largeTown_under1: 2, largeTown_1to16: 0, largeTown_17to48: 2, largeTown_49to112: 4, largeTown_113plus: 7, smallCity_under1: 3, smallCity_1to16: 1, smallCity_17to48: -2, smallCity_49to112: 1, smallCity_113plus: 6, largeCity_under1: 6, largeCity_1to16: 3, largeCity_17to48: 1, largeCity_49to112: -1, largeCity_113plus: 5, metropolis_under1: 10, metropolis_1to16: 7, metropolis_17to48: 5, metropolis_49to112: 0, metropolis_113plus: 4 },
    features: { impede: 2, prohibit: 4, easier: -2, dispute: -5, lawless: -10, income: 10, potential: 5, hidden: 5 }
};

export const WALL_COSTS: Record<string, number> = {
    glass: 0.05,
    crystal: 0.06,
    ice: 0.075,
    wood: 0.125,
    bone: 0.2,
    stone: 0.25,
    iron: 0.625,
    steel: 1.25,
    mithral: 2.5,
    adamantine: 6.25,
};

export const WALL_DURABILITY: Record<string, { hp: number, ac: number, damageThreshold: number }> = {
    glass: { hp: 5, ac: 12, damageThreshold: 0 },
    crystal: { hp: 10, ac: 13, damageThreshold: 0 },
    ice: { hp: 20, ac: 14, damageThreshold: 0 },
    wood: { hp: 25, ac: 15, damageThreshold: 0 },
    bone: { hp: 35, ac: 16, damageThreshold: 10 },
    stone: { hp: 45, ac: 17, damageThreshold: 18 },
    iron: { hp: 60, ac: 18, damageThreshold: 20 },
    steel: { hp: 75, ac: 19, damageThreshold: 22 },
    mithral: { hp: 85, ac: 21, damageThreshold: 25 },
    adamantine: { hp: 120, ac: 23, damageThreshold: 30 },
};

export const ROOM_DESCRIPTIONS: Record<string, Record<string, string>> = {
    "Living Quarters": {
        "Bedrooms, basic": "Zwei einfache, aber funktionale Schlafkammern. Jede enthält ein Bett mit Strohmatratze auf einem niedrigen Holzrahmen, eine Kommode und einen einfachen Spiegel. Raue Bänke und kleine Tische vervollständigen die spärliche Einrichtung.",
        "Bedrooms, fancy": "Zwei geschmackvoll eingerichtete Schlafgemächer mit Holzböden und hochwertigen Möbeln. Jedes Zimmer verfügt über ein bequemes Bett mit Baumwollmatratze, einen fein gearbeiteten Schreibtisch und einen Kleiderschrank.",
        "Bedrooms, luxury": "Zwei opulente Suiten, ausgestattet mit feinsten Himmelbetten, Seidenlaken und Daunendecken. Polierte Marmorböden, kunstvolle Wandteppiche und vergoldete Möbelstücke zeugen von unermesslichem Reichtum.",
        "Bedroom suite, basic": "Eine geräumige Suite mit angeschlossenem Ankleideraum und einer einfachen Latrine. Die Einrichtung ist rustikal und robust, mit einem breiten Bett, Kommoden und einer kleinen Sitzecke.",
        "Bedroom suite, fancy": "Eine elegante Suite mit begehbarem Kleiderschrank und geschmackvoll verziertem Privat-WC. Das Bett ruht auf einem kunstvoll geschnitzten Rahmen, und gepolsterte Sitzmöbel laden zum Verweilen ein.",
        "Bedroom suite, luxury": "Eine palastartige Suite, die keine Wünsche offenlässt. Ein Himmelbett mit Seidenvorhängen dominiert den Raum, ergänzt durch Möbel mit Marmorplatten, einen privaten Kamin und Kunstwerke von unschätzbarem Wert.",
        "Servants' quarters": "Ein einfacher, gemeinschaftlicher Wohnbereich für das Personal. Dünne Wände trennen kleine Nischen ab, die jeweils Platz für ein Bett, eine Kommode und einen Stuhl bieten und ein Minimum an Privatsphäre gewährleisten.",
        "Barracks": "Ein offener Schlafsaal für die Garnison, ausgestattet mit robusten Etagenbetten aus Holz und persönlichen Truhen. Der Geruch von Leder, Waffenöl und hart arbeitenden Soldaten liegt in der Luft.",
        "Common area, basic": "Ein schlichter, vielseitig nutzbarer Raum mit kahlen Wänden und einfachen Holzbänken. Er dient als Wartebereich oder Treffpunkt und ist meist von geschäftigem Treiben erfüllt.",
        "Common area, fancy": "Ein repräsentativer Gemeinschaftsbereich mit polierten Holzböden, bequemen Sitzgelegenheiten und eindrucksvollen Wandgemälden. Schallschluckende Vorhänge sorgen für eine angenehme Akustik.",
    },
    "Food & Dining": {
        "Kitchen, basic": "Eine zweckmäßige Küche mit einer großen Feuerstelle oder einem einfachen Herd als Zentrum. Töpfe und Pfannen hängen an Haken, und eine angegliederte Speisekammer lagert die grundlegenden Vorräte.",
        "Kitchen, fancy": "Eine gut ausgestattete Küche mit einem eisernen Herd, gusseisernem Kochgeschirr und Fliesenboden. Die Speisekammer ist stets gut gefüllt mit hochwertigen Zutaten für anspruchsvolle Gerichte.",
        "Kitchen, luxury": "Eine hochmoderne Großküche mit mehreren Herden, einem offenen Bratfeuer und Arbeitsflächen aus Marmor. Kupfernes Kochgeschirr glänzt im Licht, bereit, Festmahle für Könige zuzubereiten.",
        "Dining hall, basic": "Eine große Halle, dominiert von langen, groben Holztischen und Bänken. Jagdtrophäen und Waffen schmücken die Wände und verleihen dem Raum eine rustikale, wehrhafte Atmosphäre.",
        "Dining hall, fancy": "Ein eleganter Speisesaal mit fein gearbeiteten Tischen und Stühlen. Ein zentraler Kamin sorgt für Wärme, während Wandmalereien von lokalen Legenden oder Heldentaten erzählen.",
        "Dining hall, luxury": "Ein prunkvoller Bankettsaal mit einer langen Tafel aus poliertem Mahagoni oder Marmor. Silberbesteck, Kristallgläser und feinstes Porzellan stehen bereit, während ein prächtiger Kronleuchter den Raum in goldenes Licht taucht.",
    },
    "Military": {
        "Armory, basic": "Ein einfacher, funktionaler Raum, gefüllt mit Gestellen für Rüstungen und Waffen. Der Geruch von geschärftem Stahl und Lederpolitur hängt in der Luft und bereitet auf die Verteidigung der Festung vor.",
        "Armory, fancy": "Eine repräsentative Waffenkammer, deren Wände mit heroischen Schlachtgemälden geschmückt sind. Die Waffen und Rüstungen sind nicht nur funktional, sondern auch kunstvoll ausgestellt.",
        "Guard post": "Ein kleiner, befestigter Raum mit Schießscharten, der einen strategischen Blick auf die Umgebung bietet. Hier halten die Wachen Ausschau nach Bedrohungen.",
        "Gatehouse": "Das Herzstück der äußeren Verteidigung. Ein massives Tor, oft durch ein Fallgitter verstärkt, kontrolliert den Zugang zur Festung.",
        "Barbican": "Ein vorgelagertes Verteidigungswerk, das das Haupttor zusätzlich schützt. Von hier aus können Angreifer durch 'Mörderlöcher' im Boden bekämpft werden, die sich in einer Engstelle befinden.",
        "Training area, combat": "Ein offener Platz, ausgestattet mit Trainingspuppen, Zielscheiben und Holzwaffen. Hier hallt das Klirren von Stahl und das Rufen der Ausbilder wider, während die Garnison für den Kampf probt.",
        "Training area, rogue": "Ein Raum voller Übungsschlösser, Fallenattrappen und schattiger Ecken. Hier perfektionieren Schurken ihre Fähigkeiten in Diebeskunst, Schleichen und Fallenentschärfung.",
    },
    "Crafting": {
        "Smithy, basic": "Der Lärm von Hammerschlägen auf Metall erfüllt diesen Raum. Eine einfache Schmiede mit Amboss, Esse und einem Wasserfass zum Abschrecken des glühenden Stahls bildet das Zentrum des Handwerks.",
        "Smithy, fancy": "Eine erstklassige Schmiede mit poliertem Steinboden und einer marmorverkleideten Esse. Hochwertige Werkzeuge ermöglichen die Herstellung von meisterhaften Waffen und Rüstungen.",
        "Alchemical laboratory, basic": "Ein Raum voller seltsamer Gerüche und blubbernder Flüssigkeiten. Regale sind beladen mit Kolben, Bechern und Tiegeln. Ein Kamin sorgt für die nötige Hitze für alchemistische Experimente.",
        "Alchemical laboratory, fancy": "Ein fortschrittliches Labor mit Kreidetafeln für komplexe Formeln und einem Notfallsystem zum Löschen von Unfällen. Mehrere Arbeitsplätze ermöglichen gleichzeitiges Experimentieren.",
        "Magic laboratory, basic": "Ein einfaches Labor für magische Studien mit einem Schreibtisch, einer kleinen Bibliothek mystischer Texte und einem Arbeitstisch für Experimente. Der Geruch von altem Pergament und magischen Reagenzien liegt in der Luft.",
        "Magic laboratory, fancy": "Ein gut ausgestattetes magisches Labor mit allen nötigen Werkzeugen für komplexe Zauberforschung. Kreidetafeln an den Wänden sind mit arkanen Symbolen und Formeln bedeckt.",
        "Workplace, basic": "Eine einfache Werkstatt, die auf ein bestimmtes Handwerk wie Schreinerei, Schneiderei oder Brauerei spezialisiert ist. Sie ist mit den grundlegenden Werkzeugen für diese Profession ausgestattet.",
        "Workplace, fancy": "Eine meisterlich ausgestattete Werkstatt mit feinsten Werkzeugen, die präzise und kunstvolle Arbeiten ermöglichen. Die Qualität der hier hergestellten Waren ist weithin bekannt.",
    },
    "Utilities": {
        "Bath, basic": "Ein einfacher Raum mit einer hölzernen oder metallenen Wanne und einigen Bänken. Dient der grundlegenden Hygiene der Festungsbewohner.",
        "Bath, fancy": "Ein komfortables Badezimmer mit einer großen Wanne, einem Kamin zum Heizen des Wassers und gepolsterten Sitzbänken. Ein Schrank hält stets frische Handtücher bereit.",
        "Bath, luxury": "Ein opulentes Badehaus mit einer Wanne für mehrere Personen, Marmorböden und kunstvollen Armaturen. Hier wird das Baden zu einem luxuriösen Ritual der Entspannung.",
        "Storage, basic": "Ein leerer Raum mit rohen Wänden und unfertigem Boden, der zur Lagerung von Gütern und Vorräten dient. Es riecht oft nach Staub und gelagerten Waren.",
        "Storage, fancy": "Ein gut organisierter Lagerraum mit Regalen und einem fertigen Boden, der eine effiziente Nutzung des Platzes ermöglicht und die Waren vor Feuchtigkeit schützt.",
        "Storage, luxury": "Ein klimatisiertes und sicheres Lager mit hochwertigen Schränken. Ein Verwalter kümmert sich um die Inventarisierung, während man bequem in einem Sessel auf die Ausgabe der Waren wartet.",
        "Labyrinth": "Ein verwirrender Irrgarten aus Gängen und Sackgassen, der dazu dient, Eindringlinge zu verwirren, zu trennen und in die Falle zu locken. Oft in Verliesen zu finden.",
    },
    "Special & Civic": {
        "Library, basic": "Ein Raum, gefüllt mit dem Duft von altem Papier und gebundenem Leder. Einfache Holzregale beherbergen eine bescheidene Sammlung von Büchern zu verschiedenen Themen.",
        "Library, fancy": "Eine beeindruckende Bibliothek mit deckenhohen, polierten Regalen. Leitern auf Schienen ermöglichen den Zugang zu Tausenden von Bänden, während Lesetische zum Studieren einladen.",
        "Library, luxury": "Ein Archiv des Wissens mit verglasten Schränken zum Schutz wertvoller Folianten. Ein Bibliothekar pflegt einen umfassenden Katalog, und private Studienkabinen bieten ungestörte Forschung.",
        "Throne room, basic": "Ein respektabler, aber schlichter Thronsaal. Farbenfrohe Wandteppiche und ein erhöhter Thron verleihen dem Herrscher Autorität, ohne zu protzen.",
        "Throne room, fancy": "Ein kunstvoller Saal mit Wandgemälden und einem polierten Thron aus Stein oder Eisen auf einem Podest. Die Akustik und das Design unterstreichen die Macht des Herrschers.",
        "Throne room, luxury": "Ein grandioser Thronsaal, der Reichtum und absolute Macht demonstriert. Ein mit Juwelen besetzter Thron thront auf einer Marmortreppe und blickt über einen mit edlen Teppichen ausgelegten Saal.",
        "Courtyard, basic": "Ein offener, gekiester oder grasbewachsener Innenhof, der als zentraler Treffpunkt und Arbeitsbereich dient. Einige einfache Bänke bieten eine Rastmöglichkeit.",
        "Courtyard, fancy": "Ein gepflegter Innenhof mit gepflasterten Wegen, schmiedeeisernen Bänken und einem einfachen Brunnen in der Mitte. Büsten und kleine Statuen schmücken die Anlage.",
        "Courtyard, luxury": "Ein atemberaubender Gartenhof mit glatten Steinplatten, einem kunstvollen Springbrunnen als Herzstück und meisterhaften Statuen. Ein gläsernes Dach kann bei Bedarf geschlossen werden.",
        "Chapel, basic": "Ein schlichter Raum, der der Anbetung gewidmet ist. Ein einfacher Altar, grobe Bänke und ein Symbol der verehrten Gottheit bilden das spirituelle Zentrum der Festung.",
        "Chapel, fancy": "Eine größere Kapelle mit einem polierten Steinaltar, verzierten Kirchenbänken und Buntglasfenstern, die biblische oder heroische Szenen darstellen.",
        "Chapel, luxury": "Eine prächtige Kathedrale im Kleinen, mit einem juwelenbesetzten Altar, vergoldeten Bänken und großen, kunstvollen Buntglasfenstern, die den Raum in farbiges Licht tauchen.",
        "Prison cell": "Eine karge Zelle mit Eisenfesseln an den Wänden und Strohmatratzen auf dem Boden. Kann als Gemeinschaftszelle oder in mehrere Einzelzellen unterteilt werden.",
        "Torture chamber": "Ein finsterer Raum, gefüllt mit den schrecklichsten Instrumenten, um Schmerz zuzufügen und Informationen zu erpressen. Der Geruch von Angst und kaltem Eisen erfüllt die Luft.",
        "Stable, basic": "Ein einfacher Holzstall mit Boxen für bis zu sechs Reittiere. Der Boden ist mit Stroh bedeckt, und der Geruch von Heu und Tieren ist allgegenwärtig.",
        "Stable, fancy": "Ein sauberer Stall mit Steinboden, frischem Heu in den Boxen und eigenen Wassertrögen. Ein kleiner Kamin sorgt im Winter für Wärme.",
        "Stable, luxury": "Ein palastartiger Stall mit polierten Böden und kunstvollen Holzarbeiten. Jedes Tier hat eine luxuriöse Box, und die Sättel ruhen auf eigenen Podesten. Der Stall ist makellos sauber.",
        "Trophy hall, basic": "Ein Raum, um Trophäen und Erinnerungsstücke von Abenteuern und Schlachten auszustellen. Die Wände sind mit den Köpfen besiegter Monster und erbeuteten Waffen geschmückt.",
        "Trophy hall, fancy (museum)": "Eher ein Museum als ein Trophäenraum. Wertvolle Stücke werden in Vitrinen ausgestellt, versehen mit Gravuren, die ihre Geschichte erzählen. Eine Wache schützt die Exponate.",
        "Auditorium, fancy": "Ein Raum, der speziell für künstlerische Darbietungen konzipiert wurde. Die Akustik ist hervorragend, und eine Bühne bietet Platz für Musiker, Barden oder Schauspieler.",
        "Auditorium, luxury": "Ein opulenter Theatersaal mit plüschgepolsterten Sitzen und einer verstellbaren Bühne. Hier finden die exklusivsten Aufführungen für die Elite statt.",
        "Study/Office, basic": "Ein kleines, funktionales Büro mit einem Schreibtisch, einigen Regalen und einem Stuhl. Hier werden die alltäglichen Verwaltungsaufgaben der Festung erledigt.",
        "Study/Office, fancy": "Ein repräsentatives Arbeitszimmer mit hochwertigen Möbeln und gepolsterten Stühlen für Besucher. Der ideale Ort für wichtige Besprechungen.",
        "Study/Office, luxury": "Ein luxuriöses Büro mit einem separaten Wartezimmer für Besucher. Ein massiver Schreibtisch, bequeme Sofas und wertvolle Kunstwerke schaffen eine Atmosphäre von Macht und Einfluss.",
    },
    "Commercial": {
        "Dock, basic": "Ein einfacher Holzsteg, der es kleinen Schiffen wie Flößen und Ruderbooten erlaubt, an der Festung anzulegen, um Personen oder Fracht zu laden und zu löschen.",
        "Dock, extended": "Ein größerer, stabilerer Dock, der auch große Schiffe wie Galeeren oder Kriegsschiffe aufnehmen kann. Hier herrscht oft reges Treiben von Seeleuten und Händlern.",
        "Dock, extended dry": "Ein Trockendock mit Kränen und Hebevorrichtungen. Ermöglicht nicht nur das schnelle Entladen von Fracht, sondern auch die Reparatur und sogar den Bau neuer Schiffe.",
        "Shop, basic": "Ein kleiner, einfacher Laden mit groben Holzregalen und einer Verkaufstheke. Bietet den Bewohnern und Besuchern der Festung die Möglichkeit, grundlegende Waren zu handeln.",
        "Shop, fancy": "Ein ansprechendes Geschäft mit einem großen Schaufenster, polierten Holzböden und Glasvitrinen. Hier werden hochwertigere Waren in einem einladenden Ambiente angeboten.",
        "Shop, luxury": "Ein exklusives Geschäft mit Marmorböden und maßgefertigten, verschlossenen Vitrinen. Kunden werden mit edlen Weinen bewirtet, während sie die feinsten und teuersten Waren begutachten.",
        "Tavern, basic": "Eine einfache Schänke mit groben Tischen und einem knisternden Kamin. Hier treffen sich die einfachen Leute der Festung auf ein Bier und eine warme Mahlzeit.",
        "Tavern, fancy": "Ein gehobenes Gasthaus mit einer polierten Bar, bequemen Stühlen und einer Auswahl an Weinen. Der ideale Ort für Reisende und wohlhabendere Bewohner.",
        "Tavern, luxury": "Eine atemberaubende 'Bibliothek der Spirituosen', die nur die feinsten Getränke und Gourmet-Mahlzeiten anbietet. Hier verkehren Adlige und reiche Kaufleute in einem exklusiven Ambiente.",
    }
};

export const MATERIAL_DESCRIPTIONS: Record<string, string> = {
    glass: "Magisch verstärktes Glas, das überraschend widerstandsfähig ist. Ideal für Observatorien oder Gewächshäuser, wo Licht einfallen soll, aber dennoch ein gewisser Schutz erforderlich ist. Anfällig für erschütternden Schaden.",
    crystal: "Gehärteter Kristall, durchdrungen von Erdmagie, der ihm eine unerwartete Zähigkeit verleiht. Bricht das Licht in faszinierenden Mustern.",
    ice: "Eine Mauer aus massivem Eis, magisch geformt und errichtet. Bietet schnellen, aber vergänglichen Schutz, da sie bei Temperaturen über dem Gefrierpunkt schmilzt. Anfällig für brachiale Gewalt und Feuer.",
    wood: "Robuste Palisaden aus behandeltem Hartholz. Eine schnelle und günstige Methode zur Befestigung, die jedoch anfällig für Feuer ist.",
    bone: "Eine makabre, aber erstaunlich stabile Mauer aus den Knochen riesiger Bestien, die mit einem alchemistischen Harz verfestigt wurden. Bietet einen guten Kompromiss zwischen Kosten und Haltbarkeit.",
    stone: "Der Standard im Festungsbau. Zuverlässige, einfache Steinmauern, die soliden Schutz gegen die meisten konventionellen Angriffe bieten. Günstig und überall verfügbar.",
    iron: "Mit Eisenplatten verstärkte Mauern. Bieten signifikant höheren Schutz gegen physische Angriffe und Belagerungswaffen, sind aber teuer in der Errichtung und Instandhaltung.",
    steel: "Polierte Stahlmauern, das Zeichen einer wohlhabenden und gut verteidigten Festung. Fast undurchdringlich für nicht-magische Waffen und ein beeindruckender Anblick für Freund und Feind.",
    mithral: "Leicht wie eine Feder, aber hart wie Drachenschuppen. Mauern aus Mithral sind unglaublich widerstandsfähig gegen physische und magische Angriffe und wiegen nur die Hälfte von Stahlmauern.",
    adamantine: "Das legendärste aller Metalle. Eine Mauer aus Adamant ist praktisch unzerstörbar und immun gegen kritische Treffer. Der Bau einer solchen Mauer ist ein Unterfangen, das Generationen und ganze Königreiche in Anspruch nehmen kann."
};

export const CLIMATE_DESCRIPTIONS: Record<string, string> = {
    cold: "Erhöht die Baukosten um 5%. Kalte Umgebungen erfordern robustere Bauweisen, erschweren die Arbeit im Freien und können die Verfügbarkeit bestimmter Materialien einschränken.",
    temperate: "Kein Kostenmodifikator. Gemäßigte Zonen bieten ideale Baubedingungen und gelten als Standard für die Kostenkalkulation.",
    warm: "Senkt die Baukosten um 5%. Längere Arbeitstage und geringere Anforderungen an die Isolierung machen das Bauen in warmen Klimazonen günstiger.",
    aquatic: "Erhöht die Baukosten um 15%. Bauen auf oder unter Wasser ist extrem komplex und erfordert spezielle Materialien, magische Versiegelungen und Fachkräfte.",
    desert: "Erhöht die Baukosten um 10%. Wassermangel, extreme Temperaturen und die Schwierigkeit, Baumaterial zu beschaffen, treiben die Kosten in der Wüste in die Höhe.",
    forest: "Kein Kostenmodifikator. Wälder bieten in der Regel reichlich Baumaterial (Holz), was die Kosten ausgleicht, obwohl das Roden des Geländes Aufwand erfordert.",
    hill: "Senkt die Baukosten um 5%. Hügel bieten oft eine gute natürliche Verteidigung und leichten Zugang zu Stein, was die Baukosten reduzieren kann.",
    marsh: "Erhöht die Baukosten um 10%. Der instabile Untergrund in Sümpfen erfordert aufwendige Fundamente, und die hohe Luftfeuchtigkeit kann Materialien angreifen.",
    mountains: "Kein Kostenmodifikator. Berge bieten exzellente Verteidigung und Zugang zu Stein, aber die Logistik in großer Höhe und auf schwierigem Terrain gleicht diese Vorteile aus.",
    plains: "Senkt die Baukosten um 5%. Weite Ebenen erleichtern den Transport von Material und den Einsatz von schwerem Gerät, was den Bauprozess beschleunigt und verbilligt.",
    underground: "Erhöht die Baukosten um 10%. Unterirdisches Bauen ist aufwendig, erfordert ständige Abstützung und Belüftung, bietet aber unübertroffenen Schutz.",
    exotic: "Erhöht die Baukosten um 15%. Exotische oder außerplanare Orte stellen unvorhersehbare Herausforderungen dar, von seltsamer Schwerkraft bis hin zu feindseliger Flora und Fauna.",
    mobile: "Senkt die Baukosten um 5%. Eine mobile Festung (z.B. auf dem Rücken einer gigantischen Kreatur) hat geringere Gründungskosten, was den Gesamtpreis leicht senkt.",
};

export const FEATURE_DESCRIPTIONS: Record<string, string> = {
    impede: "Erhöht die Kosten um 2%. Das Gelände (z.B. dichter Dschungel oder schroffe Felsen) behindert den Transport von Material und Arbeitern.",
    prohibit: "Erhöht die Kosten um 4%. Lokale Gegebenheiten (z.B. magische Zonen oder heilige Stätten) verbieten bestimmte Bauweisen, was teure Alternativen erfordert.",
    easier: "Senkt die Kosten um 2%. Das Gelände ist besonders gut für den Bau geeignet, z.B. durch einen vorhandenen Steinbruch oder einen magisch stabilisierten Untergrund.",
    dispute: "Senkt die Kosten um 5%. Das Land ist umstritten, was zwar gefährlich ist, aber die Grundstückskosten und Steuern drastisch senkt.",
    lawless: "Senkt die Kosten um 10%. In gesetzlosen Gebieten gibt es keine Vorschriften, Steuern oder Zölle, was das Baumaterial erheblich verbilligt. Die Sicherheit ist jedoch ein ständiges Problem.",
    income: "Erhöht die Kosten um 10%. Der Standort befindet sich an einer wertvollen Ressource (z.B. Mine, Handelsroute), was die Grundstückspreise und den Bauaufwand erhöht, aber zukünftiges Einkommen verspricht.",
    potential: "Erhöht die Kosten um 5%. Der Ort hat ungenutztes Potenzial, z.B. einen Zugang zu einem unentdeckten Höhlensystem, dessen Erschließung im Voraus kostet.",
    hidden: "Erhöht die Kosten um 5%. Die Festung soll verborgen bleiben, was zusätzliche Tarnmaßnahmen und aufwendigere Logistik erfordert, um keine Spuren zu hinterlassen.",
};

export const getSettlementLabel = (key: string): string => {
    const parts = key.split('_');
    const settlementType: Record<string, string> = {
        smallTown: "Small Town",
        largeTown: "Large Town",
        smallCity: "Small City",
        largeCity: "Large City",
        metropolis: "Metropolis"
    };
    const distance: Record<string, string> = {
        under1: "< 1 mile",
        '1to16': "1-16 miles",
        '17to48': "17-48 miles",
        '49to112': "49-112 miles",
        '113plus': "> 113 miles"
    };
    return `${settlementType[parts[0]] || key} (${distance[parts[1]] || 'away'})`;
};