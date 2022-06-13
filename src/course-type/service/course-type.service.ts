import { Body, Injectable } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { type } from 'os';
import { catchError, from, map, Observable, switchMap, throwError } from 'rxjs';
import { AuthService } from 'src/auth/service/auth.service';
// import { UserEntity } from 'src/user/models/user.entity';
import { UserEntity } from 'src/user/models/user.entity';
import { Repository } from 'typeorm';
import { CourseTypeEntity } from '../models/course-type.entity';
import { CourseType } from '../models/course-type.interface';

@Injectable()
export class CourseTypeService {

    constructor(
        private authService: AuthService,
        @InjectRepository(CourseTypeEntity) private readonly courseRepository: Repository<CourseTypeEntity>,
    ) { }

    create(courseType: CourseType): Observable<CourseType> {
        const newCourse = new CourseTypeEntity();
        newCourse.course_type_name = courseType.course_type_name;
        return from(this.courseRepository.save(newCourse)).pipe(
            map((courseType: CourseType) => {
                const { ...result } = courseType;
                return result;
            }),
            catchError(err => throwError(() => new Error(err)))
        )
        // return from(this.userRepository.save(user));
    }
    findAll(): Observable<CourseType[]> {
        return from(this.courseRepository.find()).pipe(
            map((course: CourseType[]) => {
                return course;
            })
        )
    }

    findOne(course_type_id: number): Observable<CourseType> {
        return from(this.courseRepository.findOne({ course_type_id }, { relations: ["course"] })).pipe(
            map((course: CourseType) => {
                const { ...result } = course;
                return result;
            })
        )
    }

    deleteOne(id: number): Observable<any> {
        return from(this.courseRepository.delete(id));
    }

    updateOne(course_type_id: number, courseType: CourseType): Observable<any> {
        return from(this.courseRepository.update(course_type_id, courseType));
    }

}