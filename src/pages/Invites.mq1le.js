/* eslint-disable @wix/cli/no-invalid-backend-import */
import { session } from 'wix-storage';
import wixLocation from 'wix-location';
import {
	generateMagicLink,
	getAllPendingCode,
	revokeAMagicCode,
} from 'backend/adminFunctions.jsw';

const showErrorMessage = (message) => {
	const infoText = $w('#infoText');
	infoText.html = `<p style='color:red;'>${message}</p>`;
	infoText.expand();
	infoText.show();
};
const showSuccessMessage = (message) => {
	const infoText = $w('#infoText');
	infoText.html = `<p style='color:green;'>${message}</p>`;
	infoText.expand();
	infoText.show();
};

const showGeneralMessage = (message) => {
	const infoText = $w('#infoText');
	infoText.html = `<p style='color:black;'>${message}</p>`;
	infoText.expand();
	infoText.show();
};

let magicLinks = [];

const fetchMagicLinks = (access_token) => {
	getAllPendingCode(access_token)
		.then(({ data }) => {
			$w('#tableContent').data = [
				...data.map((item, id) => ({
					...item,
					_id: `${id + 1 < 10 ? '0' : ''}${id + 1}`,
				})),
			];
		})
		.catch((err) => showErrorMessage(err.message));
};

const initSession = () => {
	const userDetails = JSON.parse(session.getItem('user'));
	const sessionDetails = JSON.parse(session.getItem('session'));
	if (!userDetails || !sessionDetails) return wixLocation.to('/login');
	if (!userDetails.user_metadata.orgAdmin)
		return wixLocation.to('/dashboard-users');
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

$w.onReady(function () {
	const token = initSession();

	$w('#generateMagicLink').onClick(() => {
		showGeneralMessage('Generating magic link, please wait...');
		generateMagicLink(token)
			.then((res) => {
				console.log('Res - ', res);
				$w('#magicLinkField').value = res.magicLink || '';
				showSuccessMessage(
					'Link generated successfully. Select the prompt and copy it.'
				);
				fetchMagicLinks(token);
			})
			.catch((err) => {
				console.log('Error - ', err);
				showErrorMessage(err.message);
			});
	});
	fetchMagicLinks(token);

	$w('#tableContent').onItemReady(($item, itemData, index) => {
		$item('#serialNumberField').text = `${index + 1 < 10 ? '0' : ''}${
			index + 1
		}`;
		$item('#magicCodeField').text = itemData.employeeCode;
		$item('#revokeButton').onClick(() => {
			$item('#revokeButton').hide();
			$item('#revokingText').show();
			revokeAMagicCode(token, itemData.employeeCode)
				.then((res) => {
					if (!res.error) {
						showSuccessMessage(res.message);
						fetchMagicLinks(token);
					} else {
						if (res.message === '401:jwt expired') wixLocation.to('/login');
						console.log('Comes here - ', res.message);
						showErrorMessage(res.message);
					}
					$item('#revokingText').hide();
					$item('#revokeButton').show();
				})
				.catch((err) => {
					showErrorMessage(err.message);
					$item('#revokeButton').show();
				});
		});
	});
	$w('#tableContent').data = magicLinks;
});
