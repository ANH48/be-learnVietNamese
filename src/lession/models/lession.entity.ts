import { BlogEntity } from "src/blog/models/blog.entity";
import { Blog } from "src/blog/models/blog.interface";
import { CommentLessonEntity } from "src/comment-lesson/models/comment-lesson.entity";
import { CourseEntity } from "src/course/models/course.entity";
import { Lession_saveEntity } from "src/lession-save/models/lession-save.entity";
import { UserEntity } from "src/user/models/user.entity";
import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn, OneToMany, BeforeUpdate, ManyToOne } from "typeorm";
// import { Lession } from "./lession.interface";

@Entity({name: "lession"})
export class LessionEntity {
    @PrimaryGeneratedColumn()
    lession_id: number; 

    @Column( {unique: true} )
    lession_name: string;

    @Column()
    lession_keyword: string;


    @Column( )
    lession_img: string;


    @Column( )
    lession_video: string;

    @Column({default: 0})
    views: number;

    @ManyToOne(() => CourseEntity, courseType => courseType.lession)
    public courseType: CourseEntity;

    @ManyToOne(() => UserEntity, (user: UserEntity) => user.lessions)
    public author: UserEntity;

    @OneToMany(() => CommentLessonEntity, (commentLesson: CommentLessonEntity) => commentLesson.user)
    public comment_lesson: CommentLessonEntity[];

    @Column({type: 'timestamp', default: () => "CURRENT_TIMESTAMP"})
    lession_create: Date;

    @Column({type: 'timestamp', nullable: true})
    lession_update: Date;

    @BeforeUpdate()
    updateTimestamp(){
        this.lession_update = new Date; 
    }


}