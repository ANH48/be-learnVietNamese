import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, Query, Request, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiForbiddenResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { join } from 'path';
import { catchError, from, map, Observable, of, tap } from 'rxjs';
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
    @hasRoles(ListRole.ADMIN, ListRole.TEACHER, ListRole.STUDENT, ListRole.MEMBER)
    @Post('create')
    @ApiCreatedResponse({ description: "Create date with post" })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    @ApiBody({ type: RegisterCourseDTO })
    create(@Body()registerCourse: RegisterCourse, @Request() req, @Request() req1): Observable<RegisterCourse | Object> {
        return this.registerCourseService.create(registerCourse, req.user, req1.course).pipe(map((registerCourse: RegisterCourse) => registerCourse),
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

}
