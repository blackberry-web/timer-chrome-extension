chrome.notifications.onClicked.addListener((notificationId) => {
  if (notificationId === 'Date is reached') {
    chrome.notifications.create('onClicked notification', {
      type: 'basic',
      iconUrl: chrome.runtime.getURL('images/icon48.png'),
      title: "This is an onClicked notification",
      message: "Date is reached!",
    })
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.action === 'start') {
            console.log("Service worker received start message from sender %s", sender.id, request)
            sendResponse({message: "Service worker processed the start message"})
      }
      if (request.action === 'reset') {        
            console.log("Service worker received reset message from sender %s", sender.id, request)
            sendResponse({message: "Service worker processed the reset message"})
      }
    })

chrome.storage.onChanged.addListener((changes, namespace) => {
      for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
        console.log(
          `Storage key "${key}" in namespace "${namespace}" changed.`,
          `Old value was "${oldValue}", new value is "${newValue}".`
        );
      }
    });