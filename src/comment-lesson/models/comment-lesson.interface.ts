import { LessionEntity } from "src/lession/models/lession.entity";
import { UserEntity } from "src/user/models/user.entity";

export interface CommentLesson {
    comment_lesson_id?: number;
    comment_content?: string;
    user?: UserEntity;
    lesson?: LessionEntity;
    comment_lesson_date?: Date;
    comment_lesson_update_date?: Date;
}
