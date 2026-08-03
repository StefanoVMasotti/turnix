import { Injectable, NotFoundException } from "@nestjs/common";
import { BlocksRepository } from "./blocks.repository";
import { CreateBlockDto } from "./dto/create-block.dto";

@Injectable()
export class BlocksService {
  constructor(private readonly blocksRepository: BlocksRepository) {}

  async getAll(businessId: string) {
    return this.blocksRepository.findAllByBusinessId(businessId);
  }

  async getById(id: string) {
    const block = await this.blocksRepository.findById(id);

    if (!block) {
      throw new NotFoundException("Bloqueo no encontrado.");
    }

    return block;
  }

  async create(dto: CreateBlockDto) {
    return this.blocksRepository.create(dto);
  }

  async remove(id: string) {
    const block = await this.blocksRepository.findById(id);

    if (!block) {
      throw new NotFoundException("Bloqueo no encontrado.");
    }

    return this.blocksRepository.delete(id);
  }
}
