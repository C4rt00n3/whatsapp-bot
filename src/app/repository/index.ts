import { PrismaClient } from "@prisma/client";
import { sendMessage } from "../robots/functions";

export class PhoneNumber {
  number: string;
  name: string;
  date_now?: Date;
  count_use?: number;

  constructor(
    number: string,
    name: string,
    date_now?: Date,
    count_use?: number
  ) {
    this.number = number;
    this.date_now = date_now;
    this.count_use = count_use;
    this.name = name;
  }
}

export class Service {
  prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async findOrCreate(number: string, name: string): Promise<PhoneNumber> {
    const phoneNumberObject = new PhoneNumber(number, name);
    const find = await this.prisma.numberPhone.findUnique({
      where: {
        number,
      },
    });

    if (!find) {
      const phoneNumber = await this.prisma.numberPhone.create({
        data: {
          name: phoneNumberObject.name,
          number: phoneNumberObject.number,
          date_now: new Date(),
        },
      });

      sendMessage(
        number,
        "Lista de comandos:\n 1) /imagine | Ele criar uma imagen de acordo com  oque você escreve apos o comando. \n 2) /dev | Recebe informações do meu desenvolvedor."
      );

      return phoneNumber;
    } else {
      if (this.isSameDay(find.date_now, new Date())) {
        this.updateCount(number, name, find.conut_use! + 1);
      } else {
        this.updateCount(number, name, 0);
      }
    }

    return find;
  }

  updateCount(
    number: string,
    name: string,
    count: number
  ): Promise<PhoneNumber> {
    const data =
      count == 0
        ? {
            conut_use: count,
            date_now: new Date(),
          }
        : { conut_use: count };

    const phoneNumber = this.prisma.numberPhone.update({
      data,
      where: {
        number,
        name,
      },
    });

    return phoneNumber;
  }

  isSameDay(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }
}
