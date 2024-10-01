import { HttpException, Injectable } from '@nestjs/common';
import { CreateSpotDto } from './dto/create-spot.dto';
import { UpdateSpotDto } from './dto/update-spot.dto';
import { PrismaService } from '../prisma/prisma.service';
import { SpotStatus } from '@prisma/client';

@Injectable()
export class SpotsService {
  constructor(private prismaService: PrismaService) {}

  async create(createSpotDto: CreateSpotDto & { eventId: string }) {
    const event = await this.prismaService.event.findFirst({
      where: {
        id: createSpotDto.eventId,
      },
    });

    if (!event) {
      throw new HttpException('Event not found', 404);
    }

    return this.prismaService.spot.create({
      data: {
        ...createSpotDto,
        status: SpotStatus.available,
      },
    });
  }

  findAll(eventId: string) {
    return this.prismaService.spot.findMany({
      where: {
        eventId,
      },
    });
  }

  async findOne(eventId: string, spotId: string) {
    const spot = await this.prismaService.spot.findFirst({
      where: {
        eventId,
        id: spotId,
      },
    });

    if (!spot) {
      throw new HttpException('Spot not found', 404);
    }

    return spot;
  }

  async update(eventId: string, spotId: string, updateSpotDto: UpdateSpotDto) {
    const event = await this.prismaService.event.findFirst({
      where: {
        id: eventId,
      },
    });

    if (!event) {
      throw new HttpException('Event not found', 404);
    }

    await this.findOne(eventId, spotId);

    return this.prismaService.spot.update({
      where: {
        eventId,
        id: spotId,
      },
      data: updateSpotDto,
    });
  }

  async remove(eventId: string, spotId: string) {
    const event = await this.prismaService.event.findFirst({
      where: {
        id: eventId,
      },
    });

    if (!event) {
      throw new HttpException('Event not found', 404);
    }

    await this.findOne(eventId, spotId);

    return this.prismaService.spot.delete({
      where: {
        eventId,
        id: spotId,
      },
    });
  }
}
