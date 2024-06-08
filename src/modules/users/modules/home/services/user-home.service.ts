import { HomeStreakSerialization } from "../responses/home-streak.serialization";
import { faker } from '@faker-js/faker';

export class UserHomeService {
  private getDaysArray(startDate: Date, endDate: Date): string[] {
    const days = [];
    for (let day = startDate; day <= endDate; day.setDate(day.getDate() + 1)) {
      days.push(day.toLocaleString('en-US', { weekday: 'long' }).toLowerCase());
    }
    return days;
  }

  async getHomePageStreak(_userId: string, startDate: Date, endDate: Date): Promise<HomeStreakSerialization> {
    // list day names in between the start and end date
    const days = this.getDaysArray(startDate, endDate);

    return {
      days: days.map(day => ({
        day: day,
        points: faker.number.int({ min: 0, max: 100 }),
      })),
    }
  }
}
