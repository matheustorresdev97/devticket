import { HttpException, Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EventsService {
  constructor(private prismaService: PrismaService) { }
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
}