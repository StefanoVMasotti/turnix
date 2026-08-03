import { Injectable, NotFoundException } from "@nestjs/common";
import { ClientsRepository } from "./clients.repository";
import { CreateClientDto } from "./dto/create-client.dto";
import { UpdateClientDto } from "./dto/update-client.dto";

@Injectable()
export class ClientsService {
  constructor(private readonly clientsRepository: ClientsRepository) {}

  async getAll(businessId: string) {
    return this.clientsRepository.findAllByBusinessId(businessId);
  }

  async getById(id: string) {
    const client = await this.clientsRepository.findById(id);

    if (!client) {
      throw new NotFoundException("Cliente no encontrado.");
    }

    return client;
  }

  async create(businessId: string, dto: CreateClientDto) {
    return this.clientsRepository.create(businessId, dto);
  }

  async update(id: string, dto: UpdateClientDto) {
    const client = await this.clientsRepository.findById(id);

    if (!client) {
      throw new NotFoundException("Cliente no encontrado.");
    }

    return this.clientsRepository.update(id, dto);
  }
}
