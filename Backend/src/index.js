import app from './server.js';
import { host, port } from './config.js';
import { makeDatabase } from '../dummyDataGenerator/dummyDataGenerator.js';
app.listen(port, host, async () => {
	await makeDatabase();
	console.log(`Database connected!\nrunning on http://${host}:${port}`);
});
