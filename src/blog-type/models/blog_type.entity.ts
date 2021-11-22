import { BlogEntity } from "src/blog/models/blog.entity";
import { Blog } from "src/blog/models/blog.interface";
import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn, OneToMany, BeforeUpdate, ManyToOne } from "typeorm";

@Entity({name: "blog_type"})
export class BlogTypeEntity {
    @PrimaryGeneratedColumn()
    blog_type_id: number; 

    @Column( {unique: true} )
    blog_type_name: string;

    @OneToMany(() => BlogEntity, blog => blog.blog_id)
    blog: Blog;

    @Column({type: 'timestamp', default: () => "CURRENT_TIMESTAMP"})
    blog_create: Date;

    @Column({type: 'timestamp', default: () => "CURRENT_TIMESTAMP"})
    blog_update: Date;


    @OneToMany(() => BlogEntity, (blog_type: BlogEntity) => blog_type.blogType)
    public blogs: BlogEntity[];


    @BeforeUpdate()
    updateTimestamp(){
        this.blog_update = new Date; 
    }


}