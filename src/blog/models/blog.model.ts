import { ApiProperty } from "@nestjs/swagger";
import { type } from "os";

export class blogDTO {
    @ApiProperty({type: String, description: 'title'})
    blog_title?: string;

    @ApiProperty({type: String, description: 'description'})
    blog_description?: string;

    @ApiProperty({type: String, description: 'content'})
    blog_content?: string;

    @ApiProperty({type: String, description: 'imgage'})
    blog_imgage?: string; 

    @ApiProperty({type: String, description: 'avatar'})
    blog_avatar?: string;

    @ApiProperty({type: String, description: 'video'})
    blog_video?: string;

    @ApiProperty({type: String, description: 'keyword'})
    blog_keyword?: string;
}