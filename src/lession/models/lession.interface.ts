
export interface Lession {
    lession_id?: number; 
    lession_name?: string;
    lession_keywords?:string;
    lession_img?: string;
    lession_video?:string;
    views: number;
    lession_create?: Date;
    lession_update?: Date;
}

// export enum CourseType {
//     BEGINNER = 'beginner',
//     INTERMEDIATE = 'intermediate',
//     ADVANCED= 'advanced',
// }