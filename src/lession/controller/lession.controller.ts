import { Body, Controller, Delete, Get, Param, Post, Put, Request, UseGuards } from '@nestjs/common';
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
    create(@Body()lession: Lession): Observable<Lession | Object> {
        return this.lessionService.create(lession).pipe(
            map((Lession: Lession) => Lession),
            catchError(err => of({error: err.message})) 
        );
    }

    @ApiBearerAuth()
    @Get()
    findAll() : Observable<Lession[]>{
        return this.lessionService.findAll();
    }

    @ApiBearerAuth()
    @Get(':lession_id')
    findOne(@Param('lession_id') lession_id: string) : Observable<Lession>{
        this.lessionService.updateView(Number(lession_id)).subscribe();
        return this.lessionService.findOne(Number(lession_id));
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiBearerAuth()
    @hasRoles(ListRole.ADMIN, ListRole.WRITTER)
    @Put('update/:lession_id')
    updateOne(@Param('lession_id')lession_id: string, @Body()lession: Lession): Observable<Lession>{
        return this.lessionService.updateOne(Number(lession_id), lession);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiBearerAuth()
    @hasRoles(ListRole.ADMIN, ListRole.WRITTER)
    @Delete('delete/:lession_id')
    deleteOne(@Param('lession_id') lession_id: string): Observable<any>{
        return this.lessionService.deleteOne(Number(lession_id));
    }
    


} 