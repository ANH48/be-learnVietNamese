import { Injectable } from '@nestjs/common';
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

        create(lession: Lession): Observable<Lession> {
            const newLession = new LessionEntity();
            newLession.lession_name = lession.lession_name;
            newLession.lession_video = lession.lession_video;
            newLession.lession_img = lession.lession_img;
            newLession.lession_keyword = lession.lession_keywords;
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
            return from(this.LessionRepository.find()).pipe(
                map((lession: Lession[]) => {
                    return lession;
                })
            )
        }

        findOne(lession_id: number) : Observable<Lession>{
            return from(this.LessionRepository.findOne({lession_id})).pipe(
                map((lesion: Lession) => {
                    lesion.views = lesion.views + 1;
                    const {...result} = lesion;
                    return result;
                })
                )
        }

        deleteOne(id: number) : Observable<any>{
            return from(this.LessionRepository.delete(id));
        }
        updateView(lession_id: number): Observable<any>{
            return from(this.LessionRepository.findOne({lession_id})).pipe(
                map((lession: Lession) => {
                    const {...result} = lession;
                    lession.views = lession.views + 1;
                    return from(this.LessionRepository.update(lession_id, lession));
                })
                )
        }
        updateOne(lession_id: number, lession: Lession): Observable<any>{
            return from(this.LessionRepository.update(lession_id, lession));
        }

 }