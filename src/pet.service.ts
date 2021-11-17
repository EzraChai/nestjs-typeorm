import { User } from './user.entity';
import { Pet } from './pet.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PetService {
  constructor(
    @InjectRepository(Pet) private petRepository: Repository<Pet>,
    @InjectRepository(Pet) private userRepository: Repository<User>,
  ) {}

  async getAllPets(): Promise<Pet[]> {
    return await this.petRepository.find({
      relations: ['owner'],
    }); //SELECT * FROM USER JOIN PETS
  }

  async getOneById(id: number): Promise<Pet> {
    try {
      return await this.petRepository.findOneOrFail(id, {
        relations: ['owner'],
      }); //SELECT * FROM USER WHERE user.id = id;
    } catch (error) {
      throw new NotFoundException(error);
    }
  }

  async getOneUserById(id: number): Promise<User> {
    try {
      return await this.userRepository.findOneOrFail(id); //SELECT * FROM USER WHERE user.id = id;
    } catch (error) {
      throw new NotFoundException(error);
    }
  }

  async createPet(name: string, owner: number): Promise<Pet> {
    let pet;
    if (owner) {
      const user = await this.getOneUserById(owner);
      pet = this.petRepository.create({ name, owner: user });
    } else {
      pet = this.petRepository.create({ name });
    }
    const newPet = await this.petRepository.save(pet); //INSERT
    return this.getOneById(newPet.id);
  }

  async updatePet(id: number, name: string, owner: number): Promise<Pet> {
    const pet = await this.getOneById(id);

    if (name) pet.name = name;
    if (owner) {
      pet.owner = await this.getOneUserById(owner);
    }

    await this.petRepository.save(pet); //UPDATE
    return await this.getOneById(id);
  }

  async deletePet(petId: number): Promise<Pet> {
    const user = await this.getOneById(petId);

    return await this.petRepository.remove(user);
  }
}
