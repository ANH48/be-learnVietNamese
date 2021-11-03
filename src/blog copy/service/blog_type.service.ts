import { Injectable } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { type } from 'os';
import { catchError, from, map, Observable, switchMap, throwError } from 'rxjs';
import { AuthService } from 'src/auth/service/auth.service';
// import { UserEntity } from 'src/user/models/user.entity';
import { UserEntity } from 'src/user/models/user.entity';
import { Repository } from 'typeorm';
import { BlogTypeEntity } from '../models/blog_type.entity';
import { BlogType } from '../models/blog_type.interface';

@Injectable()
export class BlogTypeService {

    constructor(
        // @InjectRepository(UserEntity) private readonly blogRepository: Repository<UserEntity>,
        private authService: AuthService,
        @InjectRepository(BlogTypeEntity) private readonly blogRepository: Repository<BlogTypeEntity>,
        ) {}

        create(blogType: BlogType): Observable<BlogType> {
            const newBlog = new BlogTypeEntity();
            newBlog.blog_type_name = blogType.blog_type_name;
            return from(this.blogRepository.save(newBlog)).pipe(
                map((blogType: BlogType) => {
                    const { ...result} = blogType;
                     return result;
                }),
                catchError(err => throwError(()=> new Error(err)) )
            )
            // return from(this.userRepository.save(user));
        }
        findAll() : Observable<BlogType[]>{
            return from(this.blogRepository.find()).pipe(
                map((blog: BlogType[]) => {
                    return blog;
                })
            )
        }

    findOne(blog_type_id: number) : Observable<BlogType>{
        return from(this.blogRepository.findOne({blog_type_id})).pipe(
            map((blog: BlogType) => {
                const {...result} = blog;
                return result;
            })
            )
    }

    deleteOne(id: number) : Observable<any>{
        return from(this.blogRepository.delete(id));
    }

    updateOne(blog_type_id: number, blogType: BlogType): Observable<any>{
        return from(this.blogRepository.update(blog_type_id, blogType));
    }

 }