import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiCreatedResponse, ApiForbiddenResponse, ApiTags } from '@nestjs/swagger';
import { catchError, from, map, Observable, of, tap } from 'rxjs';
import { hasRoles } from 'src/auth/decorator/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-guard';
import { RolesGuard } from 'src/auth/guards/roles.guards';
import { Course } from '../models/course.interface';
import { LoginDTO } from '../models/course.model';
import { CourseService } from '../service/course.service';

@ApiTags('course')
@Controller('course')
export class CourseController {

    constructor(private courseService: CourseService){ }

    @Post('create')
    @ApiCreatedResponse({description: "Create date with post"})
    @ApiForbiddenResponse({description: 'Forbidden'})
    create(@Body()course: Course): Observable<Course | Object> {
        return this.courseService.create(course).pipe(
            map((course: Course) => course),
            catchError(err => of({error: err.message})) 
        );
    }

    @Get()
    findAll() : Observable<Course[]>{
        return this.courseService.findAll();
    }

    // @Get(':BlogType_id')
    // findOne(@Param() params) : Observable<BlogType>{
    //     return this.blogTypeService.findOne(params.BlogType_id);
    // }

    // @Put('update/:BlogType_id')
    // updateOne(@Param('BlogType_id')BlogType_id: string, @Body()BlogType: BlogType): Observable<BlogType>{
    //     return this.blogTypeService.updateOne(Number(BlogType_id), BlogType);
    // }

    // @Delete('delete/:BlogType_id')
    // deleteOne(@Param('BlogType_id') BlogType_id: string): Observable<any>{
    //     return this.blogTypeService.deleteOne(Number(BlogType_id));
    // }
    


} 