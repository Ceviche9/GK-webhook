import { Injectable } from '@nestjs/common';
import { StoreAPIProvider } from 'src/common/store/storeAPI.service';
import { NodemailerProvider } from '../../common/nodemailer/nodemailer.service';

@Injectable()
export class OrdersService {
  constructor(
    private storeAPI: StoreAPIProvider,
    private nodemailerProvider: NodemailerProvider,
  ) {}
  async getOrder(id: string): Promise<any> {
    const order = await this.storeAPI.findOrder(id);

    if (!order.situacao.aprovado) {
      throw new Error('Esse pedido ainda não foi aprovado!');
    }

    if (order.pagamentos[0].forma_pagamento.codigo !== 'mercadopagov1') {
      throw new Error('Esse pedido não não foi pago no cartão.');
    }

    // Send email.
    await this.nodemailerProvider.sendMail({
      order: Number(id),
      price: order.pagamentos[0].valor_pago,
      products: [order.itens[0].nome],
      email: order.cliente.email,
    });

    return order;
  }
}