let timerId;

document.addEventListener('DOMContentLoaded', () => {
  const startStopButton = document.getElementById('startStopButton');
  const resetButton = document.getElementById('resetButton');
  const inputDate = document.querySelector('input[type="date"]');

  updatePopup();

  startStopButton.addEventListener('click', () => {
    if (!inputDate.value) {
      window.alert("Please pick up the date.");
      throw Error("Please pick up the date.");
    };
    chrome.storage.local.set({
      'inputDate': inputDate.value
    });
    chrome.runtime.sendMessage({action: 'start'}).catch((error) => {
        console.warn("Popup could not send the start message", error)
    })
      startTimer(inputDate.value);
      timerId = setInterval(()=> {startTimer(inputDate.value)}, 1000);
    });
  
  resetButton.addEventListener('click', () => {
      chrome.runtime.sendMessage({action: 'reset'}).catch((error) => {
          console.warn("Popup could not send the reset message", error)
      })
      resetTimer();
      clearInterval(timerId);
    });
});

const startTimer = (inputDate) => {
  let days = document.getElementById("days");
  let hours = document.getElementById("hours");
  let minutes = document.getElementById("minutes");
  let seconds = document.getElementById("seconds");
  const startDate = new Date(inputDate).getTime();
  const nowDate = new Date().getTime();

  if (nowDate >= startDate) {
      window.alert("Date should be greater than today.");
      throw Error("Date should be greater than today.")
  };

  const distance = startDate - nowDate;
  days.innerHTML = Math.floor(distance / (1000 * 60 * 60 * 24));
  hours.innerHTML = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  minutes.innerHTML = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  seconds.innerHTML = Math.floor((distance % (1000 * 60)) / 1000);

  chrome.storage.local.set({ 
    'days': days.innerHTML,
    'hours': hours.innerHTML,
    'minutes': minutes.innerHTML,
    'seconds': seconds.innerHTML,
   });

  if (distance < 0) {
    document.getElementById("countdown").style.display = "none";
    resetTimer();
    clearInterval(timerId);
    chrome.notifications.create('Date is reached', {
      type: 'basic',
      iconUrl: chrome.runtime.getURL('images/icon48.png'),
      title: 'This is a notification',
      message: 'Date is reached!',
  })    
    window.alert("Time is over.");
  }
};

const resetTimer = () => {  
  document.getElementById("days").innerHTML = 0;
  document.getElementById("hours").innerHTML = 0;
  document.getElementById("minutes").innerHTML = 0;
  document.getElementById("seconds").innerHTML = 0;
  document.querySelector('input[type="date"]').value = '';
  chrome.storage.local.set({
    'days': 0,
    'hours': 0,
    'minutes': 0,
    'seconds': 0,
    'inputDate': ''
   });
  clearStorage();
};

const updatePopup = () => {
  chrome.storage.local.get(['days', 'hours', 'minutes', 'seconds', 'inputDate'], (data) => {
      document.getElementById("days").innerHTML = Number(data.days) || 0;
      document.getElementById("hours").innerHTML = Number(data.hours) || 0;
      document.getElementById("minutes").innerHTML =  Number(data.minutes) || 0;
      document.getElementById("seconds").innerHTML =  Number(data.seconds) || 0;
      document.querySelector('input[type="date"]').value = data.inputDate || '';
      if(data.inputDate){
        timerId = setInterval(() => {startTimer(data.inputDate), 1000});
      }
  });
}

const clearStorage = () => {
  chrome.storage.local.clear(() => {
    if (chrome.runtime.lastError) {
      console.error(error);
     }
   });
}