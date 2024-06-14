const fetch = require('node-fetch').default;
const cron = require("node-cron");

(async () => {
    console.log('Cron is running');
    cron.schedule("0 */5 * * * *", async () => {
        try {
            console.log('Running test api to keep server running');
            const apiUrl = 'https://dev-oxf4.onrender.com/test'
            const response = await fetch(apiUrl);
            const data = await response.json();
            console.log('isServerRunning? ', data);
            return data;
        } catch (error) {
            console.log('Error in job', error);
            return {};
        }
    });
})();

