import { BadRequestException, Body, Controller, Delete, Get, Header, Param, Patch, Post, Put, Query, Request, UnauthorizedException, UseGuards } from '@nestjs/common';
import { registerAs } from '@nestjs/config';
import { ApiBasicAuth, ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiForbiddenResponse, ApiProperty, ApiResponse, ApiSecurity, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { query } from 'express';
import { Pagination } from 'nestjs-typeorm-paginate';
import { catchError, map, Observable, of } from 'rxjs';
import { hasRoles } from 'src/auth/decorator/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-guard';
import { RolesGuard } from 'src/auth/guards/roles.guards';
import { MailService } from 'src/mail/mail.service';
// import { MailService } from 'src/mail/mail.service';
import { UserEntity } from '../models/user.entity';
import { User, UserRole } from '../models/user.interface';
// import { AdminRole } from '../../admin/models/admin.interface';
import {  confirmTokenEmailDTO, ForgotPasswordDTO, LoginDTO, RegisterUserDTO, UpdateUserDTO } from '../models/user.model';
import { UserService } from '../service/user.service';


@ApiTags('users')
@Controller('users')
export class UserController {

    constructor(
        private userService: UserService,
        private mailService: MailService

        ){ }


    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiBearerAuth()
    @Get('profile')
    // getProfile(@Request() req) {
    //     return req.user;
    // }
    getProfile(@Param('accesstoken') accesstoken: string) {
        return accesstoken;
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiBearerAuth()
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

 
    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiBearerAuth()
    @hasRoles(UserRole.ADMIN,UserRole.MEMBER,UserRole.WRITTER ,UserRole.USER)
    @Get('/:id')
    findOne(@Param('id') id: string, @Request() req): Observable<User> {
        if(req.user.user.role === UserRole.ADMIN){
            return this.userService.findOne(Number(id));
        }else{
            if(Number(req.user.user.id) === Number(id)){
                return this.userService.findOne(Number(id));
            }else{
                throw new UnauthorizedException();
            }

        }
      
    }  

    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiBearerAuth()
    @Get()
    @hasRoles(UserRole.ADMIN)
    // @Get()
    // findAll() : Observable<User[]>{
    //     return this.userService.findAll();
    // }
    // paginate 
    index( @Query('page') page: number = 1 ,@Query('limit') limit: number = 10 ) : Observable<Pagination<User>>{
        limit = limit > 100 ? 100 : limit;

        return this.userService.paginate({page: Number(page), limit: Number(limit), route: 'https://localhost:3000/api/users'});
    }



    // @hasRoles(UserRole.USER,UserRole.MEMBER)
    //
    // @Delete(':id')
    // deleteOne(@Param('id') id: string) : Observable<any>{
    //     return this.userService.deleteOne(Number(id));
    // }
   
    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiBearerAuth()
    @hasRoles(UserRole.ADMIN,UserRole.MEMBER,UserRole.WRITTER ,UserRole.USER)
    @Patch('update/:id')
    @ApiBody({ type: UpdateUserDTO})
    updateOne(@Param('id') id: string, @Body() user: User, @Request() req): Observable<any>{
        if(req.user.user.role===UserRole.ADMIN){
            return this.userService.updateOne(Number(id),user);
        }else{
            user.role = req.user.user.role;
            user.tokenEmail = req.user.user.tokenEmail;
            user.expired_token = req.user.user.expired_token;
            if(Number(req.user.user.id) === Number(id)){
                return this.userService.updateOne(Number(id),user);
            }else{
                throw new UnauthorizedException();
            }
        }
       
    }

    // @hasRoles(UserRole.USER)
    //
    // @Put(':id/role')
    // updateRoleOfUser(@Param('id') id: string, @Body() user: User): Observable<User>{
    //     return this.userService.updateRoleOfUser(Number(id),user);
    // }

  
    @Post('register')
    @ApiBody({ type: RegisterUserDTO})
    register(@Body()user: User): Observable<User | Object> {
        return this.userService.register(user).pipe(
            map((user: User) => user),
            catchError(err => of({error: err.message})) 
        );
    }

    @Post('login')
    @ApiResponse({description: "User Login"})
    @ApiUnauthorizedResponse({description: 'Invalid credentials'})
    @ApiBody({ type: LoginDTO})
    login(@Body() user: User): Observable<Object> {
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


    @Post('forgotpassword')
    @ApiBody({ type: ForgotPasswordDTO})
    async forgetpassword(@Body() user: User){
        // create user in db
        // ...
        // send confirmation mail
        const dbUser = await this.userService.isEmail(user);
        if(dbUser){
            await this.mailService.sendUserConfirmation(user, user.tokenEmail)
        }else{
            return dbUser;
        }
        
    }

    @Post('confirmTokenEmail')
    @ApiBody({ type: confirmTokenEmailDTO})
    async confirmEmailToken(@Body() user: User){
        const email = user.email;
        const tokenEmail = user.tokenEmail;
        const isUser = await this.userService.checkTokenEmail(email,tokenEmail);
        if(isUser){
            await this.mailService.sendResetPassword(user, isUser.password);
            const isUpdate = await this.userService.updatePasswordOne(isUser.id, isUser);
            return isUpdate;
        }else{
            throw new BadRequestException('Token do not exist ');
        }
    }
 
} 
