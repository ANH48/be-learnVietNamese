import { ExecutionContext, Injectable } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { type } from 'os';
import { catchError, from, map, Observable, switchMap, throwError } from 'rxjs';
import { AuthService } from 'src/auth/service/auth.service';
import { LessionEntity } from 'src/lession/models/lession.entity';
import { Lession } from 'src/lession/models/lession.interface';
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

        create_lession(lession_id: number, user: any): Observable<any> {
            const newLession = new Lession_saveEntity();
            newLession.user_id = user.id;
            newLession.lession_id = lession_id;

           return this.findOne(user.id).pipe(
                map((lession_save: Lession_saveEntity[]) => {
                    if(lession_save){
                        // console.log(lession_save)
                        let isUser = false;
                        lession_save.map((item_lesion: Lession_saveEntity) => {
                            if(item_lesion.user_id === user.id ){
                                if(item_lesion.lession_id === lession_id ){
                                    isUser = true;
                                    return;
                                }
                            }
                        })
                        if(isUser) return;
                        // if(lession_save.lession_id === lession_id){
                        //     return;
                        // }
                        return from(this.lession_saveRepository.save(newLession));

                    }else{
                        return from(this.lession_saveRepository.save(newLession));
                    }
                })
            )

        }

        updateOne(list_lession_id: number, lession: Lession_save): Observable<any>{
            return from(this.lession_saveRepository.update(list_lession_id, lession));
        }

        findAll(user_id: number) : Observable<any>{
            return this.findOne(user_id).pipe(
                map((lession_save: Lession_saveEntity[]) => {
                    let array_lession = [];
                    if(lession_save){
                        // console.log(lession_save)
                        // let isUser = false;
                        lession_save.map((item_lesion: Lession_saveEntity) => {
                            if(item_lesion.user_id === user_id ){
                                let obj = {
                                    lession_id: item_lesion.lession_id
                                }
                                array_lession.push(obj);
                            }
                        })
                        let lession_save_obj = {
                            user_id: user_id,
                            list_lession: array_lession
                        }
                        return lession_save_obj;
                        // if(lession_save.lession_id === lession_id){
                        //     return;
                        // }

                    }
                    else {
                        return [];
                    }
                })
            )

        }

        findOne(user_id: number) : Observable<any>{
            return from(this.findByUserId(user_id)).pipe(
                map((lession_item: Lession_saveEntity[]) => {
                    // console.log(lession_item)
                    // const {...result} = lession_item;
                    return lession_item;
                })
                )
        }

        findByUserId(user_id: number): Observable<any> {
            // try {
            //     return from(this.lession_saveRepository.findOne({user_id}))
            // } catch (error) {
            //     return error;
            // }
            return from(this.lession_saveRepository.createQueryBuilder("lession_save")
            .where({user_id})
            // .leftJoinAndSelect("lession.author", "author")
            // .where("lession.lession_keyword LIKE :keyword", {keyword: '%' + filter.keyword + '%'})
            // .andWhere("author.id = :userId", {userId: author.id})
            // .leftJoinAndSelect("lession.courseType","courseType")
            .select(["lession_save"])
            .getMany()
            // .execute()
            )
           
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


