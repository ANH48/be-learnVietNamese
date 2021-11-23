import { Body, Controller, Delete, Get, Param, Post, Put, UploadedFile, UploadedFiles, UseGuards, UseInterceptors, Request, Res, BadRequestException } from '@nestjs/common';
import { registerAs } from '@nestjs/config';
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiForbiddenResponse, ApiProperty, ApiResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { catchError, from, map, Observable, of, tap, throwError } from 'rxjs';
import { hasRoles } from 'src/auth/decorator/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-guard';
import { RolesGuard } from 'src/auth/guards/roles.guards';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path = require('path');
import { join } from 'path';
import { ListRole } from 'src/auth/role/role.enum';
import { Lession_saveService } from '../service/lession-save.service';
import { Lession_saveDTO } from '../models/lession-save.model';
import { Lession_save } from '../models/lession-save.interface';


@ApiTags('lession_save')
@Controller('lession_save')
export class Lession_saveController {

    constructor(private lession_saveService: Lession_saveService){ }

    // @UseGuards(JwtAuthGuard, RolesGuard)
    // @ApiBearerAuth()
    // @hasRoles(ListRole.ADMIN, ListRole.WRITTER, ListRole.USER, ListRole.MEMBER)
    // @Post('create-list_lession_id')
    // @ApiCreatedResponse({description: "Create date with post"})
    // @ApiForbiddenResponse({description: 'Forbidden'})
    // @ApiBody({ type: Lession_saveDTO})
    // create_lession(@Body()lession_save: JSON, @Request() req): Observable<Lession_save | Object> {
    //         return this.lession_saveService.create_lession(lession_save,req.user).pipe(
    //             map((lession_save: Lession_save) => lession_save),
    //             catchError(err => of({error: err.message})) 
    //         );
    // }


    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiBearerAuth()
    @hasRoles(ListRole.ADMIN, ListRole.WRITTER, ListRole.USER, ListRole.MEMBER)
    @Get()
    findAll( @Request() req) : Observable<Lession_save[]>{
        if(req.user){
            return this.lession_saveService.findAll(Number(req.user.user.id));
        }
        throw new BadRequestException("Forbiden User")
    }


    // @Get('/:id')
    // // @ApiBody({ type: blogDTO})
    // findOne(@Param('id') id: string) : Observable<Lession_save>{
    //     return this.lession_saveService.findOne(Number(id));
    // }


    // @UseGuards(JwtAuthGuard, RolesGuard)
    // @ApiBearerAuth()
    // @hasRoles(ListRole.ADMIN, ListRole.WRITTER)
    // @ApiBody({ type: Lession_saveDTO})
    // @Put('update/:lession_save_id')
    // updateOne(@Param('lession_save_id')lession_save_id: string, @Body()lession_save: Lession_save, @Request() req): Observable<Lession_save>{
    //     if(req.user.user.role!=ListRole.ADMIN){
    //         lession_save.user_id = req.user.user.id;
    //         return this.lession_saveService.updateOneCheckId(Number(lession_save_id),Number(req.user.user.id) ,lession_save);
    //     }else{
    //         return this.lession_saveService.updateOne(Number(lession_save_id), lession_save);

    //     }
    // }


    // @UseGuards(JwtAuthGuard, RolesGuard)
    // @ApiBearerAuth()
    // @hasRoles(ListRole.ADMIN, ListRole.WRITTER,ListRole.MEMBER, ListRole.USER)
    // @Put('updateLike/:blog_id')
    // updateLike(@Param('blog_id')blog_id: string): Observable<Blog>{
    //         return this.blogService.updateLike(Number(blog_id));
        
    // }


    // @UseGuards(JwtAuthGuard, RolesGuard)
    // @ApiBearerAuth()
    // @hasRoles(ListRole.ADMIN, ListRole.WRITTER)
    // @ApiBody({ type: blogDTO})
    // @Put('update/:blog_id')
    // updateOne(@Param('blog_id')blog_id: string, @Body()blog: Blog, @Request() req): Observable<Blog>{
    //     if(req.user.user.role!=ListRole.ADMIN){
    //         blog.author = req.user.user.id;
    //         return this.blogService.updateOneCheckId(Number(blog_id),Number(req.user.user.id) ,blog);
    //     }else{
    //         return this.blogService.updateOne(Number(blog_id), blog);

    //     }
    // }

    // @UseGuards(JwtAuthGuard, RolesGuard)
    // @ApiBearerAuth()
    // @Delete('delete/:blog_id')
    // deleteOne(@Param('blog_id') blog_id: string,  @Request() req): Observable<any>{
    //     if(req.user.user.role!=ListRole.ADMIN){
    //         return this.blogService.deleteOneCheckId(Number(blog_id),Number(req.user.user.id))
    //     }else{
    //         return this.blogService.deleteOne(Number(blog_id))
    //     }
    // }

    
} 
