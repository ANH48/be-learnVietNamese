import { ApiProperty } from "@nestjs/swagger";
import { type } from "os";
import { CourseEntity } from "src/course/models/course.entity";

export class LessionDTO {
    @ApiProperty({type: String, description: 'lession_name'})
    lession_name: string;

    @ApiProperty({type: String, description: 'lession_keywords'})
    lession_keywords:string;

    @ApiProperty({type: String, description: 'lession_img'})
    lession_img: string;

    @ApiProperty({type: String, description: 'lession_video'})
    lession_video:string;

    @ApiProperty({type: CourseEntity, description: 'lession_courseType'})
    courseType?:CourseEntity;
}