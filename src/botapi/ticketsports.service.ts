import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class TicketSportsService {
  private readonly apiUrl = 'https://api.ticketsports.com.br/v1.0';

  constructor(private readonly httpService: HttpService) {}

  // Método para obter o token
  async getAccessToken(login: string, password: string, accessType: string): Promise<{
    access_token: string;
    expires_in: number;
    refresh_token: string;
    token_type: string;
  }> {
    const payload = new URLSearchParams();
    payload.append('Login', login);
    payload.append('Password', password);
    payload.append('AccessType', accessType);

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
  async getEvents(body: { events: string[]; status: string[]; token: string; documento: string, }): Promise<any[]> {
    const config = {
      headers: {
        Authorization: `Bearer ${body.token}`,
        'Content-Type': 'application/json', // Adjust content type if needed
      },
      params: {
        page: 1,
        limit: 10,
      },
      data: body,
    };
  
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.apiUrl}/Order/List`, config)
      );
  
      // Extract and return only the desired participant information
      if (body.documento) {
        const participante = response.data.orders.flatMap(pedido => pedido.participante)
          .find(p => p.documento === body.documento);
  
        if (participante) {
          return [participante]; // Retorna o participante em um array para consistência
        } else {
          return []; // Retorna um array vazio se o participante não for encontrado
        }
      } else {
        // Se o documento não foi fornecido, retorna todos os participantes
        const participantes = response.data.orders.flatMap(pedido => pedido.participante)
          .map(participante => ({
            nome: participante.nome,
            inscricao: participante.inscricao,
            documento: participante.documento,
            categoria: participante.categoria,
            modalidade: participante.modalidade
          }));
  
      return participantes;
    }}
     catch (error) {
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
