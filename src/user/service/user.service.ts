import { BadRequestException, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
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
                // console.log(passwordHash)
                newUser.blocked_user = 0;
                newUser.count_error = 0;
                newUser.role = user.role;
                return from(this.userRepository.save(newUser)).pipe(
                    map((user: User) => {
                        const {password, ...result} = user;
                        return result;
                    }),
                    catchError(err => {throw new BadRequestException("User or email existed")} )
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
                newUser.time_blocked = new Date;
                newUser.blocked_user = 0;
                newUser.count_error = 0;
                return from(this.userRepository.save(newUser)).pipe(
                    map((user: User) => {
                        const {password, tokenEmail,blocked_user,count_error,expired_token, ...result} = user;
                        return result;
                    }),
                    catchError(err => {throw new BadRequestException("User or email existed")}) 
                )
            })
        )
        // throw new BadRequestException("User is blocked");
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
                        const {password,expired_token,tokenEmail, blocked_user,count_error,time_blocked, ...result} = user;
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
        // delete user.password;
        if(user.password)
        return this.authService.hashPassword(user.password).pipe(
            switchMap((passwordHash: string) => {
                user.password = passwordHash
                return from(this.userRepository.update(id, user));
            }));
        return from(this.userRepository.update(id, user));
    }

    updateCountError(id: number, user: User): Observable<any>{
        delete user.username;
        delete user.email;
        delete user.password;
        delete user.tokenEmail;
        delete user.expired_token;
        delete user.role;
        delete user.blocked_user;
        delete user.time_blocked;
        return from(this.userRepository.update(id, user));
    }

    updateTime_blocked(id: number, user: User): Observable<any>{
        delete user.username;
        delete user.email;
        delete user.password;
        delete user.tokenEmail;
        delete user.expired_token;
        delete user.role;
        delete user.blocked_user;
        delete user.count_error;
        return from(this.userRepository.update(id, user));
    }

    updateRoleOfUser(id: number, user: User): Observable<any>{
        return from(this.userRepository.update(id,user));
    }

    login(user: User): Observable<string> {
        if(user.password){
            try {
                return this.validateUser(user.email, user.password, user.username).pipe(
                    switchMap((user: any) => {
                        if(user == "0") {
                            throw new ForbiddenException('Username or email is existed')
                            // throw new UnauthorizedException;
                        }
                        else {
                            if(user) {
                                delete user.expired_token;
                                delete user.tokenEmail;
                                delete user.blocked_user;
                                delete user.count_error;
                                delete user.time_blocked;
                                return this.authService.generateJWT(user).pipe(map((jwt: string) => jwt));
                            }else {
                                return 'Wrong Credentials';
                            }
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

    validateUser(email: string, password: string, username: string): Observable<any> {
        if(email && email!=""){
            return this.findByMail(email).pipe(
                switchMap((user: User) => {
                    if(!user)  {
                        return "0";
                    } 
                    if(user.blocked_user == 1) throw new BadRequestException("User is blocked");
                    let oldDay = user.time_blocked;
                    let day = new Date;
                    if(oldDay){
                        if(day.getDay()===oldDay.getDay() && day.getMonth()===oldDay.getMonth() && day.getFullYear()===oldDay.getFullYear()){
                            if(day.getHours()===oldDay.getHours()){
                                const time =  oldDay.getMinutes() - day.getMinutes();
                                if(time > 0){
                                    throw new BadRequestException("User is blocked");
                                }
                            }
                        }
                    }
                    return this.authService.comparePasswords(password, user.password).pipe(
                        map((match: boolean) => {
                            if(match) {
                                const {password, ...result} = user;
                                user.count_error = 0;
                                delete user.password;
                                this.updateOne(user.id,user).subscribe();
                                return result;
                            }else{
                                if(user.count_error==5) {
                                    user.count_error = 0;
                                    day.setMinutes(day.getMinutes() + 5);
                                    user.time_blocked = day;
                                    this.updateTime_blocked(user.id,user).subscribe();
                                    throw new BadRequestException("User is blocked in 5 minutes");
                                }
                                else{
                                    user.count_error = user.count_error + 1;
                                }
                                delete user.password;
                                this.updateOne(user.id,user).subscribe();
                             throw  new BadRequestException("Email or password wrong");
                            }
                        })
                    )
                })
             )
        }else{
            return this.findByUsername(username).pipe(
                switchMap((user: User) => {
                    if(!user)  {
                        return "0";
                    } 
                    if(user.blocked_user == 1) throw new BadRequestException("User is blocked");
                    let oldDay = user.time_blocked;
                    let day = new Date;
                    if(oldDay){
                        if(day.getDay()===oldDay.getDay() && day.getMonth()===oldDay.getMonth() && day.getFullYear()===oldDay.getFullYear()){
                            if(day.getHours()===oldDay.getHours()){
                                const time =  oldDay.getMinutes() - day.getMinutes();
                                if(time > 0){
                                    throw new BadRequestException("User is blocked");
                                }
                            }
                        }
                    }
                    return this.authService.comparePasswords(password, user.password).pipe(
                        map((match: boolean) => {
                            if(match) {
                                const {password, ...result} = user;
                                user.count_error = 0;
                                delete user.password;
                                this.updateOne(user.id,user).subscribe();
                                return result;
                            }else{
                                if(user.count_error==5) {
                                    user.count_error = 0;
                                    day.setMinutes(day.getMinutes() + 5);
                                    user.time_blocked = day;
                                    delete user.password;
                                    this.updateTime_blocked(user.id,user).subscribe();
                                    throw new BadRequestException("User is blocked in 5 minutes");
                                }
                                else{
                                    user.count_error = user.count_error + 1;
                                }
                                delete user.password;
                                this.updateOne(user.id,user).subscribe();
                             throw new BadRequestException("Username or password wrong");;
                            }
                        })
                    )
                })
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
                        return 0;
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

        return userId;
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
