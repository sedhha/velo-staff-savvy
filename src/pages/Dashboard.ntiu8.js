/* eslint-disable @wix/cli/no-invalid-backend-import */
import { session } from 'wix-storage';
import wixLocation from 'wix-location';
const staticData = [
	{
		_id: '0',
		firstName: 'John',
		lastName: 'Doe',
		email: 'john@example.com',
		activeProfile: true,
	},
	{
		_id: '1',
		firstName: 'John',
		lastName: 'Doe',
		email: 'john@example.com',
		activeProfile: false,
	},
];

const initSession = () => {
	const userDetails = JSON.parse(session.getItem('user'));
	const sessionDetails = JSON.parse(session.getItem('session'));
	if (!userDetails || !sessionDetails) return wixLocation.to('/login');
	if (!userDetails.user_metadata.orgAdmin)
		return wixLocation.to('/dashboard-users');
	$w('#nameField').text = `Hello ${
		userDetails.user_metadata.firstName ?? 'Guest'
	}`;
	return sessionDetails.access_token;
};

$w.onReady(function () {
	initSession();
	$w('#tableContent').onItemReady(($item, itemData, index) => {
		$item('#serialNumberField').text = index;
		$item('#firstNameInput').text = itemData.firstName;
		$item('#lastNameInput').text = itemData.lastName;
		$item('#existingPermissionsInput').text = itemData.email;
		$item('#activeProfileSwitch').checked = itemData.activeProfile;
		$item('#activeProfileSwitch').onChange((e) => {
			console.log('New value  = ', e.target.checked);
		});
	});
	$w('#tableContent').data = staticData;
});
