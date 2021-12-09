import { ApiProperty } from "@nestjs/swagger";
import { type } from "os";
import { CourseEntity } from "src/course/models/course.entity";

export class SurcriseDTO {
    @ApiProperty({type: String, description: 'email'})
    email: string;

    @ApiProperty({type: String, description: 'phone'})
    phone:string;

    @ApiProperty({type: String, description: 'name'})
    name?:string;
}