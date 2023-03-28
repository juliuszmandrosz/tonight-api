import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { UpdateTicketInput } from './dtos/update-ticket.input';
import { CreateTicketInput } from '@tickets/dtos/create-ticket.input';

@Injectable()
export class TicketsService {
  constructor(private prismaService: PrismaService) {}

  findAll() {
    return this.prismaService.ticket.findMany({
      include: {
        user: true,
      },
    });
  }

  update(id: string, updateTicketInput: UpdateTicketInput) {
    return this.prismaService.ticket.update({
      where: { id },
      data: updateTicketInput,
    });
  }

  create(createTicketInput: CreateTicketInput) {
    return this.prismaService.ticket.create({
      data: createTicketInput,
    });
  }

  findOne(id: string) {
    return this.prismaService.ticket.findUnique({ where: { id } });
  }
}
