import { BlogEntity } from "src/blog/models/blog.entity";
import { Blog } from "src/blog/models/blog.interface";
import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn, OneToMany } from "typeorm";

@Entity({name: "blog_type"})
export class BlogTypeEntity {
    @PrimaryGeneratedColumn()
    blog_type_id: number; 

    @Column( {unique: true} )
    blog_type_name: string;

    @OneToMany(() => BlogEntity, blog => blog.blog_id)
    blog: Blog;
    // @BeforeInsert()
    // emailToLowerCase(){
    //     this.email = this.email.toLowerCase()
    // }

    @Column({type: 'timestamp', default: () => "CURRENT_TIMESTAMP"})
    blog_create: Date;

    @Column({type: 'timestamp', default: () => "CURRENT_TIMESTAMP"})
    blog_update: Date;

}