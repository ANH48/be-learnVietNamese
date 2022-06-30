import { UserEntity } from "src/user/models/user.entity";

export interface Feed {
    feed_id?: number; 
    feed_title?: string;
    feed_content?: string;
    author?:UserEntity;
    likes?:number;  
    dislikes?:number;
    views?: number;
    feed_create?: Date;
    feed_update?: Date;
}