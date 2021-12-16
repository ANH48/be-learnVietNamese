import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn, OneToMany, BeforeUpdate } from "typeorm";

@Entity({name: "image"})
export class ImageEntity {
    @PrimaryGeneratedColumn()
    image_id: number; 
    
    @Column()
    image_name: string;

    // @Column( {type: true} )
    // course_keywords: string;

    @Column()
    image_link: string;

    @Column({type: 'timestamp', default: () => "CURRENT_TIMESTAMP"})
    image_create: Date;

    @Column({type: 'timestamp'})
    image_update: Date;


    @BeforeUpdate()
    updateTimestamp(){
        this.image_update = new Date; 
    }


}