// API Reference: https://www.wix.com/velo/reference/api-overview/introduction
// “Hello, World!” Example: https://learn-code.wix.com/en/article/1-hello-world
import { session } from 'wix-storage';
import wixLocation from 'wix-location';
import { getRequestHistory } from 'backend/userFunctions.jsw';

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

$w.onReady(function () {
	const token = initSession();
	getRequestHistory(token)
		.then(({ data, error, message, redirect }) => {
			if (error) {
				console.error('Error = ', error, message);
				if (redirect) return wixLocation.to('/login');
				return showErrorMessage(
					message ?? 'Unexpected error occured. Please reload the page.'
				);
			}
			console.log('Data - ', data);
			$w('#tableContent').data = data.map((item) => ({
				...item,
				_id: item.requestID,
			}));
		})
		.catch((err) => {
			console.error('Error ', err);
			showErrorMessage(err.message);
		});

	$w('#tableContent').onItemReady(($item, data) => {
		console.log('Data = ', data);
		$item('#primaryCategoryField').text = data.primaryCategory;
		$item('#secondaryCategoryField').text = data.secondaryCategory;
		$item('#remarks').text = data.remarks;
		$item('#pending').text = data.approved !== true ? 'Pending' : 'Approved';
	});

	$w('#tableContent').data = [];
});
