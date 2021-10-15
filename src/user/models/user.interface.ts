
export interface User {
    id?: number;
    name?: string;
    username?: string;
    email?:string;
    password?:string;
    create: Date;
    update: Date;
    role?: UserRole;
}

export enum UserRole {
    ADMIN = 'admin',
    CHIEFEDITOR = 'chiefedior',
    EDITOR= 'editor',
    USER = 'user'
}