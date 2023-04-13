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

$w.onReady(function () {
	const userDetails = JSON.parse(session.getItem('user'));
	const sessionDetails = JSON.parse(session.getItem('session'));
	console.log({ userDetails, sessionDetails });
	if (!userDetails || !sessionDetails) return wixLocation.to('/login');
	$w('#tableContent').onItemReady(($item, itemData, index) => {
		$item('#serialNumberField').src = index;
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
