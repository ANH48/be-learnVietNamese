import { BlogEntity } from "src/blog/models/blog.entity";
import { Blog } from "src/blog/models/blog.interface";
import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn, OneToMany, BeforeUpdate } from "typeorm";
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
    @Column( {unique: true} )
    course_keywords: string;

    // @Column( {type: true} )
    // course_keywords: string;

    @Column({type: 'enum', enum: CourseType, default: CourseType.BEGINNER})
    role: CourseType;


    @Column({type: 'timestamp', default: () => "CURRENT_TIMESTAMP"})
    course_create: Date;

    @Column({type: 'timestamp', default: () => "CURRENT_TIMESTAMP"})
    course_update: Date;

    @BeforeUpdate()
    updateTimestamp(){
        this.course_update = new Date; 
    }


}