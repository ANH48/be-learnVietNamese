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
import { SubscribeDTO } from '../models/subscribe.model';
import { SubscribeService } from '../service/subscribe.service';
import { Subscribe } from '../models/subscribe.interface';
import { create } from 'domain';
import { ListRole } from 'src/auth/role/role.enum';
import { MailService } from 'src/mail/mail.service';

@ApiTags('subscribe')
@Controller('subscribe')
export class SubscribeController {
  constructor(
    private subscribeService: SubscribeService,
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
  @ApiBody({ type: SubscribeDTO })
  async create(@Body() surcrise: Subscribe): Promise<Subscribe | Object> {
    if (surcrise) {
      const validateEmail = await this.subscribeService.validateEmail(
        surcrise?.email,
      );
      if (validateEmail === 0) {
        const result = await this.subscribeService.create(surcrise);
        await this.mailService.sendSurcrise(result);
        console.log('result', result)
        if (result) {
          return result;
        } else {
          throw new BadRequestException('Subscribe is wrong ');
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
  async findAll() : Promise<Subscribe[]>{
      const result = this.subscribeService.findAll();
      return result;
  } 

}
