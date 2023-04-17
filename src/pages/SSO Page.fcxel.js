/* eslint-disable @wix/cli/no-invalid-backend-import */
import { loginUser } from 'backend/authFunctions.jsw';
import { session } from 'wix-storage';
import wixLocation from 'wix-location';

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
$w.onReady(function () {
	const query = wixLocation.query;
	const { redirectAfterSuccess } = query;
	if (!redirectAfterSuccess) return wixLocation.to('/login');
	$w('#loginButton').onClick(() => {
		const email = $w('#emailInput').value;
		const password = $w('#passwordInput').value;

		if (!email.length || !password.length)
			return showErrorMessage('Email or password cannot be empty');
		showGeneralMessage('Checking info and connecting to custom SSO server...');
		loginUser({ email, password })
			.then((data) => {
				console.log({ data });
				if (data.error) return showErrorMessage(data.message);
				const { firstName } = data.data.data.user.user_metadata;
				if (data.data.data.user) {
					session.setItem('user', JSON.stringify(data.data.data.user));
					session.setItem('session', JSON.stringify(data.data.data.session));
					const access = (
						data.data.data.user.user_metadata.orgAdmin
							? [-1]
							: data.data.data.access
					).join('__');
					console.log({
						redirectAfterSuccess,
						x:
							'http://localhost:3000' +
							'?secretToken=' +
							new Date().getTime() +
							'&accessToken=' +
							access,
					});
					showSuccessMessage(
						`Hello ${firstName}. SSO authentication successful. Redirecting you to the other URL.`
					);

					return wixLocation.to(
						'http://localhost:3000' +
							'?secretToken=' +
							new Date().getTime() +
							'&accessToken=' +
							access
					);
				}

				return showSuccessMessage(
					`Hello ${firstName}. Your Signin was successful but we need to link you to dashboard profile pages! Stay tuned :)`
				);
			})
			.catch((error) => showErrorMessage(error.message));
	});
});
