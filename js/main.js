var isPushEnabled = false;

window.addEventListener('load', function() {

    var pushButton = document.querySelector('.push-button');

    pushButton.addEventListener('click', function() {
        if (isPushEnabled) {
            unsubscribe();
        } else {
            subscribe();
        }
    });

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js').then(initialiseState);
    } else {
        console.warn('Service workers are not supported in this browser');
    }


    navigator.serviceWorker.ready.then(function(serviceWorkerRegistration) {
        serviceWorkerRegistration.pushManager.getSubscription()
            .then(function(subscription) {
                console.log(JSON.stringify(subscription));
            })
            .catch(function(err) {
                console.warn('Error during getSubscription()', err);
            });
    });
});


function initialiseState() {
    if (!('showNotification' in ServiceWorkerRegistration.prototype)) {
        console.warn('Notifications aren\'t supported.');
        return;
    }

    if (Notification.permission === 'denied') {
        console.warn('The user has blocked notifications.');
        return;
    }

    if (!('PushManager' in window)) {
        console.warn('Push messaging isn\'t supported.');
        return;
    }

    navigator.serviceWorker.ready.then(function(serviceWorkerRegistration) {
        serviceWorkerRegistration.pushManager.getSubscription()
            .then(function(subscription) {
                var pushButton = document.querySelector('.push-button');
                pushButton.disabled = false;

                if (!subscription) {
                    return;
                }

                //sendSubscriptionToServer(subscription);
                pushButton.textContent = 'Disable Push Messages';
                isPushEnabled = true;
            })
            .catch(function(err) {
                console.warn('Error during getSubscription()', err);
            });
    });
}

function subscribe() {
    var pushButton = document.querySelector('.push-button');
    pushButton.disabled = true;

    navigator.serviceWorker.ready.then(function(serviceWorkerRegistration) {
        serviceWorkerRegistration.pushManager.subscribe({userVisibleOnly: true})
            .then(function(subscription) {
                isPushEnabled = true;
                pushButton.textContent = 'Disable Push Messages';
                pushButton.disabled = false;

                // TODO: Send the subscription.endpoint to your server
                // and save it to send a push message at a later date
                //return sendSubscriptionToServer(subscription);
                var endpoints = subscription.endpoint.split('/');
                console.log(endpoints[endpoints.length - 1]);
                var div = document.createElement('div');
                div.innerHTML =  endpoints[endpoints.length - 1];
                document.getElementsByTagName('body')[0].appendChild(div);
                jQuery.ajax({
                    url: "https://push-subscribe.herokuapp.com/subscriptions",
                    data: JSON.stringify(subscription),
                    contentType: "application/json"
                }, function(data) {
                    console.log("Subscription send result: ", data);
                });
                return true;
            })
            .catch(function(e) {
                if (Notification.permission === 'denied') {
                    console.warn('Permission for Notifications was denied');
                    pushButton.disabled = true;
                } else {
                    console.error('Unable to subscribe to push.', e);
                    pushButton.disabled = false;
                    pushButton.textContent = 'Enable Push Messages';
                }
            });
    });
}


function unsubscribe() {
    var pushButton = document.querySelector('.push-button');
    pushButton.disabled = true;

    navigator.serviceWorker.ready.then(function(serviceWorkerRegistration) {
        serviceWorkerRegistration.pushManager.getSubscription().then(
            function(pushSubscription) {
                if (!pushSubscription) {
                    isPushEnabled = false;
                    pushButton.disabled = false;
                    pushButton.textContent = 'Enable Push Messages';
                    return;
                }

                var subscriptionId = pushSubscription.subscriptionId;
                // TODO: Make a request to your server to remove
                // the subscriptionId from your data store so you
                // don't attempt to send them push messages anymore

                // We have a subscription, so call unsubscribe on it
                pushSubscription.unsubscribe().then(function(successful) {
                    pushButton.disabled = false;
                    pushButton.textContent = 'Enable Push Messages';
                    isPushEnabled = false;
                }).catch(function(e) {
                    // We failed to unsubscribe, this can lead to
                    // an unusual state, so may be best to remove
                    // the users data from your data store and
                    // inform the user that you have done so

                    console.log('Unsubscription error: ', e);
                    pushButton.disabled = false;
                    pushButton.textContent = 'Enable Push Messages';
                });
            }).catch(function(e) {
            console.error('Error thrown while unsubscribing from push messaging.', e);
        });
    });
}