import { ApiProperty } from "@nestjs/swagger";
import { type } from "os";

export class BlogTypeDTO {
    @ApiProperty({type: String, description: 'blog_type_name'})
    blog_type_name: string;

}