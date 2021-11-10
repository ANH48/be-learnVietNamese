import { BadRequestException, Injectable } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
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
                        const {password, tokenEmail, expired_token, ...result} = user;
                        return result;
                    }),
                    catchError(err => throwError(()=> new Error(err)) )
                )
            })
        )
        // return from(this.userRepository.save(user));
    }

    // findOne(id: number) : Observable<User>{
    //    try {
    //     return from(this.userRepository.findOne({id})).pipe(
    //         map((user: User) => {
    //             const {password, ...result} = user;
    //             return result;
    //         })
    //         )
    //    } catch (error) {
    //         throw new BadRequestException('id existed');
    //    }
    // }
    findOne(id: number) : Observable<any>{
        try {
            return from(this.userRepository.findOne({id})).pipe(
                map((user: User) => {
                    if(user){
                        const {password,expired_token,tokenEmail, ...result} = user;
                        return result;
                    }
                    else{
                        throw new BadRequestException('user no exist');
                    }
                    
                })
                )
        } catch (error) {
             throw new BadRequestException('id existed');
        }
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

    paginate(options: IPaginationOptions): Observable<Pagination<User>>{
        return from(paginate<User>(this.userRepository, options)).pipe(
            map((userPageable: Pagination<User>) => {
                userPageable.items.forEach(function (v) {delete v.password});

                return userPageable
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
            try {
                return this.validateUser(user.email, user.password, user.username).pipe(
                    switchMap((user: User) => {
                        if(user) {
                            delete user.expired_token;
                            delete user.tokenEmail;
                            return this.authService.generateJWT(user).pipe(map((jwt: string) => jwt));
                        }else {
                            return 'Wrong Credentials';
                        }
                    })
                )
            } catch (error) {
                throw new BadRequestException('Username or email is existed');
            }
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

   async isEmail(user: User): Promise<any> {
    let token = Math.floor(100000 + Math.random() * 900000).toString();
    const email =  user.email;
    const userId = await this.userRepository.findOne({email})
    if(userId){
        userId.tokenEmail = token;
        const day = new Date;
        const oldDay = userId.expired_token;
        let isExpired = true;
        if(oldDay){
            if(day.getDay()===oldDay.getDay() && day.getMonth()===oldDay.getMonth() && day.getFullYear()===oldDay.getFullYear()){
                if(day.getHours()===oldDay.getHours()){
                    const time =  oldDay.getMinutes() - day.getMinutes();
                    if(time > 0){
                        isExpired = false;
                        return user;
                    }
                }
            }
        }
        if(isExpired){
            token = Math.floor(100000 + Math.random() * 900000).toString();
            day.setMinutes(day.getMinutes() + 5);
            userId.expired_token = day;
        }
        
        // oldDay.getMinutes()
        // day.setMinutes(day.getMinutes() + 5);
        // userId.expired_token = dayZero;
        // console.log(userId.expired_token,"new");
        
        this.userRepository.update(userId.id,userId)
        return user;
    }
    else{
        throw new BadRequestException('Username or Email do not exist ');
    }
    }

    async checkTokenEmail(email: string, tokenEmail: string): Promise<User> {
        const user: any = await this.userRepository.findOne({email});
        if(user){
            if(user.tokenEmail===null || tokenEmail===null){
                throw new BadRequestException('Token is expired');
            }
            if(tokenEmail === user.tokenEmail){
                const oldDay = user.expired_token;
                const day = new Date;
                let isExpired = false;
                if(oldDay){
                    if(day.getDay()===oldDay.getDay() && day.getMonth()===oldDay.getMonth() && day.getFullYear()===oldDay.getFullYear()){
                        if(day.getHours()===oldDay.getHours()){
                            const time =  oldDay.getMinutes() - day.getMinutes();
                            if(time > 0){
                                isExpired = true;
                                const newPassWord = "@@"+ Math.floor(100000 + Math.random() * 900000).toString() +".!@";
                                user.password = newPassWord;
                                return user;
                            }
                        }
                    }
                }
                if(!isExpired){
                    throw new BadRequestException('Token is expired ');
                }
            }else{
                throw new BadRequestException('Token is valued ');
            }
        }else{
            throw new BadRequestException('Username or Email do not exist ');
        }
        
    }

    async updatePasswordOne(id: number, user: User): Promise<any>{
        delete user.email;
        delete user.role;
        delete user.tokenEmail;
        // delete user.password;
        // console.log(user);
        user.password = await this.authService.asyncHashPassword(user.password);
        const isUpdate = await this.userRepository.update(id, user);
        return isUpdate;
    }


}
