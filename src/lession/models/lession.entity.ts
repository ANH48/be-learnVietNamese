import { BlogEntity } from "src/blog/models/blog.entity";
import { Blog } from "src/blog/models/blog.interface";
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

    // @OneToMany(() => BlogEntity, blog => blog.blog_id)
    // blog: Blog;
    // @BeforeInsert()
    // emailToLowerCase(){
    //     this.email = this.email.toLowerCase()
    // }

    @Column()
    lession_keyword: string;


    @Column( )
    lession_img: string;


    @Column( )
    lession_video: string;

    @Column({default: 0})
    views: number;
    // @Column( )
    // lession_vote: string;

    // @Column( {type: true} )
    // course_keywords: string;

    // @Column({type: 'enum', enum: CourseType, default: CourseType.BEGINNER})
    // role: CourseType;

    @ManyToOne(() => CourseEntity, courseType => courseType.lesion)
    public courseType: CourseEntity;

    @ManyToOne(() => UserEntity, (user: UserEntity) => user.lessions)
    public author: UserEntity;

    // @ManyToOne(() => Lession_saveEntity, (lession_save: Lession_saveEntity) => lession_save.lession)
    // public lession_save: UserEntity;

    

    @Column({type: 'timestamp', default: () => "CURRENT_TIMESTAMP"})
    lession_create: Date;

    @Column({type: 'timestamp', default: () => "CURRENT_TIMESTAMP"})
    lession_update: Date;

    @BeforeUpdate()
    updateTimestamp(){
        this.lession_update = new Date; 
    }


}