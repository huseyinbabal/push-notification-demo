self.addEventListener('push', function(event) {
    console.log('Received a push message', event);

    var title = 'Urun fiyati dustu!';
    var body = 'IPhon6 5TL\'ye dustu';
    var icon = '/images/icon.png';
    var tag = 'kampanya';

    event.waitUntil(
        self.registration.showNotification(title, {
            body: body,
            icon: icon,
            tag: tag
        })
    );
});