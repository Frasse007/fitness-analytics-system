const { healthMetricsCounter} = require('../healthReader.js');
const fs = require('fs/promises');

jest.mock('fs/promises');

describe('test healthMetricsCounter', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('reads a valid JSON file and coutns metrics', async () => {
        const mockJSON = JSON.stringify({
            metrics: [
                { date: '2024-01-01', heartRate: 72, steps: 8000 },
                { date: '2024-01-02', heartRate: 75, steps: 10000},
                { date: '2024-01-03', heartRate: 70, steps: 9500 }
            ]
        });

        fs.readFile.mockResolvedValue(mockJSON);

        const result = await healthMetricsCounter('./data/health-metrics.json');

        expect(result).toBe(3);
        expect(typeof  result).toBe('number');
    });

    test('throws error when file is missing', async () => {
        const error = new Error('File not found');
        error.code = 'ENOENT';
        fs.readFile.mockRejectedValue(error);

        await expect(healthMetricsCounter('./missing.json'))
            .rejects
            .toThrow(/File not found/);
    });

    test('throws error when JSON is invalid', async () => {
        const invalidJSON = '{ metrics: [invalid json}';
        fs.readFile.mockResolvedValue(invalidJSON);

        await expect(healthMetricsCounter('./data/health-metrics.json'))
            .rejects
            .toThrow(/Invalid JSON format/);
    });

    test('return correct data type', async () => {
        const mockJSON = JSON.stringify({
            metrics: [
                { date: '2024-01-01', heartRate: 72, steps: 8000 }
            ]
        });

        fs.readFile.mockResolvedValue(mockJSON);

        const result = await healthMetricsCounter('./data/health-metrics.json');
        expect(typeof result).toBe('number');
    });

    test('handles empty metrics array', async () => {
        const mockJSON = JSON.stringify({
            metrics: []
        });

        fs.readFile.mockResolvedValue(mockJSON);

        const result = await healthMetricsCounter('./data/health-metrics.json');
        expect(result).toBe(0);
    });
});