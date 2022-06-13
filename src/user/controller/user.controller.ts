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
import {  confirmTokenEmailDTO, ForgotPasswordDTO, LoginDTO, RegisterUserDTO, UpdateUserDTO, CreateUserDTO } from '../models/user.model';
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
    getProfile(@Request() req) {
        return req.user;
    }
    // getProfile(@Param('accesstoken') accesstoken: string) {
    //     return accesstoken;
    // }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiBearerAuth()
    @hasRoles(UserRole.ADMIN)
    @ApiBody({ type: CreateUserDTO})
    @Post('create')
    create(@Body()user: User): Observable<User | Object> {
        const obj: any = {
            error: "Invalid email"
        }
        const regularExpression = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        const isEmail =  regularExpression.test(String(user.email).toLowerCase());
        if(!isEmail) return  obj;
        return this.userService.create(user).pipe(
            map((user: User) => user),
            catchError(err => { throw new BadRequestException("Email or User is exist")})
        );
    }

 
    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiBearerAuth()
    @hasRoles(UserRole.ADMIN,UserRole.MEMBER,UserRole.WRITTER ,UserRole.USER, UserRole.TEACHER)
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
    index( @Query('page') page: number = 1  ,@Query('limit') limit: number = 100 ) : Observable<Pagination<User>>{
        limit = limit > 100 ? 100 : limit;

        return this.userService.paginate({page: Number(page), limit: Number(limit), route: 'https://localhost:3000/api/users'});
    }



    @hasRoles(UserRole.USER,UserRole.MEMBER)
    @ApiBearerAuth()
    @hasRoles(UserRole.ADMIN)
    @Delete('delete/:id')
    deleteOne(@Param('id') id: string) : Observable<any>{
        return this.userService.deleteOne(Number(id));
    }
   
    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiBearerAuth()
    @hasRoles(UserRole.ADMIN,UserRole.MEMBER,UserRole.WRITTER ,UserRole.USER)
    @Patch('update/:id')
    @ApiBody({ type: UpdateUserDTO})
    updateOne(@Param('id') id: string, @Body() user: User, @Request() req): Observable<any>{
        user.email = req.user.user.email;

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
        const obj: any = {
            error: "Invalid email"
        }
        const regularExpression = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        const isEmail =  regularExpression.test(String(user.email).toLowerCase());
        if(!isEmail) return  obj;
            return this.userService.register(user).pipe(
                map((user: User) => user) 
            );
    }

    @Post('login')
    @ApiResponse({description: "User Login"})
    @ApiUnauthorizedResponse({description: 'Invalid credentials'})
    @ApiBody({ type: LoginDTO})
    login(@Body() user: User): Observable<Object> {
        const obj: any = {
            error: "invalid email or password"
        }
        if(!user) return obj;
        if((user.email && user.password) || (user.username && user.password)){
            const regularExpression = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            const isEmail =  regularExpression.test(String(user.email).toLowerCase());
            if(!isEmail && !user.username){
                return obj;
            }
            if(!isEmail) user.email = null;
            return this.userService.login(user).pipe(
                map((jwt: string) => {
                    return {access_token: jwt};
                })
            )
        }else{
            return obj;
        }
    }


    @Post('forgotpassword')
    @ApiBody({ type: ForgotPasswordDTO})
    async forgetpassword(@Body() user: User){
        const obj: any = {
            error: "Token send to email, Please check your email"
        } 
        const regularExpression = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        const isEmail =  regularExpression.test(String(user.email).toLowerCase());
        if(!isEmail){
            obj.error = "Email error ";
            return obj;
        }
        const dbUser = await this.userService.isEmail(user);
        if(dbUser!=0&&dbUser){
            await this.mailService.sendUserConfirmation(dbUser, dbUser.tokenEmail);
            obj.error = "Token send to email, Please check your email";
            return obj
        }else{
            return obj;
        }
        
    }

    @Post('confirmTokenEmail')
    @ApiBody({ type: confirmTokenEmailDTO})
    async confirmEmailToken(@Body() user: User){
        const email = user.email;
        const tokenEmail = user.tokenEmail;
        const obj: any = {
            error: "Token send to email, Please check your email"
        } 
        const regularExpression = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        const isEmail =  regularExpression.test(String(user.email).toLowerCase());
        if(!isEmail){
            obj.error = "Email error ";
            return obj;
        }
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
