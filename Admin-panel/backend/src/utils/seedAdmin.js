const mongoose = require('mongoose');
const User = require('../models/User');

// Ensures the default SuperAdmin exists. Idempotent.
async function seedAdminUser() {
	// Wait until mongoose connection is ready
	if (mongoose.connection.readyState !== 1) {
		await new Promise((resolve) => {
			mongoose.connection.once('open', resolve);
		});
	}

	const adminEmail = 'admin@rapidaid.com';
	const defaultPassword = 'password123';

	const existing = await User.findOne({ email: adminEmail });
	if (existing) {
		return; // already present; do nothing
	}

	await User.create({
		name: 'Admin User',
		email: adminEmail,
		password: defaultPassword,
		role: 'SuperAdmin',
		status: 'active'
	});
}

module.exports = seedAdminUser;


