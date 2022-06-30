import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiForbiddenResponse, ApiTags } from '@nestjs/swagger';
import nestedGroupBy from 'nested-groupby';
import { catchError, map, Observable } from 'rxjs';
import { hasRoles } from 'src/auth/decorator/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-guard';
import { RolesGuard } from 'src/auth/guards/roles.guards';
import { ListRole } from 'src/auth/role/role.enum';
import { CommentFeed } from '../models/comment-feed.interface';
import { CommentFeedDTO } from '../models/comment-feed.model';
import { CommentFeedService } from '../service/comment-feed.service';

@ApiTags('comment-feed')
@Controller('comment-feed')
export class CommentFeedController {
    constructor(
        private commentFeedService: CommentFeedService
    ) { }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiBearerAuth()
    @hasRoles(ListRole.ADMIN, ListRole.TEACHER, ListRole.STUDENT, ListRole.USER)
    @Post('create')
    @ApiCreatedResponse({ description: "Create date with post" })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    @ApiBody({ type: CommentFeedDTO })
    create(@Body() comment: CommentFeed, @Request() req): Observable<CommentFeed | Object> {
        return this.commentFeedService.create(comment, req.user.user).pipe(map((comment: CommentFeed) => comment),
        catchError(err => { throw new BadRequestException(err) }))
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiBearerAuth()
    @hasRoles(ListRole.ADMIN)
    @Get()
    findAll(): Observable<CommentFeed[]> {
        return this.commentFeedService.findAll();
    }

    @Get("feed/:feed_id")
    async findByFeedId(@Param('feed_id') feed_id: string) {
        if(feed_id) {
            let listFeed = await this.commentFeedService.findfeedById(Number(feed_id));
            nestedGroupBy(listFeed, ['Feed']);
            return listFeed;
        }
        throw new BadRequestException("Forbidden user");
    }

    @ApiBearerAuth()
    @hasRoles(ListRole.ADMIN)
    @Delete('delete/:id')
    deleteOne(@Param('id') id: string) : Observable<any> {
        return this.commentFeedService.deleteOne(Number(id));
    }
}
