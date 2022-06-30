import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import { catchError, from, map, Observable } from 'rxjs';
import { UserEntity } from 'src/user/models/user.entity';
import { Repository } from 'typeorm';
import { FeedEntity } from '../models/feed.entity';
import { Feed } from '../models/feed.interface';

@Injectable()
export class FeedService {
    constructor(
        @InjectRepository(FeedEntity) private readonly feedRepository: Repository<FeedEntity>
    ) { }

    create(feed: Feed, user: any): Observable<any> {
        const newQuestion = new FeedEntity();

        newQuestion.feed_title = feed.feed_title;
        newQuestion.feed_content = feed.feed_content;
        newQuestion.author = user.user;

        return from(this.feedRepository.save(newQuestion)).pipe(
            map((question: Feed) => {
                const { ...result } = question;
                return result;
            }),
            catchError(err => { throw new BadRequestException(err) })
        )
    }

    // findAll(options: IPaginationOptions): Observable<Feed[]> {
    //     return from(this.feedRepository.createQueryBuilder("feed")
    //         .leftJoinAndSelect("feed.author", "author")
    //         .select(["feed", "author.id", "author.name"])
    //         .getMany());
    // }

    findAll(): Observable<Feed[]> {
        return from(this.feedRepository.createQueryBuilder("feed")
            .leftJoinAndSelect("feed.author", "author")
            .select(["feed", "author.id", "author.name"])
            .getMany());
    }

    findOne(feed_id: number): Observable<Feed[]> {
        return from(this.feedRepository.createQueryBuilder("feed")
            .where({ feed_id })
            .leftJoinAndSelect("feed.author", "author")
            .select(["feed", "author.id", "author.name"])
            .getMany())
        // .pipe(
        //     map((qa: any) => {
        //         if (!qa || qa === []) throw new BadRequestException("Feed does not exist");
        //         qa.map((item: any) => {
        //             if (!item.blog_id) throw new BadRequestException("This feed does not exist");
        //             item.views = item.views + 1;
        //         })
        //         const { ...result } = qa;
        //         return result;
        //     })
        // )
    }

    updateLike(feed_id: number): Observable<any> {
        return from(this.feedRepository.findOne({ feed_id })).pipe(
            map((question: Feed) => {
                if (!question) throw new BadRequestException("Question does not exist");
                question.likes = question.likes + 1;
                return from(this.feedRepository.update(feed_id, question));
            })
        )
    }

    updateDislike(feed_id: number): Observable<any> {
        return from(this.feedRepository.findOne({ feed_id })).pipe(
            map((question: Feed) => {
                if (!question) throw new BadRequestException("Question does not exist");
                question.dislikes = question.dislikes + 1;
                return from(this.feedRepository.update(feed_id, question));
            })
        )
    }

    updateView(feed_id: number): Observable<any> {
        return from(this.feedRepository.findOne({ feed_id })).pipe(
            map((question: Feed) => {
                if (!question) return;
                else {
                    // const {...result} = blog;
                    question.views = question.views + 1;
                    return from(this.feedRepository.update(feed_id, question));
                }
            })
        )
    }

    deleteOne(id: number): Observable<any> {
        return from(this.feedRepository.delete(id));
    }

    deleteOneCheckId(feed_id: number, idUser: number): Observable<any> {
        return from(this.feedRepository.findOne({ feed_id }, { relations: ["author"] })).pipe(
            map((qa: Feed) => {
                if (idUser === qa.author.id) {
                    return from(this.feedRepository.delete(feed_id));
                }
                else {
                    const obj: any = {
                        "statusCode": 401,
                        "message": "Unauthorized"
                    }
                    return obj;
                }

            })
        )
    }

    updateOne(feed_id: number, qa: Feed, user: UserEntity): Observable<any> {
        qa.author = user;
        return from(this.feedRepository.update(feed_id, qa)).pipe(
            catchError(error => { throw new BadRequestException(error) }
            ));

    }

    updateOneCheckId(feed_id: number, idUser: number, qa: Feed): Observable<any> {
        return from(this.feedRepository.findOne({ feed_id }, { relations: ["author"] })).pipe(
            map((qaItem: Feed) => {
                if (idUser === qaItem.author.id) {
                    return from(this.feedRepository.update(feed_id, qa));
                }
                else {
                    const obj: any = {
                        "statusCode": 401,
                        "message": "Unauthorized"
                    }
                    return obj;
                }
            }),
            catchError(err => { throw new BadRequestException(err) })
        )
    }
}
