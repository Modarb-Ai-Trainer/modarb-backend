import { AuthenticatableType } from "@common/enums/authenticatable-type.enum";
import { FitnessGoal } from "@common/enums/fitness-goal.enum";
import { FitnessLevel } from "@common/enums/fitness-level.enum";
import { Gender } from "@common/enums/gender.enum";
import { Injury } from "@common/enums/injury.enum";
import { PreferredDay } from "@common/enums/preferred-day.enum";
import { PreferredEquipment } from "@common/enums/preferred-equipment.enum";
import { WorkoutPlace } from "@common/enums/workout-place.enum";
import { IUser, User } from "@common/models/user.model";
import { seederWrapper } from "seeder/helpers/seeder-wrapper";

export default seederWrapper(User, async () => {
  // 10 users
  await Promise.all(Array.from({ length: 10 }, (_, i) => i).map(async function (i) {
    const o: IUser = {
      name: `User ${i}`,
      email: `user-${i}@app.com`,
      password: "password",
      image: `https://placehold.co/300x400`,
      gender: (i as number % 2 === 0) ?
        Gender.MALE :
        Gender.FEMALE,
      height: 170,
      weight: 70,
      fitness_level: [FitnessLevel.BEGINNER, FitnessLevel.INTERMEDIATE, FitnessLevel.ADVANCED][i % 3],
      preferences: {
        fitness_goal: [FitnessGoal.LOSE_WEIGHT, FitnessGoal.GAIN_MUSCLE, FitnessGoal.GET_FITTER][i % 3],
        target_weight: 60,
        workout_frequency: 3,
        preferred_days: [PreferredDay.MONDAY, PreferredDay.TUESDAY, PreferredDay.WEDNESDAY],
        workout_place: [WorkoutPlace.GYM, WorkoutPlace.HOME, WorkoutPlace.BOTH][i % 3],
        preferred_equipment: [[PreferredEquipment.BARBELLS, PreferredEquipment.DUMBBELLS, PreferredEquipment.GYM_MACHINES, PreferredEquipment.RESISTANCE_BAND, PreferredEquipment.BODYWEIGHT][i % 5]],
      },
      injuries: [[Injury.ARMS, Injury.BACK, Injury.NECK, Injury.SHOULDERS, Injury.KNEES][i % 5]],
      dob: new Date(1990, 1, 1),
      role: AuthenticatableType.USER,
    };
    await User.create(o);
  }))
})
