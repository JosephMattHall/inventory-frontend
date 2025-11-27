export interface Item {
    id: number;
    name: string;
    category: string;
    stock: number;
    min_stock: number;
    location?: string;
    description?: string;
    image_url?: string;
    attachments?: string[];
    created_at: string;
    updated_at: string;
}

export const CATEGORIES = [
    'Resistors',
    'Capacitors',
    'Inductors',
    'Diodes',
    'Transistors',
    'ICs',
    'Connectors',
    'Switches',
    'Motors',
    'Sensors',
    'Modules',
    'Microcontrollers',
    'Hardware',
    'Misc'
] as const;
