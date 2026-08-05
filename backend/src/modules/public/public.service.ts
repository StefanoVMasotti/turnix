import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import { PublicRepository } from "./public.repository";
import { CreatePublicAppointmentDto } from "./dto/create-public-appointment.dto";
import {
  addDays,
  dateToDate,
  minutesToTime,
  nowMinutesInTimezone,
  parseTimeToMinutes,
  toDateStr,
  todayInTimezone
} from "../../common/utils/time";

const DEFAULT_TIMEZONE = "America/Buenos_Aires";
const DEFAULT_INTERVAL = 30;
const DEFAULT_MAX_BOOKING_DAYS = 30;

interface ScheduleEntry {
  employeeId: string;
  dayOfWeek: number;
  start: number;
  end: number;
}

interface DayBlock {
  date: string;
  start: number;
  end: number;
}

@Injectable()
export class PublicService {
  constructor(private readonly publicRepository: PublicRepository) {}

  async getLanding(slug: string) {
    const business = await this.resolveBusiness(slug);

    const [services, employees] = await Promise.all([
      this.publicRepository.findActiveServicesByBusinessId(business.id),
      this.publicRepository.findActiveEmployeesByBusinessId(business.id)
    ]);

    return {
      business: {
        id: business.id,
        name: business.name,
        slug: business.slug,
        phone: business.phone,
        email: business.email,
        address: business.address
      },
      settings: business.settings,
      services: services.map((service) => ({
        id: service.id,
        name: service.name,
        description: service.description,
        durationMinutes: service.durationMinutes,
        employees: service.employeeServices.map((es) => ({
          employeeId: es.employeeId,
          firstName: es.employee.firstName,
          lastName: es.employee.lastName,
          price: es.price.toString()
        }))
      })),
      employees: employees.map((employee) => ({
        id: employee.id,
        firstName: employee.firstName,
        lastName: employee.lastName
      }))
    };
  }

  async getAvailability(
    slug: string,
    serviceId: string,
    employeeId?: string,
    date?: string
  ) {
    const business = await this.resolveBusiness(slug);
    const service = await this.resolveService(business.id, serviceId);

    const settings = business.settings;
    const duration = service.durationMinutes;
    const interval = settings?.appointmentInterval ?? DEFAULT_INTERVAL;
    const maxBookingDays = settings?.maxBookingDays ?? DEFAULT_MAX_BOOKING_DAYS;
    const timezone = settings?.timezone ?? DEFAULT_TIMEZONE;

    const employeeIds = await this.resolveEmployeeIds(business.id, serviceId, employeeId);

    if (employeeIds.length === 0) {
      throw new BadRequestException("El servicio no tiene profesionales disponibles.");
    }

    if (date) {
      const target = dateToDate(date);
      this.validateDateInWindow(target, todayInTimezone(timezone), maxBookingDays);

      const slots = await this.computeSlotsForDate(
        employeeIds,
        target,
        duration,
        interval,
        timezone
      );

      return {
        date,
        slots: slots.map((start) => ({
          startTime: minutesToTime(start),
          endTime: minutesToTime(start + duration)
        }))
      };
    }

    const today = todayInTimezone(timezone);
    const windowEnd = addDays(today, maxBookingDays);
    const availabilityMap = await this.buildAvailabilityMap(
      employeeIds,
      today,
      windowEnd,
      duration,
      interval,
      timezone
    );

    const days = [];
    for (let i = 0; i <= maxBookingDays; i++) {
      const dateStr = toDateStr(addDays(today, i));
      const slots = availabilityMap.get(dateStr) ?? [];
      days.push({ date: dateStr, available: slots.length > 0, slotsCount: slots.length });
    }

    return { days };
  }

