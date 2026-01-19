const fs = require('fs');
const csv = require('csv-parser');

async function readWorkoutData(filepath) {
    return new Promise((resolve, reject) => {
        const results = [];

        fs.createReadStream(filepath)
            .pipe(csv())
            .on('data', (row) => {
                results.push(row);
            })
            .on('end', () => {
                resolve(results);
            })
            .on('error', (error) => {
                reject(error);
            });
    });
}

async function workoutCalculator(filepath) {
    try {
        const workoutData = await readWorkoutData(filepath);
        let totalWorkouts = workoutData.length;
        let totalMinutes = 0;
        for (let i = 0; i < workoutData.length; i++)
    {  
            const workout = workoutData[i];
            totalMinutes += parseFloat(workout.duration);
        }
        console.log(`Total workouts: ${totalWorkouts}`)
        console.log(`Total minutes: ${totalMinutes}`)
        return { totalWorkouts, totalMinutes};
    } catch(error) {
        if (error.code === 'ENOENT') {
            console.error(`Error: CSV File not found at ${filepath}`);
            throw new Error(`CSV File not found: ${filepath}`);
        } else {
            console.error(`Error reading or processing CSV file: ${error.message}`);
            throw new Error(`CSV file is corrupted or unreadable: ${error.message}`);
        }
    }
}

module.exports = { workoutCalculator }