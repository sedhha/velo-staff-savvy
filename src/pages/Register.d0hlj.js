// eslint-disable-next-line @wix/cli/no-invalid-backend-import
import { signUpEmployees } from 'backend/authFunctions.jsw';

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
	infoText.text = message;
	infoText.expand();
};

$w.onReady(function () {
	// Add submit button click event
	$w('#signupButton').onClick(async () => {
		const firstName = $w('#firstName').value;
		const lastName = $w('#lastName').value;
		const emailAddress = $w('#emailInput').value;
		const employeeCode = $w('#employeeCode').value;
		const securePassword = $w('#passwordInput').value;
		const userType = $w('#selectionField').value;
		if (userType === '') {
			showErrorMessage('Please select a User type');
			return;
		}
		const isAdmin = $w('#selectionField').value === 'orgAdmin';
		const orgCode = '';
		showGeneralMessage("Hang on... We're signing you up!");
		signUpEmployees({
			firstName,
			lastName,
			emailAddress,
			employeeCode,
			securePassword,
			orgCode,
			isAdmin,
		})
			.then((res) => {
				console.log('Successfully added - ', res);
				if (res.error) showErrorMessage(res.message);
				else
					showSuccessMessage(
						`Congratulations ${firstName}! You can now go to login page and login!`
					);
			})
			.catch((err) => {
				console.error('Error adding - ', err);
				showErrorMessage(err.message);
			});
	});
});
