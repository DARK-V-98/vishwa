
export type TopupIcon = {
    name: string;
    path: string;
};

// Add paths to your icons in the /public folder here.
export const availableIcons: TopupIcon[] = [
    { name: 'Weekly Membership', path: '/icons/weekly.png' },
    { name: 'Monthly Membership', path: '/icons/monthly.png' },
    { name: 'Level Up Pass', path: '/icons/level-up-pass.png' },
    { name: 'Lite', path: '/icons/lite.png' },
    { name: '3D Evo', path: '/icons/3ddevo.png' },
    { name: '7D Evo', path: '/icons/7deovo.png' },
    { name: '30D Evo', path: '/icons/30devo.png' },
    { name: 'Generic Gem', path: '/icons/gem.png' },
];
