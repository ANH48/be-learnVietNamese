import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { registerAs } from '@nestjs/config';
import { ApiCreatedResponse, ApiForbiddenResponse, ApiProperty, ApiResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { catchError, map, Observable, of } from 'rxjs';
import { hasRoles } from 'src/auth/decorator/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-guard';
import { RolesGuard } from 'src/auth/guards/roles.guards';
import { User, UserRole } from '../models/user.interface';
import { LoginDTO } from '../models/user.model';
import { UserService } from '../service/user.service';

@ApiTags('users')
@Controller('users')
export class UserController {

    constructor(private userService: UserService){ }

    @hasRoles(UserRole.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post('create')
    @ApiCreatedResponse({description: "Create date with autho"})
    @ApiForbiddenResponse({description: 'Forbidden'})
    create(@Body()user: User): Observable<User | Object> {
        return this.userService.create(user).pipe(
            map((user: User) => user),
            catchError(err => of({error: err.message})) 
        );
    }

    @Post('login')
    @ApiResponse({description: "User Login"})
    @ApiUnauthorizedResponse({description: 'Invalid credentials'})
    login(@Body() user: User, loginDTO: LoginDTO): Observable<Object> {
        console.log(loginDTO);
        return this.userService.login(user).pipe(
            map((jwt: string) => {
                return {access_token: jwt};
            })
        )
    }

    @Get(':id')
    findOne(@Param() params): Observable<User> {
        return this.userService.findOne(params.id);
    }  

    @hasRoles(UserRole.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get()
    findAll() : Observable<User[]>{
        return this.userService.findAll();
    }

    @hasRoles(UserRole.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Delete(':id')
    deleteOne(@Param('id') id: string) : Observable<any>{
        return this.userService.deleteOne(Number(id));
    }

    @hasRoles(UserRole.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Put(':id')
    updateOne(@Param('id') id: string, @Body() user: User): Observable<any>{
        return this.userService.updateOne(Number(id),user);
    }

    @hasRoles(UserRole.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Put(':id/role')
    updateRoleOfUser(@Param('id') id: string, @Body() user: User): Observable<User>{
        return this.userService.updateRoleOfUser(Number(id),user);
    }

  
    @Post('register')
    register(@Body()user: User): Observable<User | Object> {
        return this.userService.register(user).pipe(
            map((user: User) => user),
            catchError(err => of({error: err.message})) 
        );
    }
} 
