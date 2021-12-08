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
import { ImageService } from 'src/Image/image.service';
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
        private imageService: ImageService

        
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

    @Get(':lession_id')
    findOne(@Param('lession_id') lession_id: string) : Observable<Lession>{
        this.lessionService.updateView(Number(lession_id)).subscribe();
        return this.lessionService.findOne(Number(lession_id));
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiBearerAuth()
    @Get('users/:lession_id')
    findOneUser(@Param('lession_id') lession_id: string, @Request() req) : Observable<Lession>{
        // this.lession_saveService.create_lession(Number(lession_id)).subscribe();
        if(req.user){
            this.lession_saveService.create_lession(Number(lession_id),req.user.user).subscribe();
        }
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
        const str = "http://localhost:4000/api/lession/lession-image/" + file.filename;
        const obj = {
            image_name: file.filename,
            image_link: str
        }
        this.imageService.create(obj).subscribe();
        return of({imagePath: file.filename});
    }

    @Get('lession-image/:imagename')
    findProfileImage(@Param('imagename') imagename, @Res() res): Observable<Object> {
        return of(res.sendFile(join(process.cwd(), 'uploads/lession/' + imagename)));
    }
    


} 