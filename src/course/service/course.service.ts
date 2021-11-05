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
            return from(this.courseEntity.find()).pipe(
                map((course: Course[]) => {
                    return course;
                })
            )
        }

        // findOne(blog_type_id: number) : Observable<BlogType>{
        //     return from(this.blogRepository.findOne({blog_type_id})).pipe(
        //         map((blog: BlogType) => {
        //             const {...result} = blog;
        //             return result;
        //         })
        //         )
        // }

        // deleteOne(id: number) : Observable<any>{
        //     return from(this.blogRepository.delete(id));
        // }

        // updateOne(blog_type_id: number, blogType: BlogType): Observable<any>{
        //     return from(this.blogRepository.update(blog_type_id, blogType));
        // }

 }