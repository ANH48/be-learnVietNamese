import { FeedEntity } from "src/q-and-a/models/feed.entity";
import { UserEntity } from "src/user/models/user.entity";

export interface CommentFeed {
    comment_feed_id?: number;
    comment_content?: string;
    user?: UserEntity;
    feed?: FeedEntity;
    comment_feed_date?: Date;
    comment_feed_update_date?: Date;
}
