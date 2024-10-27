import browser from 'webextension-polyfill'
import ghostIcon from '../../../../assets/ghost-512.png'

export function createNotification(title: string, message: string) {
  return browser.notifications.create({
    type: 'basic',
    title,
    message,
    iconUrl: ghostIcon,
  })
}
