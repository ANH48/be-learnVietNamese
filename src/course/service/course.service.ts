import { Injectable } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { type } from 'os';
import { catchError, from, map, Observable, switchMap, throwError } from 'rxjs';
import { AuthService } from 'src/auth/service/auth.service';
// import { UserEntity } from 'src/user/models/user.entity';
import { UserEntity } from 'src/user/models/user.entity';
import { Like, Repository } from 'typeorm';
import { CourseEntity } from '../models/course.entity';
import { Course } from '../models/course.interface';
import { Query } from '@nestjs-query/core';

@Injectable()
export class CourseService {

    constructor(
        // @InjectRepository(UserEntity) private readonly blogRepository: Repository<UserEntity>,
        private authService: AuthService,
        @InjectRepository(CourseEntity) private readonly courseEntity: Repository<CourseEntity>,
    ) { }

    create(course: Course, user: any): Observable<Course> {
        const newCourse = new CourseEntity();

        newCourse.course_name = course.course_name;
        newCourse.course_keywords = course.course_keywords;
        newCourse.course_image = course.course_image ? course.course_image : "";
        newCourse.course_description = course.course_description ? course.course_description : "";
        newCourse.author = user.user;
        newCourse.courseType = course.courseType;

        return from(this.courseEntity.save(newCourse)).pipe(
            map((course: Course) => {
                const { ...result } = course;
                return result;
            }),
            catchError(err => throwError(() => new Error(err)))
        )
        // return from(this.userRepository.save(user));
    }

    findAll() : Observable<Course[]> {
        const filter = {
            keywords: "",
            sort: "DESC"
        }
        return from(this.courseEntity.
            createQueryBuilder("course")
            .leftJoinAndSelect("course.author", "author")
            .where("course.course_keywords LIKE :keywords", { keywords: '%' + filter.keywords + '%' })
            .select(["course", "author.username", "author.name"])
            .getMany());
    }

    findByRole(param): Observable<Course[]> {
        return from(this.courseEntity.find(
            {
                relations: ["lession"],
                where: { role: Like('%' + (param?.keyword || "") + '%') },
                // select: ["author"]
            }
        )).pipe(
            map((course: Course[]) => {
                return course;
            })
        )
    }

    findOne(course_id: number): Observable<Course> {
        return from(this.courseEntity.findOne({ course_id }, { relations: ["lession"] })).pipe(
            map((blog: Course) => {
                const { ...result } = blog;
                return result;
            })
        )
    }

    deleteOne(id: number): Observable<any> {
        return from(this.courseEntity.delete(id));
    }

    updateOne(course_id: number, course: Course): Observable<any> {
        return from(this.courseEntity.update(course_id, course));
    }


}