window.LaunchPad = typeof window.LaunchPad === 'undefined' ? {} : window.LaunchPad;
window.LaunchPad.PWA = typeof window.LaunchPad.PWA === 'undefined' ? {} : window.LaunchPad.PWA;

window.LaunchPad.PWA.startEnviroment = () => {
	if ('serviceWorker' in navigator) {
		navigator.serviceWorker.register('/LaunchPad/sw.js')
		.then((reg) => {
			console.log('SW: Registered. Scope: ', reg.scope)
			window.LaunchPad.PWA.controller();
		}).catch(err => console.warn('SW: Error while registering. Error: ', err))
	}
};
window.LaunchPad.PWA.controller = () => {
	let deferredPrompt;
	let html = `
	<div class="overlay pwa-popup">
	<span class="popup-global-close pwa-popup-close" title="Back"></span>
	<div class="popup small-popup">
	<span class="small-close pwa-popup-close" title="Back"></span>
	<h2 class="popup-header">LaunchPad</h2>
	<div class="popup-body">
	<p class="pwa-message"></p>
	<button class="pwa-primary-btn pwa-install">Try now</button>
	</div>
	</div>
	</div>`;
	pwaHTML = document.createElement('div');
	pwaHTML.classList.add('pwa');
	pwaHTML.innerHTML = html;
	document.body.appendChild(pwaHTML);

	let installIndicators = document.body.querySelectorAll('.pwa-btn');
	let installMsg = document.body.querySelector('.pwa-message');
	let installBtn = document.body.querySelector('.pwa-install');
	const userAgent = window.navigator.userAgent.toLowerCase();
	const ios = /iphone|ipod|ipad/.test(userAgent);
	if (ios) {
		installIndicators.forEach(indicator => {
			indicator.style.display = 'block';
		});
		installMsg.innerHTML = `
		If you are a safari user please follow these instructions:
		<br>
		<br>
		To install our app you must tap <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 640 640"><path fill="currentColor" d="M128 320c0-35.2 28.8-64 64-64h256c35.2 0 64 28.8 64 64v256c0 35.2-28.8 64-64 64h-256c-35.2 0-64-28.8-64-64v-256zM192 320v256h256v-256h-64v-64h-128v64h-64zM288 122.56v389.44h64v-389.44l98.24 98.24 45.44-45.12-175.68-175.68-176 176 45.44 44.8 98.56-97.92z"></path></svg> in safari and add our app to your Home Screen.
		<hr>
		<br>
		If you are not a safari user unfortunately you will not be able to install our app.`;
		installBtn.remove();
		if (window.navigator.standalone) {
			installIndicators.forEach(indicator => {
				indicator.remove();
			});
		}
	} else {
		installMsg.innerHTML = 'LaunchPad is designed to be used as a app, which translates into a better user experience, want to try the app?';
	}
	installIndicators.forEach(indicator => {
		indicator.onclick = (event) => {
			window.LaunchPad.PWA.linkHandler(event, 'show');
		};
	});
	let closeIndicators = document.body.querySelectorAll('.pwa-popup-close');
	closeIndicators.forEach(indicator => {
		indicator.onclick = (event) => {
			window.LaunchPad.PWA.linkHandler(event);
		};
	});
	if (installBtn) {
		window.addEventListener('beforeinstallprompt', (e) => {
			deferredPrompt = e;
			installIndicators.forEach(indicator => {
				indicator.style.display = 'block';
			});
			installBtn.style.display = 'initial';
		});
		installBtn.addEventListener('click', async () => {
			if (deferredPrompt !== null && deferredPrompt !== 'undefined') {
				deferredPrompt.prompt();
				const { outcome } = await deferredPrompt.userChoice;
				if (outcome === 'accepted') {
					deferredPrompt = null;
					installMsg.innerHTML = 'Our app has been installed successfully.';
					installIndicators.forEach(indicator => {
						indicator.remove();
					});
					installBtn.remove();
				}
			}
		});
	}
};
window.LaunchPad.PWA.linkHandler = (e, linkAction) => {
	e.preventDefault();
	e.stopImmediatePropagation();
	let popup = document.body.querySelector('.pwa-popup');
	if (linkAction == 'show') {
		popup.classList.add('popup-show');
	} else {
		popup.classList.remove('popup-show');
	}
};
(function () {
	window.LaunchPad.PWA.startEnviroment();
})();