import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Request, UseGuards } from '@nestjs/common';
import { registerAs } from '@nestjs/config';
import { ApiCreatedResponse, ApiForbiddenResponse, ApiProperty, ApiResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { catchError, map, Observable, of } from 'rxjs';
import { hasRoles } from 'src/auth/decorator/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-guard';
import { RolesGuard } from 'src/auth/guards/roles.guards';
import { User, UserRole } from '../models/user.interface';
// import { AdminRole } from '../../admin/models/admin.interface';
import { LoginDTO } from '../models/user.model';
import { UserService } from '../service/user.service';

@ApiTags('users')
@Controller('users')
export class UserController {

    constructor(private userService: UserService){ }


    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get('profile')
    getProfile(@Request() req) {
        return req.user;
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @hasRoles(UserRole.ADMIN)
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
        if((user.email && user.password) || (user.username && user.password)){
            return this.userService.login(user).pipe(
                map((jwt: string) => {
                    return {access_token: jwt};
                })
            )
        }else{
            const obj: any = {
                error: "invalid email or password"
            }
            return obj;
        }
        
    }
    @UseGuards(JwtAuthGuard, RolesGuard)
    @hasRoles(UserRole.ADMIN,UserRole.MEMBER,UserRole.WRITTER ,UserRole.USER)
    @Get(':id')
    findOne(@Param() params): Observable<User> {
        return this.userService.findOne(params.id);
    }  

    @hasRoles(UserRole.ADMIN)

    @Get()
    findAll() : Observable<User[]>{
        return this.userService.findAll();
    }

    // @hasRoles(UserRole.USER,UserRole.MEMBER)
    //
    // @Delete(':id')
    // deleteOne(@Param('id') id: string) : Observable<any>{
    //     return this.userService.deleteOne(Number(id));
    // }
    @UseGuards(JwtAuthGuard, RolesGuard)
    @hasRoles(UserRole.ADMIN,UserRole.MEMBER,UserRole.WRITTER ,UserRole.USER)
    @Patch('update/:id')
    updateOne(@Param('id') id: string, @Body() user: User, @Request() req): Observable<any>{
        if(req.user.user.role!="admin"){
            user.role = UserRole.USER;
        }
        return this.userService.updateOne(Number(id),user);
    }

    // @hasRoles(UserRole.USER)
    // @UseGuards(JwtAuthGuard, RolesGuard)
    // @Put(':id/role')
    // updateRoleOfUser(@Param('id') id: string, @Body() user: User): Observable<User>{
    //     return this.userService.updateRoleOfUser(Number(id),user);
    // }

  
    @Post('register')
    register(@Body()user: User): Observable<User | Object> {
        return this.userService.register(user).pipe(
            map((user: User) => user),
            catchError(err => of({error: err.message})) 
        );
    }
} 
