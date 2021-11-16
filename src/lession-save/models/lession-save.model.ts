import { ApiProperty } from "@nestjs/swagger";
import { type } from "os";

export class Lession_saveDTO {
    
    @ApiProperty({type: JSON, description: 'list_lession_id'})
    list_lession_id?: JSON;

}


