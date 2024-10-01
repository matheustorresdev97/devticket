import { HttpException, Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { PrismaService } from '../prisma/prisma.service';
import { ReserveSpotDto } from './dto/reserve-spot.dto';
import { Prisma, TicketStatus } from '@prisma/client';

@Injectable()
export class EventsService {
  constructor(private prismaService: PrismaService) {}

  create(createEventDto: CreateEventDto) {
    return this.prismaService.event.create({
      data: {
        ...createEventDto,
        date: new Date(createEventDto.date),
      },
    });
  }

  findAll() {
    return this.prismaService.event.findMany();
  }

  async findOne(id: string) {
    const event = await this.prismaService.event.findUnique({
      where: {
        id,
      },
    });

    if (!event) {
      throw new HttpException('Event not found', 404);
    }

    return event;
  }

  async update(id: string, updateEventDto: UpdateEventDto) {
    await this.findOne(id);

    return this.prismaService.event.update({
      data: {
        ...updateEventDto,
        date: new Date(updateEventDto.date),
      },
      where: {
        id,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prismaService.event.delete({
      where: {
        id,
      },
    });
  }

  async reserveSpot(dto: ReserveSpotDto & { eventId: string }) {
    await this.findOne(dto.eventId);

    const spots = await this.prismaService.spot.findMany({
      where: {
        eventId: dto.eventId,
        name: {
          in: dto.spots,
        },
      },
    });
    if (spots.length !== dto.spots.length) {
      const foundSpotsName = spots.map((spot) => spot.name);
      const notFoundSpotsName = dto.spots.filter(
        (spotName) => !foundSpotsName.includes(spotName),
      );
      throw new HttpException(
        `Spots ${notFoundSpotsName.join(', ')} not found`,
        404,
      );
    }

    try {
      const createdTickets = await this.prismaService.$transaction(
        async (prisma) => {
          await prisma.reservationHistory.createMany({
            data: spots.map((spot) => ({
              email: dto.email,
              spotId: spot.id,
              ticketKind: dto.ticket_kind,
              status: TicketStatus.reserved,
            })),
          });

          await prisma.spot.updateMany({
            where: {
              id: {
                in: spots.map((spot) => spot.id),
              },
            },
            data: {
              status: TicketStatus.reserved,
            },
          });

          const tickets = await Promise.all(
            spots.map((spot) =>
              prisma.ticket.create({
                data: {
                  email: dto.email,
                  spotId: spot.id,
                  ticketKind: dto.ticket_kind,
                },
              }),
            ),
          );
          return tickets;
        },
        {
          isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted,
        },
      );
      return createdTickets;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        switch (error.code) {
          case 'P2002':
            throw new HttpException('Some spots are already reserved', 409);
          case 'P2034':
            throw new HttpException('Some spots are already reserved', 409);
          default:
            throw error;
        }
      }
      throw error;
    }
  }
}
