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

<<<<<<< HEAD:src/subscribe/models/subscribe.entity.ts
    @Column({type: 'timestamp', default: () => "CURRENT_TIMESTAMP"})
    subscribe_update: Date;
=======
    @Column({type: 'timestamp',nullable: true})
    surcrise_update: Date;
>>>>>>> 7d65c82294f329dcb110c4a8e91f9d29c047d956:src/surcrise/models/surcrise.entity.ts

    @BeforeUpdate()
    updateTimestamp(){
        this.subscribe_update = new Date; 
    }


}