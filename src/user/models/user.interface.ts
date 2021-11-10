
export interface User {
    id?: number;
    name?: string;
    username?: string;
    email?:string;
    password?:string;
    tokenEmail?:string;
    expired_token?: Date;
    create: Date;
    update: Date;
    role?: UserRole;
}

export enum UserRole {
    MEMBER= 'member',
    USER = 'user',
    ADMIN='admin',
    WRITTER="writter"
}