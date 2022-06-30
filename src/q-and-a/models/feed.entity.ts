import { CommentFeedEntity } from "src/comment-feed/models/comment-feed.entity";
import { UserEntity } from "src/user/models/user.entity";

import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn, ManyToOne, BeforeUpdate, OneToMany } from "typeorm";

@Entity({name: "feed"})
export class FeedEntity {
    @PrimaryGeneratedColumn()
    feed_id: number; 

    @Column( {unique: true} )
    feed_title: string;

    @Column({ length: 5500 })
    feed_content: string;

    @ManyToOne(() => UserEntity, (user: UserEntity) => user.feed)
    public author: UserEntity;

    @OneToMany(() => CommentFeedEntity, (comment: CommentFeedEntity) => comment.feed)
    public comment_feed: CommentFeedEntity[];

    @Column({type: 'timestamp', default: () => "CURRENT_TIMESTAMP"})
    feed_create: Date;

    @Column({type: 'timestamp', nullable: true})
    feed_update: Date;

    @Column({default: 0})
    likes: number;

    @Column({default: 0})
    dislikes: number;

    @Column({default: 0})
    views: number;

    @BeforeUpdate()
    updateTimestamp(){
        this.feed_update = new Date; 
    }

}