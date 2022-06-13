import { BadRequestException, ExecutionContext, Injectable } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { type } from 'os';
import { catchError, from, map, Observable, switchMap, throwError } from 'rxjs';
import { AuthService } from 'src/auth/service/auth.service';
// import { UserEntity } from 'src/user/models/user.entity';
import { UserEntity } from 'src/user/models/user.entity';
import { User } from 'src/user/models/user.interface';
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

        // findAll(filter: object) : Observable<Blog[]>{
        //     // console.log(filter)
        //     return from(this.blogRepository.createQueryBuilder("blogs")
        //     .leftJoinAndSelect("blogs.author", "author")
        //     // .where("bill.accountBill LIKE :accountBill", {accountBill})
        //     // .andWhere("author.id = :userId", {userId: author.id})
        //     .leftJoinAndSelect("blogs.blogType","blogType")
        //     .select(["blogs","author.username", "author.name","blogType"])
        //     .execute());
        // }

        findAll(options: IPaginationOptions) : Observable<Blog[]>{
            // let skip = Number(options.page);
            // let limit = Number(options.limit);

            return from(this.blogRepository.createQueryBuilder("blogs")
            .leftJoinAndSelect("blogs.author", "author")
            // .where("bill.accountBill LIKE :accountBill", {accountBill})
            // .andWhere("author.id = :userId", {userId: author.id})
            .leftJoinAndSelect("blogs.blogType","blogType")
            .select(["blogs","author.username", "author.name","blogType"])
            // .skip(skip)
            // .take(limit)
            // .execute());
            .getMany());
        }


        // paginate(options: IPaginationOptions): Observable<Pagination<Blog>>{

        //     from(this.blogRepository.createQueryBuilder("blogs")
        //     .leftJoinAndSelect("blogs.author", "author")
        //     // .where("bill.accountBill LIKE :accountBill", {accountBill})
        //     // .andWhere("author.id = :userId", {userId: author.id})
        //     .leftJoinAndSelect("blogs.blogType","blogType")
        //     .select(["blogs","author.username", "author.name","blogType"])
        //     .execute()).pipe();
            
        //     return from(paginate<Blog>(this.blogRepository, options)).pipe(
        //         map((userPageable: Pagination<Blog>) => {
        //             userPageable.items.forEach(function (v) {
        //                 console.log(userPageable)
        //                 // let temp = v.author.username;
        //                 // delete v.author.email;
        //                 // delete v.author.password;
        //                 // delete v.author.tokenEmail;
        //                 // delete v.author.expired_token;
        //                 // delete v.author.role;
        //                 // delete v.author.blocked_user;
        //                 // delete v.author.count_error;
        //                 // delete v.author.time_blocked;
        //                 // email?:string;
        //                 // password?:string;
        //                 // tokenEmail?:string;
        //                 // expired_token?: Date;
        //                 // create: Date;
        //                 // update: Date;
        //                 // role?: UserRole;
        //                 // blocked_user?: number; 
        //                 // count_error?: number; 
        //                 // time_blocked?: Date;
                       
        //             });
    
        //             return userPageable
        //         })
        //     )
        // }

        findOne(blog_id: number) : Observable<Blog>{
            // return from(this.blogRepository.findOne(
            //     {blog_id},
            //     {relations: ['author'],}
            // ))
            return from(this.blogRepository.createQueryBuilder("blogs")
            .where({blog_id})
            .leftJoinAndSelect("blogs.author", "author")
            // .where("bill.accountBill LIKE :accountBill", {accountBill})
            // .andWhere("author.id = :userId", {userId: author.id})
            .leftJoinAndSelect("blogs.blogType","blogType")
            .select(["blogs","author.username", "author.name","blogType"])
            .getMany())
            .pipe(
                map((blog: any) => {
                    if(!blog || blog === []) throw new BadRequestException("Blog does not exist ");
                    blog.map((item: any) => {
                        if(!item.blog_id) throw new BadRequestException("Blog does not exist ");
                        item.views = item.views  + 1;
                        // const {...result} = item;
                        // return item;
                    })
                    // blog.views = blog.views + 1;
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