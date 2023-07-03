// устанавливаем нужную скорость для видео
const setPlaybackRate = (speed) => {
    document.querySelector('.video-stream.html5-main-video').playbackRate = speed;
}

const getPlaybackRate = async () => await chrome.storage.local.get(['playbackRate']);

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
const changeSpeed = async (speed) => {
    try {
        const tab = await getCurrentTab();
        if (tab.url.includes('youtube')) {
            await chrome.scripting.executeScript({
                target: {tabId: tab.id},
                func: setPlaybackRate,
                args: [speed],
            })
        }
    } catch (e) {
        console.error('changeSpeed:', e)
    }
}

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo) => {
    if (changeInfo) {
        try {
            const {playbackRate} = await getPlaybackRate()
            if (playbackRate) {
                await changeSpeed(playbackRate);
            }
        } catch (e) {
            console.error('chrome.tabs.onUpdated handler:', e)
        }
    }
});
