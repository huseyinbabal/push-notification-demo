self.addEventListener('push', function(event) {
    console.log('Received a push message', event);

    var pushData = JSON.parse(event.data.text());

    var title = pushData.title;
    var body = pushData.message;
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