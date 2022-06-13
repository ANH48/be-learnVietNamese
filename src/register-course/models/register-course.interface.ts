import { CourseEntity } from "src/course/models/course.entity";
import { UserEntity } from "src/user/models/user.entity";

export interface RegisterCourse {
    register_id?: number;
    register?: boolean;
    user?: UserEntity;
    course?: CourseEntity;
    register_date?: Date;
    register_update_date?: Date;
}

export interface RegisterCourseByUser {
    register_id?: number;
    register?: boolean;
    user_id: number;
    course?: number;
    register_date?: Date;
    register_update_date?: Date;
}