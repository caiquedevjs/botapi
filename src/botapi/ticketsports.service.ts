import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class TicketSportsService {
  private readonly apiUrl = 'https://api.ticketsports.com.br/v1.0';

  constructor(private readonly httpService: HttpService) {}

  // Método para obter o token
  async getAccessToken(login: string, password: string): Promise<{
    access_token: string;
    expires_in: number;
    refresh_token: string;
    token_type: string;
  }> {
    const payload = new URLSearchParams();
    payload.append('Login', login);
    payload.append('Password', password);
    payload.append('AccessType', 'O');

    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.apiUrl}/Access`, payload.toString(), {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }),
      );

      return response.data;
    } catch (error) {
      if (error.response) {
        console.error('Erro na resposta:', JSON.stringify(error.response.data, null, 2));
        throw new HttpException(
          `Failed to retrieve access token: ${JSON.stringify(error.response.data, null, 2)}`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      console.error('Erro desconhecido:', error);
      throw new HttpException(
        'Failed to retrieve access token due to an unexpected error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Método para consultar eventos com JSON no corpo da requisição
  async getEvents(eventIds: string[], status: string[]): Promise<any> {
    const body = {
      events: eventIds, // IDs dos eventos para filtrar
      status: status,   // Status dos eventos para filtrar, como 'Pago', 'Pendente'
    };

    const config = {
      headers: {
        Authorization: `Bearer YOUR_ACCESS_TOKEN`, // Insira o token de acesso aqui
        'Content-Type': 'application/json',
      },
    };

    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.apiUrl}/Order/List?page=1&limit=10`, body, config), // Mudamos para POST aqui
      );

      return response.data;  // Retorna diretamente os dados da requisição
    } catch (error) {
      if (error.response) {
        console.error('Erro na resposta:', JSON.stringify(error.response.data, null, 2));
        throw new HttpException(
          `Failed to retrieve events: ${JSON.stringify(error.response.data, null, 2)}`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      console.error('Erro desconhecido:', error);
      throw new HttpException(
        'Failed to retrieve events due to an unexpected error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
