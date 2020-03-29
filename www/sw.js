/**
 * QCObjects SDK 1.0
 * ________________
 *
 * Author: Jean Machuca <correojean@gmail.com>
 *
 * Cross Browser Javascript Framework for MVC Patterns
 * QuickCorp/QCObjects is licensed under the
 * GNU Lesser General Public License v3.0
 * [LICENSE] (https://github.com/QuickCorp/QCObjects/blob/master/LICENSE.txt)
 *
 * Permissions of this copyleft license are conditioned on making available
 * complete source code of licensed works and modifications under the same
 * license or the GNU GPLv3. Copyright and license notices must be preserved.
 * Contributors provide an express grant of patent rights. However, a larger
 * work using the licensed work through interfaces provided by the licensed
 * work may be distributed under different terms and without source code for
 * the larger work.
 *
 * Copyright (C) 2015 Jean Machuca,<correojean@gmail.com>
 *
 * Everyone is permitted to copy and distribute verbatim copies of this
 * license document, but changing it is not allowed.
*/
"use strict";
const version = "0.0.1";
const appName = "myapp";
const cacheName = `qcobjects-app-${appName}-${version}`;
const start_url = "/?homescreen=1";
caches.delete(cacheName); // force to reload cache for the first time the sw is loaded
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(cacheName).then(cache => {
      return cache.addAll([`${start_url}`,
	"/",
	"css/components/card.css",
	"css/components/modal.css",
	"css/desktop/container.css",
	"css/desktop/content.css",
	"css/desktop/footer.css",
	"css/desktop/index.css",
	"css/desktop/navbar.css",
	"css/desktop/sidebar.css",
	"css/index.css",
	"css/mobile/content.css",
	"css/mobile/footer.css",
	"css/mobile/index.css",
	"css/mobile/navbar.css",
	"css/mobile/sidebar.css",
	"css/theme/basic/style.css",
	"css/theme/cyan/style.css",
	"css/theme/redlight/style.css",
	"css/theme/xtra/style.css",
	"favicon.ico",
	"humans.txt",
	"img/Q_web copy.png",
	"img/Q_web.png",
	"img/Q_web.svg",
	"img/icons/icon-128x128.png",
	"img/icons/icon-144x144.png",
	"img/icons/icon-152x152.png",
	"img/icons/icon-192x192.png",
	"img/icons/icon-384x384.png",
	"img/icons/icon-512x512.png",
	"img/icons/icon-72x72.png",
	"img/icons/icon-96x96.png",
	"img/logo.png",
	"img/placeholder.svg",
	"img/screenshots/screenshot1.png",
	"img/screenshots/screenshot1.webp",
	"img/screenshots/screenshot2.png",
	"img/screenshots/screenshot2.webp",
	"index.html",
	"js/index.js",
	"js/init.js",
	"js/packages/installer.js",
	"js/packages/org.quickcorp.custom.components.js",
	"js/packages/org.quickcorp.custom.controllers.js",
	"js/packages/org.quickcorp.custom.js",
	"js/packages/org.quickcorp.custom.models.js",
	"js/packages/org.quickcorp.custom.views.js",
	"manifest.json",
	"res/icon/android/drawable-hdpi-icon.png",
	"res/icon/android/drawable-ldpi-icon.png",
	"res/icon/android/drawable-mdpi-icon.png",
	"res/icon/android/drawable-xhdpi-icon.png",
	"res/icon/android/drawable-xxhdpi-icon.png",
	"res/icon/android/drawable-xxxhdpi-icon.png",
	"res/icon/ios/icon-40.png",
	"res/icon/ios/icon-40@2x.png",
	"res/icon/ios/icon-50.png",
	"res/icon/ios/icon-50@2x.png",
	"res/icon/ios/icon-60.png",
	"res/icon/ios/icon-60@2x.png",
	"res/icon/ios/icon-60@3x.png",
	"res/icon/ios/icon-72.png",
	"res/icon/ios/icon-72@2x.png",
	"res/icon/ios/icon-76.png",
	"res/icon/ios/icon-76@2x.png",
	"res/icon/ios/icon-small.png",
	"res/icon/ios/icon-small@2x.png",
	"res/icon/ios/icon-small@3x.png",
	"res/icon/ios/icon.png",
	"res/icon/ios/icon@2x.png",
	"res/icon/windows/Square150x150Logo.scale-100.png",
	"res/icon/windows/Square150x150Logo.scale-240.png",
	"res/icon/windows/Square30x30Logo.scale-100.png",
	"res/icon/windows/Square310x310Logo.scale-100.png",
	"res/icon/windows/Square44x44Logo.scale-100.png",
	"res/icon/windows/Square44x44Logo.scale-240.png",
	"res/icon/windows/Square70x70Logo.scale-100.png",
	"res/icon/windows/Square71x71Logo.scale-100.png",
	"res/icon/windows/Square71x71Logo.scale-240.png",
	"res/icon/windows/StoreLogo.scale-100.png",
	"res/icon/windows/StoreLogo.scale-240.png",
	"res/icon/windows/Wide310x150Logo.scale-100.png",
	"res/icon/windows/Wide310x150Logo.scale-240.png",
	"res/icon/wp8/ApplicationIcon.png",
	"res/icon/wp8/Background.png",
	"res/screen/android/drawable-land-hdpi-screen.png",
	"res/screen/android/drawable-land-ldpi-screen.png",
	"res/screen/android/drawable-land-mdpi-screen.png",
	"res/screen/android/drawable-land-xhdpi-screen.png",
	"res/screen/android/drawable-land-xxhdpi-screen.png",
	"res/screen/android/drawable-land-xxxhdpi-screen.png",
	"res/screen/android/drawable-port-hdpi-screen.png",
	"res/screen/android/drawable-port-ldpi-screen.png",
	"res/screen/android/drawable-port-mdpi-screen.png",
	"res/screen/android/drawable-port-xhdpi-screen.png",
	"res/screen/android/drawable-port-xxhdpi-screen.png",
	"res/screen/android/drawable-port-xxxhdpi-screen.png",
	"res/screen/ios/Default-568h@2x~iphone.png",
	"res/screen/ios/Default-667h.png",
	"res/screen/ios/Default-736h.png",
	"res/screen/ios/Default-Landscape-736h.png",
	"res/screen/ios/Default-Landscape@2x~ipad.png",
	"res/screen/ios/Default-Landscape~ipad.png",
	"res/screen/ios/Default-Portrait@2x~ipad.png",
	"res/screen/ios/Default-Portrait~ipad.png",
	"res/screen/ios/Default@2x~iphone.png",
	"res/screen/ios/Default~iphone.png",
	"res/screen/windows/SplashScreen.scale-100.png",
	"res/screen/windows/SplashScreenPhone.scale-240.png",
	"res/screen/wp8/screen-portrait.jpg",
	"robots.txt",
	"templates/components/article1.tpl.html",
	"templates/components/article2.tpl.html",
	"templates/components/article3.tpl.html",
	"templates/components/article4.tpl.html",
	"templates/components/blank.tpl.html",
	"templates/components/card.tpl.html",
	"templates/components/contentblock.tpl.html",
	"templates/components/footer.tpl.html",
	"templates/components/footer2.tpl.html",
	"templates/components/header.tpl.html",
	"templates/components/login.tpl.html",
	"templates/components/login2.tpl.html",
	"templates/components/loginform.tpl.html",
	"templates/components/main.tpl.html",
	"templates/components/modal.tpl.html",
	"templates/components/nav.tpl.html",
	"templates/components/pages/page1.tpl.html",
	"templates/components/pages/page2.tpl.html",
	"templates/components/pages/page3.tpl.html",
	"templates/components/pwa.tpl.html",
	"templates/components/section1.tpl.html",
	"templates/components/section2.tpl.html",
	"templates/components/signin.tpl.html",
	"templates/components/signup.tpl.html",
	"templates/components/signupbuttons.tpl.html",
	"templates/components/signuppage.tpl.html"])
          .then(() => self.skipWaiting());
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.open(cacheName)
      .then(cache => cache.match(event.request, {ignoreSearch: true}))
      .then(response => {
      return response || fetch(event.request);
    })
  );
});
