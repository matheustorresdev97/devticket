import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
} from '@nestjs/common';
import { SpotsService } from '@app/core/spots/spots.service';
import { CriarLugarRequest } from './request/criar-lugar.request';
import { AtualizarLugarRequest } from './request/atualizar-lugar.request';

@Controller('eventos/:eventoId/lugares')
export class LugaresController {
  constructor(private readonly spotsService: SpotsService) {}

  @Post()
  create(
    @Param('eventoId') eventoId: string,
    @Body() criarLugarRequest: CriarLugarRequest,
  ) {
    return this.spotsService.create({
      name: criarLugarRequest.nome,
      eventId: eventoId,
    });
  }

  @Get()
  findAll(@Param('eventoId') eventoId: string) {
    return this.spotsService.findAll(eventoId);
  }

  @Get(':lugarId')
  findOne(
    @Param('eventoId') eventoId: string,
    @Param('lugarId') lugarId: string,
  ) {
    return this.spotsService.findOne(eventoId, lugarId);
  }

  @Patch(':lugarId')
  update(
    @Param('eventoId') eventoId: string,
    @Param('lugarId') lugarId: string,
    @Body() atualizarLugarRequest: AtualizarLugarRequest,
  ) {
    return this.spotsService.update(eventoId, lugarId, {
      name: atualizarLugarRequest.nome,
    });
  }

  @HttpCode(204)
  @Delete(':lugarId')
  remove(
    @Param('eventoId') eventoId: string,
    @Param('lugarId') lugarId: string,
  ) {
    return this.spotsService.remove(eventoId, lugarId);
  }
}
