import { Controller, Post, Body, HttpException, HttpStatus} from '@nestjs/common';
import { TicketSportsService } from './ticketsports.service';
import { ApiBody, ApiOperation, ApiParam, ApiProperty, ApiResponse } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty()
  login: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  accessType: string;
}

export class accessTokenResponse{
  @ApiProperty()
  access_token: string

  @ApiProperty()
  expires_in: string

  @ApiProperty()
  refresh_token: string

  @ApiProperty()
  token_type: string
}
export class GetEventsDto {
  @ApiProperty({ required: true })
  events: string[];

  @ApiProperty({ required: true })
  status: string[];

  @ApiProperty({ required: true })
  token: string;

  @ApiProperty({ required: true })
  documento: string;

}

export class QuestionarioDto {
  @ApiProperty()
  'Nome Atlético': string;
  @ApiProperty()
  'Equipe/Assessoria': string;
  // ... outras propriedades
}
export class participanteResponseDto {
  @ApiProperty()
  inscricao: number;
  @ApiProperty()
  nome: string;
  @ApiProperty()
  documento: string;
  // ... outras propriedades
  @ApiProperty({ type: [QuestionarioDto] })
  questionario: QuestionarioDto[];
}
@Controller('ticketsports')
export class TicketSportsController {
  constructor(private readonly ticketSportsService: TicketSportsService) {}

  

  // Endpoint para obter o token
  @Post('access')
  @ApiOperation({ summary: 'Obtém um token de acesso' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({status: 200, description: "Token gerado com sucesso", type: accessTokenResponse})
  async getAccess(@Body() body: { login: string; password: string, accessType: string}) {
    return await this.ticketSportsService.getAccessToken(body.login, body.password, body.accessType);
  }

  // Endpoint para buscar eventos com base nos IDs e status
  @Post('events')
  @ApiOperation({summary: 'Retorna dados do participante do evento'})
  @ApiBody({type:GetEventsDto})
  @ApiResponse({status: 200, description: 'Participante encontrado', type: participanteResponseDto})
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
