// API Reference: https://www.wix.com/velo/reference/api-overview/introduction
// “Hello, World!” Example: https://learn-code.wix.com/en/article/1-hello-world
import { session } from 'wix-storage';
import wixLocation from 'wix-location';

const initSession = () => {
	const userDetails = JSON.parse(session.getItem('user'));
	const sessionDetails = JSON.parse(session.getItem('session'));
	if (!userDetails || !sessionDetails) return wixLocation.to('/login');
	if (userDetails.user_metadata.orgAdmin)
		return wixLocation.to('/admin-dashboard');
	$w('#nameField').text = `Hello ${
		userDetails.user_metadata.firstName ?? 'Guest'
	}`;
	return sessionDetails.access_token;
};

$w.onReady(function () {
	// Write your JavaScript here
	// To select an element by ID use: $w('#elementID')
	// Click 'Preview' to run your code
	initSession();
});
