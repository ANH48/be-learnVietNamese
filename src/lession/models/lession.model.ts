import { ApiProperty } from "@nestjs/swagger";
import { type } from "os";

export class LoginDTO {
    @ApiProperty({type: String, description: 'email'})
    email: string;

    @ApiProperty({type: String, description: 'password'})
    password: string;
}