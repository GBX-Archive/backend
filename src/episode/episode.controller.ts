import { Controller, Get, Query } from '@nestjs/common';
import { EpisodeService } from './episode.service';
import FetchLatest from 'src/tasks/fetch_latest';

@Controller('episode')
export class EpisodeController {
  constructor(private readonly episodeService: EpisodeService) {}

  @Get()
  getEpisodes(@Query() query: any) {
    return this.episodeService.getEpisodes(query);
  }

  @Get('refresh')
  refreshEpisodes() {
    FetchLatest();
    return { message: 'Refreshing episodes...' };
  }
}
