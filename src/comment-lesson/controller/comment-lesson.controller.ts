import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiForbiddenResponse, ApiTags } from '@nestjs/swagger';
import nestedGroupBy from 'nested-groupby';
import { catchError, map, Observable } from 'rxjs';
import { hasRoles } from 'src/auth/decorator/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-guard';
import { RolesGuard } from 'src/auth/guards/roles.guards';
import { ListRole } from 'src/auth/role/role.enum';
import { CommentLesson } from '../models/comment-lesson.interface';
import { CommentLessonDTO } from '../models/comment-lesson.model';
import { CommentLessonService } from '../service/comment-lesson.service';

@ApiTags('comment-lesson')
@Controller('comment-lesson')
export class CommentLessonController {
    constructor(
        private commentLessonService: CommentLessonService
    ) { }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiBearerAuth()
    @hasRoles(ListRole.ADMIN, ListRole.TEACHER, ListRole.STUDENT)
    @Post('create')
    @ApiCreatedResponse({ description: "Create date with post" })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    @ApiBody({ type: CommentLessonDTO })
    create(@Body() comment: CommentLesson, @Request() req): Observable<CommentLesson | Object> {
        return this.commentLessonService.create(comment, req.user.user).pipe(map((comment: CommentLesson) => comment),
        catchError(err => { throw new BadRequestException(err) }))
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiBearerAuth()
    @hasRoles(ListRole.ADMIN)
    @Get()
    findAll(): Observable<CommentLesson[]> {
        return this.commentLessonService.findAll();
    }

    // @Get("lesson")
    // async findByLessonId(@Param('lesson_id') lesson_id: string) {
    //     try {
    //         this.commentLessonService.findByLessonId(Number(lesson_id)).subscribe();
    //     } catch (error) {
    //         throw new Error("Lesson does not exist");
    //     }
    //     return this.commentLessonService.findByLessonId(Number(lesson_id))
    // }

    @Get("lesson/:lesson_id")
    async findByLessonId(@Param('lesson_id') lesson_id: string) {
        if(lesson_id) {
            let listLesson = await this.commentLessonService.findLessonById(Number(lesson_id));
            nestedGroupBy(listLesson, ['lesson']);
            return listLesson;
        }
        throw new BadRequestException("Forbidden user");
    }

    @hasRoles(ListRole.USER)
    @ApiBearerAuth()
    @hasRoles(ListRole.ADMIN)
    @Delete('delete/:id')
    deleteOne(@Param('id') id: string) : Observable<any> {
        return this.commentLessonService.deleteOne(Number(id));
    }
}
