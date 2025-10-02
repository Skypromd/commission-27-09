export interface Permission {
    id: string;
    name: string; // e.g., 'clients.view'
    description: string;
}

export interface Role {
    id: string;
    name: string;
    permissions: string[]; // Array of permission IDs
}

