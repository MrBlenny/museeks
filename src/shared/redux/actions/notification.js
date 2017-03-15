//import app from '../lib/app';

const add = (notificationData) => {
    if (app.config.get('displayNotifications')) {
        const notification =
            new Notification(
                notificationData.title,
                {
                    body: notificationData.body,
                    icon: notificationData.icon,
                    silent: true
                }
            );

        notification.onclick = () => {
            app.browserWindows.main.show();
            app.browserWindows.main.focus();
        };

        return {
            type: 'APP_NOTIFICATION_NEW',
            notification
        };
    }
};

module.exports = {
    add
};