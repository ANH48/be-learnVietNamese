import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { catchError, from, map, Observable, throwError } from 'rxjs';
import { AuthService } from 'src/auth/service/auth.service';
import { UserEntity } from 'src/user/models/user.entity';
import { Repository } from 'typeorm';
import { RegisterCourseEntity } from '../models/register-course.entity';
import { RegisterCourse, RegisterCourseByUser } from '../models/register-course.interface';

@Injectable()
export class RegisterCourseService {
    constructor(
        private authService: AuthService,
        @InjectRepository(RegisterCourseEntity) private readonly registerCourseRepository: Repository<RegisterCourseEntity>,
        @InjectRepository(RegisterCourseEntity) private readonly registerCourseRepositoryByUser: Repository<RegisterCourseByUser>
    ) { }

    create(register: any, user: UserEntity): Observable<RegisterCourse> {
        const newRegister = new RegisterCourseEntity();

        newRegister.register = register.register;
        newRegister.course = register.course_id;
        newRegister.user = user;
        return from(this.registerCourseRepository.save(newRegister)).pipe(
            map((register: RegisterCourse) => {
                const { ...result } = register;
                return result;
            }),
            catchError(err => { throw new BadRequestException(err) })
        )
    }

    findAll(): Observable<RegisterCourse[]> {
        return from(this.registerCourseRepository.createQueryBuilder("register")
            .leftJoinAndSelect("register.user", "user")
            .leftJoinAndSelect("register.course", "course").select(["register", "user.id", "course.course_id", "course.course_name"])
            .getMany());
    }

    findByUserId = async (user_id: number) => {
        let user = user_id;
        return await (this.registerCourseRepositoryByUser.createQueryBuilder("register")
            .where({ user })
            .leftJoinAndSelect("register.user", "user")
            .leftJoinAndSelect("register.course", "course")
            .select(["register", "user.id", "course.course_id", "course.course_name"])
            // .groupBy("user.id")
            .getMany()
        )
    }

    findOne(user: number): Observable<any> {
        return from(this.findByUser(user).pipe(
            map((register_item: RegisterCourseEntity[]) => {
                return register_item
            }))
        )
    }

    findByUser(user: number): Observable<any> {
        return from(this.registerCourseRepository.createQueryBuilder("register")
            .where({ user })
            .select(["register"])
            .getMany()
        )
    }

    deleteOne(id: number): Observable<any> {
        return from(this.registerCourseRepository.delete(id));
    }
}
