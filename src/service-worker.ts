/// <reference lib="webworker" />
/* eslint-disable no-restricted-globals */

import { clientsClaim } from 'workbox-core';
import { ExpirationPlugin } from 'workbox-expiration';
import { precacheAndRoute, createHandlerBoundToURL } from 'workbox-precaching';
import { registerRoute, setCatchHandler } from 'workbox-routing';
import { CacheFirst, NetworkOnly } from 'workbox-strategies';
import { BackgroundSyncPlugin } from 'workbox-background-sync';

declare const self: ServiceWorkerGlobalScope;

clientsClaim();

// Precache all of the assets generated by your build process.
precacheAndRoute(self.__WB_MANIFEST);

// Set up App Shell-style routing
const fileExtensionRegexp = new RegExp('/[^/?]+\\.[^/]+$');
registerRoute(
  ({ request, url }: { request: Request; url: URL }) => {
    if (request.mode !== 'navigate') {
      return false;
    }

    if (url.pathname.startsWith('/_')) {
      return false;
    }

    if (url.pathname.match(fileExtensionRegexp)) {
      return false;
    }

    return true;
  },
  createHandlerBoundToURL(process.env.PUBLIC_URL + '/index.html')
);

// Cache strategy for images with expiration
const imagesCacheStrategy = new CacheFirst({
  cacheName: 'images',
  plugins: [
    new ExpirationPlugin({ maxEntries: 50 }),
  ],
});

// Cache strategy for background sync
const bgSyncStrategy = new NetworkOnly({
  plugins: [
    new BackgroundSyncPlugin('imageSyncQueue', {
      maxRetentionTime: 24 * 60, // Retry for up to 24 hours
    }),
  ],
});

// Runtime caching route for .jpg files
registerRoute(
  ({ url }) => (url.pathname.endsWith('.jpg') || url.pathname.endsWith('.jpeg')) && !url.pathname.endsWith('i.pinimg.com/originals/52/24/7f/52247f214662e5f9c23257292647e669.jpg'),
  ({ event, request }) => {
    // Use background sync strategy for offline requests
    if (!navigator.onLine) {
      return bgSyncStrategy.handle({ event, request });
    }

    // Use cache-first strategy for online requests
    return imagesCacheStrategy.handle({ event, request });
  }
);

// Background sync event listener
self.addEventListener('sync', (event) => {
  if (event.tag === 'imageSyncQueue') {
    event.waitUntil(processImageSyncQueue());
  }
});

// Function to process the background sync queue
async function processImageSyncQueue() {
  const queue = await self.registration.sync.getTags();

  while (queue.length > 0) {
    const tag = queue.shift();

    if (tag) {
      // Retry the request
      try {
        await self.registration.sync.register(tag);
      } catch (error) {
        // Handle the error (e.g., log it)
        console.error('Background sync failed:', error);
      }
    }
  }
}


// Skip waiting on message from the web app
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// push notifications

self.addEventListener('push', (event) => {
  const title = 'Black n\' White Notification';
  const options = {
    body: event.data ? event.data.text() : 'New Notification',
  };
  event.waitUntil(self.registration.showNotification(title, options));
});