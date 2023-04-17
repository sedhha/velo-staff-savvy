// API Reference: https://www.wix.com/velo/reference/api-overview/introduction
// “Hello, World!” Example: https://learn-code.wix.com/en/article/1-hello-world
import { session } from 'wix-storage';
import wixLocation from 'wix-location';
import { getAllAccesses, addAccess } from 'backend/adminFunctions.jsw';

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

const alterExistingAccess = (show = true) => {
	if (!show) {
		$w('#existingAccessHeader').hide();
		$w('#existingAccessHeader').collapse();
		$w('#existingAccessBody').hide();
		$w('#existingAccessBody').collapse();
	} else {
		$w('#existingAccessHeader').show();
		$w('#existingAccessHeader').expand();
		$w('#existingAccessBody').show();
		$w('#existingAccessBody').expand();
	}
};

const switchViews = (hideForm = false) => {
	if (hideForm) {
		$w('#addAccessContainer').hide();
		$w('#addAccessContainer').collapse();
		alterExistingAccess();
		$w('#cancelButton').hide();
		return;
	}
	alterExistingAccess(false);
	$w('#addAccessContainer').show();
	$w('#addAccessContainer').expand();
	$w('#cancelButton').show();
};

let rootData = [];

const getAccessCB = async (accessToken) =>
	getAllAccesses(accessToken).then(({ data, redirect, message, error }) => {
		if (redirect) return wixLocation.to('/login');
		else if (error) return showErrorMessage(message);
		rootData = data.data.map((item, index) => ({
			...item,
			_id: `${index + 1}`,
		}));
		$w('#primaryCategoryFilter').options = [
			...data.categories.primaryCategories,
		];
		$w('#secondaryCategoryFilter').options = [
			...data.categories.secondaryCategories,
		];
	});

$w.onReady(function () {
	const accessToken = initSession();
	getAccessCB(accessToken).then(() => {
		$w('#tableContent').data = [...rootData];
	});
	$w('#tableContent').onItemReady(($item, itemData) => {
		$item('#primaryCategory').text = itemData.primaryCategory;
		$item('#secondaryCategory').text = itemData.secondaryCategory;
		$item('#description').text = itemData.description;
	});
	$w('#tableContent').data = rootData;

	$w('#primaryCategoryFilter').onChange((e) => {
		$w('#tableContent').data = rootData.filter((item) =>
			item.primaryCategory.toLowerCase().includes(e.target.value.toLowerCase())
		);
	});
	$w('#secondaryCategoryFilter').onChange((e) => {
		$w('#tableContent').data = rootData.filter((item) => {
			return item.secondaryCategory
				.toLowerCase()
				.includes(e.target.value.toLowerCase());
		});
	});

	$w('#cancelButton').onClick(() => {
		switchViews(true);
	});

	$w('#addNewAccess').onClick(() => {
		if ($w('#addAccessContainer').isVisible) {
			showGeneralMessage('Adding new access to the database.');
			const payload = [
				{
					primaryCategory: $w('#primaryCategoryInput').value,
					secondaryCategory: $w('#secondaryCategoryInput').value,
					description: $w('#accessDescriptionField').value,
				},
			];
			addAccess(accessToken, payload)
				.then((res) => {
					if (res.error) {
						showErrorMessage(res.message);
					} else {
						getAccessCB(accessToken).then(() => {
							showSuccessMessage('Successfully added access to the database');
							switchViews(true);
							getAccessCB(accessToken);
							$w('#tableContent').data = [...rootData];
						});
					}
				})
				.catch((err) => {
					console.error('Err = ', err);
				});

			return;
		}
		switchViews();
	});
});
