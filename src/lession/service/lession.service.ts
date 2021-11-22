import { BadRequestException, Injectable } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { type } from 'os';
import { catchError, from, map, Observable, switchMap, throwError } from 'rxjs';
import { AuthService } from 'src/auth/service/auth.service';
// import { UserEntity } from 'src/user/models/user.entity';
import { UserEntity } from 'src/user/models/user.entity';
import { Repository } from 'typeorm';
import { LessionEntity } from '../models/lession.entity';
import { Lession } from '../models/lession.interface';

@Injectable()
export class LessionService {

    constructor(
        // @InjectRepository(UserEntity) private readonly blogRepository: Repository<UserEntity>,
        private authService: AuthService,
        @InjectRepository(LessionEntity) private readonly LessionRepository: Repository<LessionEntity>,
        ) {}

        create(lession: Lession, user: UserEntity): Observable<Lession> {
            const newLession = new LessionEntity();
            newLession.lession_name = lession.lession_name;
            newLession.lession_video = lession.lession_video;
            newLession.lession_img = lession.lession_img;
            newLession.lession_keyword = lession.lession_keywords;
            newLession.author = user;
            return from(this.LessionRepository.save(newLession)).pipe(
                map((lessionType: Lession) => {
                    const { ...result} = lessionType;
                     return result;
                }),
                catchError(err => throwError(()=> new Error(err)) )
            )
            // return from(this.userRepository.save(user));
        }
        findAll() : Observable<Lession[]>{
            // return from(this.LessionRepository.find()).pipe(
            //     map((lession: Lession[]) => {
            //         return lession;
            //     })
            // )
            const filter = {
                keyword: "",
                sort: "DESC"
            }
            // const keyword = filter.keyword;
            return from(this.LessionRepository.createQueryBuilder("lession")
            .leftJoinAndSelect("lession.author", "author")
            .where("lession.lession_keyword LIKE :keyword", {keyword: '%' + filter.keyword + '%'})
            // .andWhere("author.id = :userId", {userId: author.id})
            .leftJoinAndSelect("lession.courseType","courseType")
            .select(["lession","author.username", "author.name","courseType"])
            .getMany());
        }

        findOne(lession_id: number) : Observable<Lession>{
            // return from(this.LessionRepository.findOne({lession_id})).pipe(
            //     map((lesion: Lession) => {
            //         lesion.views = lesion.views + 1;
            //         const {...result} = lesion;
            //         return result;
            //     })
            //     )
            const filter = {
                keyword: "",
                sort: "DESC"
            }
            return from(this.LessionRepository.createQueryBuilder("lession")
            .where({lession_id})
            .leftJoinAndSelect("lession.author", "author")
            // .where("lession.lession_keyword LIKE :keyword", {keyword: '%' + filter.keyword + '%'})
            // .andWhere("author.id = :userId", {userId: author.id})
            .leftJoinAndSelect("lession.courseType","courseType")
            .select(["lession","author.username", "author.name","courseType"])
            .getMany())
            .pipe(
                map((lession: any) => {
                    if(!lession || lession === []) throw new BadRequestException("Lession does not exist ");
                    lession.map((item: any) => {
                        if(!item.lession_lession_id) throw new BadRequestException("Lession does not exist ");
                        item.lession_views = item.lession_views  + 1;
                        // const {...result} = item;
                        // return item;
                    })
                    // blog.views = blog.views + 1;
                    const {...result} = lession;
                    return result;

                })
                )
        }

        // updateRate(lession_id: number): Observable<any>{
        //     return from(this.LessionRepository.findOne({lession_id})).pipe(
        //         map((lession: Lession) => {
        //             const {...result} = lession;
        //             lession.views = lession.views + 1;
        //             return from(this.LessionRepository.update(lession_id, lession));
        //         })
        //         )
        // }


        deleteOne(id: number) : Observable<any>{
            return from(this.LessionRepository.delete(id));
        }

        deleteOneCheckId(lession_id: number, idUser: number) : Observable<any>{
            return from(this.LessionRepository.findOne({lession_id},{relations: ["author"]})).pipe(
                map((lession: Lession) => {
                    if(idUser===lession.author.id) {
                        return from(this.LessionRepository.delete(lession_id));
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

        updateView(lession_id: number): Observable<any>{
            return from(this.LessionRepository.findOne({lession_id})).pipe(
                map((lession: Lession) => {
                    if(!lession) return;
                    const {...result} = lession;
                    lession.views = lession.views + 1;
                    return from(this.LessionRepository.update(lession_id, lession));
                })
                )
        }
        updateOne(lession_id: number, lession: Lession, user: UserEntity): Observable<any>{
            lession.author = user;
            return from(this.LessionRepository.update(lession_id, lession));
            // return from(this.LessionRepository.update(lession_id, lession));
        }

        updateOneCheckId(lession_id: number, idUser: number, lession: Lession): Observable<any>{
            return from(this.LessionRepository.findOne({lession_id},{relations: ["author"]})).pipe(
                map((lessionItem: Lession) => {
                    if(idUser===lessionItem.author.id) {
                        return from(this.LessionRepository.update(lession_id, lession));
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

 }