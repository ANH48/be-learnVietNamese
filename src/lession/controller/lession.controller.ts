import { Body, Controller, Delete, Get, Param, Post, Put, Request, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiForbiddenResponse, ApiTags } from '@nestjs/swagger';
import { catchError, from, map, Observable, of, tap } from 'rxjs';
import { hasRoles } from 'src/auth/decorator/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-guard';
import { RolesGuard } from 'src/auth/guards/roles.guards';
import { ListRole } from 'src/auth/role/role.enum';
import { Lession_save } from 'src/lession-save/models/lession-save.interface';
import { Lession_saveService } from 'src/lession-save/service/lession-save.service';
import { Lession } from '../models/lession.interface';
import { LessionDTO } from '../models/lession.model';
import { LessionService } from '../service/lession.service';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path = require('path');
import { join } from 'path';
import { FileInterceptor } from '@nestjs/platform-express';
export const storage = {
    storage: diskStorage({
        destination: './uploads/lession',
        filename: (req, file, cb) => {
            const filename: string = path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
            const extension: string = path.parse(file.originalname).ext;

            cb(null, `${filename}${extension}`)
        }
    })

}


@ApiTags('lession')
@Controller('lession')
export class LessionController {

    constructor(
        private lessionService: LessionService,
        private lession_saveService: Lession_saveService,
        
        ){ }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiBearerAuth()
    @hasRoles(ListRole.ADMIN, ListRole.WRITTER)
    @Post('create')
    @ApiCreatedResponse({description: "Create date with post"})
    @ApiForbiddenResponse({description: 'Forbidden'})
    @ApiBody({type: LessionDTO})
    create(@Body()lession: Lession, @Request() req): Observable<Lession | Object> {
        return this.lessionService.create(lession,req.user.user).pipe(
            map((Lession: Lession) => Lession),
            catchError(err => of({error: err.message})) 
        );
    }

    // @ApiBearerAuth()
    @Get()
    findAll() : Observable<Lession[]>{
        return this.lessionService.findAll();
    }

    // @ApiBearerAuth()
    @Get(':lession_id')
    findOne(@Param('lession_id') lession_id: string) : Observable<Lession>{
        this.lessionService.updateView(Number(lession_id)).subscribe();
        return this.lessionService.findOne(Number(lession_id));
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiBearerAuth()
    @hasRoles(ListRole.ADMIN, ListRole.WRITTER)
    @Put('update/:lession_id')
    updateOne(@Param('lession_id')lession_id: string, @Body()lession: Lession, @Request() req): Observable<Lession>{
        if(req.user.user.role!=ListRole.ADMIN){
            // blog.author = req.user.user.id;
            return this.lessionService.updateOneCheckId(Number(lession_id),Number(req.user.user.id) ,lession);
        }else{
            return this.lessionService.updateOne(Number(lession_id), lession, req.user.user);

        }
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiBearerAuth()
    @hasRoles(ListRole.ADMIN, ListRole.WRITTER)
    @Delete('delete/:lession_id')
    deleteOne(@Param('lession_id') lession_id: string,  @Request() req): Observable<any>{
        // return this.lessionService.deleteOne(Number(lession_id));
        if(req.user.user.role!=ListRole.ADMIN){
            return this.lessionService.deleteOneCheckId(Number(lession_id),Number(req.user.user.id))
        }else{
            return this.lessionService.deleteOne(Number(lession_id))
        }
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiBearerAuth()
    @hasRoles(ListRole.ADMIN,ListRole.WRITTER)
    @Post('upload')
    @UseInterceptors(FileInterceptor('file', storage))
    uploadFile(@UploadedFile() file, @Request() req): Observable<Object> {
        // const blog: Blog = req.blog;

        // blog.blog_avatar = file.filename;
        // return this.blogService.updateOne(blog.blog_id, blog).pipe(
        //     tap((blog: Blog) => console.log(blog)),
        //     map((blog: Blog) => ({blog_avatar: blog.blog_avatar}))
        // )
        return of({imagePath: file.filename});
    }

    @Get('blogs-image/:imagename')
    findProfileImage(@Param('imagename') imagename, @Res() res): Observable<Object> {
        return of(res.sendFile(join(process.cwd(), 'upload/lession/' + imagename)));
    }
    


} 