import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { EventsService } from '@events/events.service';
import { GetEventsDto } from '@events/dtos/get-events.dto';
import { FirebaseAuthGuard } from '@core/firebase-auth.guard';

@UseGuards(FirebaseAuthGuard)
@Controller('events')
export class EventsController {
  constructor(private eventsService: EventsService) {}

  // legacy, from typesense
  @Post('getEvents') getEvents(@Body() dto: GetEventsDto) {
    return this.eventsService.getEvents(dto);
  }
}
