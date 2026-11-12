// フクリ 通知用（画面のデータは保存しないので、更新はいつもすぐ反映されます）
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('push', e => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch (_) { d = { title: 'フクリ', body: e.data && e.data.text() }; }
  e.waitUntil(self.registration.showNotification(d.title || 'フクリ', {
    body: d.body || '', tag: d.tag || undefined, icon: 'icon-192.png', badge: 'icon-192.png', data: { tab: d.tab || '' } }));
});
self.addEventListener('notificationclick', e => {
  e.notification.close();
  const tab = (e.notification.data || {}).tab || '';
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(cs => {
    for (const c of cs) { c.postMessage({ tab }); return c.focus(); }
    return self.clients.openWindow('./' + (tab ? '?tab=' + tab : ''));
  }));
});
