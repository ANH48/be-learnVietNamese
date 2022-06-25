import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, Query, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiForbiddenResponse, ApiTags } from '@nestjs/swagger';
import { catchError, map, Observable } from 'rxjs';
import { hasRoles } from 'src/auth/decorator/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-guard';
import { RolesGuard } from 'src/auth/guards/roles.guards';
import { ListRole } from 'src/auth/role/role.enum';
import { RegisterCourse } from '../models/register-course.interface';
import { RegisterCourseDTO } from '../models/register-course.model';
import { RegisterCourseService } from '../service/register-course.service';
import nestedGroupby from 'nested-groupby';

@ApiTags('register-course')
@Controller('register-course')
export class RegisterCourseController {
    constructor(
        private registerCourseService: RegisterCourseService
    ) { }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiBearerAuth()
    @hasRoles(ListRole.ADMIN, ListRole.TEACHER, ListRole.STUDENT)
    @Post('create')
    @ApiCreatedResponse({ description: "Create date with post" })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    @ApiBody({ type: RegisterCourseDTO })
    create(@Body()registerCourse: RegisterCourse, @Request() req): Observable<RegisterCourse | Object> {
        return this.registerCourseService.create(registerCourse, req.user.user).pipe(map((registerCourse: RegisterCourse) => registerCourse),
            catchError(err => { throw new BadRequestException(err) }))
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiBearerAuth()
    @hasRoles(ListRole.ADMIN)
    @Get()
    findAll(): Observable<RegisterCourse[]> {
        return this.registerCourseService.findAll();
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiBearerAuth()
    @hasRoles(ListRole.ADMIN, ListRole.STUDENT, ListRole.TEACHER)
    @Get("user")
    async findByUserId(@Request() req) {
        if(req.user) {
            let courseRegisterByUser = await this.registerCourseService.findByUserId(Number(req.user.user.id));
            nestedGroupby(courseRegisterByUser, ['user']);
            return courseRegisterByUser;
        }
        throw new BadRequestException("Forbidden user");
    }

    @hasRoles(ListRole.USER, ListRole.STUDENT)
    @ApiBearerAuth()
    @hasRoles(ListRole.ADMIN)
    @Delete('delete/:id')
    deleteOne(@Param('id') id: string) : Observable<any> {
        return this.registerCourseService.deleteOne(Number(id));
    }
}
