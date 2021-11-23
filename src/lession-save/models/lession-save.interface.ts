import { LessionEntity } from "src/lession/models/lession.entity";
import { UserEntity } from "src/user/models/user.entity";

export interface Lession_save {
    lession_save_id?: number; 
    user_id: number;
    lession_id:number;
    lession_save_create?: Date;
    lession_save_update?: Date;
}
