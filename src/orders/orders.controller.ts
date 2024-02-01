import { Controller, Get, Param, Req, Request } from '@nestjs/common';
import { OrdersService } from './service/orders.service';

@Controller('/orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get('/:id')
  async getOrderById(
    @Req() request: Request,
    @Param('id') id: string,
  ): Promise<string> {
    const authorizationHeader = request.headers['authorization'];
    if (authorizationHeader !== process.env.KEY)
      throw new Error('Chave inválida!');
    if (!id) throw new Error('Informe um número de pedido válido!');
    const response = await this.ordersService.getOrder(id);
    return response;
  }
}