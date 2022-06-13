import { BlogEntity } from "src/blog/models/blog.entity";
import { Blog } from "src/blog/models/blog.interface";
import { CourseTypeEntity } from "src/course-type/models/course-type.entity";
import { LessionEntity } from "src/lession/models/lession.entity";
import { RegisterCourseEntity } from "src/register-course/models/register-course.entity";
import { UserEntity } from "src/user/models/user.entity";
import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn, OneToMany, BeforeUpdate, ManyToOne } from "typeorm";
import { CourseType } from "./course.interface";

@Entity({name: "course"})
export class CourseEntity {
    @PrimaryGeneratedColumn()
    course_id: number; 

    @Column( {unique: true} )
    course_name: string;

    // @OneToMany(() => BlogEntity, blog => blog.blog_id)
    // blog: Blog;
    // @BeforeInsert()
    // emailToLowerCase(){
    //     this.email = this.email.toLowerCase()
    // }
    // {unique: true}
    @Column()
    course_keywords: string;
    
    @Column()
    course_image: string;

    @Column()
    course_description: string;

    @Column({type: 'enum', enum: CourseType, default: CourseType.BEGINNER})
    role: CourseType;


    @Column({type: 'timestamp', default: () => "CURRENT_TIMESTAMP"})
    course_create: Date;

    @Column({type: 'timestamp', default: () => "CURRENT_TIMESTAMP"})
    course_update: Date;

    @OneToMany(() => LessionEntity, lesion => lesion.courseType)
    public lession: LessionEntity[];

    @ManyToOne(() => UserEntity, (user: UserEntity) => user.course)
    public author: UserEntity;

    @ManyToOne(() => CourseTypeEntity, courseType => courseType.course)
    public courseType: CourseTypeEntity;

    @OneToMany(() => RegisterCourseEntity, registerCourse => registerCourse.course)
    public registerCourse: RegisterCourseEntity[];

    @BeforeUpdate()
    updateTimestamp(){
        this.course_update = new Date; 
    }
}