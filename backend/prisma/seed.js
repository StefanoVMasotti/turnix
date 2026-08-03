const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const businessId = "11111111-1111-4111-8111-111111111111";
const settingsId = "22222222-2222-4222-8222-222222222222";
const employeeId = "33333333-3333-4333-8333-333333333333";
const secondEmployeeId = "44444444-4444-4444-8444-444444444444";
const haircutServiceId = "55555555-5555-4555-8555-555555555555";
const beardServiceId = "66666666-6666-4666-8666-666666666666";
const clientId = "77777777-7777-4777-8777-777777777777";
const appointmentId = "88888888-8888-4888-8888-888888888888";
const scheduleIds = [
  "99999999-9999-4999-8999-999999999991",
  "99999999-9999-4999-8999-999999999992",
  "99999999-9999-4999-8999-999999999993",
  "99999999-9999-4999-8999-999999999994",
  "99999999-9999-4999-8999-999999999995",
  "99999999-9999-4999-8999-999999999996"
];

function time(value) {
  return new Date(`1970-01-01T${value}:00.000Z`);
}

async function main() {
  await prisma.business.upsert({
    where: { id: businessId },
    update: {
      name: "Turnix Demo",
      phone: "+54 11 5555-5555",
      email: "demo@turnix.app",
      address: "Av. Corrientes 1234"
    },
    create: {
      id: businessId,
      name: "Turnix Demo",
      phone: "+54 11 5555-5555",
      email: "demo@turnix.app",
      address: "Av. Corrientes 1234"
    }
  });

  await prisma.businessSettings.upsert({
    where: { businessId },
    update: {
      timezone: "America/Buenos_Aires",
      currency: "ARS",
      appointmentInterval: 30,
      maxBookingDays: 30
    },
    create: {
      id: settingsId,
      businessId,
      timezone: "America/Buenos_Aires",
      currency: "ARS",
      appointmentInterval: 30,
      maxBookingDays: 30
    }
  });

  await prisma.service.upsert({
    where: { id: haircutServiceId },
    update: {
      name: "Corte clásico",
      description: "Corte masculino tradicional.",
      durationMinutes: 30,
      price: "8000"
    },
    create: {
      id: haircutServiceId,
      businessId,
      name: "Corte clásico",
      description: "Corte masculino tradicional.",
      durationMinutes: 30,
      price: "8000"
    }
  });

  await prisma.service.upsert({
    where: { id: beardServiceId },
    update: {
      name: "Perfilado de barba",
      description: "Perfilado y terminación de barba.",
      durationMinutes: 30,
      price: "6000"
    },
    create: {
      id: beardServiceId,
      businessId,
      name: "Perfilado de barba",
      description: "Perfilado y terminación de barba.",
      durationMinutes: 30,
      price: "6000"
    }
  });

  await prisma.employee.upsert({
    where: { id: employeeId },
    update: {
      firstName: "Alex",
      lastName: "Ruiz",
      phone: "+54 11 5555-1111",
      email: "alex@turnix.app"
    },
    create: {
      id: employeeId,
      businessId,
      firstName: "Alex",
      lastName: "Ruiz",
      phone: "+54 11 5555-1111",
      email: "alex@turnix.app"
    }
  });

  await prisma.employee.upsert({
    where: { id: secondEmployeeId },
    update: {
      firstName: "Sofía",
      lastName: "Molina",
      phone: "+54 11 5555-2222",
      email: "sofia@turnix.app"
    },
    create: {
      id: secondEmployeeId,
      businessId,
      firstName: "Sofía",
      lastName: "Molina",
      phone: "+54 11 5555-2222",
      email: "sofia@turnix.app"
    }
  });

  await prisma.employeeService.upsert({
    where: {
      employeeId_serviceId: {
        employeeId,
        serviceId: haircutServiceId
      }
    },
    update: { active: true },
    create: {
      employeeId,
      serviceId: haircutServiceId
    }
  });

  await prisma.employeeService.upsert({
    where: {
      employeeId_serviceId: {
        employeeId: secondEmployeeId,
        serviceId: beardServiceId
      }
    },
    update: { active: true },
    create: {
      employeeId: secondEmployeeId,
      serviceId: beardServiceId
    }
  });

  const schedules = [
    { id: scheduleIds[0], employeeId, dayOfWeek: 1, startTime: time("09:00"), endTime: time("17:00") },
    { id: scheduleIds[1], employeeId, dayOfWeek: 2, startTime: time("09:00"), endTime: time("17:00") },
    { id: scheduleIds[2], employeeId, dayOfWeek: 3, startTime: time("09:00"), endTime: time("17:00") },
    { id: scheduleIds[3], employeeId: secondEmployeeId, dayOfWeek: 1, startTime: time("10:00"), endTime: time("18:00") },
    { id: scheduleIds[4], employeeId: secondEmployeeId, dayOfWeek: 2, startTime: time("10:00"), endTime: time("18:00") },
    { id: scheduleIds[5], employeeId: secondEmployeeId, dayOfWeek: 3, startTime: time("10:00"), endTime: time("18:00") }
  ];

  for (const schedule of schedules) {
    await prisma.employeeSchedule.upsert({
      where: { id: schedule.id },
      update: {
        employeeId: schedule.employeeId,
        dayOfWeek: schedule.dayOfWeek,
        startTime: schedule.startTime,
        endTime: schedule.endTime
      },
      create: schedule
    });
  }

  await prisma.client.upsert({
    where: { id: clientId },
    update: {
      firstName: "Cliente",
      lastName: "Demo",
      phone: "+54 11 5555-9999",
      email: "cliente.demo@turnix.app"
    },
    create: {
      id: clientId,
      businessId,
      firstName: "Cliente",
      lastName: "Demo",
      phone: "+54 11 5555-9999",
      email: "cliente.demo@turnix.app"
    }
  });

  await prisma.appointment.upsert({
    where: { id: appointmentId },
    update: {
      appointmentDate: new Date("2026-07-20T00:00:00.000Z"),
      startTime: time("10:00"),
      endTime: time("10:30"),
      status: "scheduled",
      bookingSource: "web"
    },
    create: {
      id: appointmentId,
      businessId,
      clientId,
      employeeId,
      serviceId: haircutServiceId,
      appointmentDate: new Date("2026-07-20T00:00:00.000Z"),
      startTime: time("10:00"),
      endTime: time("10:30"),
      status: "scheduled",
      bookingSource: "web"
    }
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
