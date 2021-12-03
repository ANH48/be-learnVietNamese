import { Body, Controller, Delete, Get, Param, Post, Put, UploadedFile, UploadedFiles, UseGuards, UseInterceptors, Request, Res, Query, BadRequestException } from '@nestjs/common';
import { registerAs } from '@nestjs/config';
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiForbiddenResponse, ApiProperty, ApiResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { catchError, from, map, Observable, of, tap, throwError } from 'rxjs';
import { hasRoles } from 'src/auth/decorator/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-guard';
import { RolesGuard } from 'src/auth/guards/roles.guards';
import { Blog } from '../models/blog.interface';
import { blogDTO } from '../models/blog.model';
import { BlogService } from '../service/blog.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path = require('path');
import { join } from 'path';
import { ListRole } from 'src/auth/role/role.enum';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';

export const storage = {
    storage: diskStorage({
        destination: './uploads/blogs',
        filename: (req, file, cb) => {
            const filename: string = path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
            const extension: string = path.parse(file.originalname).ext;

            cb(null, `${filename}${extension}`)
        }
    })

} 

@ApiTags('blogs')
@Controller('blogs')
export class BlogController {

    constructor(private blogService: BlogService){ }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiBearerAuth()
    @hasRoles(ListRole.ADMIN, ListRole.WRITTER)
    @Post('create')
    @ApiCreatedResponse({description: "Create date with post"})
    @ApiForbiddenResponse({description: 'Forbidden'})
    @ApiBody({ type: blogDTO})
    create(@Body()blog: Blog, @Request() req): Observable<Blog | Object> {
        
            return this.blogService.create(blog,req.user).pipe(
                map((blog: Blog) => blog),
                catchError(err => { throw new BadRequestException(err)})
            );

    }

    @Get()
    findAll(@Query('page') page: number = 1 ,@Query('limit') limit: number = 10 ) : Observable<Blog[]>{
        limit = limit > 100 ? 100 : limit;
        let filter = {
            limit: limit,
            page: page
        }

        return this.blogService.findAll({page: Number(page), limit: Number(limit), route: 'https://localhost:3000/api/blogs'});
    }
    // index( @Query('page') page: number = 1 ,@Query('limit') limit: number = 10 ) : Observable<Pagination<Blog>>{
    //     limit = limit > 100 ? 100 : limit;

        // return this.blogService.paginate({page: Number(page), limit: Number(limit), route: 'https://localhost:3000/api/blogs'});
    // }


    @Get(':id')
    // @ApiBody({ type: blogDTO})
    findOne(@Param('id') id: string) : Observable<any>{
        try {
            this.blogService.updateView(Number(id)).subscribe();
        } catch (error) {
             throw new Error("Blog does not exist");
        }
        return this.blogService.findOne(Number(id))

    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiBearerAuth()
    @hasRoles(ListRole.ADMIN, ListRole.WRITTER,ListRole.MEMBER, ListRole.USER)
    @Put('updateLike/:blog_id')
    updateLike(@Param('blog_id')blog_id: string): Observable<Blog>{
            return this.blogService.updateLike(Number(blog_id));
        
    }


    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiBearerAuth()
    @hasRoles(ListRole.ADMIN, ListRole.WRITTER)
    @ApiBody({ type: blogDTO})
    @Put('update/:blog_id')
    updateOne(@Param('blog_id')blog_id: string, @Body()blog: Blog, @Request() req): Observable<Blog>{
        try {
            if(req.user.user.role!=ListRole.ADMIN){
                // blog.author = req.user.user.id;
                return this.blogService.updateOneCheckId(Number(blog_id),Number(req.user.user.id) ,blog);
            }else{
                return this.blogService.updateOne(Number(blog_id), blog, req.user.user);
    
            }
        } catch (error) {
            catchError(error => { throw new BadRequestException(error)})
        }
      
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiBearerAuth()
    @hasRoles(ListRole.ADMIN,ListRole.WRITTER)
    @Delete('delete/:blog_id')
    deleteOne(@Param('blog_id') blog_id: string,  @Request() req): Observable<any>{
        if(req.user.user.role!=ListRole.ADMIN){
            return this.blogService.deleteOneCheckId(Number(blog_id),Number(req.user.user.id))
        }else{
            return this.blogService.deleteOne(Number(blog_id))
        }
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiBearerAuth()
    @hasRoles(ListRole.ADMIN,ListRole.WRITTER)
    @Post('upload')
    @UseInterceptors(FileInterceptor('file', storage))
    uploadFile(@UploadedFile() file, @Request() req): Observable<Object> {
        // const blog: Blog = req.blog;

        // blog.blog_avatar = file.filename;
        // return this.blogService.updateOne(blog.blog_id, blog).pipe(
        //     tap((blog: Blog) => console.log(blog)),
        //     map((blog: Blog) => ({blog_avatar: blog.blog_avatar}))
        // )
        return of({imagePath: file.filename});
    }

    @Get('blogs-image/:imagename')
    findProfileImage(@Param('imagename') imagename, @Res() res): Observable<Object> {
        return of(res.sendFile(join(process.cwd(), 'uploads/blogs/' + imagename)));
    }
} 
