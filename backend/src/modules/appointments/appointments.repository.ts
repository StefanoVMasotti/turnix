import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../database/prisma/prisma.service";
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
        appointmentDate: new Date(data.appointmentDate),
        startTime: new Date(`1970-01-01T${data.startTime}+03:00`),
        endTime: new Date(`1970-01-01T${data.endTime}+03:00`),
        bookingSource: (data.bookingSource as "web" | "whatsapp" | "phone" | "walk_in") ?? "web",
        notes: data.notes
      }
    });
  }

  async update(id: string, data: UpdateAppointmentDto) {
    const updateData: Record<string, unknown> = { ...data };

    if (data.status) {
      updateData.status = data.status as "scheduled" | "completed" | "cancelled" | "no_show";
    }
    if (data.appointmentDate) {
      updateData.appointmentDate = new Date(data.appointmentDate);
    }
    if (data.startTime) {
      updateData.startTime = new Date(`1970-01-01T${data.startTime}+03:00`);
    }
    if (data.endTime) {
      updateData.endTime = new Date(`1970-01-01T${data.endTime}+03:00`);
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
