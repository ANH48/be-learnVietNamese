import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, Request, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiForbiddenResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { join } from 'path';
import { catchError, from, map, Observable, of, tap } from 'rxjs';
import { hasRoles } from 'src/auth/decorator/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-guard';
import { RolesGuard } from 'src/auth/guards/roles.guards';
import { ListRole } from 'src/auth/role/role.enum';
import { Course, CourseType } from '../models/course.interface';
import { CourseDTO } from '../models/course.model';
import { CourseService } from '../service/course.service';
import { v4 as uuidv4 } from 'uuid';
import path = require('path');
import { ImageService } from 'src/Image/image.service';
import { Query } from '@nestjs-query/core';
// import { Query } from '@nestjs-query/core';
export const storage = {
    storage: diskStorage({
        destination: './uploads/course',
        filename: (req, file, cb) => {
            const filename: string = path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
            const extension: string = path.parse(file.originalname).ext;

            cb(null, `${filename}${extension}`)
        }
    })
}

// const q: Query<MyClass> = {
//     filter: {
//       title: { eq: 'Foo Bar' },
//     },
//   };

@ApiTags('course')
@Controller('course')
export class CourseController {

    constructor(
        private courseService: CourseService,
        private imageService : ImageService
        ){ }

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
            catchError(err => {throw new BadRequestException(err)}) 
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
    
    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiBearerAuth()
    @hasRoles(ListRole.ADMIN,ListRole.WRITTER)
    @Post('upload')
    @UseInterceptors(FileInterceptor('file', storage))
    uploadFile(@UploadedFile() file, @Request() req): Observable<Object> {
        const str = "http://localhost:4000/api/course/course-image/" + file.filename;
        const obj = {
            image_name: file.filename,
            image_link: str
        }
        this.imageService.create(obj).subscribe();
        return of({imagePath: file.filename, imageLink: str});
    }

    @Get('course-image/:imagename')
    findProfileImage(@Param('imagename') imagename, @Res() res): Observable<Object> {
        return of(res.sendFile(join(process.cwd(), 'uploads/course/' + imagename)));
    }


} 