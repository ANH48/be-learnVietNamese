import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import { catchError, from, map, Observable } from 'rxjs';
import { AuthService } from 'src/auth/service/auth.service';
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

        create(blog: Blog, user: any): Observable<any> {
            const newBlog = new BlogEntity();
            newBlog.blog_title = blog.blog_title;
            newBlog.blog_description = blog.blog_description;
            newBlog.blog_content = blog.blog_content;
            newBlog.blog_imgage = blog.blog_imgage;
            newBlog.blog_video = blog.blog_video;
            newBlog.blog_avatar = blog.blog_avatar;
            newBlog.blog_keyword = blog.blog_keyword;
            // newBlog.blogType = 1;
            newBlog.author = user.user;
            newBlog.blogType = blog.blogType;

            return from(this.blogRepository.save(newBlog)).pipe(
                map((blog: Blog) => {
                    const {...result} = blog;
                    return result;
                }),
                catchError(err => { throw new BadRequestException(err)})
            )

        }

        findAll(options: IPaginationOptions) : Observable<Blog[]>{
            return from(this.blogRepository.createQueryBuilder("blogs")
            .leftJoinAndSelect("blogs.author", "author")
            .leftJoinAndSelect("blogs.blogType","blogType")
            .select(["blogs","author.username", "author.name","blogType"])
            .getMany());
        }


        findOne(blog_id: number) : Observable<Blog>{
            return from(this.blogRepository.createQueryBuilder("blogs")
            .where({blog_id})
            .leftJoinAndSelect("blogs.author", "author")
            .leftJoinAndSelect("blogs.blogType","blogType")
            .select(["blogs","author.username", "author.name","blogType"])
            .getMany())
            .pipe(
                map((blog: any) => {
                    if(!blog || blog === []) throw new BadRequestException("Blog does not exist ");
                    blog.map((item: any) => {
                        if(!item.blog_id) throw new BadRequestException("Blog does not exist ");
                        item.views = item.views  + 1;
                    })
                    const {...result} = blog;
                    return result;

                })
                )
        }
        updateLike(blog_id: number): Observable<any>{
            return from(this.blogRepository.findOne({blog_id})).pipe(
                map((blog: Blog) => {
                    if(!blog) throw new BadRequestException("Blog does not exist ");
                    blog.likes = blog.likes + 1;
                    return from(this.blogRepository.update(blog_id, blog));
                })
                )
        }

        updateView(blog_id: number): Observable<any>{
            return from(this.blogRepository.findOne({blog_id})).pipe(
                map((blog: Blog) => {
                    if(!blog) return;
                    else{
                        // const {...result} = blog;
                        blog.views = blog.views + 1;
                        return from(this.blogRepository.update(blog_id, blog));
                    }
                  
                })
                )
        }

        deleteOne(id: number) : Observable<any>{
            return from(this.blogRepository.delete(id));
        }
        deleteOneCheckId(blog_id: number, idUser: number) : Observable<any>{
            return from(this.blogRepository.findOne({blog_id},{relations: ["author"]})).pipe(
                map((blog: Blog) => {
                    if(idUser===blog.author.id) {
                        return from(this.blogRepository.delete(blog_id));
                    }
                    else{
                        const obj : any = {
                            "statusCode": 401,
                            "message": "Unauthorized"
                        }
                        return obj;
                    }

                })
                )
        }

        updateOne(blog_id: number, blog: Blog, user: UserEntity): Observable<any>{
            blog.author = user;
                return from(this.blogRepository.update(blog_id, blog)).pipe(
                    catchError(error => { throw new BadRequestException(error)}
                ));
            
        }
        updateOneCheckId(blog_id: number, idUser: number, blog: Blog): Observable<any>{
            return from(this.blogRepository.findOne({blog_id},{relations: ["author"]})).pipe(
                map((blogItem: Blog) => {
                    if(idUser===blogItem.author.id) {
                        return from(this.blogRepository.update(blog_id, blog));
                    }
                    else{
                        const obj : any = {
                            "statusCode": 401,
                            "message": "Unauthorized"
                        }
                        return obj;
                    }
                }),
                catchError(err => { throw new BadRequestException(err)})
                )
            
        }

 }