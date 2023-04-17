// API Reference: https://www.wix.com/velo/reference/api-overview/introduction
// “Hello, World!” Example: https://learn-code.wix.com/en/article/1-hello-world
import { session } from 'wix-storage';
import wixLocation from 'wix-location';
import { getFieldValues, requestAccess } from 'backend/userFunctions.jsw';

const initSession = () => {
	const userDetails = JSON.parse(session.getItem('user'));
	const sessionDetails = JSON.parse(session.getItem('session'));
	if (!userDetails || !sessionDetails) return wixLocation.to('/login');
	if (userDetails.user_metadata.orgAdmin)
		return wixLocation.to('/admin-dashboard');
		const name = userDetails.user_metadata.firstName ?? 'Guest';
		$w('#nameField').text = `Hello ${name}, Not ${name}?`;
		$w('#logOutButton').show();
		$w('#logOutButton').onClick(() => {
			session.removeItem('user');
			session.removeItem('session');
			return wixLocation.to('/login');
		});
	return sessionDetails.access_token;
};

const showErrorMessage = (message) => {
	const infoText = $w('#infoText');
	infoText.html = `<p style='color:red;'>${message}</p>`;
	infoText.show();
};
const showSuccessMessage = (message) => {
	const infoText = $w('#infoText');
	infoText.html = `<p style='color:green;'>${message}</p>`;
	infoText.show();
};

const showGeneralMessage = (message) => {
	const infoText = $w('#infoText');
	infoText.html = `<p style='color:black;'>${message}</p>`;
	infoText.show();
};

let completeData = {};
$w.onReady(function () {
	// Write your JavaScript here
	// To select an element by ID use: $w('#elementID')
	// Click 'Preview' to run your code
	const token = initSession();
	getFieldValues(token)
		.then(({ data, error, message, redirect }) => {
			if (error) {
				if (redirect) return wixLocation.to('/login');
				return showErrorMessage(
					message ?? 'Unexpected error occured. Please reload the page.'
				);
			}
			const primaryKeys = Object.keys(data).map((item) => ({
				label: item,
				value: item,
			}));
			completeData = { ...data };
			$w('#primaryCategory').options = [...primaryKeys];
		})
		.catch((err) => {
			console.error('Error ', err);
			showErrorMessage(err.message);
		});
	$w('#primaryCategory').onChange((e) => {
		$w('#optionsField').options = [...completeData[e.target.value]];
	});

	$w('#requestButton').onClick(() => {
		const accessID = $w('#optionsField').value;
		const remarks = $w('#remarksField').value;
		showGeneralMessage('Please wait while we add the request...');
		requestAccess(token, { accessID, remarks })
			.then(({ data, error, redirect, message }) => {
				if (redirect) return wixLocation.to('/login');
				if (error)
					return showErrorMessage(message ?? 'Unexpected error occured');
				return showSuccessMessage(
					'Request made successfully. Track it in your history.'
				);
			})
			.catch((err) => showErrorMessage(err.message));
	});
});