  async createAppointment(slug: string, dto: CreatePublicAppointmentDto) {
    const business = await this.resolveBusiness(slug);

    const employeeService = await this.publicRepository.findEmployeeService(
      dto.employeeId,
      dto.serviceId
    );

    if (
      !employeeService ||
      !employeeService.active ||
      !employeeService.employee.active ||
      !employeeService.service.active ||
      employeeService.employee.businessId !== business.id ||
      employeeService.service.businessId !== business.id
    ) {
      throw new BadRequestException("El servicio no está disponible para ese profesional.");
    }

    const settings = business.settings;
    const duration = employeeService.service.durationMinutes;
    const interval = settings?.appointmentInterval ?? DEFAULT_INTERVAL;
    const maxBookingDays = settings?.maxBookingDays ?? DEFAULT_MAX_BOOKING_DAYS;
    const timezone = settings?.timezone ?? DEFAULT_TIMEZONE;

    const today = todayInTimezone(timezone);
    const target = dateToDate(dto.appointmentDate);
    this.validateDateInWindow(target, today, maxBookingDays);

    const start = parseTimeToMinutes(dto.startTime);
    const slots = await this.computeSlotsForDate(
      [dto.employeeId],
      target,
      duration,
      interval,
      timezone
    );

    if (!slots.includes(start)) {
      throw new ConflictException("El horario seleccionado ya no está disponible.");
    }

    let client = await this.publicRepository.findClientByPhone(business.id, dto.client.phone);

    if (client) {
      client = await this.publicRepository.updateClient(client.id, {
        firstName: dto.client.firstName,
        lastName: dto.client.lastName,
        email: dto.client.email,
        notes: dto.client.notes
      });
    } else {
      client = await this.publicRepository.createClient(business.id, dto.client);
    }

    const end = start + duration;

    const appointment = await this.publicRepository.createAppointment({
      businessId: business.id,
      clientId: client.id,
      employeeId: dto.employeeId,
      serviceId: dto.serviceId,
      appointmentDate: target,
      startTime: minutesToTime(start),
      endTime: minutesToTime(end),
      status: "scheduled",
      bookingSource: "web"
    });

    return this.publicRepository.findAppointmentById(appointment.id);
  }

  private async resolveBusiness(slug: string) {
    const business = await this.publicRepository.findBusinessBySlug(slug);

    if (!business || !business.active) {
      throw new NotFoundException("Negocio no encontrado.");
    }

    return business;
  }

  private async resolveService(businessId: string, serviceId: string) {
    const service = await this.publicRepository.findServiceById(serviceId);

    if (!service || !service.active || service.businessId !== businessId) {
      throw new BadRequestException("Servicio no válido.");
    }

    return service;
  }

  private async resolveEmployeeIds(
    businessId: string,
    serviceId: string,
    employeeId?: string
  ): Promise<string[]> {
    if (employeeId) {
      const employeeService = await this.publicRepository.findEmployeeService(employeeId, serviceId);

      if (
        !employeeService ||
        !employeeService.active ||
        !employeeService.employee.active ||
        employeeService.employee.businessId !== businessId
      ) {
        throw new BadRequestException("El profesional no ofrece este servicio.");
      }

      return [employeeId];
    }

    const employeeServices = await this.publicRepository.findEmployeeIdsByService(serviceId);
    return employeeServices.map((es) => es.employeeId);
  }

  private validateDateInWindow(date: Date, today: Date, maxBookingDays: number) {
    if (date < today || date > addDays(today, maxBookingDays)) {
      throw new BadRequestException("La fecha está fuera del rango de reserva permitido.");
    }
  }

  private async computeSlotsForDate(
    employeeIds: string[],
    date: Date,
    duration: number,
    interval: number,
    timezone: string
  ): Promise<number[]> {
    const availabilityMap = await this.buildAvailabilityMap(
      employeeIds,
      date,
      date,
      duration,
      interval,
      timezone
    );

    return availabilityMap.get(toDateStr(date)) ?? [];
  }

