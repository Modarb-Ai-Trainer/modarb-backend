import { Activity } from "@common/models/activity.model";
import { seederWrapper } from "seeder/helpers/seeder-wrapper";
import { User } from "@common/models/user.model";
import { Exercise } from "@common/models/exercise.model";
import { Meal } from "@common/models/meal.model";
import { ActivityType } from "@common/enums/activity-type.enum";
import moment from "moment";

export default seederWrapper(Activity, async () => {
    const users = await User.find().lean();
    const exercises = await Exercise.find().lean();
    const meals = await Meal.find().lean();
    const today = moment("2024-06-22"); 
    await Promise.all(users.map(async (user: any) => {
        for (let i = 0; i < 10; i++) {
            const createdAt = today.clone().subtract(i, 'days').toDate();
            // Create 10 exercise activities
            let exerciseActivity = new Activity({
                user_id: user._id,
                activity_type: ActivityType.EXERCISE,
                related_id: exercises[Math.floor(Math.random() * exercises.length)]._id,
                created_at: createdAt
            });
            await exerciseActivity.save();

            // Create 10 meal activities
            let mealActivity = new Activity({
                user_id: user._id,
                activity_type: ActivityType.MEAL,
                related_id: meals[Math.floor(Math.random() * meals.length)]._id,
                created_at: createdAt
            });
            await mealActivity.save();
        }
    }));
});
