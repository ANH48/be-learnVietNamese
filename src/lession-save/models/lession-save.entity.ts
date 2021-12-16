import { BlogTypeEntity } from "src/blog-type/models/blog_type.entity";
import { LessionEntity } from "src/lession/models/lession.entity";
// import { BlogEntity } from "src/blog/models/blog.entity";
import { UserEntity } from "src/user/models/user.entity";

import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn, ManyToOne, BeforeUpdate, OneToMany } from "typeorm";

// import { UserRole } from "./blog.interface";

@Entity({name: "lession_save"})
export class Lession_saveEntity {
    @PrimaryGeneratedColumn()
    lession_save_id: number; 

    // @ManyToOne(() => UserEntity, user => user.id)
    @Column()
    user_id: number;

    @Column()
    lession_id?:number;

    // @ManyToOne(() => UserEntity, (user: UserEntity) => user.lession_save)
    // public author: UserEntity;



    // @ManyToOne(() => BlogTypeEntity, blogType => blogType.blog_type_id)
    // blogType_id: BlogTypeEntity;

    // @OneToMany(() => LessionEntity, lession => lession.lession_save)
    // public lession: LessionEntity[];

    // @Column()
    // lession_id?:string;

    // @BeforeInsert()
    // emailToLowerCase(){
    //     this.email = this.email.toLowerCase()
    // }


    @Column({type: 'timestamp', default: () => "CURRENT_TIMESTAMP"})
    lession_save_create: Date;

    @Column({type: 'timestamp'})
    lession_save_update: Date;

    @BeforeUpdate()
    updateTimestamp(){
        this.lession_save_update = new Date; 
    }

}