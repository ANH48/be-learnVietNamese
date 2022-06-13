import { CourseEntity } from "src/course/models/course.entity";
import { Course } from "src/course/models/course.interface";
import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn, OneToMany, BeforeUpdate, ManyToOne } from "typeorm";

@Entity({name: "course_type"})
export class CourseTypeEntity {
    @PrimaryGeneratedColumn()
    course_type_id: number; 

    @Column( {unique: true} )
    course_type_name: string;

    @OneToMany(() => CourseEntity, course => course.course_id)
    course: Course;

    @Column({type: 'timestamp', default: () => "CURRENT_TIMESTAMP"})
    course_type_create: Date;

    @Column({type: 'timestamp', nullable: true})
    course_type_update: Date;

    @OneToMany(() => CourseEntity, (course_type: CourseEntity) => course_type.role)
    public blogs: CourseEntity[];

    @BeforeUpdate()
    updateTimestamp(){
        this.course_type_update = new Date; 
    }
}