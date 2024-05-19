import { UserRegisteredWorkout } from "@common/models/user-registered-workout.model";
import { seederWrapper } from "seeder/helpers/seeder-wrapper";
import { User } from "@common/models/user.model";
import { Workout } from "@common/models/workout.model";

export default seederWrapper(UserRegisteredWorkout, async () => {
  const users = await User.find().lean();

  await Promise.all(users.map(async (user: any) => {
    const workouts = await Workout.find({
      fitness_level: user.fitness_level,
      fitness_goal: user.preferences.fitness_goal,
    }).lean();
    let index = Math.floor(Math.random() * workouts.length);
    const userRegisteredWorkout = new UserRegisteredWorkout({
      user: user._id,
      workout: workouts[index]._id,
      is_active: true,
      weeks: workouts[index].template_weeks
    });
    await userRegisteredWorkout.save();
  }));

});

