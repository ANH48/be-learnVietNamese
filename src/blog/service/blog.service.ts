import { Injectable } from '@nestjs/common';
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
        // @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
        private authService: AuthService,
        @InjectRepository(BlogEntity) private readonly blogRepository: Repository<BlogEntity>,
        ) {}

        create(blog: Blog): Observable<Blog> {
            const newBlog = new BlogEntity();
            newBlog.blog_title = blog.blog_title;
            newBlog.blog_description = blog.blog_description;
            newBlog.blog_content = blog.blog_content;
            newBlog.blog_imgage = blog.blog_imgage;
            newBlog.blog_video = blog.blog_video;
            newBlog.blog_avatar = blog.blog_avatar;
            newBlog.blog_keyword = blog.blog_keyword;
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
                map((blog: Blog[]) => {
                    return blog;
                })
            )
        }


//     register(user: User): Observable<User> {
//         return this.authService.hashPassword(user.password).pipe(
//             switchMap((passwordHash: string) => {
//                 const newUser = new UserEntity();
//                 newUser.name = user.name;
//                 newUser.username = user.username;
//                 newUser.email = user.email;
//                 newUser.password = passwordHash;
//                 //newUser.role = 'user';
//                 return from(this.userRepository.save(newUser)).pipe(
//                     map((user: User) => {
//                         const {password, ...result} = user;
//                         return result;
//                     }),
//                     catchError(err => throwError(()=> new Error(err)) )
//                 )
//             })
//         )
//         // return from(this.userRepository.save(user));
//     }

//     findOne(id: number) : Observable<User>{
//         return from(this.userRepository.findOne({id})).pipe(
//             map((user: User) => {
//                 const {password, ...result} = user;
//                 return result;
//             })
//             )
//     }



//     deleteOne(id: number) : Observable<any>{
//         return from(this.userRepository.delete(id));
//     }

//     updateOne(id: number, user: User): Observable<any>{
//         delete user.email;
//         delete user.password;

//         return from(this.userRepository.update(id, user));
//     }

//     updateRoleOfUser(id: number, user: User): Observable<any>{
//         return from(this.userRepository.update(id,user));
//     }

//     login(user: User): Observable<string> {
//         return this.validateUser(user.email, user.password).pipe(
//             switchMap((user: User) => {
//                 if(user) {
//                     return this.authService.generateJWT(user).pipe(map((jwt: string) => jwt));

//                 }else {
//                     return 'Wrong Credentials';
//                 }
//             })
//         )
//     }

//     validateUser(email: string, password: string): Observable<User> {
//         return this.findByMail(email).pipe(
//            switchMap((user: User) => this.authService.comparePasswords(password, user.password).pipe(
//                map((match: boolean) => {
//                    if(match) {
//                        const {password, ...result} = user;
//                        return result;
//                    }else{
//                        throw Error;
//                    }
//                })
//            ))
//         )
//     }

//     findByMail(email: string): Observable<User> {
//         return from(this.userRepository.findOne({email}))
//     }
 }


