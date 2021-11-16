import { BlogTypeEntity } from "src/blog-type/models/blog_type.entity";
import { BlogEntity } from "src/blog/models/blog.entity";
import { UserEntity } from "src/user/models/user.entity";

import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn, ManyToOne, BeforeUpdate } from "typeorm";

// import { UserRole } from "./blog.interface";

@Entity({name: "lession_save"})
export class Lession_saveEntity {
    @PrimaryGeneratedColumn()
    lession_save_id: number; 

    // @ManyToOne(() => UserEntity, user => user.id)
    @Column({unique: true} )
    user_id: number;


    // @ManyToOne(() => BlogTypeEntity, blogType => blogType.blog_type_id)
    // blogType_id: BlogTypeEntity;

    // @ManyToOne(() => BlogEntity, blog => blog.blog_id)
    // blog_id: BlogTypeEntity;

    @Column()
    list_lession_id?:string;

    // @BeforeInsert()
    // emailToLowerCase(){
    //     this.email = this.email.toLowerCase()
    // }


    @Column({type: 'timestamp', default: () => "CURRENT_TIMESTAMP"})
    blog_create: Date;

    @Column({type: 'timestamp', default: () => "CURRENT_TIMESTAMP"})
    blog_update: Date;

    @BeforeUpdate()
    updateTimestamp(){
        this.blog_update = new Date; 
    }

}