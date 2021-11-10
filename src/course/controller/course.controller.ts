import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiForbiddenResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { catchError, from, map, Observable, of, tap } from 'rxjs';
import { hasRoles } from 'src/auth/decorator/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-guard';
import { RolesGuard } from 'src/auth/guards/roles.guards';
import { ListRole } from 'src/auth/role/role.enum';
import { Course, CourseType } from '../models/course.interface';
import { CourseDTO } from '../models/course.model';
import { CourseService } from '../service/course.service';

@ApiTags('course')
@Controller('course')
export class CourseController {

    constructor(private courseService: CourseService){ }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiBearerAuth()
    @hasRoles(ListRole.ADMIN)
    @Post('create')
    @ApiCreatedResponse({description: "Create date with post"})
    @ApiForbiddenResponse({description: 'Forbidden'})
    @ApiQuery(
        {name: 'Course Type', enum: CourseType},
    )
    @ApiBody({type: CourseDTO})
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

  
    @Get(':course_id')
    findOne(@Param('course_id') course_id: string) : Observable<Course>{
        return this.courseService.findOne(Number(course_id));
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiBearerAuth()
    @hasRoles(ListRole.ADMIN)
    @Put('update/:course_id')
    @ApiBody({type: CourseDTO})
    updateOne(@Param('course_id')course_id: string, @Body()course: Course): Observable<Course>{
        return this.courseService.updateOne(Number(course_id), course);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiBearerAuth()
    @hasRoles(ListRole.ADMIN)   
    @Delete('delete/:course_id')
    deleteOne(@Param('course_id') course_id: string): Observable<any>{
        return this.courseService.deleteOne(Number(course_id));
    }
    


} 