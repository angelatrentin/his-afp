import {pool} from "./dbSession.js";
import {catchAsync} from "../utils/errorHandler.js";

export const retrieveHealthStatusFn = catchAsync(async (req, res) => {
	try {
		const dbStatus = await pool.query('SELECT 1');
		res.status(200).json({
			status: 'success',
			data: {
				service: 'UP',
				database: dbStatus.rowCount === 1 ? 'CONNECTED' : 'DISCONNECTED',
				uptime: process.uptime()
			}
		});
	} catch (err) {
		res.status(503).json({
			status: 'error',
			data: {
				service: 'UP',
				database: 'DISCONNECTED',
				uptime: process.uptime()
			},
			message: err.message
		});
	}


});