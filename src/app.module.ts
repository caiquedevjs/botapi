import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios'; 
import { TicketSportsController } from './botapi/ticketsports.controller';
import { TicketSportsService } from './botapi/ticketsports.service';

@Module({
  imports: [HttpModule],
  controllers: [TicketSportsController],
  providers: [ TicketSportsService ],
})
export class AppModule {}
