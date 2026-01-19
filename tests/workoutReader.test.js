const { workoutCalculator } = require('../workoutReader.js');
const fs = require('fs')
const { Readable } = require('stream');

jest.mock('fs');

describe('workoutCalculator', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    test('reads a valid CSV file and calculates totals', async () => {
        const mockCSV = 'date,exercise,duration\n2024-01-01,Running,30\n2024-01-02,Cycling,45';
        const mockStream = new Readable({
            read() {}
        });
        mockStream.push(mockCSV);
        mockStream.push(null);

        fs.createReadStream.mockReturnValue(mockStream);

        const result = await workoutCalculator('./data/workouts.csv');

        expect(result.totalWorkouts).toBe(2);
        expect(result.totalMinutes).toBe(75);
    });

    test('throws error when file is missing', async () => {
        fs.createReadStream.mockImplementation(() => {
            const error = new Error('File not found');
            error.code = 'ENOENT';
            throw error;
        });

        await expect(workoutCalculator('./missing.csv'))
        .rejects
        .toThrow(/CSV File not found/);
    });

    test('return correct data structure', async () => {
        const mockCSV = 'date,exercise,duration\n2024-01-01,Running,30';

        const mockStream = new Readable({
            read() {}
        });
        mockStream.push(mockCSV);
        mockStream.push(null);

        fs.createReadStream.mockReturnValue(mockStream);

        const result = await workoutCalculator('./data/workouts.csv')
        expect(result).toHaveProperty('totalWorkouts');
        expect(result).toHaveProperty('totalMinutes');
        expect(typeof result.totalWorkouts).toBe('number');
        expect(typeof result.totalMinutes).toBe('number');
    });

    test('handles empty CSV file', async () => {
        const mockCSV = 'date,exercise,duration\n';

        const mockStream = new Readable({
            read() {}
        });
        mockStream.push(mockCSV);
        mockStream.push(null);

        fs.createReadStream.mockReturnValue(mockStream);

        const result = await workoutCalculator('./data/workouts.csv');
        expect(result.totalWorkouts).toBe(0);
        expect(result.totalMinutes).toBe(0);
    });
});
