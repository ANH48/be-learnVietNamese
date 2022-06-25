import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { catchError, from, map, Observable } from 'rxjs';
import { AuthService } from 'src/auth/service/auth.service';
import { UserEntity } from 'src/user/models/user.entity';
import { Repository } from 'typeorm';
import { CommentLessonEntity } from '../models/comment-lesson.entity';
import { CommentLesson } from '../models/comment-lesson.interface';

@Injectable()
export class CommentLessonService {
    constructor(
        private authService: AuthService,
        @InjectRepository(CommentLessonEntity) private readonly commentLessonRepository: Repository<CommentLessonEntity>
    ) { }

    create(commentLesson: any, user: UserEntity): Observable<CommentLesson> {
        const comment = new CommentLessonEntity();

        comment.comment_content = commentLesson.comment_content;
        comment.lesson = commentLesson.lesson_id;
        comment.user = user;
        return from(this.commentLessonRepository.save(comment)).pipe(
            map((commentLesson: CommentLesson) => {
                const { ...result } = commentLesson;
                return result;
            }),
            catchError(err => { throw new BadRequestException(err) })
        )
    }

    findAll(): Observable<CommentLesson[]> {
        return from(this.commentLessonRepository.createQueryBuilder("comment-lesson")
            .leftJoinAndSelect("comment-lesson.user", "user")
            .leftJoinAndSelect("comment-lesson.lesson", "lesson")
            .select(["comment-lesson", "user.id", "user.name", "lesson.lession_id"])
            .getMany());
    }

    findByLessonId(lesson_id: number): Observable<CommentLesson[]> {
        let lesson = lesson_id;
        return from(this.commentLessonRepository.createQueryBuilder("comment-lesson")
        .where({lesson})
        .leftJoinAndSelect("comment-lesson.user", "user")
        .leftJoinAndSelect("comment-lesson.lesson", "lesson")
        .select(["comment-lesson", "user.id", "user.name", "lesson.lession_id"]).getMany()
        );
    }

    findLessonById = async (lesson_id: number) => {
        let lesson = lesson_id;
        let list_lesson = await this.commentLessonRepository.createQueryBuilder("comment-lesson")
        .where({lesson})
        .leftJoinAndSelect("comment-lesson.user", "user")
        .leftJoinAndSelect("comment-lesson.lesson", "lesson")
        .select(["comment-lesson", "user.id", "user.name", "lesson.lession_id"]).getMany()
        ;
        return list_lesson.filter((item) => item.lesson.lession_id == lesson)
    }

    deleteOne(id: number): Observable<any> {
        return from(this.commentLessonRepository.delete(id));
    }
}
