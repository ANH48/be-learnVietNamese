import { Injectable } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { type } from 'os';
import { catchError, from, map, Observable, switchMap, throwError } from 'rxjs';
import { AuthService } from 'src/auth/service/auth.service';
// import { UserEntity } from 'src/user/models/user.entity';
import { UserEntity } from 'src/user/models/user.entity';
import { Repository } from 'typeorm';
import { CourseEntity } from '../models/course.entity';
import { Course } from '../models/course.interface';

@Injectable()
export class CourseService {

    constructor(
        // @InjectRepository(UserEntity) private readonly blogRepository: Repository<UserEntity>,
        private authService: AuthService,
        @InjectRepository(CourseEntity) private readonly courseEntity: Repository<CourseEntity>,
        ) {}

        create(course: Course): Observable<Course> {
            const newBlog = new CourseEntity();

            newBlog.course_name = course.course_name;
            newBlog.course_keywords = course.course_keywords;
            newBlog.course_image = course.course_image ? course.course_image : "";

            return from(this.courseEntity.save(newBlog)).pipe(
                map((course: Course) => {
                    const { ...result} = course;
                     return result;
                }),
                catchError(err => throwError(()=> new Error(err)) )
            )
            // return from(this.userRepository.save(user));
        }
        findAll() : Observable<Course[]>{
            return from(this.courseEntity.find({relations: ["lesion"]})).pipe(
                map((course: Course[]) => {
                    return course;
                })
            )
        }

        findOne(course_id: number) : Observable<Course>{
            return from(this.courseEntity.findOne({course_id},{relations: ["lesion"]})).pipe(
                map((blog: Course) => {
                    const {...result} = blog;
                    return result;
                })
                )
        }

        deleteOne(id: number) : Observable<any>{
            return from(this.courseEntity.delete(id));
        }

        updateOne(course_id: number, course: Course): Observable<any>{
            return from(this.courseEntity.update(course_id, course));
        }

 }