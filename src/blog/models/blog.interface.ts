import { BlogTypeEntity } from "src/blog-type/models/blog_type.entity";
import { UserEntity } from "src/user/models/user.entity";

export interface Blog {
    blog_id?: number; 
    blog_title?: string;
    blog_description?: string;
    blog_content?: string;
    blog_imgage?: string; 
    blog_avatar?: string;
    blog_video?: string;
    blog_keyword?: string;
    blogType?:BlogTypeEntity;
    author?:UserEntity;
    likes?:number;  
    views: number;
    blog_create?: Date;
    blog_update?: Date;
}