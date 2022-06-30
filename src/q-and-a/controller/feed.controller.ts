import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, Query, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiForbiddenResponse, ApiTags } from '@nestjs/swagger';
import { catchError, map, Observable } from 'rxjs';
import { hasRoles } from 'src/auth/decorator/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-guard';
import { RolesGuard } from 'src/auth/guards/roles.guards';
import { ListRole } from 'src/auth/role/role.enum';
import { Feed } from '../models/feed.interface';
import { feedDTO } from '../models/feed.model';
import { FeedService } from '../service/feed.service';

@ApiTags('feeds')
@Controller('feeds')
export class FeedController {
    constructor(
        private feedService: FeedService,
    ) { }
    
    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiBearerAuth()
    @hasRoles(ListRole.ADMIN, ListRole.USER, ListRole.TEACHER, ListRole.STUDENT)
    @Post('create')
    @ApiCreatedResponse({description: "Create date with post"})
    @ApiForbiddenResponse({description: 'Forbidden'})
    @ApiBody({ type: feedDTO})
    create(@Body()question: Feed, @Request() req): Observable<Feed | Object> {
        return this.feedService.create(question, req.user).pipe(
            map((question: Feed) => question),
            catchError(err => { throw new BadRequestException(err)})
        )
    }

    // @Get()
    // findAll(@Query('page') page: number = 1  ,@Query('limit') limit: number = 10) : Observable<Feed[]> {
    //     limit = limit > 100 ? 100 : limit;
    //     let filter = {
    //         limit: limit,
    //         page: page
    //     }
    //     return this.feedService.findAll({page: Number(page), limit: Number(limit), route: 'https://localhost:4000/feeds'})
    // }

    @Get()
    findAll() : Observable<Feed[]> {
        return this.feedService.findAll();
    }

    @Get('feed/:id')
    findOne(@Param('id') id: string) : Observable<any> {
        try {
            this.feedService.updateView(Number(id)).subscribe();
        } catch (error) {
            console.log(error)
            throw new Error("This feeds does not exist");
        }
        return this.feedService.findOne(Number(id))
    }

    // @UseGuards(JwtAuthGuard, RolesGuard)
    // @ApiBearerAuth()
    // @hasRoles(ListRole.ADMIN, ListRole.TEACHER ,ListRole.MEMBER, ListRole.USER, ListRole.STUDENT)
    @Put('updateLike/:feed_id')
    updateLike(@Param('feed_id')feed_id: string): Observable<Feed>{
            return this.feedService.updateLike(Number(feed_id));
        
    }

    // @UseGuards(JwtAuthGuard, RolesGuard)
    // @ApiBearerAuth()
    // @hasRoles(ListRole.ADMIN, ListRole.TEACHER ,ListRole.MEMBER, ListRole.USER, ListRole.STUDENT)
    @Put('updateDislike/:feed_id')
    updateDislike(@Param('feed_id')feed_id: string): Observable<Feed>{
            return this.feedService.updateDislike(Number(feed_id));
        
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiBearerAuth()
    @hasRoles(ListRole.ADMIN, ListRole.STUDENT, ListRole.USER, ListRole.TEACHER)
    @ApiBody({ type: feedDTO})
    @Put('update/:feed_id')
    updateOne(@Param('feed_id')feed_id: string, @Body()feed: Feed, @Request() req): Observable<Feed>{
        try {
            if(req.user.user.role!=ListRole.ADMIN){
                return this.feedService.updateOneCheckId(Number(feed_id),Number(req.user.user.id) ,feed);
            }else{
                return this.feedService.updateOne(Number(feed_id), feed, req.user.user);
    
            }
        } catch (error) {
            catchError(error => { throw new BadRequestException(error)})
        }
      
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiBearerAuth()
    @hasRoles(ListRole.ADMIN, ListRole.STUDENT, ListRole.USER, ListRole.TEACHER)
    @Delete('delete/:feed_id')
    deleteOne(@Param('feed_id') feed_id: string,  @Request() req): Observable<any>{
        if(req.user.user.role!=ListRole.ADMIN){
            return this.feedService.deleteOneCheckId(Number(feed_id),Number(req.user.user.id))
        }else{
            return this.feedService.deleteOne(Number(feed_id))
        }
    }
}
