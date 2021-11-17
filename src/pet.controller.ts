import { Pet } from './pet.entity';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { PetService } from './pet.service';

@Controller('pets')
export class PetController {
  constructor(private readonly petService: PetService) {}

  @Get()
  async getPets(): Promise<Pet[]> {
    return await this.petService.getAllPets();
  }

  @Get(':id')
  async getPet(@Param('id') id: number): Promise<Pet> {
    return await this.petService.getOneById(id);
  }

  @Post()
  async createPet(
    @Body('name') name: string,
    @Body('owner') ownerId: number,
  ): Promise<Pet> {
    return await this.petService.createPet(name, ownerId);
  }

  @Patch(':id')
  async updatePet(
    @Param('id') id: number,
    @Body('name') name: string,
    @Body('owner') ownerId: number,
  ): Promise<Pet> {
    return await this.petService.updatePet(id, name, ownerId);
  }

  @Delete(':id')
  async deletePet(@Param('id') id: number) {
    return await this.petService.deletePet(id);
  }
}
