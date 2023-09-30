import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TasksService } from './tasks/task.service';
import { ScheduleModule } from '@nestjs/schedule';
import { EpisodeModule } from './episode/episode.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), ScheduleModule.forRoot(), EpisodeModule],
  controllers: [AppController],
  providers: [AppService, TasksService],
})
export class AppModule {}
