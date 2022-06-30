import { ApiProperty } from "@nestjs/swagger";

export class CommentFeedDTO {
    @ApiProperty({type: Number, description: 'user_id'})
    user_id: number;

    @ApiProperty({type: Number, description: 'lession_id'})
    feed_id: number;

    @ApiProperty({type: String, description: 'comment-content'})
    comment_content?: string;
}