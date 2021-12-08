import { BadRequestException, Injectable } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { type } from 'os';
import { catchError, from, map, Observable, switchMap, throwError } from 'rxjs';
import { AuthService } from 'src/auth/service/auth.service';
import { Repository } from 'typeorm';
import { ImageEntity } from './image.entity';
import { Image } from './image.interface';

@Injectable()
export class ImageService {

    constructor(
        // @InjectRepository(UserEntity) private readonly blogRepository: Repository<UserEntity>,
        private authService: AuthService,
        @InjectRepository(ImageEntity) private readonly imageEntity: Repository<ImageEntity>,
        ) {}

        create(image: Image): Observable<Image> {
            const newImage = new ImageEntity();

            newImage.image_name = image.image_name;
            newImage.image_link = image.image_link;

            return from(this.imageEntity.save(newImage)).pipe(
                map((image: Image) => {
                    const { ...result} = image;
                     return result;
                }),
                catchError(err => { throw new BadRequestException(err)} )
            )
            // return from(this.userRepository.save(user));
        }
        findAll() : Observable<Image[]>{
            return from(this.imageEntity.find()).pipe(
                map((image: Image[]) => {
                    return image;
                })
            )
        }

        // findOne(course_id: number) : Observable<Course>{
        //     return from(this.courseEntity.findOne({course_id},{relations: ["lesion"]})).pipe(
        //         map((blog: Course) => {
        //             const {...result} = blog;
        //             return result;
        //         })
        //         )
        // }

        // deleteOne(id: number) : Observable<any>{
        //     return from(this.courseEntity.delete(id));
        // }

        // updateOne(course_id: number, course: Course): Observable<any>{
        //     return from(this.courseEntity.update(course_id, course));
        // }

 }