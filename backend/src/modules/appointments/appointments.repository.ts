import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../database/prisma/prisma.service";
import { dateToDate } from "../../common/utils/time";
import { CreateAppointmentDto } from "./dto/create-appointment.dto";
import { UpdateAppointmentDto } from "./dto/update-appointment.dto";

@Injectable()
export class AppointmentsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAllByBusinessId(businessId: string, clientId?: string) {
    return this.prisma.appointment.findMany({
      where: {
        businessId,
        ...(clientId ? { clientId } : {})
      },
      include: {
        client: { select: { firstName: true, lastName: true, phone: true } },
        employee: { select: { firstName: true, lastName: true } },
        service: { select: { name: true, durationMinutes: true } }
      },
      orderBy: [{ appointmentDate: "asc" }, { startTime: "asc" }]
    });
  }

  async findById(id: string) {
    return this.prisma.appointment.findUnique({
      where: { id },
      include: {
        client: { select: { firstName: true, lastName: true, phone: true } },
        employee: { select: { firstName: true, lastName: true } },
        service: { select: { name: true, durationMinutes: true } }
      }
    });
  }

  async create(businessId: string, data: CreateAppointmentDto) {
    return this.prisma.appointment.create({
      data: {
        businessId,
        clientId: data.clientId,
        employeeId: data.employeeId,
        serviceId: data.serviceId,
        appointmentDate: dateToDate(data.appointmentDate),
        startTime: data.startTime,
        endTime: data.endTime,
        bookingSource: (data.bookingSource ?? "web") as "web" | "whatsapp" | "phone" | "walk_in",
        notes: data.notes
      }
    });
  }

  async update(id: string, data: UpdateAppointmentDto) {
    const updateData: Record<string, unknown> = {};

    if (data.status !== undefined) {
      updateData.status = data.status;
    }
    if (data.appointmentDate) {
      updateData.appointmentDate = dateToDate(data.appointmentDate);
    }
    if (data.startTime) {
      updateData.startTime = data.startTime;
    }
    if (data.endTime) {
      updateData.endTime = data.endTime;
    }
    if (data.clientId !== undefined) {
      updateData.clientId = data.clientId;
    }
    if (data.employeeId !== undefined) {
      updateData.employeeId = data.employeeId;
    }
    if (data.serviceId !== undefined) {
      updateData.serviceId = data.serviceId;
    }
    if (data.notes !== undefined) {
      updateData.notes = data.notes;
    }

    return this.prisma.appointment.update({
      where: { id },
      data: updateData
    });
  }

  async delete(id: string) {
    return this.prisma.appointment.delete({ where: { id } });
  }
}
