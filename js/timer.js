(function() {
    const timerContainer = document.querySelector('.elm-panel-timer');
    if (!timerContainer) return;

    const valueElements = timerContainer.querySelectorAll('.panel-timer-value');
    const textElements = timerContainer.querySelectorAll('.panel-timer-text');
    
    if (valueElements.length < 3 || textElements.length < 3) return;

    const daysElement = valueElements[0];
    const hoursElement = valueElements[1];
    const minutesElement = valueElements[2];
    
    const daysTextElement = textElements[0];
    const hoursTextElement = textElements[1];
    const minutesTextElement = textElements[2];
    
    const initialDays = parseInt(daysElement.textContent, 10) || 0;
    const initialHours = parseInt(hoursElement.textContent, 10) || 0;
    const initialMinutes = parseInt(minutesElement.textContent, 10) || 0;
    
    let totalSeconds = (initialDays * 24 * 60 * 60) + (initialHours * 60 * 60) + (initialMinutes * 60);
    
    function updateTimer() {
        if (totalSeconds <= 0) {
            daysElement.textContent = '00';
            hoursElement.textContent = '00';
            minutesElement.textContent = '00';
            return;
        }
        
        const days = Math.floor(totalSeconds / (24 * 60 * 60));
        const hours = Math.floor((totalSeconds % (24 * 60 * 60)) / (60 * 60));
        const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
        
        daysElement.textContent = String(days).padStart(2, '0');
        hoursElement.textContent = String(hours).padStart(2, '0');
        minutesElement.textContent = String(minutes).padStart(2, '0');
        
        updateTexts(days, hours, minutes);
        
        totalSeconds--;
    }
    
    function updateTexts(days, hours, minutes) {
        const daysLastDigit = days % 10;
        const daysLastTwoDigits = days % 100;
        
        if (daysLastTwoDigits >= 11 && daysLastTwoDigits <= 14) {
            daysTextElement.textContent = 'дней';
        } else if (daysLastDigit === 1) {
            daysTextElement.textContent = 'день';
        } else if (daysLastDigit >= 2 && daysLastDigit <= 4) {
            daysTextElement.textContent = 'дня';
        } else {
            daysTextElement.textContent = 'дней';
        }
        
        const hoursLastDigit = hours % 10;
        const hoursLastTwoDigits = hours % 100;
        
        if (hoursLastTwoDigits >= 11 && hoursLastTwoDigits <= 14) {
            hoursTextElement.textContent = 'часов';
        } else if (hoursLastDigit === 1) {
            hoursTextElement.textContent = 'час';
        } else if (hoursLastDigit >= 2 && hoursLastDigit <= 4) {
            hoursTextElement.textContent = 'часа';
        } else {
            hoursTextElement.textContent = 'часов';
        }
        
        const minutesLastDigit = minutes % 10;
        const minutesLastTwoDigits = minutes % 100;
        
        if (minutesLastTwoDigits >= 11 && minutesLastTwoDigits <= 14) {
            minutesTextElement.textContent = 'минут';
        } else if (minutesLastDigit === 1) {
            minutesTextElement.textContent = 'минута';
        } else if (minutesLastDigit >= 2 && minutesLastDigit <= 4) {
            minutesTextElement.textContent = 'минуты';
        } else {
            minutesTextElement.textContent = 'минут';
        }
    }
    
    updateTimer();
    setInterval(updateTimer, 1000);
})();