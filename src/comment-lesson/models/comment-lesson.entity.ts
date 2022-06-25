import { UserEntity } from "src/user/models/user.entity";
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { LessionEntity } from "src/lession/models/lession.entity";

@Entity({name: "comment-lesson"})
export class CommentLessonEntity {
    @PrimaryGeneratedColumn()
    comment_id: number;

    @Column()
    comment_content: string;

    @Column({type: 'timestamp', default: () => "CURRENT_TIMESTAMP"})
    comment_date: Date;

    @ManyToOne(() => UserEntity, user => user.comment_user)
    public user: UserEntity;

    @ManyToOne(() => LessionEntity, lesson => lesson.comment_lesson)
    public lesson: LessionEntity;

}