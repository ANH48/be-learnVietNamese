import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiForbiddenResponse, ApiTags } from '@nestjs/swagger';
import { catchError, from, map, Observable, of, tap } from 'rxjs';
import { hasRoles } from 'src/auth/decorator/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-guard';
import { RolesGuard } from 'src/auth/guards/roles.guards';
import { ListRole } from 'src/auth/role/role.enum';
import { BlogType } from '../models/blog_type.interface';
import { BlogTypeDTO } from '../models/blog_type.model';
import { BlogTypeService } from '../service/blog_type.service';

@ApiTags('blog_type')
@Controller('blog_type')
export class BlogTypeController {

    constructor(private blogTypeService: BlogTypeService){ }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiBearerAuth()
    @hasRoles(ListRole.ADMIN,ListRole.WRITTER)
    @Post('create')
    @ApiCreatedResponse({description: "Create date with post"})
    @ApiForbiddenResponse({description: 'Forbidden'})
    @ApiBody({type: BlogTypeDTO})
    create(@Body()blogType: BlogType, @Request() req): Observable<BlogType | Object> {
        return this.blogTypeService.create(blogType).pipe(
            map((BlogType: BlogType) => BlogType),
            catchError(err => {throw new BadRequestException(err)}) 
        );
    }

    @Get()
    findAll(@Body()filter: any) : Observable<BlogType[]>{
        return this.blogTypeService.findAll();
    }

    @Get(':BlogType_id')
    findOne(@Param('BlogType_id') BlogType_id: string) : Observable<BlogType>{
        return this.blogTypeService.findOne(Number(BlogType_id));
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiBearerAuth()
    @hasRoles(ListRole.ADMIN,ListRole.WRITTER)
    @Put('update/:BlogType_id')
    updateOne(@Param('BlogType_id')BlogType_id: string, @Body()BlogType: BlogType): Observable<BlogType>{
        return this.blogTypeService.updateOne(Number(BlogType_id), BlogType);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiBearerAuth()
    @hasRoles(ListRole.ADMIN,ListRole.WRITTER)
    @Delete('delete/:BlogType_id')
    deleteOne(@Param('BlogType_id') BlogType_id: string): Observable<any>{
        return this.blogTypeService.deleteOne(Number(BlogType_id));
    }
    


} 