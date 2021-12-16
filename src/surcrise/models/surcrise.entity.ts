import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn, OneToMany, BeforeUpdate, ManyToOne } from "typeorm";
// import { Lession } from "./lession.interface";

@Entity({name: "surcrise"})
export class SurcriseEntity {
    @PrimaryGeneratedColumn()
    surcrise_id: number; 

    @Column(  )
    name: string;

    @Column( {unique: true} )
    email: string;

    @Column( )
    phone: string;

    @Column({type: 'timestamp', default: () => "CURRENT_TIMESTAMP"})
    surcrise_create: Date;

    @Column({type: 'timestamp'})
    surcrise_update: Date;

    @BeforeUpdate()
    updateTimestamp(){
        this.surcrise_update = new Date; 
    }


}