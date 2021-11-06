import { Injectable } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { type } from 'os';
import { catchError, from, map, Observable, switchMap, throwError } from 'rxjs';
import { AuthService } from 'src/auth/service/auth.service';
import { Repository } from 'typeorm';
import { UserEntity } from '../models/user.entity';
import { User } from '../models/user.interface';

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
        private authService: AuthService
        ) {}

    create(user: User): Observable<User> {
        return this.authService.hashPassword(user.password).pipe(
            switchMap((passwordHash: string) => {
                const newUser = new UserEntity();
                newUser.name = user.name;
                newUser.username = user.username;
                newUser.email = user.email;
                newUser.password = passwordHash;
                newUser.role = user.role;
                return from(this.userRepository.save(newUser)).pipe(
                    map((user: User) => {
                        const {password, ...result} = user;
                        return result;
                    }),
                    catchError(err => throwError(()=> new Error(err)) )
                )
            })
        )
        // return from(this.userRepository.save(user));
    }

    register(user: User): Observable<User> {
        return this.authService.hashPassword(user.password).pipe(
            switchMap((passwordHash: string) => {
                const newUser = new UserEntity();
                newUser.name = user.name;
                newUser.username = user.username;
                newUser.email = user.email;
                newUser.password = passwordHash;
                //newUser.role = 'user';
                return from(this.userRepository.save(newUser)).pipe(
                    map((user: User) => {
                        const {password, ...result} = user;
                        return result;
                    }),
                    catchError(err => throwError(()=> new Error(err)) )
                )
            })
        )
        // return from(this.userRepository.save(user));
    }

    findOne(id: number) : Observable<User>{
        return from(this.userRepository.findOne({id})).pipe(
            map((user: User) => {
                const {password, ...result} = user;
                return result;
            })
            )
    }

    findAll() : Observable<User[]>{
        return from(this.userRepository.find()).pipe(
            map((users: User[]) => {
                users.forEach(function (v){
                    delete v.password
                });
                return users;
            })
        )
    }

    deleteOne(id: number) : Observable<any>{
        return from(this.userRepository.delete(id));
    }

    updateOne(id: number, user: User): Observable<any>{
        delete user.email;
        delete user.password;
        
        return from(this.userRepository.update(id, user));
    }

    updateRoleOfUser(id: number, user: User): Observable<any>{
        return from(this.userRepository.update(id,user));
    }

    login(user: User): Observable<string> {
        if(user.password){
            return this.validateUser(user.email, user.password, user.username).pipe(
                switchMap((user: User) => {
                    if(user) {
                        return this.authService.generateJWT(user).pipe(map((jwt: string) => jwt));
                    }else {
                        return 'Wrong Credentials';
                    }
                })
            )
        }
       else{
        const obj: any = {
            error: "invalid"
        }
        return obj;
       }
    }

    validateUser(email: string, password: string, username: string): Observable<User> {
        if(email){
            return this.findByMail(email).pipe(
                switchMap((user: User) => this.authService.comparePasswords(password, user.password).pipe(
                    map((match: boolean) => {
                        if(match) {
                            const {password, ...result} = user;
                            return result;
                        }else{
                         throw Error;
                        }
                    })
                ))
             )
        }else{
            return this.findByUsername(username).pipe(
                switchMap((user: User) => this.authService.comparePasswords(password, user.password).pipe(
                    map((match: boolean) => {
                        if(match) {
                            const {password, ...result} = user;
                            return result;
                        }else{
                         throw Error;
                        }
                    })
                ))
             )
        }
        
    }

    findByMail(email: string): Observable<User> {
        try {
            return from(this.userRepository.findOne({email}))
        } catch (error) {
            return error;
        }
       
    }

    findByUsername(username: string): Observable<User> {
        try {
            return from(this.userRepository.findOne({username}))
        } catch (error) {
            return error;
        }
       
    }
}
