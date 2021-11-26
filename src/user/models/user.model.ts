import { ApiProperty } from "@nestjs/swagger";
import { type } from "os";
import { UserRole } from "./user.interface";

export class LoginDTO {
    @ApiProperty({type: String, description: 'email'})
    email: string;

    @ApiProperty({type: String, description: 'username'})
    username: string;

    @ApiProperty({type: String, description: 'password'})
    password: string;
}

export class UpdateUserDTO {

    @ApiProperty({type: String, description: 'name'})
    name: string;

    @ApiProperty({type: String, description: 'username'})
    username: string;

    @ApiProperty({type: String, description: 'password'})
    password: string;

    @ApiProperty({type: String, description: 'email'})
    email: string; 

    @ApiProperty({type: String, description: 'role'})
    role: UserRole;
}

export class RegisterUserDTO {

    @ApiProperty({type: String, description: 'name'})
    name: string;

    @ApiProperty({type: String, description: 'username'})
    username: string;

    @ApiProperty({type: String, description: 'password'})
    password: string;

    @ApiProperty({type: String, description: 'email'})
    email: string; 

    // @ApiProperty({type: String, description: 'role'})
    // role: UserRole;
}

export class CreateUserDTO {

    @ApiProperty({type: String, description: 'name'})
    name: string;

    @ApiProperty({type: String, description: 'username'})
    username: string;

    @ApiProperty({type: String, description: 'password'})
    password: string;

    @ApiProperty({type: String, description: 'email'})
    email: string; 

    @ApiProperty({type: String, description: 'role'})
    role: string; 

    // @ApiProperty({type: String, description: 'role'})
    // role: UserRole;
}

export class ForgotPasswordDTO {

    @ApiProperty({type: String, description: 'email'})
    email: string;

    // @ApiProperty({type: String, description: 'role'})
    // role: UserRole;
}

export class confirmTokenEmailDTO {

    @ApiProperty({type: String, description: 'email'})
    email: string;

    @ApiProperty({type: String, description: 'tokenEmail'})
    tokenEmail: string;
    // @ApiProperty({type: String, description: 'role'})
    // role: UserRole;
}
