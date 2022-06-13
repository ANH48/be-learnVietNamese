import { CourseTypeEntity } from "src/course-type/models/course-type.entity";
import { UserEntity } from "src/user/models/user.entity";

export interface Course {
    course_id?: number; 
    course_name?: string;
    course_keywords?:string;
    course_image?:string;
    course_description?:string;
    // courseType?:CourseType;
    courseType?: CourseTypeEntity;
    course_create?: Date;
    course_update?: Date;
    author?: UserEntity;
}

export enum CourseType {
    BEGINNER = 'Beginner',
    INTERMEDIATE = 'Intermediate',
    ADVANCED= 'Advanced',
}