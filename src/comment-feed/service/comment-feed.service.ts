import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { catchError, from, map, Observable } from 'rxjs';
import { AuthService } from 'src/auth/service/auth.service';
import { UserEntity } from 'src/user/models/user.entity';
import { Repository } from 'typeorm';
import { CommentFeedEntity } from '../models/comment-feed.entity';
import { CommentFeed } from '../models/comment-feed.interface';

@Injectable()
export class CommentFeedService {
    constructor(
        private authService: AuthService,
        @InjectRepository(CommentFeedEntity) private readonly commentFeedRepository: Repository<CommentFeedEntity>
    ) { }

    create(commentFeed: any, user: UserEntity): Observable<CommentFeed> {
        const comment = new CommentFeedEntity();

        comment.comment_content = commentFeed.comment_content;
        comment.feed = commentFeed.feed_id;
        comment.user = user;
        return from(this.commentFeedRepository.save(comment)).pipe(
            map((commentFeed: CommentFeed) => {
                const { ...result } = commentFeed;
                return result;
            }),
            catchError(err => { throw new BadRequestException(err) })
        )
    }

    findAll(): Observable<CommentFeed[]> {
        return from(this.commentFeedRepository.createQueryBuilder("comment-feed")
            .leftJoinAndSelect("comment-feed.user", "user")
            .leftJoinAndSelect("comment-feed.feed", "feed")
            .select(["comment-feed", "user.id", "user.name", "feed.feed_id"])
            .getMany());
    }

    findByFeedId(feed_id: number): Observable<CommentFeed[]> {
        let feed = feed_id;
        return from(this.commentFeedRepository.createQueryBuilder("comment-feed")
        .where({feed})
        .leftJoinAndSelect("comment-feed.user", "user")
        .leftJoinAndSelect("comment-feed.feed", "feed")
        .select(["comment-feed", "user.id", "user.name", "feed.feed_id"]).getMany()
        );
    }

    findfeedById = async (feed_id: number) => {
        let feed = feed_id;
        let list_feed = await this.commentFeedRepository.createQueryBuilder("comment-feed")
        .where({feed})
        .leftJoinAndSelect("comment-feed.user", "user")
        .leftJoinAndSelect("comment-feed.feed", "feed")
        .select(["comment-feed", "user.id", "user.name", "feed.feed_id"]).getMany()
        ;
        return list_feed.filter((item) => item.feed.feed_id == feed)
    }

    deleteOne(id: number): Observable<any> {
        return from(this.commentFeedRepository.delete(id));
    }
}
