import { UserEntity } from "src/user/models/user.entity";
import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn, OneToMany, BeforeUpdate, ManyToOne, ManyToMany } from "typeorm";
import { CourseEntity } from "src/course/models/course.entity";

@Entity({name: "register"})
export class RegisterCourseEntity {
    @PrimaryGeneratedColumn()
    register_id: number;

    @Column({type: 'boolean', default: () => "false"})
    register: boolean;

    @Column({type: 'timestamp', default: () => "CURRENT_TIMESTAMP"})
    register_date: Date;

    @ManyToOne(() => UserEntity, user => user.course_enroll)
    public user: UserEntity;

    @ManyToOne(() => CourseEntity, course => course.registerCourse)
    public course: CourseEntity;

}