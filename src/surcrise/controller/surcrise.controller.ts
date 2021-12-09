import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  Request,
  Res,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { registerAs } from '@nestjs/config';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiProperty,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { catchError, from, map, Observable, of, tap, throwError } from 'rxjs';
import { hasRoles } from 'src/auth/decorator/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-guard';
import { RolesGuard } from 'src/auth/guards/roles.guards';
import { SurcriseDTO } from '../models/surcrise.model';
import { SurcriseService } from '../service/surcrise.service';
import { Surcrise } from '../models/surcrise.interface';
import { create } from 'domain';
import { ListRole } from 'src/auth/role/role.enum';
import { MailService } from 'src/mail/mail.service';

@ApiTags('surcrise')
@Controller('surcrise')
export class SurcriseController {
  constructor(
    private surcriseService: SurcriseService,
    private mailService: MailService
  ) // private imageService: ImageService
  {}

  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @ApiBearerAuth()
  // @hasRoles(ListRole.ADMIN, ListRole.WRITTER)
  // @Post('create')
  // @ApiCreatedResponse({description: "Create date with post"})
  // @ApiForbiddenResponse({description: 'Forbidden'})
  // @ApiBody({ type: SurcriseDTO})
  // create(@Body()surcrise: ): Observable<Surcrise| Object> {
  //          return;

  //         // return this.surcriseService.create(blog,req.user).pipe(
  //         //     map((blog: Blog) => blog),
  //         //     catchError(err => { throw new BadRequestException(err)})
  //         // );

  // }
  @Post('create')
  @ApiBody({ type: SurcriseDTO })
  async create(@Body() surcrise: Surcrise): Promise<Surcrise | Object> {
    if (surcrise) {
      const validateEmail = await this.surcriseService.validateEmail(
        surcrise?.email,
      );
      if (validateEmail === 0) {
        const result = await this.surcriseService.create(surcrise);
        await this.mailService.sendSurcrise(result);
        if (result) {

          return result;
        } else {
          throw new BadRequestException('Surcrise is wrong ');
        }
      } else {
        switch (validateEmail) {
          case 1:
            throw new BadRequestException('Email format is wrong ');
          case 2:
            throw new BadRequestException('Email is regiter ');
        }
      }
    } else {
      throw new BadRequestException('No valied input');
    }
  }

  @Get()
  async findAll() : Promise<Surcrise[]>{
      const result = this.surcriseService.findAll();
      return result;
  } 

}
