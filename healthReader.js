const fs = require('fs/promises');

async function healthMetricsCounter(filepath) {
    try {    
        const data = await fs.readFile(filepath, 'utf8');
        const healthData = JSON.parse(data);
        const totalEntries = healthData.metrics.length;

        console.log(`Total health entries: ${totalEntries}`);
        return totalEntries;
    } catch (error) {
        if (error.code === 'ENOENT') {
            console.error(`Error: File not found at ${filepath}`);
            throw new Error(`File not found: ${filepath}`);
        } else if (error instanceof SyntaxError) {
            console.error(`Error: Invalid JSON format in ${filepath}`);
            throw new Error(`Error: Invalid JSON format in ${filepath}`);
        } else {
            console.error(`Unknown error reading health data: ${error.message}`);
            throw error;
        }
    }
}

module.exports = { healthMetricsCounter };