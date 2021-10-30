import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { registerAs } from '@nestjs/config';
import { ApiCreatedResponse, ApiForbiddenResponse, ApiProperty, ApiResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { catchError, map, Observable, of } from 'rxjs';
import { hasRoles } from 'src/auth/decorator/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-guard';
import { RolesGuard } from 'src/auth/guards/roles.guards';
import { Blog } from '../models/blog.interface';
import { LoginDTO } from '../models/blog.model';
import { BlogService } from '../service/blog.service';

@ApiTags('blogs')
@Controller('blogs')
export class BlogController {

    constructor(private blogService: BlogService){ }

    @Post('create')
    @ApiCreatedResponse({description: "Create date with post"})
    @ApiForbiddenResponse({description: 'Forbidden'})
    create(@Body()blog: Blog): Observable<Blog | Object> {
        return this.blogService.create(blog).pipe(
            map((blog: Blog) => blog),
            catchError(err => of({error: err.message})) 
        );
    }

    @Get()
    findAll() : Observable<Blog[]>{
        return this.blogService.findAll();
    }

    @Get(':blog_id')
    findOne(@Param() params) : Observable<Blog>{
        return this.blogService.findOne(params.blog_id);
    }

    @Put('update')
    updateOne(@Param('blog_id')blog_id: string, @Body()blog: Blog): Observable<Blog>{
        return this.blogService.updateOne(Number(blog_id), blog);
    }

    @Delete('delete')
    deleteOne(@Param('blog_id') blog_id: string): Observable<any>{
        return this.blogService.deleteOne(Number(blog_id));
    }
} 
