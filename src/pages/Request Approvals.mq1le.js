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
};
const showSuccessMessage = (message) => {
	const infoText = $w('#infoText');
	infoText.html = `<p style='color:green;'>${message}</p>`;
	infoText.expand();
};

const showGeneralMessage = (message) => {
	const infoText = $w('#infoText');
	infoText.html = `<p style='color:black;'>${message}</p>`;
	infoText.expand();
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

$w.onReady(function () {
	const userDetails = JSON.parse(session.getItem('user'));
	const sessionDetails = JSON.parse(session.getItem('session'));
	if (!userDetails || !sessionDetails) return wixLocation.to('/login');

	$w('#generateMagicLink').onClick(() => {
		showGeneralMessage('Generating magic link, please wait...');
		generateMagicLink(sessionDetails.access_token)
			.then((res) => {
				console.log('Res - ', res);
				$w('#magicLinkField').value = res.magicLink || '';
				showSuccessMessage(
					'Link generated successfully. Select the prompt and copy it.'
				);
				fetchMagicLinks(sessionDetails.access_token);
			})
			.catch((err) => {
				console.log('Error - ', err);
				showErrorMessage(err.message);
			});
	});
	fetchMagicLinks(sessionDetails.access_token);

	$w('#tableContent').onItemReady(($item, itemData, index) => {
		$item('#serialNumberField').text = `${index + 1 < 10 ? '0' : ''}${
			index + 1
		}`;
		$item('#magicCodeField').text = itemData.employeeCode;
		$item('#revokeButton').onClick(() => {
			$item('#revokeButton').hide();
			$item('#revokingText').show();
			revokeAMagicCode(sessionDetails.access_token, itemData.employeeCode)
				.then((res) => {
					if (!res.error) {
						showSuccessMessage(res.message);
						fetchMagicLinks(sessionDetails.access_token);
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
