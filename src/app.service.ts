import { Pet } from './pet.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Pet) private petsRepository: Repository<Pet>,
  ) {}

  async getAllUsers(): Promise<User[]> {
    return await this.userRepository.find({
      relations: ['pets'],
    }); //SELECT * FROM USER JOIN PETS
  }

  async getOneById(id: number): Promise<User> {
    try {
      return await this.userRepository.findOneOrFail(id, {
        relations: ['pets'],
      }); //SELECT * FROM USER WHERE user.id = id;
    } catch (error) {
      throw new NotFoundException(error);
    }
  }

  async createUser(name: string, petsIds: number[]): Promise<User> {
    let pets;
    if (petsIds) {
      pets = this.petsRepository.findByIds(petsIds);
    }
    const user = this.userRepository.create({ name, pets });
    return await this.userRepository.save(user); //INSERT
  }

  async updateUser(id: number, name: string, petsIds: number[]): Promise<User> {
    const user = await this.getOneById(id);

    if (name) user.name = name;
    if (petsIds) {
      user.pets = await this.petsRepository.findByIds(petsIds);
    }

    return await this.userRepository.save(user); //UPDATE
  }

  async deleteUser(id: number): Promise<User> {
    const user = await this.getOneById(id);

    return this.userRepository.remove(user);
  }

  customQuery() {
    this.userRepository.createQueryBuilder('user').select('name');
  }
}
