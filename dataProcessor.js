require('dotenv').config();
const { healthMetricsCounter } = require('./healthReader.js');
const { workoutCalculator } = require('./workoutReader.js');

async function processFiles() {
    try {
        const userName = process.env.USER_NAME;
        const weeklyGoal = parseInt(process.env.WEEKLY_GOAL);

        console.log(`Processing data for: ${userName}`);

        console.log(`📁 Reading workout data...`);
        const workoutData = await workoutCalculator('./data/workouts.csv');
        console.log(`📁 Reading health data...`);
        const healthData = await healthMetricsCounter('./data/health-metrics.json');

        console.log('\n=== SUMMARY ===');
        console.log(`Workouts found: ${workoutData.totalWorkouts}`);
        console.log(`Total workout minutes: ${workoutData.totalMinutes}`);
        console.log(`Health entries found: ${healthData}`);
        console.log(`Weekly goal: ${weeklyGoal} minutes`);

        if (workoutData.totalMinutes >= weeklyGoal) {
            console.log(`🎉 Congratulations ${userName}! You have exceeded your weekly goal! `)
        } else {
            const remaining = weeklyGoal - workoutData.totalMinutes
            console.log(`Keep going ${userName}! You need ${remaining} more minutes to reach your goal.`)
        }
    } catch(error) {
        console.error(`Error processing files: ${error.message}`)
        console.error(`Please check that all data files exist and are properly formatted.`)
        process.exit(1)
    }
}

processFiles();