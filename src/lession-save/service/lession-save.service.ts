import { ExecutionContext, Injectable } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { type } from 'os';
import { catchError, from, map, Observable, switchMap, throwError } from 'rxjs';
import { AuthService } from 'src/auth/service/auth.service';
import { LessionEntity } from 'src/lession/models/lession.entity';
import { LessionDTO } from 'src/lession/models/lession.model';
// import { UserEntity } from 'src/user/models/user.entity';
import { UserEntity } from 'src/user/models/user.entity';
import { Repository } from 'typeorm';
import { Lession_saveEntity } from '../models/lession-save.entity';
import { Lession_save } from '../models/lession-save.interface';

@Injectable()
export class Lession_saveService {

    constructor(
        // @InjectRepository(UserEntity) private readonly blogRepository: Repository<UserEntity>,
        private authService: AuthService,
        @InjectRepository(Lession_saveEntity) private readonly lession_saveRepository: Repository<Lession_saveEntity>,
        ) {}

        create_lession(list_lession_id: JSON, user: any): Observable<any> {
            const newLession = new Lession_saveEntity();
            newLession.user_id = user.user.id;
            newLession.list_lession_id = JSON.stringify(list_lession_id);
            // newLession.list_blog_id = lession.list_lession_id;
            return from(this.lession_saveRepository.save(newLession)).pipe(
                map((lession_item: Lession_saveEntity) => {
                    const { ...result} = lession_item;
                     return result;
                }),
                catchError(err => throwError(()=> new Error(err)) )
            )
            // return from(this.userRepository.save(user));
        }

        updateOne(list_lession_id: number, lession: Lession_save): Observable<any>{
            return from(this.lession_saveRepository.update(list_lession_id, lession));
        }

        findAll() : Observable<Lession_save[]>{
            return from(this.lession_saveRepository.find()).pipe(
                map((blogs: Lession_save[]) => {
                    blogs.map((blog) => {
                    //   delete blog.author;
                    })
                    return blogs;
                })
            )
        }

        findOne(user_id: number) : Observable<any>{
            return from(this.findByUserId(user_id)).pipe(
                map((lession_item: Lession_saveEntity) => {
                    const {...result} = lession_item;
                    return result;
                })
                )
        }

        findByUserId(user_id: number): Observable<any> {
            try {
                return from(this.lession_saveRepository.findOne({user_id}))
            } catch (error) {
                return error;
            }
           
        }

        // updateLike(blog_id: number): Observable<any>{
        //     return from(this.blogRepository.findOne({blog_id})).pipe(
        //         map((blog: Blog) => {
        //             const {author,...result} = blog;
        //             blog.likes = blog.likes + 1;
        //             return from(this.blogRepository.update(blog_id, blog));
        //         })
        //         )

        // }
        // deleteOne(id: number) : Observable<any>{
        //     return from(this.blogRepository.delete(id));
        // }
        // deleteOneCheckId(blog_id: number, idUser: number) : Observable<any>{
        //     return from(this.blogRepository.findOne({blog_id})).pipe(
        //         map((blog: Blog) => {
        //             if(idUser===blog.author) {
        //                 return from(this.blogRepository.delete(blog_id));
        //             }
        //             else{
        //                 const obj : any = {
        //                     "statusCode": 401,
        //                     "message": "Unauthorized"
        //                 }
        //                 return obj;
        //             }

        //         })
        //         )
        // }

       
        // updateOneCheckId(blog_id: number, idUser: number, blog: Blog): Observable<any>{
        //     return from(this.blogRepository.findOne({blog_id})).pipe(
        //         map((blogItem: Blog) => {
        //             if(idUser===blogItem.author) {
        //                 return from(this.blogRepository.update(blog_id, blog));
        //             }
        //             else{
        //                 const obj : any = {
        //                     "statusCode": 401,
        //                     "message": "Unauthorized"
        //                 }
        //                 return obj;
        //             }

        //         })
        //         )
            
        // }

 }


