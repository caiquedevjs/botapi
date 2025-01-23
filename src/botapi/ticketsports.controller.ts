import { Controller, Post, Body, Get, Query, HttpException, HttpStatus, Param } from '@nestjs/common';
import { TicketSportsService } from './ticketsports.service';

@Controller('ticketsports')
export class TicketSportsController {
  constructor(private readonly ticketSportsService: TicketSportsService) {}

  // Endpoint para obter o token
  @Post('access')
  async getAccess(@Body() body: { login: string; password: string }) {
    return await this.ticketSportsService.getAccessToken(body.login, body.password);
  }

  // Endpoint para buscar eventos com base nos IDs e status
  @Post('events')
  async getEvents(@Body() body: { events: string[]; status: string[]; token : string, documento : string}) {
    if (!body.events || !body.status || !body.token ||!body.documento) {
      throw new HttpException('Events and status are required', HttpStatus.BAD_REQUEST);
    }

    try {
      // Chamando o serviço para obter os eventos com os parâmetros fornecidos
      return await this.ticketSportsService.getEvents(body);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


}
