/* eslint-disable @wix/cli/no-invalid-backend-import */
import { session } from 'wix-storage';
import wixLocation from 'wix-location';
import { generateMagicLink } from 'backend/adminFunctions.jsw';

$w.onReady(function () {
	const userDetails = JSON.parse(session.getItem('user'));
	const sessionDetails = JSON.parse(session.getItem('session'));
	console.log({ userDetails, sessionDetails });
	if (!userDetails || !sessionDetails) return wixLocation.to('/login');

	$w('#generateMagicLink').onClick(() => {
		generateMagicLink(sessionDetails.access_token)
			.then((res) => console.log('Res - ', res))
			.catch((err) => console.log('Error - ', err));
	});
});
