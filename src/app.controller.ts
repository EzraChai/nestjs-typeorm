import { User } from './user.entity';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { AppService } from './app.service';

@Controller('users')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getUsers(): Promise<User[]> {
    return await this.appService.getAllUsers();
  }

  @Get(':id')
  async getUser(@Param('id') id: number): Promise<User> {
    return await this.appService.getOneById(id);
  }

  @Post()
  async createUser(
    @Body('name') name: string,
    @Body('pets') petsIds: number[],
  ): Promise<User> {
    return await this.appService.createUser(name, petsIds);
  }

  @Patch(':id')
  async updateUser(
    @Param('id') id: number,
    @Body('name') name: string,
    @Body('pets') petsIds: number[],
  ): Promise<User> {
    return await this.appService.updateUser(id, name, petsIds);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: number) {
    return await this.appService.deleteUser(id);
  }
}
