import { UserEntity } from "src/user/models/user.entity";
import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn, OneToMany, BeforeUpdate, ManyToOne } from "typeorm";
// import { Lession } from "./lession.interface";

@Entity({name: "subscribe"})
export class SubscribeEntity {
    @PrimaryGeneratedColumn()
    subscribe_id: number; 

    @Column(  )
    name: string;

    @Column( {unique: true} )
    email: string;

    @Column( )
    phone: string;

    @Column({type: 'timestamp', default: () => "CURRENT_TIMESTAMP"})
    subscribe_create: Date;

    @Column({type: 'timestamp', default: () => "CURRENT_TIMESTAMP"})
    subscribe_update: Date;


    @BeforeUpdate()
    updateTimestamp(){
        this.subscribe_update = new Date; 
    }


}