import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import FetchLatest from './fetch_latest';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  onModuleInit() {
    this.logger.log('TasksService initialized');
  }

  @Cron('30 22 * * 5') // every friday at 22:30 (GBX)
  handleCron() {
    this.logger.debug('Requesting latest episodes from Clyde 1...');
    FetchLatest();
    this.logger.debug('Done.');
  }

  // every saturday at 22:30 (GBX)
  @Cron('30 22 * * 6')
  handleCron2() {
    this.logger.debug('Requesting latest episodes from Clyde 1...');
    FetchLatest();
    this.logger.debug('Done.');
  }

  // every sunday at 22:05 (Sunday Night Takeover)
  @Cron('30 22 * * 0')
  handleCron3() {
    this.logger.debug('Requesting latest episodes from Clyde 1...');
    FetchLatest();
    this.logger.debug('Done.');
  }
}
