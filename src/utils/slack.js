import Auth from './auth'
import axios from 'axios'

export default class Slack {
  static send(text) {
    const credentials = Auth.credentials()
    const data = {
      token: credentials.token,
      channel: '#electron-pomodoro',
      username: 'tomato',
      text
    }

    axios.post(credentials.webhookUrlDev, data)
    .then(response => {
      /* eslint-disable no-console */
      console.log(response);
      /* eslint-enable no-console */
    })
    .catch(error => {
      /* eslint-disable no-console */
      console.log(error);
      /* eslint-enable no-console */
    });
  }
}
