import { ApiProperty } from "@nestjs/swagger";
import { type } from "os";

export class LessionDTO {
    @ApiProperty({type: String, description: 'lession_name'})
    lession_name: string;

    @ApiProperty({type: String, description: 'lession_keywords'})
    lession_keywords:string;

    @ApiProperty({type: String, description: 'lession_img'})
    lession_img: string;

    @ApiProperty({type: String, description: 'lession_video'})
    lession_video:string;
}