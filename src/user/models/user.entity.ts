import { BlogTypeEntity } from "src/blog-type/models/blog_type.entity";
import { BlogEntity } from "src/blog/models/blog.entity";
import { Blog } from "src/blog/models/blog.interface";
import { Lession_saveEntity } from "src/lession-save/models/lession-save.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
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

    @Column({type: 'timestamp', default: () => "CURRENT_TIMESTAMP"})
    update: Date;


    // @OneToMany(() => Lession_saveEntity, lession_save => lession_save.lession_save_id)
    // lession_save: Lession_saveEntity;

    @BeforeUpdate()
    updateTimestamp(){
        this.update = new Date; 
    }



}