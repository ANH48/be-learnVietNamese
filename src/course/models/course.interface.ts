
export interface Course {
    course_id?: number; 
    course_name?: string;
    course_keywords?:string;
    course_image?:string;
    CourseType?:CourseType;
    course_create?: Date;
    course_update?: Date;
}

export enum CourseType {
    BEGINNER = 'beginner',
    INTERMEDIATE = 'intermediate',
    ADVANCED= 'advanced',
}