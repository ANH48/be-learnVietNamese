import { ExecutionContext, Injectable } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { type } from 'os';
import { catchError, from, map, Observable, switchMap, throwError } from 'rxjs';
import { AuthService } from 'src/auth/service/auth.service';
// import { UserEntity } from 'src/user/models/user.entity';
import { UserEntity } from 'src/user/models/user.entity';
import { Repository } from 'typeorm';
import { BlogEntity } from '../models/blog.entity';
import { Blog } from '../models/blog.interface';

@Injectable()
export class BlogService {

    constructor(
        // @InjectRepository(UserEntity) private readonly blogRepository: Repository<UserEntity>,
        private authService: AuthService,
        @InjectRepository(BlogEntity) private readonly blogRepository: Repository<BlogEntity>,
        ) {}

        create(blog: Blog, user: any): Observable<Blog> {
            
    
            const newBlog = new BlogEntity();
            newBlog.blog_title = blog.blog_title;
            newBlog.blog_description = blog.blog_description;
            newBlog.blog_content = blog.blog_content;
            newBlog.blog_imgage = blog.blog_imgage;
            newBlog.blog_video = blog.blog_video;
            newBlog.blog_avatar = blog.blog_avatar;
            newBlog.blog_keyword = blog.blog_keyword;
            newBlog.author = user?.user.id;

            return from(this.blogRepository.save(newBlog)).pipe(
                map((blog: Blog) => {
                    const { ...result} = blog;
                     return result;
                }),
                catchError(err => throwError(()=> new Error(err)) )
            )
            // return from(this.userRepository.save(user));
        }
        findAll() : Observable<Blog[]>{
            return from(this.blogRepository.find()).pipe(
                map((blogs: Blog[]) => {
                    blogs.map((blog) => {
                      delete blog.author;
                    })
                    return blogs;
                })
            )
        }

    findOne(blog_id: number) : Observable<Blog>{
        return from(this.blogRepository.findOne({blog_id})).pipe(
            map((blog: Blog) => {
                delete blog.author;
                const {...result} = blog;
                return result;
            })
            )
    }

    deleteOne(id: number) : Observable<any>{
        return from(this.blogRepository.delete(id));
    }

    updateOne(blog_id: number, blog: Blog): Observable<any>{
        return from(this.blogRepository.update(blog_id, blog));
    }

 }


