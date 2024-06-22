import { Workout } from "@common/models/workout.model";
import { seederWrapper } from "seeder/helpers/seeder-wrapper";
import { Exercise } from "@common/models/exercise.model";
import { FitnessLevel } from "@common/enums/fitness-level.enum";
import { FitnessGoal } from "@common/enums/fitness-goal.enum";
import { Place } from "@common/enums/place.enum";

export default seederWrapper(Workout, async () => {
  // 10 workouts
  await Promise.all(Array.from({ length: 10 }, (_, i) => i).map(async function (i) {
    const exercisesDuration = await Exercise.find(
      {
        duration: { $gt: 0 },
        sets: { $exists: false },
        reps: { $exists: false },
      }
    ).limit(4).skip(i*4).lean();

    const exercisesReps = await Exercise.find(
      {
        duration: 0,
        sets: { $gt: 0 },
        reps: { $gt: 0 }
      }
    ).limit(4).skip(i*4).lean();

    const o = {
      name: `Workout - ${i}`,
      description: `Workout - ${i} description`,
      type: 'Equipment Diversity',
      image: `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvEFvhT6PV5u-yCaY5lJRtySenHFAJquCb7BHcmuMwW5hSVVoWYH0DU2eCXoKn6yMYqH0&usqp=CAU`,
      fitness_level: [FitnessLevel.BEGINNER, FitnessLevel.INTERMEDIATE, FitnessLevel.ADVANCED][i % 3],
      fitness_goal: [FitnessGoal.LOSE_WEIGHT, FitnessGoal.GAIN_MUSCLE, FitnessGoal.GET_FITTER][i % 3],
      place: [Place.GYM, Place.HOME][i % 2],
      min_per_day: 30,
      total_number_days: 4,
      template_weeks: [
        {
          week_number: 1,
          week_name: 'Week 1',
          week_description: 'Week 1 description',
          days: [
            {
              day_number: 1,
              total_number_exercises: 2,
              day_type: 'full_body',
              exercises: [
                exercisesDuration.slice(0, 1).map((e: any) => e._id),
                exercisesReps.slice(0, 1).map((e: any) => e._id)
              ]
            },
            {
              day_number: 2,
              total_number_exercises: 2,
              day_type: 'full_body',
              exercises: [
                exercisesDuration.slice(1, 2).map((e: any) => e._id),
                exercisesReps.slice(1, 2).map((e: any) => e._id)
              ]
            },
          ]
        },
        {
          week_number: 2,
          week_name: 'Week 2',
          week_description: 'Week 2 description',
          days: [
            {
              day_number: 1,
              total_number_exercises: 2,
              day_type: 'full_body',
              exercises: [
                exercisesDuration.slice(2, 3).map((e: any) => e._id),
                exercisesReps.slice(2, 3).map((e: any) => e._id)
              ]
            },
            {
              day_number: 2,
              total_number_exercises: 2,
              day_type: 'full_body',
              exercises: [
                exercisesDuration.slice(3, 4).map((e: any) => e._id),
                exercisesReps.slice(3, 4).map((e: any) => e._id)
              ]
            },
          ]
        }
      ],
      isDeleted: false,
    };
    await Workout.create(o);
  }))
})
