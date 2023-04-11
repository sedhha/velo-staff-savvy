// eslint-disable-next-line @wix/cli/no-invalid-backend-import
import { signUpEmployees } from 'backend/authFunctions.jsw';

$w.onReady(function () {
	// Add submit button click event
	$w('#signupButton').onClick(() => {
		const firstName = $w('#firstName').value;
		const lastName = $w('#firstName').value;
		const emailAddress = $w('#emailInput').value;
		const employeeCode = $w('#employeeCode').value;
		const securePassword = $w('#passwordInput').value;
		const orgCode = '';
		console.log('Requesting secure password for employee');
		signUpEmployees({
			firstName,
			lastName,
			emailAddress,
			employeeCode,
			securePassword,
			orgCode,
		})
			.then((res) => {
				console.log('Successfully added - ', res);
			})
			.catch((err) => {
				console.error('Error adding - ', err);
			});
	});
});
