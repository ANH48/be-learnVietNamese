import { UserEntity } from "src/user/models/user.entity";
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { FeedEntity } from "src/q-and-a/models/feed.entity";

@Entity({name: "comment-feed"})
export class CommentFeedEntity {
    @PrimaryGeneratedColumn()
    comment_id: number;

    @Column()
    comment_content: string;

    @Column({type: 'timestamp', default: () => "CURRENT_TIMESTAMP"})
    comment_date: Date;

    @ManyToOne(() => UserEntity, user => user.comment_user)
    public user: UserEntity;

    @ManyToOne(() => FeedEntity, feed => feed.comment_feed)
    public feed: FeedEntity;

}