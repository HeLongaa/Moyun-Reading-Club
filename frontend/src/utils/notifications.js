export function requestNotificationPermission() {
    if (!('Notification' in window)) return

    Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
            console.log('Notification permission granted.')
        }
    })
}

export function showLocalNotification(title, options) {
    if (Notification.permission === 'granted') {
        new Notification(title, options)
    }
}