  private async buildAvailabilityMap(
    employeeIds: string[],
    windowStart: Date,
    windowEnd: Date,
    duration: number,
    interval: number,
    timezone: string
  ): Promise<Map<string, number[]>> {
    const [schedules, timeOffs, blocks, appointments] = await Promise.all([
      this.publicRepository.findSchedulesByEmployees(employeeIds),
      this.publicRepository.findTimeOffByEmployees(employeeIds, windowStart, windowEnd),
      this.publicRepository.findBlocksByEmployees(employeeIds, windowStart, windowEnd),
      this.publicRepository.findAppointmentsByEmployees(employeeIds, windowStart, windowEnd)
    ]);

    const schedulesByKey = new Map<string, ScheduleEntry[]>();
    for (const schedule of schedules) {
      const key = `${schedule.employeeId}:${String(schedule.dayOfWeek)}`;
      const entries = schedulesByKey.get(key) ?? [];
      entries.push({
        employeeId: schedule.employeeId,
        dayOfWeek: schedule.dayOfWeek,
        start: parseTimeToMinutes(schedule.startTime),
        end: parseTimeToMinutes(schedule.endTime)
      });
      schedulesByKey.set(key, entries);
    }

    const timeOffByEmployee = new Map<string, { startDate: string; endDate: string }[]>();
    for (const timeOff of timeOffs) {
      const entries = timeOffByEmployee.get(timeOff.employeeId) ?? [];
      entries.push({ startDate: toDateStr(timeOff.startDate), endDate: toDateStr(timeOff.endDate) });
      timeOffByEmployee.set(timeOff.employeeId, entries);
    }

    const blocksByEmployee = new Map<string, DayBlock[]>();
    for (const block of blocks) {
      const entries = blocksByEmployee.get(block.employeeId) ?? [];
      entries.push({
        date: toDateStr(block.blockDate),
        start: parseTimeToMinutes(block.startTime),
        end: parseTimeToMinutes(block.endTime)
      });
      blocksByEmployee.set(block.employeeId, entries);
    }

    const appointmentsByEmployee = new Map<string, DayBlock[]>();
    for (const appointment of appointments) {
      const entries = appointmentsByEmployee.get(appointment.employeeId) ?? [];
      entries.push({
        date: toDateStr(appointment.appointmentDate),
        start: parseTimeToMinutes(appointment.startTime),
        end: parseTimeToMinutes(appointment.endTime)
      });
      appointmentsByEmployee.set(appointment.employeeId, entries);
    }

    const todayStr = toDateStr(todayInTimezone(timezone));
    const nowMinutes = nowMinutesInTimezone(timezone);
    const totalDays = Math.round((windowEnd.getTime() - windowStart.getTime()) / 86400000);

    const result = new Map<string, number[]>();

    for (let i = 0; i <= totalDays; i++) {
      const day = addDays(windowStart, i);
      const dateStr = toDateStr(day);
      const dayOfWeek = day.getUTCDay();
      const daySlots = new Set<number>();

      for (const employeeId of employeeIds) {
        const scheduleEntries = schedulesByKey.get(`${employeeId}:${String(dayOfWeek)}`) ?? [];

        if (scheduleEntries.length === 0) {
          continue;
        }

        const timeOffEntries = timeOffByEmployee.get(employeeId) ?? [];
        if (timeOffEntries.some((entry) => entry.startDate <= dateStr && entry.endDate >= dateStr)) {
          continue;
        }

        const dayBlocks = (blocksByEmployee.get(employeeId) ?? []).filter(
          (block) => block.date === dateStr
        );
        const dayAppointments = (appointmentsByEmployee.get(employeeId) ?? []).filter(
          (appointment) => appointment.date === dateStr
        );

        for (const schedule of scheduleEntries) {
          for (let start = schedule.start; start + duration <= schedule.end; start += interval) {
            const end = start + duration;

            if (dateStr === todayStr && start < nowMinutes) {
              continue;
            }

            if (dayBlocks.some((block) => block.start < end && block.end > start)) {
              continue;
            }

            if (
              dayAppointments.some(
                (appointment) => appointment.start < end && appointment.end > start
              )
            ) {
              continue;
            }

            daySlots.add(start);
          }
        }
      }

      if (daySlots.size > 0) {
        result.set(dateStr, [...daySlots].sort((a, b) => a - b));
      }
    }

    return result;
  }
}
