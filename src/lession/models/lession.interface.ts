import { CourseEntity } from "src/course/models/course.entity";
import { UserEntity } from "src/user/models/user.entity";

export interface Lession {
    lession_id?: number; 
    lession_name?: string;
    lession_keyword?:string;
    lession_img?: string;
    lession_video?:string;
    author?: UserEntity;
    views: number;
    courseType?:CourseEntity;
    lession_create?: Date;
    lession_update?: Date;
}
