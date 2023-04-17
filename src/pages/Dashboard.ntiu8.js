import { session } from 'wix-storage';
import wixLocation from 'wix-location';
import {
	getOrgSSOToken,
	generateNewSSOToken,
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

const onClickShowSSOButton = () => {
	const isPasswordField = $w('#ssoIDField').inputType === 'password';
	if (isPasswordField) {
		$w('#ssoIDField').inputType = 'text';
		$w('#revealButton').label = 'Hide Code';
	} else {
		$w('#ssoIDField').inputType = 'password';
		$w('#revealButton').label = 'Reveal Code';
	}
};

const getSSOToken = async (
	token,
	generateNew = false,
	message = 'Revoking SSO Token',
	successMessage = 'Successfully revoked the old token and generated new one!'
) => {
	if (generateNew) showGeneralMessage(message);
	getOrgSSOToken(token).then(({ data, error, redirect, message }) => {
		if (redirect) return wixLocation.to('/login');
		if (error) return showErrorMessage(message);
		if (generateNew) showSuccessMessage(successMessage);
		if (data.ssoID) enableSSOIDFields(data.ssoID);
	});
};

const enableSSOIDFields = (ssoID) => {
	$w('#ssoIDField').show();
	$w('#revokeCode').show();
	$w('#revealButton').show();
	$w('#generateSSOButton').hide();
	$w('#ssoIDField').value = ssoID;
};

$w.onReady(function () {
	const token = initSession();
	getOrgSSOToken(token).then(({ data, error, redirect, message }) => {
		if (redirect) return wixLocation.to('/login');
		if (error) return showErrorMessage(message);
		if (data.ssoID) return enableSSOIDFields(data.ssoID);
		else $w('#generateSSOButton').show();
	});
	$w('#revealButton').onClick(onClickShowSSOButton);
	$w('#revokeCode').onClick(() => getSSOToken(token, true));
	$w('#generateSSOButton').onClick(() => {
		$w('#generateSSOButton').hide();
		showGeneralMessage(
			'Generating SSO token for very first time... Please wait...'
		);
		generateNewSSOToken(token).then(({ data, error, message, redirect }) => {
			if (redirect) return wixLocation.to('/login');
			if (error) return showErrorMessage(message);
			if (data.ssoID) {
				showSuccessMessage(
					'Successfully generated new SSO token. You can use this token to integrate with custom apps'
				);
				return enableSSOIDFields(data.ssoID);
			}
		});
	});
});
