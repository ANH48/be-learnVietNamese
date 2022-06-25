import { ApiProperty } from "@nestjs/swagger";

export class CommentLessonDTO {
    @ApiProperty({type: Number, description: 'user_id'})
    user_id: number;

    @ApiProperty({type: Number, description: 'lession_id'})
    lesson_id: number;

    @ApiProperty({type: String, description: 'comment-content'})
    comment_content?: string;
}