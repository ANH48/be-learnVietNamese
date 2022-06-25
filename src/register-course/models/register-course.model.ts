import { ApiProperty } from "@nestjs/swagger";

export class RegisterCourseDTO {
    @ApiProperty({type: Number, description: 'user_id'})
    user_id: number;

    @ApiProperty({type: Number, description: 'course_id'})
    course_id: number;

    @ApiProperty({type: Boolean, description: 'register'})
    register?: boolean;
}