import { BlogEntity } from "src/blog/models/blog.entity";
import { CommentLessonEntity } from "src/comment-lesson/models/comment-lesson.entity";
import { CourseEntity } from "src/course/models/course.entity";
import { LessionEntity } from "src/lession/models/lession.entity";
import { RegisterCourseEntity } from "src/register-course/models/register-course.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { UserRole } from "./user.interface";

@Entity({name: "users"})
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number; 

    @Column()
    name: string;

    @Column( {unique: true} )
    username: string;

    @Column()
    password: string;

    @Column({unique: true} )
    email: string; 

    @Column({type: 'enum', enum: UserRole, default: UserRole.USER})
    role: UserRole;

    @OneToMany(() => BlogEntity, (blog: BlogEntity) => blog.author)
    public blogs: BlogEntity[];

    @OneToMany(() => CourseEntity, (course: CourseEntity) => course.author)
    public course: CourseEntity[];

    @OneToMany(() => LessionEntity, (lession: LessionEntity) => lession.author)
    public lessions: LessionEntity[];

    @OneToMany(() => RegisterCourseEntity, (registerCourse: RegisterCourseEntity) => registerCourse.user)
    public course_enroll: RegisterCourseEntity[];   

    @OneToMany(() => CommentLessonEntity, (commentLesson: CommentLessonEntity) => commentLesson.user)
    public comment_user: CommentLessonEntity[];   

    @BeforeInsert()
    emailToLowerCase(){
        this.email = this.email.toLowerCase()
    }

    @Column({nullable: true})
    tokenEmail: string;

    @Column({nullable: true})
    expired_token: Date;

    @Column({type: 'timestamp', default: () => "CURRENT_TIMESTAMP"})
    create: Date;

    
    @Column({type: 'timestamp', nullable: true})
    update: Date;

    @Column({default: 0} )
    blocked_user: number; 

    @Column({default: 0})
    count_error: number; 

    @Column({nullable: true})
    time_blocked: Date;

    @BeforeUpdate()
    updateTimestamp(){
        this.update = new Date; 
    }

}