import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiCreatedResponse, ApiForbiddenResponse, ApiTags } from '@nestjs/swagger';
import { catchError, from, map, Observable, of, tap } from 'rxjs';
import { hasRoles } from 'src/auth/decorator/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-guard';
import { RolesGuard } from 'src/auth/guards/roles.guards';
import { BlogType } from '../models/blog_type.interface';
import { LoginDTO } from '../models/blog_type.model';
import { BlogTypeService } from '../service/blog_type.service';

@ApiTags('blog_type')
@Controller('blog_type')
export class BlogTypeController {

    constructor(private blogTypeService: BlogTypeService){ }

    @Post('create')
    @ApiCreatedResponse({description: "Create date with post"})
    @ApiForbiddenResponse({description: 'Forbidden'})
    create(@Body()blogType: BlogType): Observable<BlogType | Object> {
        return this.blogTypeService.create(blogType).pipe(
            map((BlogType: BlogType) => BlogType),
            catchError(err => of({error: err.message})) 
        );
    }

    @Get()
    findAll() : Observable<BlogType[]>{
        return this.blogTypeService.findAll();
    }

    @Get(':BlogType_id')
    findOne(@Param() params) : Observable<BlogType>{
        return this.blogTypeService.findOne(params.BlogType_id);
    }

    @Put('update/:BlogType_id')
    updateOne(@Param('BlogType_id')BlogType_id: string, @Body()BlogType: BlogType): Observable<BlogType>{
        return this.blogTypeService.updateOne(Number(BlogType_id), BlogType);
    }

    @Delete('delete/:BlogType_id')
    deleteOne(@Param('BlogType_id') BlogType_id: string): Observable<any>{
        return this.blogTypeService.deleteOne(Number(BlogType_id));
    }


} 