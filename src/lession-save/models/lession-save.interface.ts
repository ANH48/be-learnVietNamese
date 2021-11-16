import { UserEntity } from "src/user/models/user.entity";

export interface Lession_save {
    lession_save_id?: number; 
    user_id?:number;
    list_lession_id?:string;
    blog_create?: Date;
    blog_update?: Date;
}
