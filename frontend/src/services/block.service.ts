import { api } from "./api";
import type { EmployeeBlock } from "../types/block";

export async function getBlocks(): Promise<EmployeeBlock[]> {
  const response = await api.get<EmployeeBlock[]>("/blocks");
  return response.data;
}

export async function createBlock(data: Omit<EmployeeBlock, "id" | "createdAt" | "updatedAt">): Promise<EmployeeBlock> {
  const response = await api.post<EmployeeBlock>("/blocks", data);
  return response.data;
}

export async function deleteBlock(id: string): Promise<void> {
  await api.delete(`/blocks/${id}`);
}
