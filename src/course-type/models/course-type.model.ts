import { ApiProperty } from "@nestjs/swagger";
import { type } from "os";

export class CourseTypeDTO {
    @ApiProperty({type: String, description: 'course_type_name'})
    course_type_name: string;
}