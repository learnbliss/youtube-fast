// устанавливаем нужную скорость для видео
const setPlaybackRate = (speed) => {
    document.querySelector('.video-stream.html5-main-video').playbackRate = speed;
}

//получаем текущую вкладку
const getCurrentTab = async () => {
    let queryOptions = {active: true, currentWindow: true};
    try {
        let [tab] = await chrome.tabs.query(queryOptions);
        return tab;
    } catch (e) {
        console.error('getCurrentTab', e)
    }
}

//меняем скорость
const changeSpeed = (speed) => {
    getCurrentTab().then((tab) => {
        if (tab.url.includes('youtube')) {
            chrome.scripting.executeScript({
                target: {tabId: tab.id},
                func: setPlaybackRate,
                args: [speed],
            }).catch(e => console.error('executeScript', e))
        }
    }).catch(e => console.error('changeSpeed', e))
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
    if (changeInfo) {
        chrome.storage.local.get(['playbackRate']).then((result) => {
            if (result.playbackRate) {
                changeSpeed(result.playbackRate);
            }
        })
    }
});
