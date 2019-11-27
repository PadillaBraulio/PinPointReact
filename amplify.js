// window.LOG_LEVEL='DEBUG'

import Amplify, { Auth } from 'aws-amplify';
import awsconfig from './aws-exports';
import Analytics from '@aws-amplify/analytics';
import PushNotification from '@aws-amplify/pushnotification';

Amplify.configure(awsconfig);
Amplify.Logger.LOG_LEVEL = 'VERBOSE';
Analytics.configure(awsconfig);
Analytics.enable();
PushNotification.configure(awsconfig);
PushNotification.onNotification((notification) => {
  console.log('in app notification', notification);

  // required on iOS only (see fetchCompletionHandler docs: https://facebook.github.io/react-native/docs/pushnotificationios.html)
  // notification.finish(PushNotificationIOS.FetchResult.NoData);
});

var GCM_TOKEN = ""
PushNotification.onRegister(async (token) => {
 GCM_TOKEN=token
});
// get the notification data when notification is opened
PushNotification.onNotificationOpened((notification) => {
    console.log('the notification is opened', notification);
});

const SendRecord = (props) => {
  if(GCM_TOKEN != ""){
    Analytics.updateEndpoint({
     OptOut: 'NONE',
     Address: GCM_TOKEN,
     ChannelType: 'GCM',
     UserAttributes: {
     interests: ['football', 'chess', 'AWS', 'React Native']
     }
     })
       .then(data => {
         console.log('Endpoint updated', JSON.stringify(data));
       })
       .catch(error => {
         console.log('Error updating endpoint', error);
       });
     }

  console.log('Enviando notificacion');
  Analytics.record({
      name: 'song',
      attributes: { name: props.name },
      metrics: { minutesListened: Math.random().toString() },
  });
  console.log('Notificacion Enviada');
}
export  { PushNotification , SendRecord };
