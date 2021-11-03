import { BlogTypeEntity } from "src/blog copy/models/blog_type.entity";
import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
// import { UserRole } from "./blog.interface";

@Entity({name: "blogs"})
export class BlogEntity {
    @PrimaryGeneratedColumn()
    blog_id: number; 

    @Column( {unique: true} )
    blog_title: string;

    @Column( {unique: true} )
    blog_description: string;

    @Column()
    blog_content: string;

    @Column()
    blog_imgage: string; 

    @Column()
    blog_avatar: string;

    @Column()
    blog_video: string;

    @Column()
    blog_keyword: string;

    @ManyToOne(() => BlogTypeEntity, blogType => blogType.blog_type_id)
    blogType: BlogTypeEntity;

    // @BeforeInsert()
    // emailToLowerCase(){
    //     this.email = this.email.toLowerCase()
    // }

    @Column({type: 'timestamp', default: () => "CURRENT_TIMESTAMP"})
    blog_create: Date;

    @Column({type: 'timestamp', default: () => "CURRENT_TIMESTAMP"})
    blog_update: Date;

}