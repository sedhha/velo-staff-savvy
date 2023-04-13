// API Reference: https://www.wix.com/velo/reference/api-overview/introduction
// “Hello, World!” Example: https://learn-code.wix.com/en/article/1-hello-world
import { session } from 'wix-storage';
import wixLocation from 'wix-location';
const staticData = [];

const initSession = () => {
	const userDetails = JSON.parse(session.getItem('user'));
	const sessionDetails = JSON.parse(session.getItem('session'));
	if (!userDetails || !sessionDetails) return wixLocation.to('/login');
	$w('#nameField').text = `Hello ${
		userDetails.user_metadata.firstName ?? 'Guest'
	}`;
};

$w.onReady(function () {
	initSession();
	$w('#tableContent').onItemReady(($item, itemData) => {
		$item('#primaryCategory').text = itemData.primaryCategory;
		$item('#secondaryCategory').text = itemData.secondaryCategory;
		$item('#description').text = itemData.description;
	});
	$w('#tableContent').data = staticData;

	$w('#primaryCategoryFilter').onChange((e) => {
		console.log('Changed to -', e.target.value);
		$w('#tableContent').data = $w('#tableContent').data.filter((item) =>
			item.primaryCategory.toLowerCase().includes(e.target.value.toLowerCase())
		);
	});
	$w('#secondaryCategoryFilter').onChange((e) => {
		console.log('Changed to -', e.target.value);
		$w('#tableContent').data = $w('#tableContent').data.filter((item) =>
			item.primaryCategory.toLowerCase().includes(e.target.value.toLowerCase())
		);
	});

	$w('#cancelButton').onClick(() => {
		$w('#addAccessContainer').hide();
		$w('#existingAccess').show();
		$w('#cancelButton').hide();
	});

	$w('#addNewAccess').onClick(() => {
		$w('#existingAccess').hide();
		$w('#addAccessContainer').show();
		$w('#cancelButton').show();
	});
});
