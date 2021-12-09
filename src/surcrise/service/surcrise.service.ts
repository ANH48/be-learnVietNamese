import { Injectable } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { type } from 'os';
import { catchError, from, map, Observable, switchMap, throwError } from 'rxjs';
import { AuthService } from 'src/auth/service/auth.service';
import { Repository } from 'typeorm';
import { SurcriseEntity } from '../models/surcrise.entity';
// import { UserEntity } from 'src/user/models/user.entity';
import {Surcrise} from '../models/surcrise.interface'
@Injectable()
export class SurcriseService {

    constructor(
        // @InjectRepository(UserEntity) private readonly blogRepository: Repository<UserEntity>,
        private authService: AuthService,
        @InjectRepository(SurcriseEntity) private readonly surcriseEntity: Repository<SurcriseEntity>,
        ) {}

        async create(surcrise: Surcrise): Promise<Surcrise> {
            const newSurcrise = new SurcriseEntity();

            newSurcrise.name = surcrise.name;
            newSurcrise.phone = surcrise.phone;
            newSurcrise.email = surcrise.email;
            const result = await this.surcriseEntity.save(newSurcrise);
            return result;
        }

        // create(course: Course): Observable<Course> {
        //     const newBlog = new CourseEntity();

        //     newBlog.course_name = course.course_name;
        //     newBlog.course_keywords = course.course_keywords;
        //     newBlog.course_image = course.course_image ? course.course_image : "";

        //     return from(this.courseEntity.save(newBlog)).pipe(
        //         map((course: Course) => {
        //             const { ...result} = course;
        //              return result;
        //         }),
        //         catchError(err => throwError(()=> new Error(err)) )
        //     )
        //     // return from(this.userRepository.save(user));
        // }
        async findAll() : Promise <Surcrise[]>{
            const result = await this.surcriseEntity.find();
            return result;
        }

        // findOne(course_id: number) : Observable<Course>{
        //     return from(this.courseEntity.findOne({course_id},{relations: ["lesion"]})).pipe(
        //         map((blog: Course) => {
        //             const {...result} = blog;
        //             return result;
        //         })
        //         )
        // }

        // deleteOne(id: number) : Observable<any>{
        //     return from(this.courseEntity.delete(id));
        // }

        // updateOne(course_id: number, course: Course): Observable<any>{
        //     return from(this.courseEntity.update(course_id, course));
        // }

        async validateEmail(email: string) {

            const regularExpression = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            const isEmail =  regularExpression.test(String(email).toLowerCase());
            if(!isEmail) return  1;
            
            const result = await this.surcriseEntity.findOne({email});

            if(result) {
                return 2;
            }

            return 0;
        }
 }