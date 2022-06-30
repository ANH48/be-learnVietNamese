import { ApiProperty } from "@nestjs/swagger";

export class feedDTO {
    @ApiProperty({type: String, description: 'title'})
    feed_title?: string;

    @ApiProperty({type: String, description: 'content'})
    feed_content?: string;
}

export class ParamDTO {
    @ApiProperty({type: Number, description: 'page', required: false})
    page?: string;

    @ApiProperty({type: Number, description: 'limit', required: false})
    limit?: string;
}