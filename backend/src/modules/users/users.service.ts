import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { UsersRepository } from "./users.repository";
import { CreateUserDto } from "./dto/create-user.dto";

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async getAll(businessId: string) {
    return this.usersRepository.findAllByBusinessId(businessId);
  }

  async getById(id: string) {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new NotFoundException("Usuario no encontrado.");
    }

    return user;
  }

  async create(dto: CreateUserDto) {
    const existingUser = await this.usersRepository.findByAuthUserId(dto.authUserId);

    if (existingUser) {
      throw new ConflictException("Ya existe un usuario con este ID de autenticación.");
    }

    return this.usersRepository.create(dto, dto.authUserId);
  }

  async softDelete(id: string) {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new NotFoundException("Usuario no encontrado.");
    }

    return this.usersRepository.softDelete(id);
  }
}
