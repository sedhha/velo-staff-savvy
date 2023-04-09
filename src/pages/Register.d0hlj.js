// API Reference: https://www.wix.com/velo/reference/api-overview/introduction
// “Hello, World!” Example: https://learn-code.wix.com/en/article/1-hello-world

const activeStyle = { color: 'white', background: 'black' };
const inactiveStyle = { color: 'black', background: 'white' };

$w.onReady(function () {
    // Get references to the buttons
    const signupButton = $w('#signUpButton');

    signupButton.onClick(() => {
        const firstName = $w('#firstNameFormInput').value;
        const lastName = $w('#firstNameFormInput').value;
        const emailAddress = $w('#emailFormInput').value;
        const orgCode = $w('#emailFormInput').value;
        const employeeCode = $w('#employeeCodeFormInput').value;
        const securePassword = $w('#passwordFormInput').value;
        console.log({ firstName, lastName, emailAddress, orgCode, employeeCode, securePassword })

    })


});
