import { HomeStreakSerialization } from "../responses/home-streak.serialization";
import { faker } from '@faker-js/faker';
import { UserHomeYourDailyIntakeSerialization } from "../responses/user-home-your-daily-intake.serialization";

export class UserHomeService {
  private getDaysArray(startDate: Date, endDate: Date): string[] {
    const days = [];
    for (let day = startDate; day <= endDate; day.setDate(day.getDate() + 1)) {
      days.push(day.toLocaleString('en-US', { weekday: 'long' }).toLowerCase());
    }
    return days;
  }

  async getHomePageYourDailyIntake(_userId: string): Promise<UserHomeYourDailyIntakeSerialization>{
    const caloriesGoal = faker.number.int({ min: 29, max: 100 });
    const caloriesLeft = faker.number.int({ min: 0, max: caloriesGoal});
    const caloriesBurned = caloriesGoal - caloriesLeft;

    const carbsGoal = faker.number.int({ min: 29, max: 100 });
    const carbsConsumed = faker.number.int({ min: 0, max: carbsGoal });

    const proteinGoal = faker.number.int({ min: 29, max: 100 });
    const proteinConsumed = faker.number.int({ min: 0, max: proteinGoal });

    const fatGoal = faker.number.int({ min: 29, max: 100 });
    const fatConsumed = faker.number.int({ min: 0, max: fatGoal });

    return {
      caloriesGoal,
      caloriesLeft,
      caloriesBurned,
      carbsGoal,
      carbsConsumed,
      proteinGoal,
      proteinConsumed,
      fatGoal,
      fatConsumed,
    }
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
