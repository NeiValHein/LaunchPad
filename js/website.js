window.addEventListener('load', () => {
	let pwaLoader = document.querySelector('.pwa-loader');
	setTimeout(() => {
		pwaLoader.remove();
	}, 500)
});