import {
  Controller,
  Req,
  Request,
  UnauthorizedException,
  Logger,
  Get,
} from '@nestjs/common';
import { EmailVerificationService } from './emailVerification.service';
import { EmailVerification } from '@prisma/client';

@Controller('/email')
export class EmailVerificationController {
  constructor(
    private readonly emailVerificationService: EmailVerificationService,
  ) {}

  @Get('/all')
  async sendEmailConfirmation(
    @Req() request: Request,
  ): Promise<EmailVerification[]> {
    const authorizationHeader = request.headers['authorization'];
    if (authorizationHeader !== process.env.KEY || !authorizationHeader) {
      Logger.error('Chave inválida enviada');
      throw new UnauthorizedException('Chave inválida!');
    }
    return await this.emailVerificationService.getAllEmails();
  }
}