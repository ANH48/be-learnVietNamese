import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, map, Observable, switchMap, throwError } from 'rxjs';
import { AuthService } from 'src/auth/service/auth.service';
import { Repository } from 'typeorm';
import { Lession_saveEntity } from '../models/lession-save.entity';
import { Lession_save } from '../models/lession-save.interface';

@Injectable()
export class Lession_saveService {

    constructor(
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
                    return lession_item;
                })
                )
        }

        findByUserId(user_id: number): Observable<any> {
            return from(this.lession_saveRepository.createQueryBuilder("lession_save")
            .where({user_id})
            .select(["lession_save"])
            .getMany()
            // .execute()
            )
           
        }

 }


