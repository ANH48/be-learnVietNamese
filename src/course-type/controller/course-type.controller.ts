import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiForbiddenResponse, ApiTags } from '@nestjs/swagger';
import { catchError, from, map, Observable, of, tap } from 'rxjs';
import { hasRoles } from 'src/auth/decorator/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-guard';
import { RolesGuard } from 'src/auth/guards/roles.guards';
import { ListRole } from 'src/auth/role/role.enum';
import { CourseType } from '../models/course-type.interface';
import { CourseTypeDTO } from '../models/course-type.model';
import { CourseTypeService } from '../service/course-type.service';

@ApiTags('course_type')
@Controller('course_type')
export class CourseTypeController {

    constructor(private courseTypeService: CourseTypeService){ }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiBearerAuth()
    @hasRoles(ListRole.ADMIN,ListRole.TEACHER)
    @Post('create')
    @ApiCreatedResponse({description: "Create date with post"})
    @ApiForbiddenResponse({description: 'Forbidden'})
    @ApiBody({type: CourseTypeDTO})
    create(@Body()courseType: CourseType, @Request() req): Observable<CourseType | Object> {
        return this.courseTypeService.create(courseType).pipe(
            map((CourseType: CourseType) => CourseType),
            catchError(err => {throw new BadRequestException(err)}) 
        );
    }

    @Get()
    findAll(@Body()filter: any) : Observable<CourseType[]>{
        return this.courseTypeService.findAll();
    }

    @Get(':CourseType_id')
    findOne(@Param('CourseType_id') CourseType_id: string) : Observable<CourseType>{
        return this.courseTypeService.findOne(Number(CourseType_id));
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiBearerAuth()
    @hasRoles(ListRole.ADMIN,ListRole.TEACHER)
    @Put('update/:CourseType_id')
    updateOne(@Param('CourseType_id')CourseType_id: string, @Body()CourseType: CourseType): Observable<CourseType>{
        return this.courseTypeService.updateOne(Number(CourseType_id), CourseType);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiBearerAuth()
    @hasRoles(ListRole.ADMIN,ListRole.TEACHER)
    @Delete('delete/:CourseType_id')
    deleteOne(@Param('CourseType_id') CourseType_id: string): Observable<any>{
        return this.courseTypeService.deleteOne(Number(CourseType_id));
    }
    


} 