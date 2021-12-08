import { ApiProperty } from "@nestjs/swagger";
import { type } from "os";

export class CourseDTO {

    @ApiProperty({type: String, description: 'course_name'})
    course_name?: string;

    @ApiProperty({type: String, description: 'course_image'})
    course_image?: string;

    @ApiProperty({type: String, description: 'course_keywords'})
    course_keywords?:string;
}