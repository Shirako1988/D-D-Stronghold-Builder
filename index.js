import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import ReactDOM from 'react-dom/client';

// --- From constants.ts ---
const TABS = [
    { id: 'site', label: 'Site Selection', icon: '🏰' },
    { id: 'rooms', label: 'Rooms', icon: '🏠' },
    { id: 'walls', label: 'Walls', icon: '🧱' },
    { id: 'staff', label: 'Staff', icon: '👥' },
    { id: 'social', label: 'Soziales', icon: '🤝' },
    { id: 'economy', label: 'Wirtschaft', icon: '💰' },
    { id: 'defense', label: 'Verteidigung', icon: '🛡️' },
    { id: 'construction', label: 'Construction', icon: '🏗️' },
    { id: 'summary', label: 'Summary', icon: '📊' }
];
const PERK_LIST = {
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
const PERK_EXPLANATIONS = {
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
const RESOURCE_EXPLANATIONS = {
    servantQuarterSpace: "Regeltechnisch: Stellt Unterkünfte für ungelernte Arbeitskräfte (Unskilled Hirelings) bereit. Jeder ungelernte Arbeiter (der kein Freiwilliger ist) benötigt einen Platz.",
    barracksSpace: "Regeltechnisch: Stellt Unterkünfte für niederrangiges militärisches Personal (CR 1/2 oder niedriger) bereit. Jeder Soldat dieser Stufe (der kein Freiwilliger ist) benötigt einen Platz.",
    bedroomSpace: "Regeltechnisch: Stellt Unterkünfte für gelernte Arbeitskräfte (Skilled Hirelings) und erfahrenes Personal (CR 1-2) bereit. Jeder Arbeiter dieser Stufe (der kein Freiwilliger ist) benötigt einen Platz.",
    suiteSpace: "Regeltechnisch: Stellt luxuriöse Unterkünfte für hochrangiges Personal oder Anführer (CR 3 oder höher) bereit. Jede Person dieser Stufe (die kein Freiwilliger ist) benötigt einen Platz.",
    food: "Regeltechnisch: Produziert Nahrung für die Bewohner der Festung. Jedes angestellte Personalmitglied (Hireling), inklusive Freiwillige, verbraucht pro Woche eine Einheit Nahrung. Die Basis-Nahrung (5) repräsentiert Rationen und Futtersuche.",
    diningHallSeat: "Regeltechnisch: Stellt einen Sitzplatz in einem Speisesaal bereit. Jedes bezahlte Personalmitglied benötigt einen Sitzplatz. Freiwillige essen im Stehen oder wo Platz ist.",
    armorySpace: "Regeltechnisch: Stellt Platz zur Lagerung von Waffen und Rüstungen bereit. Jedes militärische Personalmitglied (Creature CR, exklusive Freiwillige) benötigt einen Platz in der Waffenkammer.",
    bath: "Regeltechnisch: Stellt sanitäre Einrichtungen bereit. Pro 10 Personalmitglieder (exklusive Freiwillige) wird ein Bad benötigt, um die Hygiene und Moral aufrechtzuerhalten.",
    storage: "Regeltechnisch: Bietet allgemeinen Lagerplatz für Güter, Materialien und Vorräte. Der Wert wird in Pfund (lbs) an Kapazität angegeben.",
    stallSpace: "Regeltechnisch: Stellt einen Platz für ein Reittier bereit. Medium Reittiere (Pferde) brauchen 1 Platz, Large (Greifen) 4 Plätze, Huge (Elefanten) 9 Plätze. Benötigt einen Stallmeister. Ein Stallmeister versorgt bis zu 4 Plätze."
};
const JOB_EXPLANATION_GENERIC = "Regeltechnisch: Diese Position muss mit einer geeigneten Fachkraft (Skilled Hireling) besetzt werden, damit das Gebäude seine Ressourcen und Fähigkeiten vollumfänglich bereitstellen kann.";
const ALL_PERKS = Object.values(PERK_LIST);
const COMPONENTS = {
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
        "Stable, basic": { cost: 1000, ss: 1, provides: { stallSpace: 4 }, jobs: [{ role: 'Stablemaster', count: 1 }] },
        "Stable, fancy": { cost: 3000, ss: 1, provides: { stallSpace: 4 }, jobs: [{ role: 'Stablemaster', count: 1 }], perks: [PERK_LIST.EXOTIC_MOUNTS] },
        "Stable, luxury": { cost: 9000, ss: 1, provides: { stallSpace: 4 }, jobs: [{ role: 'Stablemaster', count: 1 }], perks: [PERK_LIST.FLYING_MOUNTS] },
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
        "Shop, basic": { cost: 400, ss: 1, perks: [PERK_LIST.COMMERCE], jobs: [{ role: 'Merchant', count: 1 }] },
        "Shop, fancy": { cost: 4000, ss: 1, perks: [PERK_LIST.COMMERCE], jobs: [{ role: 'Merchant', count: 2 }] },
        "Shop, luxury": { cost: 16000, ss: 1, perks: [PERK_LIST.COMMERCE], jobs: [{ role: 'Merchant', count: 4 }] },
        "Tavern, basic": { cost: 900, ss: 1 },
        "Tavern, fancy": { cost: 4000, ss: 1 },
        "Tavern, luxury": { cost: 20000, ss: 1 },
    }
};
const COMPONENT_CLASSIFICATIONS = {
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
const getClassificationForComponent = (name) => {
    return COMPONENT_CLASSIFICATIONS[name] || 'social';
};
const HIRELING_DATA = {
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
const MOUNT_DATA = {
    'mount_medium': { name: 'Mount (Medium)', size: 1, cost: 1.4, type: 'basic' }, // 2sp/day
    'mount_large': { name: 'Mount (Large)', size: 4, cost: 5.6, type: 'basic' }, // 8sp/day
    'mount_large_flying': { name: 'Mount (Large, Flying)', size: 4, cost: 5.6, type: 'flying', requiredPerk: 'FLYING_MOUNTS' },
    'mount_huge': { name: 'Mount (Huge)', size: 9, cost: 12.6, type: 'exotic', requiredPerk: 'EXOTIC_MOUNTS' }, // 18sp/day
};
const SITE_MODIFIERS = {
    climate: { cold: 5, temperate: 0, warm: -5, aquatic: 15, desert: 10, forest: 0, hill: -5, marsh: 10, mountains: 0, plains: -5, underground: 10, exotic: 15, mobile: -5 },
    settlement: { smallTown_under1: 0, smallTown_1to16: 2, smallTown_17to48: 4, smallTown_49to112: 7, smallTown_113plus: 10, largeTown_under1: 2, largeTown_1to16: 0, largeTown_17to48: 2, largeTown_49to112: 4, largeTown_113plus: 7, smallCity_under1: 3, smallCity_1to16: 1, smallCity_17to48: -2, smallCity_49to112: 1, smallCity_113plus: 6, largeCity_under1: 6, largeCity_1to16: 3, largeCity_17to48: 1, largeCity_49to112: -1, largeCity_113plus: 5, metropolis_under1: 10, metropolis_1to16: 7, metropolis_17to48: 5, metropolis_49to112: 0, metropolis_113plus: 4 },
    features: { impede: 2, prohibit: 4, easier: -2, dispute: -5, lawless: -10, income: 10, potential: 5, hidden: 5 }
};
const WALL_COSTS = {
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
const WALL_DURABILITY = {
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
const ROOM_DESCRIPTIONS = {
    // ... (same as before)
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
        "Dining hall, fancy": "Ein eleganten Speisesaal mit fein gearbeiteten Tischen und Stühlen. Ein zentraler Kamin sorgt für Wärme, während Wandmalereien von lokalen Legenden oder Heldentaten erzählen.",
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
        "Chapel, basic": "Ein schlichter Raum, der der Anbetung gewidmet ist. Ein einfacher Altar, grobe Bänke und ein Symbol der verehrten Gottheit bilden das spirituelle Zentrum. Ermöglicht Priestern, den sozialen Wert zu steigern (Bonus limitiert durch den Wert der Kapelle).",
        "Chapel, fancy": "Eine größere Kapelle mit einem polierten Steinaltar, verzierten Kirchenbänken und Buntglasfenstern. Kanalisiert göttliche Macht effizienter und erlaubt einen höheren Bonus durch Priester.",
        "Chapel, luxury": "Eine prächtige Kathedrale im Kleinen, mit einem juwelenbesetzten Altar und vergoldeten Bänken. Ein Ort großer Macht, der Priestern erlaubt, den sozialen Wert der Festung enorm zu steigern.",
        "Prison cell": "Eine karge Zelle mit Eisenfesseln an den Wänden und Strohmatratzen auf dem Boden. Kann als Gemeinschaftszelle oder in mehrere Einzelzellen unterteilt werden.",
        "Torture chamber": "Ein finsterer Raum, gefüllt mit den schrecklichsten Instrumenten, um Schmerz zuzufügen und Informationen zu erpressen. Der Geruch von Angst und kaltem Eisen erfüllt die Luft.",
        "Stable, basic": "Ein einfacher Holzstall mit Boxen für bis zu vier Reittiere. Benötigt einen Stallmeister. Ein Stallmeister kann bis zu 4 Stallplätze versorgen.",
        "Stable, fancy": "Ein sauberer Stall mit Steinboden, frischem Heu in den Boxen für bis zu vier Reittiere. Benötigt einen Stallmeister. Ein Stallmeister kann bis zu 4 Stallplätze versorgen. Ermöglicht exotische Reittiere.",
        "Stable, luxury": "Ein palastartiger Stall mit polierten Böden für bis zu vier Reittiere. Benötigt einen Stallmeister. Ein Stallmeister kann bis zu 4 Stallplätze versorgen. Ermöglicht fliegende Reittiere.",
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
const MATERIAL_DESCRIPTIONS = {
    glass: "Magisch verstärktes Glas, das überraschend widerstandsfähig ist. Ideal für Observatorien oder Gewächshausser, wo Licht einfallen soll, aber dennoch ein gewisser Schutz erforderlich ist. Anfällig für erschütternden Schaden.",
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
const CLIMATE_DESCRIPTIONS = {
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
const FEATURE_DESCRIPTIONS = {
    impede: "Erhöht die Kosten um 2%. Das Gelände (z.B. dichter Dschungel oder schroffe Felsen) behindert den Transport von Material und Arbeitern.",
    prohibit: "Erhöht die Kosten um 4%. Lokale Gegebenheiten (z.B. magische Zonen oder heilige Stätten) verbieten bestimmte Bauweisen, was teure Alternativen erfordert.",
    easier: "Senkt die Kosten um 2%. Das Gelände ist besonders gut für den Bau geeignet, z.B. durch einen vorhandenen Steinbruch oder einen magisch stabilisierten Untergrund.",
    dispute: "Senkt die Kosten um 5%. Das Land ist umstritten, was zwar gefährlich ist, aber die Grundstückskosten und Steuern drastisch senkt.",
    lawless: "Senkt die Kosten um 10%. In gesetzlosen Gebieten gibt es keine Vorschriften, Steuern oder Zölle, was das Baumaterial erheblich verbilligt. Die Sicherheit ist jedoch ein ständiges Problem.",
    income: "Erhöht die Kosten um 10%. Der Standort befindet sich an einer wertvollen Ressource (z.B. Mine, Handelsroute), was die Grundstückspreise und den Bauaufwand erhöht, aber zukünftiges Einkommen verspricht.",
    potential: "Erhöht die Kosten um 5%. Der Ort hat ungenutztes Potenzial, z.B. einen Zugang zu einem unentdeckten Höhlensystem, dessen Erschließung im Voraus kostet.",
    hidden: "Erhöht die Kosten um 5%. Die Festung soll verborgen bleiben, was zusätzliche Tarnmaßnahmen und aufwendigere Logistik erfordert, um keine Spuren zu hinterlassen.",
};
const getSettlementLabel = (key) => {
    const parts = key.split('_');
    const settlementType = {
        smallTown: "Small Town",
        largeTown: "Large Town",
        smallCity: "Small City",
        largeCity: "Large City",
        metropolis: "Metropolis"
    };
    const distance = {
        under1: "< 1 mile",
        '1to16': "1-16 miles",
        '17to48': "17-48 miles",
        '49to112': "49-112 miles",
        '113plus': "> 113 miles"
    };
    return `${settlementType[parts[0]] || key} (${distance[parts[1]] || 'away'})`;
};

// --- From hooks/useStronghold.ts ---
const INITIAL_STATE = {
  site: { climate: '', settlement: '', features: [] },
  components: [],
  walls: [],
  staff: [],
  simulationLog: [],
  totalDamage: 0,
  merchantGoldSpentThisWeek: 0,
  strongholdTreasury: 0,
};
const calculateConstructionTime = (baseCost) => {
    if (baseCost <= 0) return 0;
    const days = (baseCost / 10000) * 7;
    return Math.ceil(days);
};
const calculateScaledBenefits = (componentName, category, area) => {
    const data = COMPONENTS[category]?.[componentName];
    if (!data) return { resources: {}, jobs: [], perks: [] };
    
    let baseArea;
    if (data.minSize) {
        baseArea = data.minSize.length * data.minSize.width;
    } else {
        baseArea = Math.pow((data.ss || 1) * 20, 2);
    }

    const scalingFactor = baseArea > 0 ? area / baseArea : 1;

    const scaledResources = {};
    if (data.provides) {
        for (const [key, value] of Object.entries(data.provides)) {
            const calculated = Math.floor(value * scalingFactor);
            if (calculated > 0) {
                 scaledResources[key] = calculated;
            }
        }
    }

    const scaledJobs = [];
    if (data.jobs) {
        data.jobs.forEach(job => {
            const calculated = Math.floor(job.count * scalingFactor);
            if(calculated > 0) {
                scaledJobs.push({ role: job.role, count: calculated });
            }
        });
    }
    
    const scaledPerks = [];
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
const useStronghold = () => {
  const [state, setState] = useState(INITIAL_STATE);
  const [saveSlots, setSaveSlots] = useState([]);
  const [activeSaveName, setActiveSaveName] = useState(null);

  useEffect(() => {
    try {
        const oldStateRaw = localStorage.getItem('strongholdBuilder');
        const savesRaw = localStorage.getItem('strongholdSaves');

        if (oldStateRaw && !savesRaw) {
            const oldState = JSON.parse(oldStateRaw);
            const legacySave = {
                name: 'Autosave (Legacy)',
                lastSaved: new Date().toISOString(),
                state: oldState,
            };
            setSaveSlots([legacySave]);
            setActiveSaveName(legacySave.name);
            setState(oldState);
            localStorage.removeItem('strongholdBuilder');
            return;
        }
      
        const loadedSaves = savesRaw ? JSON.parse(savesRaw) : [];
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

  const saveAsNewSlot = useCallback((name) => {
      if (!name || saveSlots.some(s => s.name === name)) {
          alert("A save with this name already exists or the name is invalid.");
          return false;
      }
      const newSave = {
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

  const loadSlot = useCallback((name) => {
      const slotToLoad = saveSlots.find(s => s.name === name);
      if (slotToLoad) {
          setState(slotToLoad.state);
          setActiveSaveName(name);
          localStorage.setItem('activeStrongholdSaveName', name);
      }
  }, [saveSlots]);
  
  const deleteSlot = useCallback((name) => {
      const newSaveSlots = saveSlots.filter(s => s.name !== name);
      setSaveSlots(newSaveSlots);
      localStorage.setItem('strongholdSaves', JSON.stringify(newSaveSlots));
      if (activeSaveName === name) {
          setActiveSaveName(null);
          setState(INITIAL_STATE);
          localStorage.removeItem('activeStrongholdSaveName');
      }
  }, [saveSlots, activeSaveName]);

  const renameSlot = useCallback((oldName, newName) => {
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

  const copySlot = useCallback((name) => {
      const slotToCopy = saveSlots.find(s => s.name === name);
      if (!slotToCopy) return;

      let newName = `Kopie von ${name}`;
      let counter = 1;
      while (saveSlots.some(s => s.name === newName)) {
          counter++;
          newName = `Kopie von ${name} (${counter})`;
      }

      const newSave = {
          ...slotToCopy,
          name: newName,
          lastSaved: new Date().toISOString(),
      };
      
      const newSaveSlots = [...saveSlots, newSave];
      setSaveSlots(newSaveSlots);
      localStorage.setItem('strongholdSaves', JSON.stringify(newSaveSlots));
  }, [saveSlots]);

  const exportSlot = useCallback((name) => {
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

    const importStronghold = useCallback((fileContent) => {
        try {
            const importedSlot = JSON.parse(fileContent);

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

            const newSave = { ...importedSlot, name: newName };
            const newSaveSlots = [...saveSlots, newSave];
            setSaveSlots(newSaveSlots);
            
            setState(newSave.state);
            setActiveSaveName(newSave.name);
            
            localStorage.setItem('strongholdSaves', JSON.stringify(newSaveSlots));
            localStorage.setItem('activeStrongholdSaveName', newSave.name);

        } catch (error) {
            console.error("Fehler beim Importieren der Speicherdatei", error);
            alert("Fehler beim Importieren der Speicherdatei. Sie könnte beschädigt sein oder ein falsches Format haben.");
        }
    }, [saveSlots]);

  const setSite = useCallback((newSite) => {
    setState(prevState => ({ ...prevState, site: newSite }));
  }, []);

  const addComponent = useCallback((component) => {
      const { jobs: scaledJobs } = calculateScaledBenefits(component.name, component.category, component.area);

      const jobSlots = [];
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

  const removeComponent = useCallback((id) => {
    setState(prevState => {
      const componentToRemove = prevState.components.find(c => c.id === id);
      if (!componentToRemove) return prevState;

      const staffToUnassign = componentToRemove.jobSlots.map(j => j.filledBy).filter(Boolean);
      const updatedStaff = prevState.staff.map(s => staffToUnassign.includes(s.id) ? { ...s, assignedJobId: null } : s);

      return { ...prevState, components: prevState.components.filter(c => c.id !== id), staff: updatedStaff };
    });
  }, []);

  const addWall = useCallback((wall) => {
    setState(prevState => ({ ...prevState, walls: [...prevState.walls, { ...wall, id: crypto.randomUUID() }] }));
  }, []);
  
  const removeWall = useCallback((id) => {
    setState(prevState => ({ ...prevState, walls: prevState.walls.filter(w => w.id !== id) }));
  }, []);

  const addStaff = useCallback((staffToAdd) => {
    let cr = 0;
    if (staffToAdd.isMount) {
        // Mounts usually don't add to garrison CR in this simplified model
        cr = 0;
    } else {
        const hirelingInfo = HIRELING_DATA[staffToAdd.hirelingKey];
        if (!hirelingInfo) return;
        cr = hirelingInfo.cr;
    }

    const staffWithId = { ...staffToAdd, id: crypto.randomUUID(), cr: cr, assignedJobId: null };

    setState(prevState => {
        const existingStaff = prevState.staff.find(s => 
            s.hirelingKey === staffWithId.hirelingKey && 
            s.customRole === staffWithId.customRole && 
            s.isVolunteer === staffWithId.isVolunteer && 
            s.isMount === staffWithId.isMount &&
            s.assignedJobId === null
        );
        if (existingStaff) {
            return { ...prevState, staff: prevState.staff.map(s => s.id === existingStaff.id ? { ...s, quantity: s.quantity + staffWithId.quantity, totalCost: s.totalCost + staffWithId.totalCost } : s) };
        } else {
            return { ...prevState, staff: [...prevState.staff, staffWithId] };
        }
    });
  }, []);

  const removeStaff = useCallback((id) => {
    setState(prevState => {
      const staffIndex = prevState.staff.findIndex(s => s.id === id);
      if (staffIndex === -1) return prevState;
      
      const staffToRemove = prevState.staff[staffIndex];
      let updatedComponents = prevState.components;
      let updatedStaff = [...prevState.staff];

      if (staffToRemove.quantity > 1) {
          // Reduce quantity
          updatedStaff[staffIndex] = {
              ...staffToRemove,
              quantity: staffToRemove.quantity - 1,
              totalCost: staffToRemove.totalCost - staffToRemove.costPerUnit
          };
          return { ...prevState, staff: updatedStaff };
      } else {
          // Quantity is 1, remove completely
          if (staffToRemove.assignedJobId) {
              updatedComponents = prevState.components.map(c => ({ ...c, jobSlots: c.jobSlots.map(j => j.id === staffToRemove.assignedJobId ? { ...j, filledBy: null } : j) }));
          }
          updatedStaff = prevState.staff.filter(s => s.id !== id);
          return { ...prevState, staff: updatedStaff, components: updatedComponents };
      }
    });
  }, []);

  const assignStaffToJob = useCallback((staffId, jobId) => {
      setState(prevState => {
          const staffIndex = prevState.staff.findIndex(s => s.id === staffId);
          if (staffIndex === -1) return prevState;

          const staffMember = prevState.staff[staffIndex];

          // Logic Split: If quantity > 1, we split the stack.
          if (staffMember.quantity > 1) {
              // 1. Create a new staff entry for the single assigned person
              const newAssignedStaffId = crypto.randomUUID();
              const newAssignedStaff = {
                  ...staffMember,
                  id: newAssignedStaffId,
                  quantity: 1,
                  totalCost: staffMember.costPerUnit, // Cost for 1 unit
                  assignedJobId: jobId
              };

              // 2. Update existing staff entry (reduce quantity)
              const updatedSourceStaff = {
                  ...staffMember,
                  quantity: staffMember.quantity - 1,
                  totalCost: (staffMember.quantity - 1) * staffMember.costPerUnit
              };

              // 3. Update components to fill the slot with the NEW ID
              let targetComponentId = null;
              const updatedComponents = prevState.components.map(c => ({
                  ...c,
                  jobSlots: c.jobSlots.map(j => {
                      if (j.id === jobId) {
                          targetComponentId = c.id;
                          return { ...j, filledBy: newAssignedStaffId };
                      }
                      return j;
                  })
              }));

              if (!targetComponentId) return prevState;

              // 4. Update staff array: replace source, add new
              const updatedStaff = [...prevState.staff];
              updatedStaff[staffIndex] = updatedSourceStaff;
              updatedStaff.push(newAssignedStaff);

              return { ...prevState, components: updatedComponents, staff: updatedStaff };

          } else {
              // Standard logic for quantity === 1
              let targetComponentId = null;
              const updatedComponents = prevState.components.map(c => ({ ...c, jobSlots: c.jobSlots.map(j => { if (j.id === jobId) { targetComponentId = c.id; return { ...j, filledBy: staffId }; } return j; }) }));
              if (!targetComponentId) return prevState;
              const updatedStaff = prevState.staff.map(s => s.id === staffId ? { ...s, assignedJobId: jobId } : s);
              return { ...prevState, components: updatedComponents, staff: updatedStaff };
          }
      });
  }, []);

  const unassignStaffFromJob = useCallback((staffId) => {
      setState(prevState => {
          const staffMember = prevState.staff.find(s => s.id === staffId);
          if (!staffMember || !staffMember.assignedJobId) return prevState;
          const jobId = staffMember.assignedJobId;

          // 1. Clear the job slot in the component
          const updatedComponents = prevState.components.map(c => ({
              ...c,
              jobSlots: c.jobSlots.map(j => j.id === jobId ? { ...j, filledBy: null } : j)
          }));

          // 2. Check if there is an existing stack in "available" (assignedJobId: null) to merge with
          const mergeTargetIndex = prevState.staff.findIndex(s =>
              s.id !== staffId &&
              s.assignedJobId === null &&
              s.hirelingKey === staffMember.hirelingKey &&
              s.customRole === staffMember.customRole &&
              s.isVolunteer === staffMember.isVolunteer &&
              s.isMount === staffMember.isMount
          );

          let updatedStaff;

          if (mergeTargetIndex !== -1) {
              // Merge logic: Update target stack, remove unassigned member
              const targetId = prevState.staff[mergeTargetIndex].id;
              
              updatedStaff = prevState.staff.map(s => {
                  if (s.id === targetId) {
                      return {
                          ...s,
                          quantity: s.quantity + 1,
                          totalCost: s.totalCost + staffMember.costPerUnit
                      };
                  }
                  return s;
              }).filter(s => s.id !== staffId);
          } else {
              // No merge target logic: Just unassign
              updatedStaff = prevState.staff.map(s => s.id === staffId ? { ...s, assignedJobId: null } : s);
          }

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

  const startConstruction = useCallback((id, type, startDate) => {
    setState(prevState => (type === 'component') ? { ...prevState, components: prevState.components.map(c => c.id === id ? { ...c, constructionStatus: 'in_progress', startDate: startDate } : c) } : { ...prevState, walls: prevState.walls.map(w => w.id === id ? { ...w, constructionStatus: 'in_progress', startDate: startDate } : w) });
  }, []);

  const completeConstruction = useCallback((id, type) => {
    setState(prevState => (type === 'component') ? { ...prevState, components: prevState.components.map(c => c.id === id ? { ...c, constructionStatus: 'completed' } : c) } : { ...prevState, walls: prevState.walls.map(w => w.id === id ? { ...w, constructionStatus: 'completed' } : w) });
  }, []);

  const repairDamage = useCallback((amount) => {
    setState(prevState => ({ ...prevState, totalDamage: Math.max(0, prevState.totalDamage - amount), simulationLog: [...prevState.simulationLog, `Reparatur: ${amount.toFixed(0)} GP wurden für Reparaturen aufgewendet.`] }));
  }, []);

  const setMerchantGoldSpentThisWeek = useCallback((amount) => { setState(prevState => ({ ...prevState, merchantGoldSpentThisWeek: amount })); }, []);
  const depositToTreasury = useCallback((amount) => { if (amount <= 0) return; setState(prevState => ({ ...prevState, strongholdTreasury: prevState.strongholdTreasury + amount, simulationLog: [...prevState.simulationLog, `Einzahlung: ${amount.toFixed(2)} GP in die Schatzkammer eingezahlt.`] })); }, []);
  const withdrawFromTreasury = useCallback((amount) => { if (amount <= 0) return; setState(prevState => ({ ...prevState, strongholdTreasury: prevState.strongholdTreasury - amount, simulationLog: [...prevState.simulationLog, `Auszahlung: ${amount.toFixed(2)} GP aus der Schatzkammer entnommen.`] })); }, []);

  const siteModifier = useMemo(() => {
    const climateMod = SITE_MODIFIERS.climate[state.site.climate] || 0;
    const settlementMod = SITE_MODIFIERS.settlement[state.site.settlement] || 0;
    const featuresMod = (state.site.features || []).reduce((sum, feature) => sum + (SITE_MODIFIERS.features[feature] || 0), 0);
    return climateMod + settlementMod + featuresMod;
  }, [state.site]);

  const componentsTotal = useMemo(() => state.components.reduce((sum, c) => sum + c.totalCost, 0), [state.components]);
  const wallsTotal = useMemo(() => state.walls.reduce((sum, w) => sum + w.totalCost, 0), [state.walls]);
  const grandTotal = useMemo(() => componentsTotal + wallsTotal, [componentsTotal, wallsTotal]);
  const totalArea = useMemo(() => state.components.reduce((sum, c) => sum + c.area, 0), [state.components]);
  
  const requiredServants = useMemo(() => Math.ceil(totalArea / 2000), [totalArea]);
  const currentServants = useMemo(() => state.staff
      .filter(s => s.hirelingKey === 'unskilled')
      .reduce((sum, s) => sum + s.quantity, 0), [state.staff]);
  const missingServants = Math.max(0, requiredServants - currentServants);
  const maintenancePenaltyMultiplier = 1 + missingServants; // 0 missing = 1, 1 missing = 2, etc.

  const maintenanceWeekly = useMemo(() => {
      const completedComponentsTotal = state.components.filter(c => c.constructionStatus === 'completed').reduce((sum, c) => sum + c.totalCost, 0);
      const completedWallsTotal = state.walls.filter(w => w.constructionStatus === 'completed').reduce((sum, w) => sum + w.totalCost, 0);
      const baseMaintenance = (completedComponentsTotal + completedWallsTotal) * 0.01 / 52;
      return baseMaintenance * maintenancePenaltyMultiplier;
  }, [state.components, state.walls, maintenancePenaltyMultiplier]);

    const calculateFullValue = useCallback((classification) => {
        return state.components
            .filter(c => c.classification === classification && c.constructionStatus === 'completed')
            .reduce((sum, c) => sum + c.baseCost, 0);
    }, [state.components]);

    const calculateScaledValue = useCallback((classification) => {
        return state.components
            .filter(c => c.classification === classification && c.constructionStatus === 'completed')
            .reduce((sum, c) => {
                if (!c.jobSlots || c.jobSlots.length === 0) {
                    return sum + c.baseCost;
                }
                const totalJobs = c.jobSlots.length;
                const filledJobs = c.jobSlots.filter(j => j.filledBy).length;
                const efficiency = totalJobs > 0 ? filledJobs / totalJobs : 1;
                return sum + (c.baseCost * efficiency);
            }, 0);
    }, [state.components]);

    const baseMilitaryValue = useMemo(() => {
        const componentValue = calculateFullValue('military');
        const wallValue = state.walls.filter(w => w.constructionStatus === 'completed').reduce((sum, w) => sum + w.baseCost, 0);
        return componentValue + wallValue;
    }, [state.components, state.walls, calculateFullValue]);
    const baseIndustrialValue = useMemo(() => calculateFullValue('industrial'), [calculateFullValue]);
    const baseEconomicValue = useMemo(() => calculateFullValue('economic'), [calculateFullValue]);
    const baseSocialValue = useMemo(() => calculateFullValue('social'), [calculateFullValue]);

    // --- PRIEST / CHAPEL LOGIC START ---
    const totalChapelValue = useMemo(() => 
        state.components
            .filter(c => c.constructionStatus === 'completed' && c.name.toLowerCase().includes('chapel'))
            .reduce((sum, c) => sum + c.baseCost, 0),
        [state.components]
    );

    const priestCount = useMemo(() => {
         let count = 0;
         state.components.forEach(c => {
             if(c.jobSlots) {
                 c.jobSlots.forEach(slot => {
                     if(slot.role === 'Priest' && slot.filledBy) count++;
                 });
             }
         });
         return count;
    }, [state.components]);

    const potentialPriestBonus = useMemo(() => baseSocialValue * (priestCount * 0.10), [baseSocialValue, priestCount]);
    const actualPriestBonus = useMemo(() => Math.min(potentialPriestBonus, totalChapelValue), [potentialPriestBonus, totalChapelValue]);
    const socialValue = baseSocialValue + actualPriestBonus;
    // --- PRIEST / CHAPEL LOGIC END ---

    const damageShare = state.totalDamage > 0 ? state.totalDamage / 3 : 0;
    const militaryValue = Math.max(0, baseMilitaryValue - damageShare);
    const industrialValue = Math.max(0, baseIndustrialValue - damageShare);
    const economicValue = Math.max(0, baseEconomicValue - damageShare);
    // socialValue is already defined above
    const formulaSV = industrialValue + economicValue;
    const totalValue = militaryValue + industrialValue + economicValue + socialValue;

    const industrialValueForProfit = useMemo(() => {
        const scaledBase = calculateScaledValue('industrial');
        return Math.max(0, scaledBase - damageShare);
    }, [calculateScaledValue, damageShare]);
    const economicValueForProfit = useMemo(() => {
        const scaledBase = calculateScaledValue('economic');
        return Math.max(0, scaledBase - damageShare);
    }, [calculateScaledValue, damageShare]);

    const industrialPotential = useMemo(() => industrialValueForProfit * 0.01, [industrialValueForProfit]);
    const economicPotential = useMemo(() => economicValueForProfit * 0.05 * (economicValueForProfit > 0 ? Math.min(1, industrialValueForProfit / economicValueForProfit) : 0), [economicValueForProfit, industrialValueForProfit]);
    const weeklyProfit = useMemo(() => industrialPotential + economicPotential, [industrialPotential, economicPotential]);

    const comparisonValue = useMemo(() => (militaryValue + industrialValue + economicValue) * 2, [militaryValue, industrialValue, economicValue]);
    const salaryReductionPercentage = useMemo(() => (comparisonValue > 0 ? Math.min(100, (socialValue / comparisonValue) * 100) : 0), [socialValue, comparisonValue]);
    
    const baseStaffTotalWeekly = useMemo(() => state.staff.reduce((sum, s) => sum + s.totalCost, 0), [state.staff]);
    const staffTotalWeekly = useMemo(() => baseStaffTotalWeekly * (1 - salaryReductionPercentage / 100), [baseStaffTotalWeekly, salaryReductionPercentage]);
    const weeklyUpkeep = useMemo(() => staffTotalWeekly + maintenanceWeekly, [staffTotalWeekly, maintenanceWeekly]);

    const totalMerchantGold = useMemo(() => {
        const scaledShopValue = state.components
            .filter(c => c.constructionStatus === 'completed' && c.name.toLowerCase().includes('shop'))
            .reduce((sum, c) => {
                if (!c.jobSlots || c.jobSlots.length === 0) {
                    return sum + c.baseCost;
                }
                const totalJobs = c.jobSlots.length;
                const filledJobs = c.jobSlots.filter(j => j.filledBy !== null).length;
                const efficiency = totalJobs > 0 ? filledJobs / totalJobs : 1;
                return sum + (c.baseCost * efficiency);
            }, 0);
        return scaledShopValue * 0.25;
    }, [state.components]);

    const defenseBonus = useMemo(() => militaryValue === 0 ? (formulaSV > 0 ? -0.9 : 0) : Math.max(-0.9, 2 - (formulaSV / militaryValue)), [militaryValue, formulaSV]);
    const attackChanceBonus = useMemo(() => militaryValue === 0 ? (formulaSV > 0 ? 3.0 : -0.9) : Math.max(-0.9, (formulaSV / (2 * militaryValue)) - 0.9), [militaryValue, formulaSV]);
    const maxAttackRoll = useMemo(() => Math.max(2, Math.min(100, Math.round(25 * (attackChanceBonus + 1)))), [attackChanceBonus]);

    const baseGarrisonCR = useMemo(() => state.staff.reduce((sum, s) => sum + (s.cr * s.quantity), 0), [state.staff]);
    const garrisonCR = useMemo(() => Math.max(0, baseGarrisonCR * (1 + defenseBonus)), [baseGarrisonCR, defenseBonus]);
    const attackCR = useMemo(() => Math.max(0.5, Math.min(30, totalValue / 2000)), [totalValue]);
    
    const totalConstructionDays = useMemo(() => {
    const componentDays = state.components.filter(c => c.constructionStatus !== 'completed').reduce((sum, c) => sum + Math.ceil(calculateConstructionTime(c.baseCost) * (1 - c.rushPercent / 100)), 0);
    const wallDays = state.walls.filter(w => w.constructionStatus !== 'completed').reduce((sum, w) => sum + Math.ceil(calculateConstructionTime(w.baseCost) * (1 - w.rushPercent / 100)), 0);
    return componentDays + wallDays;
    }, [state.components, state.walls]);

    const economicComponentsBreakdown = useMemo(() => {
        return state.components
            .filter(c => c.constructionStatus === 'completed' && ['industrial', 'economic'].includes(c.classification))
            .map(c => {
                const totalJobs = c.jobSlots?.length || 0;
                const filledJobs = c.jobSlots?.filter(j => j.filledBy).length || 0;
                const efficiency = totalJobs > 0 ? filledJobs / totalJobs : (totalJobs === 0 ? 1 : 0);
                const currentValue = c.baseCost * efficiency;
                const isShop = c.name.toLowerCase().includes('shop');
                
                return {
                    id: c.id,
                    name: c.name,
                    classification: c.classification,
                    jobRole: c.jobSlots?.[0]?.role || 'Arbeiter',
                    totalJobs,
                    filledJobs,
                    baseValue: c.baseCost,
                    currentValue,
                    merchantGoldContribution: isShop ? currentValue * 0.25 : 0,
                };
            })
            .sort((a, b) => {
                const order = { industrial: 1, economic: 2 };
                return order[a.classification] - order[b.classification];
            });
    }, [state.components]);

    const simulateNextWeek = useCallback(() => {
        setState(prevState => {
            let newState = JSON.parse(JSON.stringify(prevState));
            const newLog = [...(newState.simulationLog || [])];
            
            const calculateSimScaledValue = (classification, components) => {
                return components
                    .filter(c => c.classification === classification && c.constructionStatus === 'completed')
                    .reduce((sum, c) => {
                        if (!c.jobSlots || c.jobSlots.length === 0) return sum + c.baseCost;
                        const totalJobs = c.jobSlots.length;
                        const filledJobs = c.jobSlots.filter(j => j.filledBy).length;
                        const efficiency = totalJobs > 0 ? filledJobs / totalJobs : 1;
                        return sum + (c.baseCost * efficiency);
                    }, 0);
            };

            const calculateSimFullValue = (classification, components) => {
                 return components
                    .filter(c => c.classification === classification && c.constructionStatus === 'completed')
                    .reduce((sum, c) => sum + c.baseCost, 0);
            };
            
            const dmgShare_sim = newState.totalDamage > 0 ? newState.totalDamage / 3 : 0;

            const baseMV_sim_comp = calculateSimFullValue('military', newState.components);
            const wallValue_sim = newState.walls.filter(w => w.constructionStatus === 'completed').reduce((s, w) => s + w.baseCost, 0);
            const baseMV_sim = baseMV_sim_comp + wallValue_sim;
            const baseIV_sim_full = calculateSimFullValue('industrial', newState.components);
            const baseEV_sim_full = calculateSimFullValue('economic', newState.components);
            const baseSV_social_sim_full = calculateSimFullValue('social', newState.components);

            // --- SIM PRIEST LOGIC ---
            const simChapelValue = newState.components
                 .filter(c => c.constructionStatus === 'completed' && c.name.toLowerCase().includes('chapel'))
                 .reduce((sum, c) => sum + c.baseCost, 0);

            let simPriestCount = 0;
            newState.components.forEach(c => {
                 if(c.jobSlots) {
                     c.jobSlots.forEach(slot => {
                         if(slot.role === 'Priest' && slot.filledBy) simPriestCount++;
                     });
                 }
            });
            const simPotentialBonus = baseSV_social_sim_full * (simPriestCount * 0.10);
            const simActualBonus = Math.min(simPotentialBonus, simChapelValue);
            // --- END SIM PRIEST LOGIC ---

            const currentMV = Math.max(0, baseMV_sim - dmgShare_sim);
            const currentIV_full = Math.max(0, baseIV_sim_full - dmgShare_sim);
            const currentEV_full = Math.max(0, baseEV_sim_full - dmgShare_sim);
            const currentSV_social = baseSV_social_sim_full + simActualBonus;
            const currentFormulaSV = currentIV_full + currentEV_full;
            const currentTV = currentMV + currentIV_full + currentEV_full + currentSV_social;
            const currentDefenseBonus = currentMV === 0 ? (currentFormulaSV > 0 ? -0.9 : 0) : Math.max(-0.9, 2 - (currentFormulaSV / currentMV));
            const currentAttackChanceBonus = currentMV === 0 ? (currentFormulaSV > 0 ? 3.0 : -0.9) : Math.max(-0.9, (currentFormulaSV / (2 * currentMV)) - 0.9);
            const currentMaxAttackRoll = Math.max(2, Math.min(100, Math.round(25 * (currentAttackChanceBonus + 1))));
            const currentBaseGarrisonCR = newState.staff.reduce((s, st) => s + (st.cr * st.quantity), 0);
            const currentGarrisonCR = Math.max(0, currentBaseGarrisonCR * (1 + currentDefenseBonus));
            const currentAttackCR = Math.max(0.5, Math.min(30, currentTV / 2000));
            
            const weekNumber = Math.floor((newState.simulationLog || []).filter((l) => l.includes('(Wirtschaft)')).length) + 1;

            const baseIV_sim_scaled = calculateSimScaledValue('industrial', newState.components);
            const baseEV_sim_scaled = calculateSimScaledValue('economic', newState.components);
            const currentIV_scaled = Math.max(0, baseIV_sim_scaled - dmgShare_sim);
            const currentEV_scaled = Math.max(0, baseEV_sim_scaled - dmgShare_sim);
            
            const industrialPotSim = currentIV_scaled * 0.01;
            const efficiency = currentEV_scaled > 0 ? Math.min(1, currentIV_scaled / currentEV_scaled) : 0;
            const economicPotSim = currentEV_scaled * 0.05 * efficiency;
            const profit = industrialPotSim + economicPotSim;
            newLog.push(`Woche ${weekNumber} (Wirtschaft): Einnahmen von ${profit.toFixed(2)} GP erzielt.`);

            const compVal = (currentMV + currentIV_full + currentEV_full) * 2;
            const salRedPerc = compVal > 0 ? Math.min(100, (currentSV_social / compVal) * 100) : 0;
            const baseStaffCost = newState.staff.reduce((sum, s) => sum + s.totalCost, 0);
            const staffCost = baseStaffCost * (1 - salRedPerc / 100);

            const completedComponentsTotal = newState.components.filter(c => c.constructionStatus === 'completed').reduce((sum, c) => sum + c.totalCost, 0);
            const completedWallsTotal = newState.walls.filter(w => w.constructionStatus === 'completed').reduce((sum, w) => sum + w.totalCost, 0);
            
            // Logic for Servant Penalty in Simulation
            const totalArea_sim = newState.components.reduce((sum, c) => sum + c.area, 0);
            const requiredServants_sim = Math.ceil(totalArea_sim / 2000);
            const currentServants_sim = newState.staff
                  .filter(s => s.hirelingKey === 'unskilled')
                  .reduce((sum, s) => sum + s.quantity, 0);
            const missingServants_sim = Math.max(0, requiredServants_sim - currentServants_sim);
            const maintenancePenaltyMultiplier_sim = 1 + missingServants_sim;

            const maintenanceCost = ((completedComponentsTotal + completedWallsTotal) * 0.01 / 52) * maintenancePenaltyMultiplier_sim;
            const totalUpkeep = staffCost + maintenanceCost;
            const netIncome = profit - totalUpkeep;
            const previousTreasury = newState.strongholdTreasury || 0;
            newState.strongholdTreasury = previousTreasury + netIncome;
            newLog.push(`Woche ${weekNumber} (Wirtschaft): Nettoeinkommen von ${netIncome.toFixed(2)} GP. Neues Vermögen: ${newState.strongholdTreasury.toFixed(2)} GP.`);
            if (missingServants_sim > 0) {
                newLog.push(`Woche ${weekNumber} (Wartung): ACHTUNG! Wartungskosten um ${missingServants_sim * 100}% erhöht durch Personalmangel (Fehlende Diener: ${missingServants_sim}).`);
            }
            if (simActualBonus < simPotentialBonus) {
                newLog.push(`Woche ${weekNumber} (Sozial): Priester-Bonus ist am Limit! Baue mehr Kapellen, um ${Math.round(simPotentialBonus - simActualBonus)} GP potenziellen Sozialwert freizuschalten.`);
            }
            
            const scaledShopValue_sim = newState.components
                .filter(c => c.constructionStatus === 'completed' && c.name.toLowerCase().includes('shop'))
                .reduce((sum, c) => {
                    if (!c.jobSlots || c.jobSlots.length === 0) return sum + c.baseCost;
                    const totalJobs = c.jobSlots.length;
                    const filledJobs = c.jobSlots.filter(j => j.filledBy !== null).length;
                    const efficiencyRatio = totalJobs > 0 ? filledJobs / totalJobs : 1;
                    return sum + (c.baseCost * efficiencyRatio);
                }, 0);
            const currentTotalMerchantGold = scaledShopValue_sim * 0.25;
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
        // CHANGED: Base Food Capacity set to 5 to represent rations and foraging, allowing initial hiring.
        const capacity = { servantQuarterSpace: 0, barracksSpace: 0, bedroomSpace: 0, suiteSpace: 0, food: 5, diningHallSeat: 0, armorySpace: 0, bath: 0, storage: 0, stallSpace: 0 };
        const demand = { servantQuarterSpace: 0, barracksSpace: 0, bedroomSpace: 0, suiteSpace: 0, food: 0, diningHallSeat: 0, armorySpace: 0, bath: 0, storage: 0, stallSpace: 0 };
        const rigidDemand = { servantQuarterSpace: 0, barracksSpace: 0, bedroomSpace: 0, suiteSpace: 0, food: 0, diningHallSeat: 0, armorySpace: 0, bath: 0, storage: 0, stallSpace: 0 };

        // Separate Stall Space Logic
        let builtStallCapacity = 0;
        let totalStablemasters = 0;

        // Count Active Stablemasters
        state.components.forEach(c => {
             if (c.jobSlots) {
                 c.jobSlots.forEach(slot => {
                     if (slot.role === 'Stablemaster' && slot.filledBy !== null) {
                         totalStablemasters++;
                     }
                 });
             }
        });

        state.components.filter(c => c.constructionStatus === 'completed').forEach(c => {
            // Standard calculation for non-stallSpace resources based on 'canProvide' (at least one job filled)
            let canProvide = !c.jobSlots.length || c.jobSlots.some(slot => slot.filledBy !== null);
            
            // For stallSpace, we calculate built capacity regardless of individual job status first
            const { resources: scaledResources } = calculateScaledBenefits(c.name, c.category, c.area);
            
            if (scaledResources.stallSpace) {
                 builtStallCapacity += scaledResources.stallSpace;
            }

            if (canProvide) {
                for (const [resource, value] of Object.entries(scaledResources)) { 
                    if (resource !== 'stallSpace') {
                        capacity[resource] = (capacity[resource] || 0) + value; 
                    }
                }
            }
        });

        // Apply Stablemaster Limit to Stall Capacity
        // 1 Stablemaster can tend to 4 slots.
        const maxServiceableStalls = totalStablemasters * 4;
        capacity.stallSpace = Math.min(builtStallCapacity, maxServiceableStalls);


        let totalVolunteerCount = 0;
        let totalPaidStaffCount = 0;

        // Phase 1: Calculate Rigid Demand (Non-Volunteers)
        state.staff.forEach(s => {
            if (s.isMount) {
                demand.stallSpace += (s.mountSize || 1) * s.quantity;
                rigidDemand.stallSpace += (s.mountSize || 1) * s.quantity;
            } else if (!s.isVolunteer) {
                // Paid staff have specific demands
                totalPaidStaffCount += s.quantity;
                
                if (s.hirelingKey === 'unskilled') { demand.servantQuarterSpace += s.quantity; rigidDemand.servantQuarterSpace += s.quantity; } 
                else if (s.hirelingKey === 'skilled') { demand.bedroomSpace += s.quantity; rigidDemand.bedroomSpace += s.quantity; } 
                else if (s.cr <= 0.5) { demand.barracksSpace += s.quantity; rigidDemand.barracksSpace += s.quantity; } 
                else if (s.cr <= 2) { demand.bedroomSpace += s.quantity; rigidDemand.bedroomSpace += s.quantity; } 
                else if (s.cr >= 3) { demand.suiteSpace += s.quantity; rigidDemand.suiteSpace += s.quantity; }
                
                if (s.hirelingKey !== 'unskilled' && s.hirelingKey !== 'skilled') { 
                    demand.armorySpace += s.quantity; 
                    rigidDemand.armorySpace += s.quantity;
                }
                
                demand.food += s.quantity;
                rigidDemand.food += s.quantity;
                
                demand.diningHallSeat += s.quantity;
                rigidDemand.diningHallSeat += s.quantity;
                
                const bathDemand = Math.ceil(s.quantity / 10);
                demand.bath += bathDemand; 
                rigidDemand.bath += bathDemand;
            } else {
                // Is Volunteer - count them for later distribution
                totalVolunteerCount += s.quantity;
            }
        });

        // Phase 2: Distribute Volunteers (Flexible Demand)
        // Volunteers consume food just like everyone else
        demand.food += totalVolunteerCount;
        // Volunteers eat standing up, so they DO NOT consume diningHallSeat.
        
        // Baths for volunteers are usually shared, let's add them to the bath count logic roughly
        demand.bath = Math.ceil((totalPaidStaffCount + totalVolunteerCount) / 10);

        // Housing Waterfall: Volunteers take whatever is free, starting from bottom up.
        let remainingVolunteers = totalVolunteerCount;
        const housingHierarchy = ['servantQuarterSpace', 'barracksSpace', 'bedroomSpace', 'suiteSpace'];

        for (const housingType of housingHierarchy) {
            if (remainingVolunteers <= 0) break;
            
            const currentCapacity = capacity[housingType] || 0;
            const currentOccupied = demand[housingType] || 0;
            const freeSpace = Math.max(0, currentCapacity - currentOccupied);
            
            const take = Math.min(remainingVolunteers, freeSpace);
            demand[housingType] += take;
            remainingVolunteers -= take;
        }

        // If volunteers still have no place to sleep, add deficit to lowest tier
        if (remainingVolunteers > 0) {
            demand.servantQuarterSpace += remainingVolunteers;
        }

        return {
            servantQuarterSpace: { capacity: capacity.servantQuarterSpace, demand: demand.servantQuarterSpace, rigidDemand: rigidDemand.servantQuarterSpace }, 
            barracksSpace: { capacity: capacity.barracksSpace, demand: demand.barracksSpace, rigidDemand: rigidDemand.barracksSpace }, 
            bedroomSpace: { capacity: capacity.bedroomSpace, demand: demand.bedroomSpace, rigidDemand: rigidDemand.bedroomSpace }, 
            suiteSpace: { capacity: capacity.suiteSpace, demand: demand.suiteSpace, rigidDemand: rigidDemand.suiteSpace }, 
            food: { capacity: capacity.food, demand: demand.food, rigidDemand: rigidDemand.food }, 
            diningHallSeat: { capacity: capacity.diningHallSeat, demand: demand.diningHallSeat, rigidDemand: rigidDemand.diningHallSeat }, 
            armorySpace: { capacity: capacity.armorySpace, demand: demand.armorySpace, rigidDemand: rigidDemand.armorySpace }, 
            bath: { capacity: capacity.bath, demand: demand.bath, rigidDemand: rigidDemand.bath }, 
            storage: { capacity: capacity.storage, demand: 0, rigidDemand: 0 }, 
            stallSpace: { capacity: capacity.stallSpace, demand: demand.stallSpace, rigidDemand: rigidDemand.stallSpace },
        };
    }, [state.components, state.staff]);

    const getAllPerks = useCallback(() => {
        const staticPerks = [];
        const scaledBonuses = {};
        const activeStaticPerkIds = new Set();

        state.components.filter(c => c.constructionStatus === 'completed').forEach(c => {
            const canProvide = !c.jobSlots.length || c.jobSlots.some(slot => slot.filledBy !== null);
            if (!canProvide) return;
            
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
    siteModifier, componentsTotal, wallsTotal, grandTotal, totalArea, baseStaffTotalWeekly, staffTotalWeekly, maintenanceWeekly, weeklyUpkeep,
    totalConstructionDays, militaryValue, industrialValue, economicValue, socialValue, totalValue,
    industrialPotential, economicPotential, weeklyProfit, defenseBonus, attackChanceBonus, maxAttackRoll,
    garrisonCR, attackCR, resources, getAllPerks, totalMerchantGold, comparisonValue, salaryReductionPercentage,
    economicComponentsBreakdown, requiredServants, currentServants, missingServants, maintenancePenaltyMultiplier,
    priestCount, potentialPriestBonus, actualPriestBonus, totalChapelValue
  };
};

// --- From components/Header.tsx ---
const Header = () => (
  React.createElement("header", { className: "text-center mb-6 p-5 bg-gradient-to-br from-gold to-gold-dark dark:from-wood-dark dark:to-gray-900 border-4 border-wood dark:border-gold-dark rounded-lg shadow-inner shadow-black/20" },
    React.createElement("h1", { className: "font-medieval text-4xl sm:text-5xl text-wood-dark dark:text-gold-light drop-shadow-[2px_2px_3px_rgba(0,0,0,0.3)] mb-2" },
      "⚔️ D&D Stronghold Builder ⚔️"
    ),
    React.createElement("p", { className: "text-lg text-wood-text dark:text-parchment-light italic" }, "Build Your Fantasy Fortress with Precision")
  )
);

// --- From components/Tabs.tsx ---
const Tabs = ({ activeTab, setActiveTab }) => (
  React.createElement("nav", { className: "flex flex-col sm:flex-row bg-wood dark:bg-gray-700 rounded-t-lg overflow-hidden" },
    TABS.map(tab => (
      React.createElement("button", {
        key: tab.id,
        onClick: () => setActiveTab(tab.id),
        className: `flex-1 p-4 font-cinzel text-base font-semibold cursor-pointer transition-all duration-300 ease-in-out border-b-2 sm:border-b-0 sm:border-r-2 border-wood-dark dark:border-gray-900 last:border-r-0
          ${activeTab === tab.id
            ? 'bg-parchment-light dark:bg-gray-900 text-wood dark:text-gold-light'
            : 'bg-wood-light dark:bg-gray-600 text-parchment-bg dark:text-gray-300 hover:bg-gold-dark dark:hover:bg-gold dark:hover:text-wood-dark'
          }`
      },
      `${tab.icon} ${tab.label}`
      )
    ))
  )
);

// --- From components/SiteTab.tsx ---
const FormGroup = ({ label, children }) => (
    React.createElement("div", { className: "flex-1 min-w-[200px] mb-4" },
        React.createElement("label", { className: "block font-semibold mb-2 text-wood dark:text-gold-light text-lg" }, label),
        children
    )
);
const SiteTab = ({ stronghold }) => {
    const { site, setSite, siteModifier } = stronghold;
    const [description, setDescription] = useState('Wähle ein Klima oder fahre mit der Maus über ein Merkmal, um eine Beschreibung zu sehen.');

    useEffect(() => {
        if (site.climate && CLIMATE_DESCRIPTIONS[site.climate]) {
            setDescription(CLIMATE_DESCRIPTIONS[site.climate]);
        } else {
            setDescription('Wähle ein Klima oder fahre mit der Maus über ein Merkmal, um eine Beschreibung zu sehen.');
        }
    }, [site.climate]);


    const handleChange = (e) => {
        const { name, value, type } = e.target;
        
        if (type === 'checkbox') {
            const { checked } = e.target;
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
        React.createElement("div", null,
            React.createElement("h2", { className: "text-3xl font-medieval text-wood-dark dark:text-gold-light mb-2" }, "🏰 Site Selection"),
            React.createElement("p", { className: "mb-6" }, "Wähle den Standort für deine Festung. Der Ort beeinflusst die Endkosten durch verschiedene Modifikatoren."),
            React.createElement("div", { className: "flex flex-wrap gap-6" },
                React.createElement(FormGroup, { label: "Climate/Terrain Type" },
                    React.createElement("select", { name: "climate", value: site.climate, onChange: handleChange, className: "w-full p-3 border-2 border-gold dark:border-gray-500 rounded-md bg-white/80 dark:bg-gray-700 dark:text-parchment-light focus:border-wood dark:focus:border-gold-light focus:outline-none focus:ring-2 focus:ring-wood-light dark:focus:ring-gold-light" },
                        React.createElement("option", { value: "" }, "Wähle Klima/Gelände"),
                        Object.entries(SITE_MODIFIERS.climate).map(([key, mod]) => 
                            React.createElement("option", { key: key, value: key },
                                `${key.charAt(0).toUpperCase() + key.slice(1)} (${mod > 0 ? `+${mod}` : mod}%)`
                            )
                        )
                    )
                ),
                React.createElement(FormGroup, { label: "Primary Settlement" },
                    React.createElement("select", { name: "settlement", value: site.settlement, onChange: handleChange, className: "w-full p-3 border-2 border-gold dark:border-gray-500 rounded-md bg-white/80 dark:bg-gray-700 dark:text-parchment-light focus:border-wood dark:focus:border-gold-light focus:outline-none focus:ring-2 focus:ring-wood-light dark:focus:ring-gold-light" },
                        React.createElement("option", { value: "" }, "Wähle Siedlung"),
                        Object.entries(SITE_MODIFIERS.settlement).map(([key, mod]) => 
                            React.createElement("option", { key: key, value: key },
                                `${getSettlementLabel(key)} (${mod > 0 ? `+${mod}` : mod}%)`
                            )
                        )
                    )
                )
            ),
            React.createElement("div", { className: "mb-6" },
                React.createElement("label", { className: "block font-semibold mb-2 text-wood dark:text-gold-light text-lg" }, "Nearby Features"),
                React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2" },
                    Object.entries(SITE_MODIFIERS.features).map(([key, mod]) => (
                        React.createElement("label", { 
                            key: key, 
                            className: "flex items-center space-x-2 p-2 rounded hover:bg-parchment-dark/30 dark:hover:bg-gray-700/50 cursor-pointer",
                            onMouseEnter: () => setDescription(FEATURE_DESCRIPTIONS[key] || 'Keine Beschreibung verfügbar.'),
                            onMouseLeave: handleFeatureMouseLeave
                        },
                            React.createElement("input", { type: "checkbox", name: "features", value: key, checked: site.features.includes(key), onChange: handleChange, className: "h-5 w-5 rounded border-gold dark:border-gray-500 text-wood dark:text-gold-dark focus:ring-wood-light dark:focus:ring-gold" }),
                            React.createElement("span", null, `${key.charAt(0).toUpperCase() + key.slice(1)} (${mod > 0 ? `+${mod}` : mod}%)`)
                        )
                    ))
                )
            ),
             React.createElement("div", { className: "mt-6 bg-blue-900/10 dark:bg-blue-900/30 p-4 rounded-lg border-l-4 border-blue-600 dark:border-blue-400 min-h-[80px]" },
                React.createElement("h4", { className: "text-xl font-semibold text-blue-800 dark:text-blue-200" }, "📖 Beschreibung"),
                React.createElement("p", { className: "mt-2 text-wood-text/80 dark:text-parchment-bg/70 italic" }, description)
            ),
            React.createElement("div", { className: "mt-8 bg-wood/10 dark:bg-gray-700/30 border-2 border-wood-light dark:border-gray-600 rounded-lg p-4" },
                React.createElement("h3", { className: "text-xl font-semibold text-wood-dark dark:text-gold-light" }, "Current Site Modifier: ", 
                    React.createElement("span", { className: `ml-2 font-bold ${siteModifier > 0 ? 'text-red-700 dark:text-red-400' : 'text-green-700 dark:text-green-400'}` },
                        `${siteModifier > 0 ? `+${siteModifier}` : siteModifier}%`
                    )
                )
            )
        )
    );
};

// --- From components/RoomsTab.tsx ---
const getMinSideLength = (ss) => {
    const side = 20 * ss;
    return Math.max(5, Math.round(side / 5) * 5);
};
const RESOURCE_LABELS = {
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
const generateComponentSummary = (name, category) => {
    const data = COMPONENTS[category]?.[name];
    if (!data) return '';

    const parts = [];
    const resourceLabels = {
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
            .map(([key, value]) => `+${value} ${resourceLabels[key]}${value > 1 ? 'e' : ''}`)
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
const CalculatedBenefitsDisplay = ({ area, benefits, componentName, calculatedBaseCost }) => {
    const { resources, jobs, perks } = benefits;
    
    const isShop = componentName.toLowerCase().includes('shop');
    const merchantGold = calculatedBaseCost * 0.25;
    
    const hasBenefits = Object.keys(resources).length > 0 || jobs.length > 0 || perks.length > 0 || (isShop && merchantGold > 0);

    return (
        React.createElement("div", { className: "bg-blue-900/10 dark:bg-blue-900/30 p-4 rounded-lg border-l-4 border-blue-600 dark:border-blue-400" },
            React.createElement("h4", { className: "text-xl font-semibold text-blue-800 dark:text-blue-200" }, `Kalkulierte Vorteile (bei ${area} sq ft)`),
            hasBenefits ? (
                 React.createElement("div", { className: "mt-2 text-wood-text/90 dark:text-parchment-bg/80 space-y-2" },
                    Object.entries(resources).map(([key, value]) => (
                        React.createElement("div", { key: key, className: "border-t border-blue-600/20 dark:border-blue-400/20 pt-2 mt-2 first:border-t-0 first:mt-0 first:pt-0" },
                            React.createElement("p", null, React.createElement("strong", null, "Ressource:"), ` +${value} ${RESOURCE_LABELS[key]}`),
                            React.createElement("p", { className: "text-sm text-wood-text/80 dark:text-parchment-bg/70 italic pl-4" }, RESOURCE_EXPLANATIONS[key] || 'Regeltechnische Erklärung nicht verfügbar.')
                        )
                    )),
                    jobs.map((job, index) => (
                         React.createElement("div", { key: index, className: "border-t border-blue-600/20 dark:border-blue-400/20 pt-2 mt-2 first:border-t-0 first:mt-0 first:pt-0" },
                            React.createElement("p", null, React.createElement("strong", null, "Arbeitsplätze:"), ` ${job.count} ${job.role}(s)`),
                            React.createElement("p", { className: "text-sm text-wood-text/80 dark:text-parchment-bg/70 italic pl-4" }, JOB_EXPLANATION_GENERIC)
                         )
                    )),
                    perks.map((perk, index) => (
                        React.createElement("div", { key: index, className: "border-t border-blue-600/20 dark:border-blue-400/20 pt-2 mt-2 first:border-t-0 first:mt-0 first:pt-0" },
                            React.createElement("p", null, React.createElement("strong", null, "Fähigkeit:"), ` ${perk.name} ${perk.finalBonus ? `+${perk.finalBonus}` : ''}`),
                            React.createElement("p", { className: "text-sm text-wood-text/80 dark:text-parchment-bg/70 italic pl-4" }, PERK_EXPLANATIONS[perk.id] || perk.description)
                        )
                    )),
                    isShop && merchantGold > 0 && (
                        React.createElement("div", { className: "border-t border-blue-600/20 dark:border-blue-400/20 pt-2 mt-2" },
                            React.createElement("p", null, React.createElement("strong", null, "Wirtschaft:"), ` +${merchantGold.toFixed(0)} GP Händlergold/Woche`),
                            React.createElement("p", null, React.createElement("strong", null, "Wirtschaft:"), ` Max. Gegenstandswert ${merchantGold.toFixed(0)} GP`)
                        )
                    )
                )
            ) : (
                React.createElement("p", { className: "mt-2 text-wood-text/80 dark:text-parchment-bg/70 italic" }, "Dieser Raum bietet bei der aktuellen Größe keine direkten Vorteile.")
            )
        )
    );
};
const RoomBuilderForm = ({ stronghold }) => {
    const [category, setCategory] = useState(Object.keys(COMPONENTS)[0]);
    const [componentName, setComponentName] = useState(Object.keys(COMPONENTS[category])[0]);
    const [classification, setClassification] = useState(getClassificationForComponent(componentName));
    
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

    const handleCategoryChange = (e) => {
        const newCategory = e.target.value;
        setCategory(newCategory);
        setComponentName(Object.keys(COMPONENTS[newCategory])[0]);
    };

    const handleAddComponent = () => {
        const newComponent = {
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
        currentValue,
        setter,
        minDimension
    ) => {
        let value = Math.max(minDimension, currentValue);
        value = Math.round(value / 5) * 5;
        setter(value);
    };

    return (
        React.createElement("div", { className: "space-y-6" },
            React.createElement("div", { className: "grid md:grid-cols-2 gap-6" },
                 React.createElement("div", null,
                    React.createElement("label", { htmlFor: "componentCategory", className: "block font-semibold mb-2 text-wood dark:text-gold-light text-lg" }, "Category"),
                    React.createElement("select", { id: "componentCategory", value: category, onChange: handleCategoryChange, className: "w-full p-3 border-2 border-gold dark:border-gray-500 rounded-md bg-white/80 dark:bg-gray-700 dark:text-parchment-light focus:border-wood dark:focus:border-gold-light focus:outline-none focus:ring-2 focus:ring-wood-light dark:focus:ring-gold-light" },
                        Object.keys(COMPONENTS).map(cat => React.createElement("option", { key: cat, value: cat }, cat))
                    )
                ),
                React.createElement("div", null,
                    React.createElement("label", { htmlFor: "componentSelect", className: "block font-semibold mb-2 text-wood dark:text-gold-light text-lg" }, "Component"),
                    React.createElement("select", { id: "componentSelect", value: componentName, onChange: e => setComponentName(e.target.value), className: "w-full p-3 border-2 border-gold dark:border-gray-500 rounded-md bg-white/80 dark:bg-gray-700 dark:text-parchment-light focus:border-wood dark:focus:border-gold-light focus:outline-none focus:ring-2 focus:ring-wood-light dark:focus:ring-gold-light" },
                        Object.keys(COMPONENTS[category]).map(name => 
                            React.createElement("option", { key: name, value: name },
                                `${name} ${generateComponentSummary(name, category)}`
                            )
                        )
                    )
                )
            ),
            React.createElement("div", null,
                React.createElement("label", { htmlFor: "classification", className: "block font-semibold mb-2 text-wood dark:text-gold-light text-lg" }, "Classification"),
                React.createElement("select", { id: "classification", value: classification, onChange: e => setClassification(e.target.value), className: "w-full p-3 border-2 border-gold dark:border-gray-500 rounded-md bg-white/80 dark:bg-gray-700 dark:text-parchment-light focus:border-wood dark:focus:border-gold-light focus:outline-none focus:ring-2 focus:ring-wood-light dark:focus:ring-gold-light" },
                    React.createElement("option", { value: "military" }, "Militärisch"),
                    React.createElement("option", { value: "industrial" }, "Industriell"),
                    React.createElement("option", { value: "economic" }, "Ökonomisch"),
                    React.createElement("option", { value: "social" }, "Sozial")
                )
            ),
            React.createElement("div", { className: "grid md:grid-cols-2 gap-6" },
                React.createElement("div", null,
                    React.createElement("label", { htmlFor: "length", className: "block font-semibold mb-2 text-wood dark:text-gold-light text-lg" }, "Length (feet)"),
                    React.createElement("input", { type: "number", id: "length", value: length, 
                        onChange: e => setLength(parseInt(e.target.value) || 0), 
                        onBlur: () => handleDimensionBlur(length, setLength, minLength),
                        step: "5", min: minLength, 
                        className: "w-full p-3 border-2 border-gold dark:border-gray-500 rounded-md bg-white/80 dark:bg-gray-700 dark:text-parchment-light focus:border-wood dark:focus:border-gold-light focus:outline-none focus:ring-2 focus:ring-wood-light dark:focus:ring-gold-light" })
                ),
                React.createElement("div", null,
                    React.createElement("label", { htmlFor: "width", className: "block font-semibold mb-2 text-wood dark:text-gold-light text-lg" }, "Width (feet)"),
                    React.createElement("input", { type: "number", id: "width", value: width, 
                        onChange: e => setWidth(parseInt(e.target.value) || 0),
                        onBlur: () => handleDimensionBlur(width, setWidth, minWidth),
                        step: "5", min: minWidth,
                        className: "w-full p-3 border-2 border-gold dark:border-gray-500 rounded-md bg-white/80 dark:bg-gray-700 dark:text-parchment-light focus:border-wood dark:focus:border-gold-light focus:outline-none focus:ring-2 focus:ring-wood-light dark:focus:ring-gold-light" })
                )
            ),
             React.createElement("div", { className: "bg-wood/10 dark:bg-gray-700/30 p-4 rounded-lg border-l-4 border-wood-light dark:border-gray-500 space-y-2" },
                React.createElement("div", { className: "flex justify-between" }, React.createElement("strong", null, "Area:"), React.createElement("span", null, `${area} sq ft`)),
                React.createElement("div", { className: "flex justify-between" }, React.createElement("strong", null, "Cost per sq ft:"), React.createElement("span", null, `${costPerSqFt.toFixed(2)} gp`)),
                React.createElement("div", { className: "flex justify-between" }, React.createElement("strong", null, "Calculated Base Cost:"), React.createElement("span", null, `${calculatedBaseCost.toFixed(0)} gp`)),
                React.createElement("div", { className: "flex justify-between" }, React.createElement("strong", null, "Adjusted Cost (Site Mod):"), React.createElement("span", null, `${adjustedCost.toFixed(0)} gp`))
            ),
            React.createElement(CalculatedBenefitsDisplay, { 
                area: area, 
                benefits: scaledBenefits, 
                componentName: componentName,
                calculatedBaseCost: calculatedBaseCost
            }),
            React.createElement("div", { className: "bg-green-900/10 dark:bg-green-900/30 p-4 rounded-lg border-l-4 border-green-600 dark:border-green-400 space-y-4" },
                React.createElement("h4", { className: "text-xl font-semibold text-green-800 dark:text-green-200" }, "🏗️ Construction Options"),
                React.createElement("div", null,
                    React.createElement("label", { htmlFor: "componentRushCharge", className: "block font-semibold mb-2 text-wood dark:text-gold-light text-lg" }, "⚡ Rush Charge"),
                    React.createElement("select", { id: "componentRushCharge", value: rushPercent, onChange: e => setRushPercent(parseInt(e.target.value)), className: "w-full p-3 border-2 border-gold dark:border-gray-500 rounded-md bg-white/80 dark:bg-gray-700 dark:text-parchment-light focus:border-wood dark:focus:border-gold-light focus:outline-none focus:ring-2 focus:ring-wood-light dark:focus:ring-gold-light" },
                        [0, 10, 20, 30, 40, 50, 60, 70].map(p => React.createElement("option", { key: p, value: p }, p === 0 ? "Standard Construction (0%)" : `Rush ${p}% (+${p}% cost, -${p}% time)`))
                    )
                ),
                 React.createElement("div", { className: "flex justify-between font-bold" }, React.createElement("span", null, "⏱️ Construction Time:"), React.createElement("span", null, `${constructionDays} days`)),
                React.createElement("div", { className: "flex justify-between font-bold text-lg" }, React.createElement("span", null, "💰 Total Cost (with Rush):"), React.createElement("span", null, `${totalCost.toFixed(0)} gp`))
            ),
             React.createElement("div", { className: "bg-blue-900/10 dark:bg-blue-900/30 p-4 rounded-lg border-l-4 border-blue-600 dark:border-blue-400" },
                React.createElement("h4", { className: "text-xl font-semibold text-blue-800 dark:text-blue-200" }, "📖 Room Description"),
                React.createElement("p", { className: "mt-2 text-wood-text/80 dark:text-parchment-bg/70 italic" }, description)
            ),
            React.createElement("button", { onClick: handleAddComponent, className: "w-full sm:w-auto bg-gradient-to-br from-wood-light to-wood-dark text-parchment-bg dark:from-gold dark:to-gold-dark dark:text-wood-dark font-bold py-3 px-6 rounded-lg border-2 border-wood-dark dark:border-gold-dark hover:from-gold-dark hover:to-gold-light hover:text-wood-dark dark:hover:from-gold-light dark:hover:to-gold transition-all duration-300 transform hover:-translate-y-0.5 shadow-md" },
                "➕ Add to Stronghold"
            )
        )
    );
};
const RoomsTab = ({ stronghold }) => {
    return (
        React.createElement("div", null,
            React.createElement("h2", { className: "text-3xl font-medieval text-wood-dark dark:text-gold-light mb-2" }, "🏠 Room Builder"),
            React.createElement("p", { className: "mb-6" }, "Select rooms to build your stronghold. Costs are calculated based on a base cost, affected by site modifiers and rush charges."),
            React.createElement(RoomBuilderForm, { stronghold: stronghold })
        )
    );
};

// --- From components/WallsTab.tsx ---
const WallsTab = ({ stronghold }) => {
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
        const newWall = {
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
         React.createElement("div", null,
            React.createElement("h2", { className: "text-3xl font-medieval text-wood-dark dark:text-gold-light mb-2" }, "🧱 Free-Standing Walls"),
            React.createElement("p", { className: "mb-6" }, "Design fortified walls around your stronghold. Cost is calculated per cubic foot."),
            
            React.createElement("div", { className: "space-y-6" },
                React.createElement("div", { className: "grid md:grid-cols-2 lg:grid-cols-4 gap-6" },
                    React.createElement("div", null,
                        React.createElement("label", { className: "block font-semibold mb-2 text-wood dark:text-gold-light text-lg" }, "Wall Type"),
                        React.createElement("select", { value: wallType, onChange: e => setWallType(e.target.value), className: "w-full p-3 border-2 border-gold dark:border-gray-500 rounded-md bg-white/80 dark:bg-gray-700 dark:text-parchment-light" },
                            Object.keys(WALL_COSTS).map(type => React.createElement("option", { key: type, value: type }, type.charAt(0).toUpperCase() + type.slice(1)))
                        )
                    ),
                     React.createElement("div", null,
                        React.createElement("label", { className: "block font-semibold mb-2 text-wood dark:text-gold-light text-lg" }, "Length (ft)"),
                        React.createElement("input", { type: "number", value: length, onChange: e => setLength(Math.max(1, parseInt(e.target.value) || 1)), className: "w-full p-3 border-2 border-gold dark:border-gray-500 rounded-md bg-white/80 dark:bg-gray-700 dark:text-parchment-light"})
                    ),
                     React.createElement("div", null,
                        React.createElement("label", { className: "block font-semibold mb-2 text-wood dark:text-gold-light text-lg" }, "Height (ft)"),
                        React.createElement("input", { type: "number", value: height, onChange: e => setHeight(Math.max(1, parseInt(e.target.value) || 1)), className: "w-full p-3 border-2 border-gold dark:border-gray-500 rounded-md bg-white/80 dark:bg-gray-700 dark:text-parchment-light"})
                    ),
                     React.createElement("div", null,
                        React.createElement("label", { className: "block font-semibold mb-2 text-wood dark:text-gold-light text-lg" }, "Thickness (ft)"),
                        React.createElement("input", { type: "number", step: "0.5", value: thickness, onChange: e => setThickness(Math.max(0.5, parseFloat(e.target.value) || 0.5)), className: "w-full p-3 border-2 border-gold dark:border-gray-500 rounded-md bg-white/80 dark:bg-gray-700 dark:text-parchment-light"})
                    )
                ),

                 React.createElement("div", { className: "bg-wood/10 dark:bg-gray-700/30 p-4 rounded-lg border-l-4 border-wood-light dark:border-gray-500 space-y-2" },
                    React.createElement("div", { className: "flex justify-between" }, React.createElement("strong", null, "Volume:"), React.createElement("span", null, `${volume.toFixed(1)} cubic ft`)),
                    React.createElement("div", { className: "flex justify-between" }, React.createElement("strong", null, "Base Cost (per cubic ft):"), React.createElement("span", null, `${baseCostPerFt.toFixed(2)} gp`)),
                    React.createElement("div", { className: "flex justify-between font-bold" }, React.createElement("strong", null, "Base Total Cost:"), React.createElement("span", null, `${baseTotalCost.toFixed(0)} gp`))
                 ),

                 React.createElement("div", { className: "bg-green-900/10 dark:bg-green-900/30 p-4 rounded-lg border-l-4 border-green-600 dark:border-green-400 space-y-4" },
                     React.createElement("h4", { className: "text-xl font-semibold text-green-800 dark:text-green-200" }, "🏗️ Construction Options"),
                     React.createElement("label", { className: "block font-semibold mb-2 text-wood dark:text-gold-light text-lg" }, "⚡ Rush Charge"),
                     React.createElement("select", { value: rushPercent, onChange: e => setRushPercent(parseInt(e.target.value)), className: "w-full p-3 border-2 border-gold dark:border-gray-500 rounded-md bg-white/80 dark:bg-gray-700 dark:text-parchment-light" },
                         [0, 10, 20, 30, 40, 50, 60, 70].map(p => React.createElement("option", { key: p, value: p }, p === 0 ? "Standard Construction (0%)" : `Rush ${p}% (+${p}% cost, -${p}% time)`))
                     ),
                     React.createElement("div", { className: "flex justify-between font-bold" }, React.createElement("span", null, "⏱️ Construction Time:"), React.createElement("span", null, `${constructionDays} days`)),
                     React.createElement("div", { className: "flex justify-between font-bold text-lg" }, React.createElement("span", null, "💰 Total Cost (with Rush):"), React.createElement("span", null, `${totalCost.toFixed(0)} gp`))
                 ),

                 React.createElement("div", { className: "bg-blue-900/10 dark:bg-blue-900/30 p-4 rounded-lg border-l-4 border-blue-600 dark:border-blue-400" },
                    React.createElement("h4", { className: "text-xl font-semibold text-blue-800 dark:text-blue-200" }, "📖 Material Description"),
                    React.createElement("p", { className: "mt-2 text-wood-text/80 dark:text-parchment-bg/70 italic" }, description)
                 ),
                 
                 React.createElement("div", { className: "bg-red-900/10 dark:bg-red-900/30 p-4 rounded-lg border-l-4 border-red-600 dark:border-red-400" },
                     React.createElement("h4", { className: "text-xl font-semibold text-red-800 dark:text-red-200" }, "🛡️ Wall Durability (per 5'x5' segment)"),
                     durability ? (
                        React.createElement("div", { className: "mt-2 grid grid-cols-3 gap-4 text-center" },
                            React.createElement("div", null, React.createElement("div", { className: "font-bold text-lg" }, durabilityHpDisplay), React.createElement("div", null, "HP")),
                            React.createElement("div", null, React.createElement("div", { className: "font-bold text-lg" }, durability.ac), React.createElement("div", null, "AC")),
                            React.createElement("div", null, React.createElement("div", { className: "font-bold text-lg" }, durability.damageThreshold), React.createElement("div", null, "Threshold"))
                        )
                     ) : React.createElement("p", null, "Select a wall type.")
                 ),

                React.createElement("button", { onClick: handleAddWall, className: "w-full sm:w-auto bg-gradient-to-br from-wood-light to-wood-dark text-parchment-bg dark:from-gold dark:to-gold-dark dark:text-wood-dark font-bold py-3 px-6 rounded-lg border-2 border-wood-dark dark:border-gold-dark hover:from-gold-dark hover:to-gold-light hover:text-wood-dark dark:hover:from-gold-light dark:hover:to-gold transition-all duration-300 transform hover:-translate-y-0.5 shadow-md" },
                    "➕ Add Wall Section"
                )
            )
        )
    );
};

// --- From components/StaffTab.tsx ---
const RESOURCE_SUGGESTIONS = {
    servantQuarterSpace: "Baue 'Servants' quarters'.",
    barracksSpace: "Baue 'Barracks'.",
    bedroomSpace: "Baue 'Bedrooms'.",
    suiteSpace: "Baue eine 'Bedroom suite'.",
    food: "Baue eine 'Kitchen'.",
    diningHallSeat: "Baue eine 'Dining hall'.",
    armorySpace: "Baue eine 'Armory'.",
    bath: "Baue ein 'Bath'.",
    stallSpace: "Baue 'Stable' und stelle einen 'Stablemaster' ein.",
};

const MountPurchaseForm = ({ stronghold }) => {
    const { addStaff, resources, getAllPerks } = stronghold;
    const [mountKey, setMountKey] = useState(Object.keys(MOUNT_DATA)[0]);
    const [quantity, setQuantity] = useState(1);
    const [customName, setCustomName] = useState('');
    const { staticPerks } = getAllPerks();

    const selectedMount = MOUNT_DATA[mountKey];
    const totalCost = selectedMount ? selectedMount.cost * quantity : 0;
    const totalSlots = selectedMount ? selectedMount.size * quantity : 0;

    const validationResult = useMemo(() => {
        const messages = [];
        if (!selectedMount) return { isValid: false, messages: [] };

        // Check perks
        if (selectedMount.requiredPerk) {
            const hasPerk = staticPerks.some(p => p.id === selectedMount.requiredPerk);
            if (!hasPerk) {
                messages.push(`Benötigt Perk: ${selectedMount.requiredPerk} (Upgrade deine Ställe).`);
            }
        }

        // Check space
        if (resources.stallSpace.capacity < resources.stallSpace.demand + totalSlots) {
            const missing = (resources.stallSpace.demand + totalSlots) - resources.stallSpace.capacity;
            messages.push(`Nicht genug Stallplatz. Benötigt: ${missing} weitere Slots. ${RESOURCE_SUGGESTIONS.stallSpace}`);
        }

        return { isValid: messages.length === 0, messages };
    }, [selectedMount, quantity, resources, staticPerks, totalSlots]);

    const handleAddMount = () => {
        if (quantity > 0 && validationResult.isValid && selectedMount) {
             const newMount = {
                hirelingType: selectedMount.name,
                hirelingKey: mountKey,
                customRole: customName.trim(),
                quantity,
                costPerUnit: selectedMount.cost,
                totalCost,
                cr: 0, // Mounts usually don't fight in this simple abstract simulation unless logic added
                isVolunteer: false,
                isMount: true,
                mountSize: selectedMount.size
            };
            addStaff(newMount);
            setQuantity(1);
            setCustomName('');
        }
    };

    return (
         React.createElement("div", { className: "bg-wood/10 dark:bg-gray-700/30 p-6 rounded-lg border-2 border-wood-light dark:border-gray-600 space-y-6 mb-8" },
            React.createElement("h3", { className: "text-2xl font-medieval text-wood-dark dark:text-gold-light -mb-2" }, "🐎 Purchase Mounts"),
            React.createElement("div", { className: "grid md:grid-cols-2 gap-6" },
                React.createElement("div", null,
                    React.createElement("label", { className: "block font-semibold mb-2 text-wood dark:text-gold-light text-lg" }, "Mount Type"),
                    React.createElement("select", { value: mountKey, onChange: e => setMountKey(e.target.value), className: "w-full p-3 border-2 border-gold dark:border-gray-500 rounded-md bg-white/80 dark:bg-gray-700 dark:text-parchment-light" },
                        Object.entries(MOUNT_DATA).map(([key, data]) => (
                            React.createElement("option", { key: key, value: key }, `${data.name} (${data.size} Slot${data.size > 1 ? 's' : ''}, ${data.cost.toFixed(1)} gp/Woche)`)
                        ))
                    )
                ),
                 React.createElement("div", null,
                    React.createElement("label", { className: "block font-semibold mb-2 text-wood dark:text-gold-light text-lg" }, "Quantity"),
                    React.createElement("input", { type: "number", value: quantity, onChange: e => setQuantity(Math.max(1, parseInt(e.target.value) || 1)), className: "w-full p-3 border-2 border-gold dark:border-gray-500 rounded-md bg-white/80 dark:bg-gray-700 dark:text-parchment-light" })
                )
            ),
             React.createElement("div", null,
                React.createElement("label", { className: "block font-semibold mb-2 text-wood dark:text-gold-light text-lg" }, "Custom Name (Optional)"),
                React.createElement("input", { type: "text", value: customName, onChange: e => setCustomName(e.target.value), placeholder: "e.g., Shadowfax, Betsy", className: "w-full p-3 border-2 border-gold dark:border-gray-500 rounded-md bg-white/80 dark:bg-gray-700 dark:text-parchment-light" })
            ),
            React.createElement("div", { className: "bg-parchment-light/50 dark:bg-gray-800/40 p-4 rounded-lg text-lg space-y-1" },
                React.createElement("div", { className: "flex justify-between" },
                    React.createElement("span", null, "Total Weekly Maintenance:"),
                    React.createElement("span", { className: "font-bold" }, `${totalCost.toFixed(2)} gp`)
                ),
                React.createElement("div", { className: "flex justify-between text-sm text-wood-text/80 dark:text-parchment-bg/70" },
                     React.createElement("span", null, "Required Stall Slots:"),
                     React.createElement("span", null, `${totalSlots}`)
                )
            ),
            !validationResult.isValid && (
              React.createElement("div", { className: "bg-red-200/50 dark:bg-red-900/40 p-4 rounded-lg border border-red-500 dark:border-red-600 text-red-800 dark:text-red-200 space-y-1" },
                React.createElement("h4", { className: "font-bold text-lg" }, "Voraussetzungen nicht erfüllt:"),
                React.createElement("ul", { className: "list-disc list-inside text-sm" },
                  validationResult.messages.map((msg, i) => React.createElement("li", { key: i }, msg))
                )
              )
            ),
            React.createElement("button", { 
                onClick: handleAddMount, 
                disabled: !validationResult.isValid,
                className: "w-full sm:w-auto bg-gradient-to-br from-wood-light to-wood-dark text-parchment-bg dark:from-gold dark:to-gold-dark dark:text-wood-dark font-bold py-3 px-6 rounded-lg border-2 border-wood-dark dark:border-gold-dark hover:from-gold-dark hover:to-gold-light hover:text-wood-dark dark:hover:from-gold-light dark:hover:to-gold transition-all duration-300 transform hover:-translate-y-0.5 shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
            },
                "➕ Buy Mount(s)"
            )
        )
    )
}

const HirelingForm = ({ stronghold }) => {
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
        const messages = [];
        const hirelingInfo = HIRELING_DATA[hirelingKey];
        if (!hirelingInfo) return { isValid: false, messages: ["Ungültiger Anstellungstyp ausgewählt."] };

        const totalStaffCount = staff.reduce((acc, s) => !s.isMount ? acc + s.quantity : acc, 0);

        // Common Requirements for Everyone (Including Volunteers)
        // Food
        if (resources.food.capacity < resources.food.demand + quantity) {
            messages.push(`Benötigt: ${resources.food.demand + quantity - resources.food.capacity} mehr Nahrung. ${RESOURCE_SUGGESTIONS.food}`);
        }

        // Baths (Rough check)
        const requiredBaths = Math.ceil((totalStaffCount + quantity) / 10);
        if (resources.bath.capacity < requiredBaths) {
            messages.push(`Benötigt: ${requiredBaths - resources.bath.capacity} mehr Bad/Bäder. ${RESOURCE_SUGGESTIONS.bath}`);
        }

        // Calculate Total Housing Stats
        const housingTypes = ['servantQuarterSpace', 'barracksSpace', 'bedroomSpace', 'suiteSpace'];
        let totalHousingCapacity = 0;
        let totalHousingDemand = 0;
        
        housingTypes.forEach(type => {
            totalHousingCapacity += resources[type].capacity || 0;
            totalHousingDemand += resources[type].demand || 0; // Demand here includes existing volunteers due to waterfall
        });

        if (isVolunteer) {
            // Volunteer Logic: Flexible
            // Check if there is ANY total housing space left
            if (totalHousingCapacity < totalHousingDemand + quantity) {
                 messages.push(`Keine freien Schlafplätze mehr vorhanden (Freiwillige nehmen jeden freien Platz). Benötigt: ${totalHousingDemand + quantity - totalHousingCapacity} weitere Betten.`);
            }
            
            return { isValid: messages.length === 0, messages };
        } else {
            // Paid Staff Logic: Rigid + Displacement
            
            // 1. Dining Seats (Paid only)
            if (resources.diningHallSeat.capacity < resources.diningHallSeat.demand + quantity) {
                messages.push(`Benötigt: ${resources.diningHallSeat.demand + quantity - resources.diningHallSeat.capacity} mehr Essensplätze. ${RESOURCE_SUGGESTIONS.diningHallSeat}`);
            }

            // 2. Armory (Paid soldiers only)
            if (hirelingKey !== 'unskilled' && hirelingKey !== 'skilled') {
                if (resources.armorySpace.capacity < resources.armorySpace.demand + quantity) {
                    const needed = resources.armorySpace.demand + quantity - resources.armorySpace.capacity;
                    messages.push(`Benötigt: ${needed} mehr Waffenkammer-Plätze. ${RESOURCE_SUGGESTIONS.armorySpace}`);
                }
            }

            // 3. Housing Logic for Paid Staff
            // We need to check two things:
            // A) Is there enough specific capacity for paid staff (ignoring current volunteers)?
            // B) Is there enough total capacity for everyone (paid + volunteers + new guy)?
            
            let accommodationType = null;
            let accommodationName = '';
            if (hirelingKey === 'unskilled') { accommodationType = 'servantQuarterSpace'; accommodationName = "Dienerquartier-Plätze"; } 
            else if (hirelingKey === 'skilled') { accommodationType = 'bedroomSpace'; accommodationName = "Schlafzimmer-Plätze"; } 
            else if (hirelingInfo.cr <= 0.5) { accommodationType = 'barracksSpace'; accommodationName = "Kasernen-Plätze"; } 
            else if (hirelingInfo.cr <= 2) { accommodationType = 'bedroomSpace'; accommodationName = "Schlafzimmer-Plätze"; } 
            else if (hirelingInfo.cr >= 3) { accommodationType = 'suiteSpace'; accommodationName = "Suiten-Plätze"; }

            if (accommodationType) {
                const resource = resources[accommodationType];
                
                // Check A: Specific Rigid Capacity
                // RigidDemand tracks only paid staff. 
                // If Capacity < RigidDemand + NewQuantity, we physically lack the correct beds for paid staff.
                if (resource.capacity < resource.rigidDemand + quantity) {
                     const needed = resource.rigidDemand + quantity - resource.capacity;
                     messages.push(`Benötigt: ${needed} mehr ${accommodationName} für bezahltes Personal. ${RESOURCE_SUGGESTIONS[accommodationType]}`);
                } 
                // Check B: Total Displacement Capacity
                // If specific beds are fine (Check A passes), we must ensure volunteers have *somewhere* to go.
                else if (totalHousingCapacity < totalHousingDemand + quantity) {
                    // totalHousingDemand includes existing volunteers.
                    const globalMissing = (totalHousingDemand + quantity) - totalHousingCapacity;
                    messages.push(`Nicht genug Gesamt-Schlafplätze. Zwar ist Platz im ${accommodationName}, aber verdrängte Freiwillige finden kein Bett. Baue ${globalMissing} beliebige Betten.`);
                }
            }
        }

        return { isValid: messages.length === 0, messages };
    }, [hirelingKey, quantity, resources, staff, isVolunteer]);


    const handleAddStaff = () => {
        if (quantity > 0 && validationResult.isValid) {
            const hirelingData = HIRELING_DATA[hirelingKey];
            if (!hirelingData) return;

            const newStaff = {
                hirelingType: hirelingData.name,
                hirelingKey: hirelingKey,
                customRole: customRole.trim(),
                quantity,
                costPerUnit,
                totalCost,
                cr: hirelingData.cr,
                isVolunteer,
                isMount: false
            };
            addStaff(newStaff);
            setCustomRole('');
            setQuantity(1);
            setIsVolunteer(false);
        }
    };
    
    return (
         React.createElement("div", { className: "bg-wood/10 dark:bg-gray-700/30 p-6 rounded-lg border-2 border-wood-light dark:border-gray-600 space-y-6 mb-8" },
            React.createElement("h3", { className: "text-2xl font-medieval text-wood-dark dark:text-gold-light -mb-2" }, "Hire New Staff"),
            React.createElement("div", { className: "grid md:grid-cols-2 gap-6" },
                React.createElement("div", null,
                    React.createElement("label", { className: "block font-semibold mb-2 text-wood dark:text-gold-light text-lg" }, "Hireling Type"),
                    React.createElement("select", { value: hirelingKey, onChange: e => setHirelingKey(e.target.value), className: "w-full p-3 border-2 border-gold dark:border-gray-500 rounded-md bg-white/80 dark:bg-gray-700 dark:text-parchment-light" },
                        Object.entries(HIRELING_DATA).map(([key, data]) => (
                            React.createElement("option", { key: key, value: key }, `${data.name} (${data.cost} gp/Woche)`)
                        ))
                    )
                ),
                 React.createElement("div", null,
                    React.createElement("label", { className: "block font-semibold mb-2 text-wood dark:text-gold-light text-lg" }, "Quantity"),
                    React.createElement("input", { type: "number", value: quantity, onChange: e => setQuantity(Math.max(1, parseInt(e.target.value) || 1)), className: "w-full p-3 border-2 border-gold dark:border-gray-500 rounded-md bg-white/80 dark:bg-gray-700 dark:text-parchment-light" })
                )
            ),
             React.createElement("div", null,
                React.createElement("label", { className: "block font-semibold mb-2 text-wood dark:text-gold-light text-lg" }, "Custom Role (Optional)"),
                React.createElement("input", { type: "text", value: customRole, onChange: e => setCustomRole(e.target.value), placeholder: "e.g., Spy, Gardener, Guard Captain", className: "w-full p-3 border-2 border-gold dark:border-gray-500 rounded-md bg-white/80 dark:bg-gray-700 dark:text-parchment-light" })
            ),
            React.createElement("div", null,
                React.createElement("div", { className: "flex items-center space-x-3" },
                    React.createElement("input", { id: "volunteer-check", type: "checkbox", checked: isVolunteer, onChange: e => setIsVolunteer(e.target.checked), className: "h-5 w-5 rounded border-gold dark:border-gray-500 text-wood dark:text-gold-dark focus:ring-wood-light dark:focus:ring-gold-light" }),
                    React.createElement("label", { htmlFor: "volunteer-check", className: "font-semibold text-wood-dark dark:text-gold-light cursor-pointer" },
                        "Hire as Volunteer (2 sp/day)"
                    )
                ),
                React.createElement("p", { className: "text-sm text-wood-text/70 dark:text-parchment-bg/60 mt-1 italic pl-8" },
                    "Freiwillige benötigen Nahrung und irgendeinen Schlafplatz, sind aber flexibel in der Unterbringung."
                )
            ),
            React.createElement("div", { className: "bg-parchment-light/50 dark:bg-gray-800/40 p-4 rounded-lg text-lg" },
                React.createElement("div", { className: "flex justify-between" },
                    React.createElement("span", null, "Total Weekly Cost for Selection:"),
                    React.createElement("span", { className: "font-bold" }, `${totalCost.toFixed(2)} gp`)
                )
            ),
            !validationResult.isValid && (
              React.createElement("div", { className: "bg-red-200/50 dark:bg-red-900/40 p-4 rounded-lg border border-red-500 dark:border-red-600 text-red-800 dark:text-red-200 space-y-1" },
                React.createElement("h4", { className: "font-bold text-lg" }, "Voraussetzungen nicht erfüllt:"),
                React.createElement("ul", { className: "list-disc list-inside text-sm" },
                  validationResult.messages.map((msg, i) => React.createElement("li", { key: i }, msg))
                )
              )
            ),
            React.createElement("button", { 
                onClick: handleAddStaff, 
                disabled: !validationResult.isValid,
                className: "w-full sm:w-auto bg-gradient-to-br from-wood-light to-wood-dark text-parchment-bg dark:from-gold dark:to-gold-dark dark:text-wood-dark font-bold py-3 px-6 rounded-lg border-2 border-wood-dark dark:border-gold-dark hover:from-gold-dark hover:to-gold-light hover:text-wood-dark dark:hover:from-gold-light dark:hover:to-gold transition-all duration-300 transform hover:-translate-y-0.5 shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
            },
                "➕ Add Hireling(s)"
            )
        )
    )
}
const StaffTab = ({ stronghold }) => {
    const { staff, components, assignStaffToJob, unassignStaffFromJob, removeStaff, resources, requiredServants, currentServants, missingServants } = stronghold;
    const [pendingDismissal, setPendingDismissal] = useState(null);

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

    const handleDragStart = (e, staffId) => {
        e.dataTransfer.setData("staffId", staffId);
    };

    const handleDropOnJob = (e, job) => {
        e.preventDefault();
        if (job.filledBy) return; // Can't drop on a filled slot
        const staffId = e.dataTransfer.getData("staffId");
        if (staffId) {
            const staffMember = staff.find(s => s.id === staffId);
            if (staffMember && staffMember.hirelingKey === 'skilled') {
                assignStaffToJob(staffId, job.id);
            }
        }
    };
    
    const handleDropOnAvailable = (e) => {
        e.preventDefault();
        const staffId = e.dataTransfer.getData("staffId");
        const staffMember = staff.find(s => s.id === staffId);
        if (staffMember && staffMember.assignedJobId) {
            unassignStaffFromJob(staffId);
        }
    };

    const allowDrop = (e) => {
        e.preventDefault();
    };
    
    const handleDismissal = (staffId) => {
        if (pendingDismissal === staffId) {
            removeStaff(staffId);
            setPendingDismissal(null);
        } else {
            setPendingDismissal(staffId);
        }
    };

    const ResourceRow = ({ label, resourceKey }) => {
        const { capacity, demand } = resources[resourceKey];
        const isDeficit = demand > capacity;
        return (
            React.createElement("div", { className: `flex justify-between items-baseline p-1 rounded ${isDeficit ? 'bg-red-300/50 dark:bg-red-900/40' : ''}` },
                React.createElement("span", null, `${label}:`),
                React.createElement("span", { className: `font-bold text-lg ${isDeficit ? 'text-red-800 dark:text-red-300' : ''}` }, `${demand} / ${capacity}`)
            )
        );
    };

    const DismissButton = ({ staffId }) => {
        const isPending = pendingDismissal === staffId;
        return (
            React.createElement("button", {
                onClick: () => handleDismissal(staffId),
                title: isPending ? 'Confirm Dismissal' : 'Dismiss Staff',
                className: `text-sm font-bold transition-all duration-200 rounded px-2 py-1 ${isPending ? 'bg-yellow-500 text-black animate-pulse' : 'text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-800'}`
            },
                isPending ? 'Confirm?' : '👢'
            )
        );
    };

    return (
        React.createElement("div", null,
            React.createElement("h2", { className: "text-3xl font-medieval text-wood-dark dark:text-gold-light mb-2" }, "👥 Staff & Hirelings"),
            React.createElement("p", { className: "mb-6" }, "Hire staff and assign them to jobs within your stronghold. Drag and drop 'Skilled Hirelings' to assign them."),
            React.createElement("div", { className: "bg-wood/10 dark:bg-gray-700/30 p-6 rounded-lg border-2 border-wood-light dark:border-gray-600 space-y-2 mb-8" },
                React.createElement("h3", { className: "text-2xl font-medieval text-wood-dark dark:text-gold-light mb-2 text-center" }, "🛏️ Unterkünfte & Versorgung"),
                React.createElement(ResourceRow, { label: "Dienerquartiere", resourceKey: "servantQuarterSpace" }),
                React.createElement(ResourceRow, { label: "Kasernen", resourceKey: "barracksSpace" }),
                React.createElement(ResourceRow, { label: "Schlafzimmer", resourceKey: "bedroomSpace" }),
                React.createElement(ResourceRow, { label: "Suiten", resourceKey: "suiteSpace" }),
                React.createElement(ResourceRow, { label: "Stall Space (für Mounts)", resourceKey: "stallSpace" }),
                React.createElement(ResourceRow, { label: "Nahrung", resourceKey: "food" }),
                React.createElement(ResourceRow, { label: "Essensplätze", resourceKey: "diningHallSeat" }),
                
                React.createElement("div", { className: "border-t border-wood-light/30 dark:border-gray-500/30 my-2" }),
                
                // Wartungspersonal (Diener) Anzeige
                React.createElement("div", { className: `flex flex-col p-1 rounded ${missingServants > 0 ? 'bg-red-300/50 dark:bg-red-900/40' : ''}` },
                    React.createElement("div", { className: "flex justify-between items-baseline" },
                        React.createElement("span", null, "Allgemeine Wartung (Diener):"),
                        React.createElement("span", { className: `font-bold text-lg ${missingServants > 0 ? 'text-red-800 dark:text-red-300' : 'text-green-800 dark:text-green-300'}` }, 
                            `${currentServants} / ${requiredServants}`
                        )
                    ),
                     React.createElement("div", { className: "text-xs text-right italic opacity-80" }, "(1 Diener pro 2000 sq ft benötigt)"),
                     missingServants > 0 && React.createElement("div", { className: "text-xs text-red-800 dark:text-red-300 font-bold text-right" }, `ACHTUNG: +${missingServants * 100}% Wartungskosten!`)
                )

            ),
            React.createElement(HirelingForm, { stronghold: stronghold }),
            React.createElement(MountPurchaseForm, { stronghold: stronghold }),
            React.createElement("div", { className: "grid lg:grid-cols-2 gap-8" },
                React.createElement("div", { onDrop: handleDropOnAvailable, onDragOver: allowDrop },
                    React.createElement("h3", { className: "text-2xl font-medieval text-wood-dark dark:text-gold-light mb-4" }, "✅ Available Staff & Mounts"),
                    React.createElement("div", { className: "bg-wood/5 dark:bg-gray-800/20 p-4 rounded-lg min-h-[300px] border-2 border-dashed border-wood-light/50 dark:border-gray-600/50 space-y-2" },
                        availableStaff.length > 0 ? availableStaff.map(s => {
                            const isSkilled = s.hirelingKey === 'skilled';
                            const isMount = !!s.isMount;
                            const crLabel = s.cr > 0 ? ` (CR ${s.cr})` : '';
                            return (
                                React.createElement("div", { key: s.id, 
                                     draggable: isSkilled, 
                                     onDragStart: isSkilled ? (e) => handleDragStart(e, s.id) : undefined,
                                     title: isMount ? "Tiere arbeiten nicht (meistens)." : (!isSkilled ? "Nur Fachkräfte (Skilled Hirelings) können zugewiesen werden." : s.customRole || s.hirelingType),
                                     className: `p-3 rounded shadow-sm border transition-all flex justify-between items-center 
                                        ${isMount ? 'bg-amber-100 dark:bg-amber-900/40 border-amber-500 dark:border-amber-600' : 'bg-parchment-light dark:bg-gray-700 border-gold-dark dark:border-gray-500'}
                                        ${isSkilled ? 'cursor-grab hover:shadow-md' : 'cursor-not-allowed opacity-80'}
                                     `},
                                    React.createElement("div", null,
                                        React.createElement("div", { className: "font-bold flex items-center" }, 
                                            isMount && React.createElement("span", { className: "mr-2 text-xl" }, "🐎"),
                                            `${s.customRole || s.hirelingType}${crLabel} (x${s.quantity})`
                                        ),
                                        React.createElement("div", { className: "text-sm text-wood-text/80 dark:text-parchment-bg/70" }, 
                                            s.isVolunteer ? 'Volunteer' : `${s.totalCost.toFixed(2)} gp/week`
                                        ),
                                        isMount && React.createElement("div", { className: "text-xs text-wood-text/60 dark:text-parchment-bg/50" }, `Benötigt ${s.mountSize * s.quantity} Stallplatz`)
                                    ),
                                    React.createElement(DismissButton, { staffId: s.id })
                                )
                            )
                        }) : (
                            React.createElement("div", { className: "flex items-center justify-center h-full text-center text-wood-text/70 dark:text-parchment-bg/60 italic p-8" },
                                "No available staff or mounts. Hire new staff/buy mounts."
                            )
                        )
                    )
                ),
                React.createElement("div", null,
                    React.createElement("h3", { className: "text-2xl font-medieval text-wood-dark dark:text-gold-light mb-4" }, "📋 Open Positions"),
                    React.createElement("div", { className: "bg-wood/5 dark:bg-gray-800/20 p-4 rounded-lg min-h-[300px] border border-wood-light/50 dark:border-gray-600 space-y-2" },
                        openPositions.length > 0 ? openPositions.map(job => {
                            const assignedStaff = job.filledBy ? staff.find(s => s.id === job.filledBy) : null;
                            const assignedCrLabel = (assignedStaff && assignedStaff.cr > 0) ? ` (CR ${assignedStaff.cr})` : '';
                            return (
                                React.createElement("div", { key: job.id, onDrop: (e) => handleDropOnJob(e, job), onDragOver: allowDrop,
                                     className: `p-3 rounded border ${assignedStaff ? 'bg-green-200/80 dark:bg-green-900/50 border-green-700 dark:border-green-600' : 'bg-parchment/60 dark:bg-gray-700/30 border-gray-400 border-dashed hover:bg-parchment dark:hover:bg-gray-600/50'}`},
                                    React.createElement("div", { className: "font-semibold text-wood-dark dark:text-gold-light" }, `${job.role} `, React.createElement("span", { className: "text-sm font-normal text-wood-text/80 dark:text-parchment-bg/70" }, `(${job.componentName})`)),
                                    assignedStaff ? (
                                         // Fix: Cast props to any to avoid TS overload error with 'draggable'
                                         React.createElement("div", { draggable: true, onDragStart: (e) => handleDragStart(e, assignedStaff.id),
                                             className: "p-2 mt-1 bg-white dark:bg-gray-800 rounded shadow-inner cursor-grab"},
                                            React.createElement("div", { className: "flex justify-between items-center" },
                                                React.createElement("div", null,
                                                    React.createElement("div", { className: "font-bold" }, `${assignedStaff.customRole || assignedStaff.hirelingType}${assignedCrLabel}`),
                                                    React.createElement("div", { className: "text-xs text-wood-text/80 dark:text-parchment-bg/70" }, assignedStaff.isVolunteer ? 'Volunteer' : `${assignedStaff.totalCost.toFixed(2)} gp/week`)
                                                ),
                                                React.createElement(DismissButton, { staffId: assignedStaff.id })
                                            )
                                        )
                                    ) : (
                                        React.createElement("div", { className: "text-center text-gray-500 dark:text-gray-400 italic text-sm p-2" }, "Drop Skilled Hireling here")
                                    )
                                )
                            )
                        }) : (
                             React.createElement("div", { className: "flex items-center justify-center h-full text-center text-wood-text/70 dark:text-parchment-bg/60 italic p-8" },
                                "No open positions available. Construct buildings that require staff."
                            )
                        )
                    )
                )
            )
        )
    );
};

// --- From components/SocialTab.tsx ---
const SocialTab = ({ stronghold }) => {
    const { 
        socialValue, 
        comparisonValue, 
        salaryReductionPercentage, 
        baseStaffTotalWeekly, 
        staffTotalWeekly,
        priestCount,
        potentialPriestBonus,
        actualPriestBonus,
        totalChapelValue
    } = stronghold;

    const savings = baseStaffTotalWeekly - staffTotalWeekly;
    const isCapped = potentialPriestBonus > totalChapelValue;

    const InfoRowSocial = ({ label, value, tooltip, className = '' }) => (
        React.createElement("div", { className: `flex justify-between items-center py-2 border-b border-wood-light/30 dark:border-parchment-bg/20 ${className}`, title: tooltip },
            React.createElement("span", null, `${label}:`),
            React.createElement("span", { className: "font-bold text-lg" }, value)
        )
    );

    return (
        React.createElement("div", null,
            React.createElement("h2", { className: "text-3xl font-medieval text-wood-dark dark:text-gold-light mb-2" }, "🤝 Soziales & Moral"),
            React.createElement("p", { className: "mb-6" }, "Soziale Gebäude verbessern die Lebensqualität und Moral deiner Angestellten. Eine hohe Moral führt zu geringeren Gehaltsforderungen, da die Angestellten zufriedener sind."),
            React.createElement("div", { className: "grid md:grid-cols-1 lg:grid-cols-2 gap-8" },
                React.createElement("div", { className: "space-y-6" },
                    // Gehaltsreduktion Box
                    React.createElement("div", { className: "bg-blue-900/10 dark:bg-blue-900/30 p-6 rounded-lg border-2 border-blue-800/50 dark:border-blue-500/50 shadow-lg" },
                        React.createElement("h3", { className: "text-2xl font-semibold text-center mb-4 text-blue-900 dark:text-blue-200" }, "Berechnung der Gehaltsreduktion"),
                        React.createElement("div", { className: "space-y-3 bg-black/10 dark:bg-black/20 p-4 rounded" },
                            React.createElement(InfoRowSocial, { 
                                label: "Sozialer Wert (Gesamt)", 
                                value: `${socialValue.toFixed(0)} GP`, 
                                tooltip: "Der Gesamtwert aller fertiggestellten sozialen Gebäude plus Boni (z.B. durch Priester)." 
                            }),
                            React.createElement(InfoRowSocial, { 
                                label: "Vergleichswert", 
                                value: `${comparisonValue.toFixed(0)} GP`, 
                                tooltip: "Die doppelte Summe des militärischen, industriellen und ökonomischen Wertes. Dient als Maßstab für die 'produktive' Größe der Festung." 
                            }),
                            React.createElement("div", { className: "flex justify-between items-baseline border-t-2 border-blue-800/40 dark:border-blue-400/40 pt-3 mt-3 font-bold text-xl text-blue-800 dark:text-blue-200" },
                                React.createElement("span", null, "Gehaltsreduktion:"),
                                React.createElement("span", null, `${salaryReductionPercentage.toFixed(2)}%`)
                            )
                        )
                    ),
                    // Neuer Priester Bonus Block
                    React.createElement("div", { className: "bg-purple-900/10 dark:bg-purple-900/30 p-6 rounded-lg border-2 border-purple-800/50 dark:border-purple-500/50 shadow-lg" },
                        React.createElement("h3", { className: "text-2xl font-semibold text-center mb-4 text-purple-900 dark:text-purple-200" }, "Göttlicher Beistand"),
                        React.createElement("div", { className: "space-y-3 bg-black/10 dark:bg-black/20 p-4 rounded" },
                             React.createElement(InfoRowSocial, { 
                                label: "Aktive Priester", 
                                value: `${priestCount}`,
                                tooltip: "Anzahl der Priester, die in Kapellen arbeiten."
                            }),
                            React.createElement(InfoRowSocial, { 
                                label: "Priester-Bonus", 
                                value: `+${(priestCount * 10).toFixed(0)}%`,
                                tooltip: "Jeder Priester erhöht den sozialen Wert um 10%."
                            }),
                            React.createElement("div", { className: "flex justify-between items-center py-2 border-b border-wood-light/30 dark:border-parchment-bg/20", title: "Der Bonus ist auf den Gesamtwert aller Kapellen begrenzt." },
                                React.createElement("span", null, "Aktueller Bonuswert:"),
                                React.createElement("span", { className: `font-bold text-lg ${isCapped ? 'text-red-600 dark:text-red-400' : 'text-green-700 dark:text-green-400'}` }, 
                                    `${actualPriestBonus.toFixed(0)} GP`
                                )
                            ),
                            React.createElement(InfoRowSocial, { 
                                label: "Kapellen-Limit (Cap)", 
                                value: `${totalChapelValue.toFixed(0)} GP`,
                                tooltip: "Der maximale Bonus, den deine Kapellen kanalisieren können."
                            }),
                            isCapped && (
                                React.createElement("div", { className: "mt-2 text-sm text-red-800 dark:text-red-300 font-bold text-center animate-pulse" },
                                    `Limit erreicht! Baue mehr Kapellen, um ${Math.round(potentialPriestBonus - actualPriestBonus)} GP Bonus freizuschalten.`
                                )
                            )
                        )
                    )
                ),
                React.createElement("div", { className: "bg-green-900/10 dark:bg-green-900/30 p-6 rounded-lg border-2 border-green-800/50 dark:border-green-500/50 shadow-lg h-min" },
                    React.createElement("h3", { className: "text-2xl font-semibold text-center mb-4 text-green-900 dark:text-green-200" }, "Auswirkung auf Gehälter"),
                     React.createElement("div", { className: "space-y-3 bg-black/10 dark:bg-black/20 p-4 rounded" },
                        React.createElement(InfoRowSocial, { 
                            label: "Ursprüngliche Gehälter", 
                            value: `${baseStaffTotalWeekly.toFixed(2)} GP/Woche`
                        }),
                        React.createElement(InfoRowSocial, { 
                            label: "Einsparung", 
                            value: `-${savings.toFixed(2)} GP/Woche`,
                            className: 'text-yellow-600 dark:text-yellow-400'
                        }),
                        React.createElement("div", { className: "flex justify-between items-baseline border-t-2 border-green-800/40 dark:border-green-400/40 pt-3 mt-3 font-bold text-xl text-green-800 dark:text-green-200" },
                            React.createElement("span", null, "Endgültige Gehälter:"),
                            React.createElement("span", null, `${staffTotalWeekly.toFixed(2)} GP/Woche`)
                        )
                    )
                )
            )
        )
    );
};


// --- From components/ConstructionTab.tsx ---
const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
    if (!isOpen) return null;
    return React.createElement("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" },
        React.createElement("div", { className: "bg-parchment-bg dark:bg-gray-800 w-full max-w-md p-0 rounded-lg border-4 border-wood dark:border-gold-dark shadow-2xl transform transition-all scale-100 overflow-hidden" },
            // Header
            React.createElement("div", { className: "bg-wood dark:bg-gray-900 p-4 border-b-2 border-wood-light dark:border-gray-700" },
                React.createElement("h3", { className: "text-2xl font-medieval text-parchment-light dark:text-gold-light text-center" }, title)
            ),
            // Body
            React.createElement("div", { className: "p-6 text-center" },
                React.createElement("div", { className: "text-5xl mb-4" }, "⚠️"),
                React.createElement("p", { className: "text-lg text-wood-text dark:text-parchment-bg font-cinzel" }, message)
            ),
            // Footer
            React.createElement("div", { className: "flex justify-center space-x-4 p-6 pt-0" },
                React.createElement("button", { 
                    onClick: onClose, 
                    className: "flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded border-2 border-gray-600 shadow-md transition-transform transform hover:scale-105" 
                }, "Zurück"),
                React.createElement("button", { 
                    onClick: onConfirm, 
                    className: "flex-1 bg-red-700 hover:bg-red-800 text-white font-bold py-2 px-4 rounded border-2 border-red-900 shadow-md transition-transform transform hover:scale-105" 
                }, "Bestätigen")
            )
        )
    );
};

const ConstructionTab = ({ stronghold }) => {
    const { components, walls, startConstruction, completeConstruction, removeComponent, removeWall } = stronghold;
    const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);
    const [itemToCancel, setItemToCancel] = useState(null);

    const combinedQueue = useMemo(() => {
        const componentItems = components.map(c => ({...c, itemType: 'component'}));
        const wallItems = walls.map(w => ({...w, itemType: 'wall'}));
        return [...componentItems, ...wallItems];
    }, [components, walls]);

    const pending = combinedQueue.filter(i => i.constructionStatus === 'pending');
    const inProgress = combinedQueue.filter(i => i.constructionStatus === 'in_progress');

    const handleConfirmCancel = () => {
        if (itemToCancel) {
             if (itemToCancel.itemType === 'component') removeComponent(itemToCancel.id);
            else removeWall(itemToCancel.id);
            setItemToCancel(null);
        }
    };

    const QueueItemCard = ({ item }) => {
        const baseConstructionDays = calculateConstructionTime(item.baseCost);
        const totalDays = Math.ceil(baseConstructionDays * (1 - item.rushPercent / 100));

        const handleCancelClick = () => {
            setItemToCancel(item);
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
            React.createElement("div", { className: "bg-parchment-light/50 dark:bg-gray-700/40 p-4 rounded-md border border-gold-dark dark:border-gray-600 space-y-3 shadow-sm relative overflow-hidden" },
                React.createElement("div", { className: "flex justify-between items-start" },
                    React.createElement("div", null,
                        React.createElement("div", { className: "font-semibold text-wood dark:text-gold-light text-lg" }, `${item.name} ${item.itemType === 'wall' ? '(Mauer)' : ''}`),
                        React.createElement("div", { className: "text-sm text-wood-text/80 dark:text-parchment-bg/70" }, `Kosten: ${item.totalCost.toFixed(0)} gp | Zeit: ${totalDays} Tage`)
                    ),
                    React.createElement("button", { 
                        onClick: handleCancelClick, 
                        title: "Bau abbrechen", 
                        className: "bg-red-600/90 hover:bg-red-700 text-white font-bold py-1.5 px-3 rounded text-xs flex items-center gap-2 shadow-sm border border-red-800 transition-all hover:shadow-md hover:scale-105 active:scale-95"
                    },
                        React.createElement("span", null, "❌"),
                        React.createElement("span", null, "Abbrechen")
                    )
                ),
                item.constructionStatus === 'in_progress' && (
                    React.createElement("div", null,
                        React.createElement("div", { className: "text-sm flex justify-between text-wood-text/90 dark:text-parchment-bg/80" },
                            React.createElement("span", null, `Started: ${new Date(item.startDate).toLocaleDateString()}`),
                            React.createElement("span", null, `Progress: ${daysElapsed} / ${totalDays} days`)
                        ),
                        React.createElement("div", { className: "w-full h-4 bg-parchment dark:bg-gray-800 rounded-full overflow-hidden border border-wood-light dark:border-gray-600 mt-1" },
                            React.createElement("div", { style: { width: `${completionPercentage}%` }, className: "h-full bg-gradient-to-r from-green-500 to-green-700 transition-all duration-300 text-right pr-2 text-white text-xs flex items-center justify-end" },
                                `${completionPercentage.toFixed(0)}%`
                            )
                        )
                    )
                ),
                React.createElement("div", { className: "flex justify-end space-x-2 pt-2" },
                    item.constructionStatus === 'pending' && (
                        React.createElement("button", { onClick: handleStart, className: "bg-green-600 hover:bg-green-700 text-white font-bold py-1 px-3 rounded text-sm shadow-sm hover:shadow-md transition-shadow transform hover:-translate-y-px" },
                            "Start Construction"
                        )
                    ),
                    item.constructionStatus === 'in_progress' && (
                        React.createElement("button", { onClick: handleComplete, className: "bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-sm shadow-sm hover:shadow-md transition-shadow transform hover:-translate-y-px" },
                            "Mark as Completed"
                        )
                    )
                )
            )
        );
    };

    return (
         React.createElement("div", null,
            React.createElement("h2", { className: "text-3xl font-medieval text-wood-dark dark:text-gold-light mb-2" }, "🏗️ Construction Projects"),
            React.createElement("p", { className: "mb-6" }, "Manage the construction of your stronghold components. Start projects from the pending queue and mark them as complete once finished."),
            React.createElement("div", { className: "mb-8 bg-wood/10 dark:bg-gray-700/30 p-4 rounded-lg border-2 border-wood-light dark:border-gray-600" },
                React.createElement("label", { htmlFor: "currentDate", className: "block font-semibold mb-2 text-wood dark:text-gold-light text-lg" }, "📅 Current In-Game Date"),
                React.createElement("input", { id: "currentDate", type: "date", value: currentDate, onChange: e => setCurrentDate(e.target.value), className: "w-full md:w-auto p-2 rounded border-2 border-gold dark:border-gray-500 bg-white/80 dark:bg-gray-700 dark:text-parchment-light"}),
                React.createElement("p", { className: "text-sm mt-2 text-wood-text/80 dark:text-parchment-bg/70 italic" }, "Set the current date to see construction progress on active projects.")
            ),
            React.createElement("div", { className: "grid md:grid-cols-1 lg:grid-cols-2 gap-8" },
                React.createElement("div", null,
                    React.createElement("h3", { className: "text-2xl font-medieval text-wood-dark dark:text-gold-light mb-4" }, "⏳ Pending Construction"),
                    React.createElement("div", { className: "space-y-4 bg-wood/5 dark:bg-gray-800/20 p-4 rounded-lg max-h-[60vh] overflow-y-auto border border-wood-light/50 dark:border-gray-600" },
                        pending.length > 0 ? pending.map(item => React.createElement(QueueItemCard, { key: `${item.itemType}-${item.id}`, item: item })) : React.createElement("p", { className: "text-center text-wood-text/70 dark:text-parchment-bg/60 italic py-8" }, "No pending projects. Add rooms or walls to begin.")
                    )
                ),
                 React.createElement("div", null,
                    React.createElement("h3", { className: "text-2xl font-medieval text-wood-dark dark:text-gold-light mb-4" }, "🛠️ In Progress"),
                     React.createElement("div", { className: "space-y-4 bg-wood/5 dark:bg-gray-800/20 p-4 rounded-lg max-h-[60vh] overflow-y-auto border border-wood-light/50 dark:border-gray-600" },
                        inProgress.length > 0 ? inProgress.map(item => React.createElement(QueueItemCard, { key: `${item.itemType}-${item.id}`, item: item })) : React.createElement("p", { className: "text-center text-wood-text/70 dark:text-parchment-bg/60 italic py-8" }, "No projects currently under construction.")
                    )
                )
            ),
            React.createElement(ConfirmationModal, {
                isOpen: !!itemToCancel,
                onClose: () => setItemToCancel(null),
                onConfirm: handleConfirmCancel,
                title: "Bauvorhaben abbrechen",
                message: `Bist du sicher, dass du den Bau von "${itemToCancel?.name}" abbrechen möchtest? Alle investierten Ressourcen und Fortschritte gehen verloren.`
            })
        )
    );
};

// --- From components/SummaryTab.tsx ---
const SummarySection = ({ title, icon, children }) => (
    React.createElement("div", { className: "bg-gradient-to-br from-gold/80 to-gold-dark/80 dark:from-gray-700 dark:to-gray-800 text-wood-dark dark:text-gold-light p-6 rounded-lg border-2 border-wood-dark dark:border-gold-dark shadow-lg" },
        React.createElement("h3", { className: "text-2xl font-semibold text-center mb-4" }, `${icon} ${title}`),
        React.createElement("div", { className: "space-y-2 bg-black/10 dark:bg-black/20 p-4 rounded" }, children)
    )
);
const SummaryRow = ({ label, value, isNegative = false, className }) => (
    React.createElement("div", { className: `flex justify-between items-baseline ${className}` },
        React.createElement("span", null, `${label}:`),
        React.createElement("span", { className: `font-bold text-lg ${isNegative ? 'text-red-800 dark:text-red-400' : ''}` }, value)
    )
);
const SummaryTotalRow = ({ label, value, isNegative = false }) => (
     React.createElement("div", { className: `flex justify-between items-baseline border-t-2 border-wood-light/50 dark:border-gold-dark/50 pt-2 mt-2 font-bold text-xl ${isNegative ? 'text-red-900 dark:text-red-300' : 'text-green-900 dark:text-green-300'}` },
        React.createElement("span", null, `${label}:`),
        React.createElement("span", null, value)
    )
);
const SUMMARY_RESOURCE_LABELS = {
    servantQuarterSpace: "Servant Quarters",
    barracksSpace: "Barracks Space",
    bedroomSpace: "Bedrooms",
    suiteSpace: "Suites",
    food: "Food Supply",
    diningHallSeat: "Dining Seats",
    armorySpace: "Armory Space",
    bath: "Baths",
    storage: "Storage (lbs)",
    stallSpace: "Stall Space"
};
const AssetSection = ({ title, value, children }) => (
    React.createElement("div", { className: "bg-parchment/70 dark:bg-gray-700/50 p-4 rounded-lg border border-wood-light dark:border-gray-600 shadow-md" },
        React.createElement("div", { className: "flex justify-between items-center pb-2 mb-2 border-b border-wood-light/30 dark:border-gray-500/50" },
            React.createElement("h4", { className: "text-xl font-semibold text-wood-dark dark:text-gold-light" }, title),
            React.createElement("span", { className: "font-bold text-wood dark:text-gold-light" }, `${value.toFixed(0)} GP`)
        ),
        React.createElement("div", { className: "space-y-2 max-h-60 overflow-y-auto pr-2" },
            children
        )
    )
);
const AssetItem = ({ item, isPending, onDelete }) => {
    let dimensionDisplay = null;

    if (item.length && item.width) {
        dimensionDisplay = React.createElement("div", { className: "text-xs text-wood-text/60 dark:text-parchment-bg/50 mt-0.5 flex items-center gap-1" },
            React.createElement("span", null, "📏"),
            React.createElement("span", null, `${item.length} ft x ${item.width} ft`),
            React.createElement("span", { className: "opacity-75" }, `(${item.area} sq ft)`)
        );
    } else if (item.length && item.height && item.thickness) {
         dimensionDisplay = React.createElement("div", { className: "text-xs text-wood-text/60 dark:text-parchment-bg/50 mt-0.5 flex items-center gap-1" },
            React.createElement("span", null, "🧱"),
            React.createElement("span", null, `L: ${item.length}' | H: ${item.height}' | T: ${item.thickness}'`)
        );
    }

    return React.createElement("div", { className: "flex justify-between items-center bg-parchment-light/50 dark:bg-gray-800/50 p-2 rounded-md mb-2 border border-wood-light/20 dark:border-gray-600/30" },
        React.createElement("div", null,
            React.createElement("div", { className: "font-semibold text-wood-dark dark:text-gold-light" }, item.name),
            dimensionDisplay,
            React.createElement("div", { className: "text-sm text-wood-text/80 dark:text-parchment-bg/70" }, `${item.totalCost.toFixed(0)} GP`)
        ),
        React.createElement("button", {
            onClick: onDelete,
            title: isPending ? 'Bestätige Abriss' : 'Abriss',
            className: `font-bold text-xs py-1 px-2 rounded transition-all duration-200 ${isPending ? 'bg-yellow-500 text-black animate-pulse' : 'bg-red-600/80 text-white hover:bg-red-700'}`
        },
            isPending ? 'Bestätigen?' : 'Abriss'
        )
    );
};
const SaveLoadManager = ({ stronghold }) => {
    const { saveSlots, activeSaveName, saveAsNewSlot, loadSlot, deleteSlot, renameSlot, copySlot, exportSlot } = stronghold;
    const [newSaveName, setNewSaveName] = useState('');
    
    const [editingName, setEditingName] = useState(null);
    const [currentEditedName, setCurrentEditedName] = useState('');
    const [pendingDeleteName, setPendingDeleteName] = useState(null);

    useEffect(() => {
        if (pendingDeleteName) {
            const timer = setTimeout(() => setPendingDeleteName(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [pendingDeleteName]);

    const handleSaveAs = () => {
        if (newSaveName.trim()) {
            if (saveAsNewSlot(newSaveName.trim())) {
                setNewSaveName('');
            }
        }
    };

    const handleStartRename = (name) => {
        setEditingName(name);
        setCurrentEditedName(name);
        setPendingDeleteName(null);
    };

    const handleConfirmRename = () => {
        if (editingName && currentEditedName.trim()) {
            if (renameSlot(editingName, currentEditedName.trim())) {
                setEditingName(null);
            }
        }
    };
    
    const handleCancelRename = () => {
        setEditingName(null);
    };

    const handleDeleteClick = (name) => {
        if (pendingDeleteName === name) {
            deleteSlot(name);
            setPendingDeleteName(null);
        } else {
            setEditingName(null);
            setPendingDeleteName(name);
        }
    };


    return (
        React.createElement("div", { className: "mt-12 bg-gradient-to-br from-parchment to-parchment-dark dark:from-gray-800 dark:to-gray-900 p-6 rounded-lg border-2 border-wood dark:border-wood-dark shadow-lg" },
            React.createElement("h3", { className: "text-2xl font-semibold text-center mb-4 text-wood-dark dark:text-gold-light" }, "💾 Spielstände Verwalten"),
            React.createElement("div", { className: "space-y-4" },
                React.createElement("div", { className: "bg-black/10 dark:bg-black/20 p-4 rounded space-y-3" },
                    React.createElement("label", { htmlFor: "new-save-name", className: "block font-semibold text-center" }, "Neuen Spielstand anlegen"),
                    React.createElement("div", { className: "flex space-x-2" },
                        React.createElement("input", {
                            id: "new-save-name",
                            type: "text",
                            value: newSaveName,
                            onChange: e => setNewSaveName(e.target.value),
                            placeholder: "Name des Spielstands",
                            className: "w-full p-2 border-2 border-gold dark:border-gray-500 rounded-md bg-white/80 dark:bg-gray-700 dark:text-parchment-light"
                        }),
                        React.createElement("button", { onClick: handleSaveAs, className: "bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded whitespace-nowrap" }, "Speichern als...")
                    )
                ),

                React.createElement("div", { className: "space-y-2 max-h-60 overflow-y-auto pr-2" },
                    saveSlots.length > 0 ? saveSlots.map(slot => (
                        React.createElement("div", { key: slot.name, className: `p-3 rounded border-2 flex flex-col sm:flex-row justify-between items-center gap-2 ${slot.name === activeSaveName ? 'bg-gold-light dark:bg-gold-dark/50 border-wood-dark dark:border-gold-light' : 'bg-parchment-light dark:bg-gray-700/50 border-gold-dark dark:border-gray-600'}` },
                            editingName === slot.name ? (
                                React.createElement("div", { className: "flex-1 w-full sm:w-auto" },
                                    React.createElement("input", { 
                                        type: "text",
                                        value: currentEditedName,
                                        onChange: e => setCurrentEditedName(e.target.value),
                                        onKeyDown: e => e.key === 'Enter' && handleConfirmRename(),
                                        autoFocus: true,
                                        className: "w-full p-1 border-2 border-wood rounded-md bg-white dark:bg-gray-800 dark:text-parchment-light"
                                    })
                                )
                            ) : (
                                React.createElement("div", null,
                                    React.createElement("p", { className: "font-bold" }, slot.name),
                                    React.createElement("p", { className: "text-xs text-wood-text/80 dark:text-parchment-bg/70" }, `Zuletzt gespeichert: ${new Date(slot.lastSaved).toLocaleString()}`)
                                )
                            ),
                            
                            editingName === slot.name ? (
                                React.createElement("div", { className: "flex space-x-1" },
                                    React.createElement("button", { onClick: handleConfirmRename, className: "bg-green-600 hover:bg-green-700 text-white text-xs font-bold py-1 px-2 rounded" }, "Speichern"),
                                    React.createElement("button", { onClick: handleCancelRename, className: "bg-gray-500 hover:bg-gray-600 text-white text-xs font-bold py-1 px-2 rounded" }, "Abbrechen")
                                )
                            ) : (
                                React.createElement("div", { className: "flex space-x-1 flex-wrap justify-center" },
                                    React.createElement("button", { onClick: () => loadSlot(slot.name), className: "bg-green-600 hover:bg-green-700 text-white text-xs font-bold py-1 px-2 rounded" }, "Laden"),
                                    React.createElement("button", { onClick: () => handleStartRename(slot.name), className: "bg-gray-500 hover:bg-gray-600 text-white text-xs font-bold py-1 px-2 rounded" }, "Umbenennen"),
                                    React.createElement("button", { onClick: () => copySlot(slot.name), className: "bg-purple-500 hover:bg-purple-600 text-white text-xs font-bold py-1 px-2 rounded" }, "Kopieren"),
                                    React.createElement("button", { onClick: () => exportSlot(slot.name), className: "bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold py-1 px-2 rounded" }, "Exportieren"),
                                    React.createElement("button", { 
                                        onClick: () => handleDeleteClick(slot.name), 
                                        className: `text-xs font-bold py-1 px-2 rounded transition-all duration-200 ${pendingDeleteName === slot.name ? 'bg-yellow-500 text-black animate-pulse' : 'bg-red-600 text-white hover:bg-red-700'}`
                                    },
                                        pendingDeleteName === slot.name ? 'Bestätigen?' : 'Löschen'
                                    )
                                )
                            )
                        )
                    )) : React.createElement("p", { className: "text-center italic text-wood-text/70 dark:text-parchment-bg/60" }, "Keine Spielstände vorhanden.")
                )
            )
        )
    );
};
const SummaryTab = ({ stronghold }) => {
    const { 
        components, walls, totalDamage, militaryValue, industrialValue, economicValue, socialValue,
        totalValue, totalArea, totalConstructionDays, weeklyUpkeep, weeklyProfit, resources, getAllPerks,
        importStronghold, startNewStronghold, removeComponent, removeWall, repairDamage, saveCurrentSlot, activeSaveName,
        staffTotalWeekly, maintenanceWeekly, industrialPotential, economicPotential, missingServants
    } = stronghold;
    
    const [pendingDeletion, setPendingDeletion] = useState(null);
    const [repairAmount, setRepairAmount] = useState(0);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (pendingDeletion) {
            const timer = setTimeout(() => setPendingDeletion(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [pendingDeletion]);
    
    useEffect(() => { setRepairAmount(Math.ceil(totalDamage)); }, [totalDamage]);

    const handleRepair = () => {
        if (repairAmount > 0) {
            repairDamage(repairAmount);
            setRepairAmount(0);
        }
    };

    const handleDelete = (type, id) => {
        if (pendingDeletion?.id === id) {
            type === 'component' ? removeComponent(id) : removeWall(id);
            setPendingDeletion(null);
        } else {
            setPendingDeletion({ type, id });
        }
    };

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target?.result;
            if (typeof text === 'string') {
                importStronghold(text);
            }
        };
        reader.onerror = () => {
            alert("Error reading file.");
        };
        reader.readAsText(file);
        
        event.target.value = '';
    };

    const completedComponents = components.filter(c => c.constructionStatus === 'completed');
    const completedWalls = walls.filter(w => w.constructionStatus === 'completed');
    const netWeeklyIncome = weeklyProfit - weeklyUpkeep;
    const { staticPerks, scaledBonuses } = getAllPerks();
    
    const groupedComponents = useMemo(() => {
        const groups = { military: [], industrial: [], economic: [], social: [] };
        completedComponents.forEach(c => { groups[c.classification]?.push(c); });
        return groups;
    }, [completedComponents]);

    const perkSources = useMemo(() => {
        const sources = {};
        Object.values(COMPONENTS).forEach(categoryData => {
            Object.entries(categoryData).forEach(([componentName, data]) => {
                data.perks?.forEach(perk => {
                    if (!sources[perk.id]) sources[perk.id] = [];
                    if (!sources[perk.id].includes(componentName)) sources[perk.id].push(componentName);
                });
            });
        });
        return sources;
    }, []);
    
    const sortedPerks = useMemo(() => {
        const activePerkIds = new Set([
            ...staticPerks.map(p => p.id),
            ...Object.keys(scaledBonuses)
        ]);

        return [...ALL_PERKS].sort((a, b) => {
            const aIsActive = activePerkIds.has(a.id);
            const bIsActive = activePerkIds.has(b.id);
            if (aIsActive && !bIsActive) return -1;
            if (!bIsActive && aIsActive) return 1;
            return a.name.localeCompare(b.name);
        });
    }, [staticPerks, scaledBonuses]);

    const PerkDisplay = ({ perk, bonus, isActive, sources }) => (
        React.createElement("div", { title: `${perk.description}\nWird bereitgestellt von: ${sources}`, className: `p-2 rounded border-2 transition-colors ${isActive ? 'bg-green-200/80 dark:bg-green-900/50 border-green-700 dark:border-green-500' : 'bg-parchment/60 dark:bg-gray-700/40 border-wood-light/50 dark:border-gray-600/50'}` },
            React.createElement("div", { className: "font-bold" }, `${perk.name} ${bonus ? `+${bonus}` : ''}`),
            React.createElement("div", { className: `text-sm italic ${isActive ? 'text-green-900/80 dark:text-green-300/80' : 'text-wood-text/70 dark:text-parchment-bg/60'}` }, isActive ? 'Aktiv' : 'Inaktiv')
        )
    );

    const maintenanceDisplayValue = missingServants > 0 
        ? `-${maintenanceWeekly.toFixed(2)} gp (inkl. +${missingServants * 100}% Strafe)` 
        : `-${maintenanceWeekly.toFixed(2)} gp`;

    return (
        React.createElement("div", null,
            React.createElement("h2", { className: "text-3xl font-medieval text-wood-dark dark:text-gold-light mb-2" }, "📊 Stronghold Summary"),
            React.createElement("p", { className: "mb-6" }, "A complete overview of your fortress, its construction, and its ongoing costs."),
             React.createElement("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-8" },
                React.createElement("div", { className: "space-y-8" },
                    React.createElement(SummarySection, { title: "Asset Values", icon: "💎" },
                        React.createElement(SummaryRow, { label: "Militärischer Wert", value: `${militaryValue.toFixed(0)} gp` }),
                        React.createElement(SummaryRow, { label: "Industrieller Wert", value: `${industrialValue.toFixed(0)} gp` }),
                        React.createElement(SummaryRow, { label: "Ökonomischer Wert", value: `${economicValue.toFixed(0)} gp` }),
                        React.createElement(SummaryRow, { label: "Sozialer Wert", value: `${socialValue.toFixed(0)} gp` }),
                        React.createElement("div", { className: "flex justify-between items-baseline border-t-2 border-wood-light/50 dark:border-gold-dark/50 pt-2 mt-2 font-bold text-xl" },
                            React.createElement("span", null, "TOTAL VALUE:"),
                            React.createElement("span", null, `${totalValue.toFixed(0)} gp`)
                        )
                    ),
                    React.createElement(SummarySection, { title: "Resource Management", icon: "📦" },
                        Object.keys(resources).map((key) => {
                            const resource = resources[key];
                            if (!resource || (resource.capacity === 0 && resource.demand === 0 && key !== 'storage')) return null;
                            const isDeficit = resource.demand > resource.capacity;
                            return React.createElement(SummaryRow, { key: key, label: SUMMARY_RESOURCE_LABELS[key], value: key === 'storage' ? `${resource.capacity}` : `${resource.demand} / ${resource.capacity}`, isNegative: isDeficit, className: isDeficit ? 'bg-red-300/50 dark:bg-red-900/40 -mx-2 px-2 rounded' : ''});
                        })
                    ),
                    React.createElement(SummarySection, { title: "Construction Details", icon: "🏗️" },
                        React.createElement(SummaryRow, { label: "Total Area", value: `${totalArea} sq ft` }),
                        React.createElement(SummaryRow, { label: "Remaining Build Time", value: `${totalConstructionDays} days` })
                    )
                ),
                React.createElement("div", { className: "space-y-8" },
                    React.createElement(SummarySection, { title: "Fähigkeiten der Festung", icon: "🌟" },
                        React.createElement("div", { className: "space-y-2 max-h-[60vh] overflow-y-auto" },
                             sortedPerks.map(perk => {
                                const activeScaledBonus = scaledBonuses[perk.id];
                                const isActiveStatic = staticPerks.some(p => p.id === perk.id);
                                const isActive = !!activeScaledBonus || isActiveStatic;
                                const bonusValue = activeScaledBonus?.totalBonus;
                                const sourceList = perkSources[perk.id]?.join(', ') || 'Unbekannt';
                                return React.createElement(PerkDisplay, { key: perk.id, perk: perk, bonus: bonusValue, isActive: isActive, sources: sourceList });
                            })
                        )
                    ),
                    React.createElement(SummarySection, { title: "Beschädigungen", icon: "🩹" },
                        React.createElement(SummaryRow, { label: "Gesamtschaden", value: `${totalDamage.toFixed(0)} GP`, isNegative: totalDamage > 0 }),
                        totalDamage > 0 && (
                            React.createElement("div", { className: "mt-4 pt-3 border-t-2 border-wood-light/30 dark:border-gold-dark/30 space-y-2" },
                                React.createElement("label", { htmlFor: "repair-amount", className: "block text-center font-semibold" }, "Schaden reparieren:"),
                                React.createElement("div", { className: "flex items-center space-x-2" },
                                React.createElement("input", { id: "repair-amount", type: "number", value: repairAmount, onChange: (e) => setRepairAmount(Math.max(0, Math.min(Math.ceil(totalDamage), parseInt(e.target.value) || 0))), className: "w-full p-2 border-2 border-gold dark:border-gray-500 rounded-md bg-white/80 dark:bg-gray-700 dark:text-parchment-light"}),
                                React.createElement("button", { onClick: handleRepair, className: "p-2 rounded bg-green-600 text-white font-bold hover:bg-green-700 transition-colors whitespace-nowrap" }, "Reparieren")
                                )
                            )
                        )
                    )
                )
            ),
            React.createElement("div", { className: "mt-8" },
                React.createElement("div", { className: "bg-gradient-to-br from-gold/80 to-gold-dark/80 dark:from-gray-700 dark:to-gray-800 text-wood-dark dark:text-gold-light p-6 rounded-lg border-2 border-wood-dark dark:border-gold-dark shadow-lg" },
                    React.createElement("h3", { className: "text-2xl font-semibold text-center mb-4" }, "💰 Weekly Finances"),
                    React.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-6" },
                        React.createElement("div", { className: "bg-black/10 dark:bg-black/20 p-4 rounded" },
                            React.createElement("h4", { className: "font-bold text-center text-lg text-green-800 dark:text-green-300 mb-2" }, "📈 Income"),
                            React.createElement(SummaryRow, { label: "Industrial Profit", value: `+${industrialPotential.toFixed(2)} gp` }),
                            React.createElement(SummaryRow, { label: "Economic Profit", value: `+${economicPotential.toFixed(2)} gp` }),
                            React.createElement(SummaryTotalRow, { label: "TOTAL PROFIT", value: `+${weeklyProfit.toFixed(2)} gp`, isNegative: false })
                        ),
                        React.createElement("div", { className: "bg-black/10 dark:bg-black/20 p-4 rounded" },
                            React.createElement("h4", { className: "font-bold text-center text-lg text-red-800 dark:text-red-300 mb-2" }, "📉 Expenses"),
                            React.createElement(SummaryRow, { label: "Staff Salaries", value: `-${staffTotalWeekly.toFixed(2)} gp`, isNegative: true }),
                            React.createElement(SummaryRow, { label: "Maintenance", value: maintenanceDisplayValue, isNegative: true }),
                            React.createElement(SummaryTotalRow, { label: "TOTAL UPKEEP", value: `-${weeklyUpkeep.toFixed(2)} gp`, isNegative: true })
                        )
                    ),
                    React.createElement("div", { className: `text-center border-t-4 border-wood-dark/50 dark:border-gold-dark/50 mt-6 pt-4 font-bold text-2xl ${netWeeklyIncome >= 0 ? 'text-green-900 dark:text-green-300' : 'text-red-900 dark:text-red-300'}` },
                        "Net Weekly Income: ",
                        React.createElement("span", { className: "text-3xl ml-2" }, `${netWeeklyIncome.toFixed(2)} gp`)
                    )
                )
            ),
            React.createElement("div", { className: "mt-12" },
                React.createElement("h2", { className: "text-3xl font-medieval text-wood-dark dark:text-gold-light mb-4 text-center" }, "🏰 Anlagen der Festung"),
                React.createElement("div", { className: "grid md:grid-cols-2 gap-6" },
                    React.createElement(AssetSection, { title: "Militärische Gebäude", value: militaryValue }, groupedComponents.military.length > 0 ? groupedComponents.military.map(c => React.createElement(AssetItem, { key: c.id, item: c, onDelete: () => handleDelete('component', c.id), isPending: pendingDeletion?.id === c.id })) : React.createElement("p", { className: "text-center italic text-wood-text/70 dark:text-parchment-bg/60" }, "Keine")),
                    React.createElement(AssetSection, { title: "Industrielle Gebäude", value: industrialValue }, groupedComponents.industrial.length > 0 ? groupedComponents.industrial.map(c => React.createElement(AssetItem, { key: c.id, item: c, onDelete: () => handleDelete('component', c.id), isPending: pendingDeletion?.id === c.id })) : React.createElement("p", { className: "text-center italic text-wood-text/70 dark:text-parchment-bg/60" }, "Keine")),
                    React.createElement(AssetSection, { title: "Ökonomische Gebäude", value: economicValue }, groupedComponents.economic.length > 0 ? groupedComponents.economic.map(c => React.createElement(AssetItem, { key: c.id, item: c, onDelete: () => handleDelete('component', c.id), isPending: pendingDeletion?.id === c.id })) : React.createElement("p", { className: "text-center italic text-wood-text/70 dark:text-parchment-bg/60" }, "Keine")),
                    React.createElement(AssetSection, { title: "Soziale Gebäude", value: socialValue }, groupedComponents.social.length > 0 ? groupedComponents.social.map(c => React.createElement(AssetItem, { key: c.id, item: c, onDelete: () => handleDelete('component', c.id), isPending: pendingDeletion?.id === c.id })) : React.createElement("p", { className: "text-center italic text-wood-text/70 dark:text-parchment-bg/60" }, "Keine")),
                    React.createElement("div", { className: "md:col-span-2" }, React.createElement(AssetSection, { title: "Mauern & Befestigungen", value: completedWalls.reduce((acc, w) => acc + w.totalCost, 0) }, completedWalls.length > 0 ? completedWalls.map(w => React.createElement(AssetItem, { key: w.id, item: w, onDelete: () => handleDelete('wall', w.id), isPending: pendingDeletion?.id === w.id })) : React.createElement("p", { className: "text-center italic text-wood-text/70 dark:text-parchment-bg/60" }, "Keine")))
                )
            ),
            React.createElement("div", { className: "mt-12 bg-gradient-to-br from-parchment to-parchment-dark dark:from-gray-800 dark:to-gray-900 p-6 rounded-lg border-2 border-wood dark:border-wood-dark shadow-lg" },
                React.createElement("h3", { className: "text-2xl font-semibold text-center mb-4 text-wood-dark dark:text-gold-light" }, "Aktionen"),
                React.createElement("div", { className: "flex flex-wrap justify-center items-center gap-4" },
                    React.createElement("div", { className: "text-center" },
                        React.createElement("button", { onClick: saveCurrentSlot, disabled: !activeSaveName, className: "bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed" },
                            "💾 Speichern"
                        )
                    ),
                     React.createElement("button", { onClick: handleImportClick, className: "bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors" }, "📤 Importieren"),
                    React.createElement("input", { type: "file", ref: fileInputRef, onChange: handleFileChange, accept: ".json", style: { display: 'none' } }),
                    React.createElement("button", { onClick: startNewStronghold, className: "bg-red-700 hover:bg-red-800 text-white font-bold py-3 px-6 rounded-lg transition-colors" }, "🗑️ Neues Bollwerk beginnen")
                )
            ),
            React.createElement(SaveLoadManager, { stronghold: stronghold })
        )
    );
};

// --- From components/EconomyTab.tsx ---
const InfoRow = ({ label, value, tooltip }) => (
    React.createElement("div", { className: "flex justify-between items-center py-2 border-b border-wood-light/30 dark:border-parchment-bg/20", title: tooltip },
        React.createElement("span", null, `${label}:`),
        React.createElement("span", { className: "font-bold text-lg" }, value)
    )
);
const EconomyTab = ({ stronghold }) => {
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
        economicComponentsBreakdown
    } = stronghold;

    const [transactionAmount, setTransactionAmount] = useState('');

    const handleTransaction = (type) => {
        const amount = parseFloat(transactionAmount);
        if (isNaN(amount) || amount <= 0) return;

        if (type === 'deposit') {
            depositToTreasury(amount);
        } else {
            withdrawFromTreasury(amount);
        }
        setTransactionAmount('');
    };

    const BreakdownItem = ({ item }) => {
        const efficiencyPercentage = item.baseValue > 0 ? (item.currentValue / item.baseValue) * 100 : 0;
        const colorClass = item.classification === 'military' ? 'border-red-500' : item.classification === 'industrial' ? 'border-blue-500' : 'border-green-500';

        return (
            React.createElement("div", { className: `bg-parchment-light/50 dark:bg-gray-700/50 p-3 rounded-md border-l-4 ${colorClass} shadow-sm space-y-2` },
                React.createElement("div", { className: "flex justify-between items-start" },
                    React.createElement("div", null,
                        React.createElement("div", { className: "font-semibold text-wood dark:text-gold-light text-lg" }, item.name),
                        item.totalJobs > 0 && React.createElement("div", { className: "text-sm text-wood-text/80 dark:text-parchment-bg/70" }, `${item.filledJobs}/${item.totalJobs} ${item.jobRole}(s) besetzt`)
                    )
                ),
                React.createElement("div", null,
                    React.createElement("div", { className: "text-sm flex justify-between text-wood-text/90 dark:text-parchment-bg/80 mb-1" },
                        React.createElement("span", null, "Aktueller Wert:"),
                        React.createElement("span", { className: "font-bold" }, `${item.currentValue.toFixed(0)} / ${item.baseValue.toFixed(0)} GP`)
                    ),
                    React.createElement("div", { className: "w-full h-4 bg-parchment dark:bg-gray-800 rounded-full overflow-hidden border border-wood-light dark:border-gray-600" },
                        React.createElement("div", { style: { width: `${efficiencyPercentage}%` }, className: "h-full bg-gradient-to-r from-yellow-400 to-amber-600 transition-all duration-300 text-right pr-2 text-white text-xs flex items-center justify-end" },
                            `${efficiencyPercentage.toFixed(0)}%`
                        )
                    )
                ),
                item.merchantGoldContribution > 0 && (
                     React.createElement("div", { className: "text-sm text-green-800 dark:text-green-300 font-semibold pt-1 border-t border-wood/10 dark:border-parchment-bg/10" },
                        `Händlergold: +${item.merchantGoldContribution.toFixed(2)} GP`
                    )
                )
            )
        );
    };

    return (
        React.createElement("div", null,
            React.createElement("h2", { className: "text-3xl font-medieval text-wood-dark dark:text-gold-light mb-2" }, "💰 Wirtschaft"),
            React.createElement("p", { className: "mb-6" }, "Verwalte die wirtschaftliche Leistung deiner Festung. Industrielle Gebäude produzieren Rohstoffe, die von ökonomischen Gebäuden in Profit umgewandelt werden."),
            React.createElement("div", { className: "grid md:grid-cols-2 gap-8" },
                React.createElement("div", { className: "space-y-8" },
                    React.createElement("div", { className: "bg-gold/80 dark:bg-gray-800/50 p-6 rounded-lg border-2 border-wood-dark dark:border-gold-dark shadow-lg" },
                        React.createElement("h3", { className: "text-2xl font-semibold text-center mb-4 text-wood-dark dark:text-gold-light" }, "🏰 Schatzkammer der Festung"),
                        React.createElement("div", { className: "text-center mb-4" },
                            React.createElement("div", { className: "text-lg text-wood-text dark:text-parchment-bg/80" }, "Aktuelles Vermögen"),
                            React.createElement("div", { className: `text-5xl font-bold font-cinzel ${strongholdTreasury < 0 ? 'text-red-800 dark:text-red-400' : 'text-green-800 dark:text-green-300'}` },
                                `${strongholdTreasury.toFixed(2)} GP`
                            )
                        ),
                        React.createElement("div", { className: "bg-black/10 dark:bg-black/20 p-4 rounded space-y-3" },
                            React.createElement("label", { htmlFor: "transaction-amount", className: "block font-semibold text-center" }, "Transaktion durchführen"),
                            React.createElement("input", { 
                                id: "transaction-amount",
                                type: "number",
                                value: transactionAmount,
                                onChange: e => setTransactionAmount(e.target.value),
                                placeholder: "Betrag in GP",
                                className: "w-full p-2 border-2 border-gold dark:border-gray-500 rounded-md bg-white/80 dark:bg-gray-700 dark:text-parchment-light text-center",
                                min: "0"
                            }),
                            React.createElement("div", { className: "flex justify-center space-x-4" },
                                React.createElement("button", { 
                                    onClick: () => handleTransaction('deposit'),
                                    className: "flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors shadow-md"
                                },
                                    "Einzahlen"
                                ),
                                React.createElement("button", { 
                                    onClick: () => handleTransaction('withdraw'),
                                    className: "flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors shadow-md"
                                },
                                    "Auszahlen"
                                )
                            )
                        )
                    ),
                    React.createElement("div", { className: "bg-gold/80 dark:bg-gray-800/50 p-6 rounded-lg border-2 border-wood-dark dark:border-gold-dark shadow-lg" },
                        React.createElement("h3", { className: "text-2xl font-semibold text-center mb-4 text-wood-dark dark:text-gold-light" }, "Wöchentliche Einnahmen (Zusammenfassung)"),
                        React.createElement("div", { className: "space-y-3 bg-black/10 dark:bg-black/20 p-4 rounded" },
                            React.createElement(InfoRow, { label: "Industrieller Wert (IV)", value: `${industrialValue.toFixed(0)} GP`, tooltip: "Gesamtwert aller industriellen Gebäude, skaliert nach Arbeiterzahl." }),
                            React.createElement(InfoRow, { label: "Ökonomischer Wert (EV)", value: `${economicValue.toFixed(0)} GP`, tooltip: "Gesamtwert aller ökonomischen Gebäude, skaliert nach Arbeiterzahl." }),
                            React.createElement("hr", { className: "border-wood-light/50 dark:border-parchment-bg/30 my-2" }),
                            React.createElement(InfoRow, { label: "Industrielles Potential", value: `${industrialPotential.toFixed(2)} GP`, tooltip: "Eigenständiger Profit aus industriellen Gebäuden. Berechnet als: Industrieller Wert × 1%." }),
                            React.createElement(InfoRow, { label: "Ökonomisches Potential", value: `${economicPotential.toFixed(2)} GP`, tooltip: "Eigenständiger Profit aus ökonomischen Gebäuden, modifiziert durch industrielle Effizienz. Berechnet als: Ökonomischer Wert × 5% × (min(1, Industrieller Wert / Ökonomischer Wert))." }),
                            React.createElement("div", { className: "flex justify-between items-baseline border-t-2 border-wood-light/50 dark:border-gold-dark/50 pt-3 mt-3 font-bold text-xl text-green-800 dark:text-green-300", title: "Gesamteinnahmen aus beiden Potentialen (Industrielles Potential + Ökonomisches Potential)" },
                                React.createElement("span", null, "Wöchentlicher Gewinn:"),
                                React.createElement("span", null, `${weeklyProfit.toFixed(2)} GP`)
                            )
                        )
                    ),
                    
                    React.createElement("div", { className: "bg-gold/80 dark:bg-gray-800/50 p-6 rounded-lg border-2 border-wood-dark dark:border-gold-dark shadow-lg" },
                        React.createElement("h3", { className: "text-2xl font-semibold text-center mb-4 text-wood-dark dark:text-gold-light" }, "Handelskapital"),
                        React.createElement("div", { className: "space-y-3 bg-black/10 dark:bg-black/20 p-4 rounded" },
                            React.createElement(InfoRow, { label: "Wöchentliches Händlergold", value: `${totalMerchantGold.toFixed(2)} GP`, tooltip: "25% des Gesamtwertes aller 'Shop'-Gebäude (skaliert nach Arbeiterzahl). Setzt sich wöchentlich zurück." }),
                            React.createElement("div", { className: "py-2" },
                                React.createElement("label", { className: "block font-semibold mb-2 text-wood-text/90 dark:text-parchment-bg/80" }, "Ausgegebenes Gold diese Woche:"),
                                React.createElement("input", { 
                                    type: "number",
                                    value: merchantGoldSpentThisWeek,
                                    onChange: e => {
                                        const val = parseFloat(e.target.value) || 0;
                                        setMerchantGoldSpentThisWeek(Math.max(0, Math.min(val, totalMerchantGold)));
                                    },
                                    className: "w-full p-2 border-2 border-gold dark:border-gray-500 rounded-md bg-white/80 dark:bg-gray-700 dark:text-parchment-light",
                                    max: totalMerchantGold,
                                    min: 0
                                })
                            ),
                            React.createElement("div", { className: "flex justify-between items-baseline border-t-2 border-wood-light/50 dark:border-gold-dark/50 pt-3 mt-3 font-bold text-xl text-green-800 dark:text-green-300" },
                                React.createElement("span", null, "Verbleibendes Gold:"),
                                React.createElement("span", null, `${(totalMerchantGold - merchantGoldSpentThisWeek).toFixed(2)} GP`)
                            )
                        )
                    )

                ),
                React.createElement("div", { className: "space-y-8" },
                    React.createElement("div", null,
                        React.createElement("h3", { className: "text-2xl font-medieval text-wood-dark dark:text-gold-light mb-4" }, "Produktionsübersicht pro Gebäude"),
                        React.createElement("div", { className: "bg-parchment-light/80 dark:bg-gray-800/30 p-4 rounded-lg border border-wood-light dark:border-gray-600 max-h-[600px] overflow-y-auto space-y-3 shadow-inner" },
                            economicComponentsBreakdown.length > 0 ? (
                                economicComponentsBreakdown.map(item => React.createElement(BreakdownItem, { key: item.id, item: item }))
                            ) : (
                                React.createElement("p", { className: "text-center text-wood-text/70 dark:text-parchment-bg/60 italic pt-16" }, "Keine produzierenden Gebäude fertiggestellt.")
                            )
                        )
                    ),
                     React.createElement("div", null,
                        React.createElement("h3", { className: "text-2xl font-medieval text-wood-dark dark:text-gold-light mb-4" }, "📜 Ereignisprotokoll"),
                        React.createElement("div", { className: "bg-parchment-light/80 dark:bg-gray-800/30 p-4 rounded-lg border border-wood-light dark:border-gray-600 h-[400px] overflow-y-auto space-y-2 shadow-inner" },
                            simulationLog.length > 0 ? (
                                simulationLog.slice().reverse().map((log, index) => (
                                    React.createElement("p", { key: index, className: "text-sm text-wood-text dark:text-parchment-bg/90 border-b border-wood/20 dark:border-parchment-bg/20 pb-1" }, log)
                                ))
                            ) : (
                                React.createElement("p", { className: "text-center text-wood-text/70 dark:text-parchment-bg/60 italic pt-16" }, "Noch keine Ereignisse. Starte die Simulation, um die Woche voranzutreiben.")
                            )
                        )
                    )
                )
            )
        )
    );
};

// --- From components/DefenseTab.tsx ---
const DefenseInfoRow = ({ label, value, tooltip }) => (
    React.createElement("div", { className: "flex justify-between items-center py-2 border-b border-wood-light/30", title: tooltip },
        React.createElement("span", null, `${label}:`),
        React.createElement("span", { className: "font-bold text-lg" }, value)
    )
);
const DefenseTab = ({ stronghold }) => {
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
        React.createElement("div", null,
            React.createElement("h2", { className: "text-3xl font-medieval text-wood-dark dark:text-gold-light mb-2" }, "🛡️ Verteidigung"),
            React.createElement("p", { className: "mb-6" }, "Analysiere die Verteidigungsstärke deiner Festung und die Wahrscheinlichkeit eines Angriffs. Der Verteidigungsbonus modifiziert die Kampfkraft deiner Garnison."),
            React.createElement("div", { className: "grid md:grid-cols-2 gap-8" },
                React.createElement("div", null,
                    React.createElement("div", { className: "bg-red-900/10 dark:bg-red-900/30 p-6 rounded-lg border-2 border-red-800/50 dark:border-red-500/50 shadow-lg mb-8" },
                        React.createElement("h3", { className: "text-2xl font-semibold text-center mb-4 text-red-900 dark:text-red-200" }, "Status & Angriffschance"),
                        React.createElement("div", { className: "space-y-3 bg-black/10 dark:bg-black/20 p-4 rounded" },
                            React.createElement(InfoRow, { label: "Militärischer Wert (MV)", value: `${militaryValue.toFixed(0)} GP`, tooltip: "Gesamtwert aller militärischen Gebäude und Mauern." }),
                            React.createElement(InfoRow, { label: "Formel Wert (IV + EV)", value: `${socialValueForDisplay.toFixed(0)} GP`, tooltip: "Gesamtwert aller industriellen und ökonomischen Gebäude (IV + EV)." }),
                            React.createElement("hr", { className: "border-red-800/30 dark:border-red-400/30 my-2" }),
                            React.createElement(InfoRow, { label: "Verteidigungsbonus", value: `${(defenseBonus * 100).toFixed(1)}%`, tooltip: "Stärkt (oder schwächt) deine Garnison basierend auf dem Verhältnis von MV zu (IV+EV)." }),
                            React.createElement(InfoRow, { label: "Angriffschancebonus", value: `${(attackChanceBonus * 100).toFixed(1)}%`, tooltip: "Erhöht die Wahrscheinlichkeit eines Angriffs, wenn der soziale Wert den militärischen übersteigt." }),
                            React.createElement("div", { className: "flex justify-between items-baseline border-t-2 border-red-800/40 dark:border-red-400/40 pt-3 mt-3 font-bold text-xl text-red-800 dark:text-red-200" },
                                React.createElement("span", null, "Angriff bei W100 ≤"),
                                React.createElement("span", null, maxAttackRoll.toFixed(0))
                            )
                        )
                    ),
                    React.createElement("div", { className: "bg-blue-900/10 dark:bg-blue-900/30 p-6 rounded-lg border-2 border-blue-800/50 dark:border-blue-500/50 shadow-lg mb-8" },
                        React.createElement("h3", { className: "text-2xl font-semibold text-center mb-4 text-blue-900 dark:text-blue-200" }, "Kampfstärke"),
                        React.createElement("div", { className: "space-y-3 bg-black/10 dark:bg-black/20 p-4 rounded" },
                             React.createElement(InfoRow, { label: "Garnisons-CR", value: garrisonCR.toFixed(2), tooltip: "Die effektive Kampfstärke deiner stationierten Truppen, modifiziert durch den Verteidigungsbonus." }),
                             React.createElement(InfoRow, { label: "Angreifer-CR (geschätzt)", value: attackCR.toFixed(2), tooltip: "Die geschätzte Stärke eines potenziellen Angreifers, basierend auf dem Gesamtwert deiner Festung." }),
                             React.createElement("div", { className: "pt-2" },
                                React.createElement("h4", { className: "font-semibold text-center text-sm text-wood-dark dark:text-gold-light mb-1" }, "Garnisons-Zusammensetzung"),
                                React.createElement("div", { className: "max-h-24 overflow-y-auto text-xs space-y-1 pr-2" },
                                    staff.length > 0 ? staff.map(s => (
                                        React.createElement("div", { key: s.id, className: "flex justify-between" },
                                            React.createElement("span", null, `${s.customRole || s.hirelingType} (x${s.quantity})`),
                                            React.createElement("span", null, `CR sum: ${(HIRELING_DATA[s.hirelingKey]?.cr * s.quantity).toFixed(2)}`)
                                        )
                                    )) : React.createElement("p", { className: "italic text-center" }, "Keine Garnison stationiert.")
                                )
                             )
                        )
                    ),
                    React.createElement("button", { 
                        onClick: simulateNextWeek, 
                        className: "w-full bg-gradient-to-br from-wood-light to-wood-dark text-parchment-bg dark:from-gold dark:to-gold-dark dark:text-wood-dark font-bold py-4 px-6 rounded-lg border-2 border-wood-dark dark:border-gold-dark hover:from-gold-dark hover:to-gold-light hover:text-wood-dark dark:hover:from-gold-light dark:hover:to-gold transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg text-xl"
                    },
                        "Nächste Woche simulieren 🎲"
                    )
                ),
                React.createElement("div", null,
                     React.createElement("h3", { className: "text-2xl font-medieval text-wood-dark dark:text-gold-light mb-4" }, "📜 Ereignisprotokoll"),
                     React.createElement("div", { className: "bg-parchment-light/80 dark:bg-gray-800/30 p-4 rounded-lg border border-wood-light dark:border-gray-600 h-[600px] overflow-y-auto space-y-2 shadow-inner" },
                        simulationLog.length > 0 ? (
                            simulationLog.slice().reverse().map((log, index) => (
                                React.createElement("p", { key: index, className: "text-sm text-wood-text dark:text-parchment-bg/90 border-b border-wood/20 dark:border-parchment-bg/20 pb-1" }, log)
                            ))
                        ) : (
                            React.createElement("p", { className: "text-center text-wood-text/70 dark:text-parchment-bg/60 italic pt-16" }, "Noch keine Ereignisse. Starte die Simulation, um die Woche voranzutreiben.")
                        )
                     )
                )
            )
        )
    );
};

// --- From App.tsx ---
const ThemeToggle = ({ theme, setTheme }) => {
    const themes = [
        { name: 'light', icon: '☀️' },
        { name: 'dark', icon: '🌙' },
        { name: 'system', icon: '🖥️' }
    ];

    const cycleTheme = () => {
        const currentIndex = themes.findIndex(t => t.name === theme);
        const nextIndex = (currentIndex + 1) % themes.length;
        setTheme(themes[nextIndex].name);
    };

    const currentTheme = themes.find(t => t.name === theme) || themes[2];

    return (
        React.createElement("button", {
            onClick: cycleTheme,
            className: "absolute top-4 right-4 sm:top-6 sm:right-6 p-2 rounded-full bg-parchment/80 dark:bg-gray-700/80 text-2xl border-2 border-wood dark:border-gold-dark hover:scale-110 transition-transform z-10",
            title: `Switch to ${themes[(themes.findIndex(t => t.name === theme) + 1) % themes.length].name} mode`
        },
            currentTheme.icon
        )
    );
};

const App = () => {
  const [activeTab, setActiveTab] = useState('site');
  const stronghold = useStronghold();
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'system');

  const handleSetTheme = (newTheme) => {
      const root = window.document.documentElement;
      localStorage.setItem('theme', newTheme);
      setTheme(newTheme);

      if (newTheme === 'system') {
          const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          if (systemPrefersDark) {
              root.classList.add('dark');
          } else {
              root.classList.remove('dark');
          }
      } else if (newTheme === 'dark') {
          root.classList.add('dark');
      } else {
          root.classList.remove('dark');
      }
  };

  useEffect(() => {
    handleSetTheme(theme); // Apply theme on initial load

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
        if (localStorage.getItem('theme') === 'system') {
            handleSetTheme('system');
        }
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []); // Empty dependency array ensures this runs only once on mount


  const renderTabContent = () => {
    switch (activeTab) {
      case 'site':
        return React.createElement(SiteTab, { stronghold: stronghold });
      case 'rooms':
        return React.createElement(RoomsTab, { stronghold: stronghold });
      case 'walls':
        return React.createElement(WallsTab, { stronghold: stronghold });
      case 'staff':
        return React.createElement(StaffTab, { stronghold: stronghold });
      case 'social':
        return React.createElement(SocialTab, { stronghold: stronghold });
      case 'economy':
        return React.createElement(EconomyTab, { stronghold: stronghold });
      case 'defense':
        return React.createElement(DefenseTab, { stronghold: stronghold });
      case 'construction':
        return React.createElement(ConstructionTab, { stronghold: stronghold });
      case 'summary':
        return React.createElement(SummaryTab, { stronghold: stronghold });
      default:
        return null;
    }
  };

  return (
    React.createElement("div", { className: "min-h-screen p-2 md:p-4 lg:p-6" },
      React.createElement("div", { className: "relative container mx-auto max-w-7xl p-2 sm:p-5 bg-parchment-bg/90 dark:bg-gray-800/95 border-8 border-wood dark:border-wood-dark rounded-2xl shadow-2xl shadow-wood-dark/30 dark:shadow-black/50" },
        React.createElement(ThemeToggle, { theme: theme, setTheme: handleSetTheme }),
        React.createElement(Header, null),
        React.createElement("div", { className: "text-center font-semibold text-wood-dark dark:text-gold-light bg-gold/50 dark:bg-gray-700/50 py-2 -mt-4 mb-4 border-b-2 border-t-2 border-wood/20 dark:border-wood-dark/50" },
          stronghold.activeSaveName ? (
            React.createElement(React.Fragment, null,
              "Aktives Bollwerk: ", React.createElement("span", { className: "font-medieval text-xl" }, stronghold.activeSaveName)
            )
          ) : (
            React.createElement(React.Fragment, null,
              "Aktives Bollwerk: ", React.createElement("span", { className: "font-medieval text-xl italic text-wood-text/80 dark:text-parchment-bg/70" }, "Neues, ungespeichertes Bollwerk")
            )
          )
        ),
        React.createElement(Tabs, { activeTab: activeTab, setActiveTab: setActiveTab }),
        React.createElement("main", { className: "bg-parchment-bg/95 dark:bg-gray-900/50 border-x-3 border-b-3 border-wood dark:border-wood-dark rounded-b-lg p-4 sm:p-8 min-h-[500px] overflow-hidden" },
          React.createElement("div", { key: activeTab, className: "tab-content-animation" },
            renderTabContent()
          )
        )
      )
    )
  );
};

// --- From index.tsx ---
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  React.createElement(React.StrictMode, null,
    React.createElement(App, null)
  )
);