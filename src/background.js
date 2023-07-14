// устанавливаем нужную скорость для видео
const setPlaybackRate = (speed) => {
    document.querySelector('.video-stream.html5-main-video').playbackRate = speed;
    const short = document.querySelector('.video-stream.html5-main-video[loop]')
    if (short) short.playbackRate = speed;
}

const getPlaybackRate = async () => await chrome.storage.local.get(['playbackRate']);

//получаем текущую вкладку
const getCurrentTab = async () => {
    const queryOptions = {active: true, lastFocusedWindow: true};
    try {
        let [tab] = await chrome.tabs.query(queryOptions);
        return tab;
    } catch (e) {
        console.error('getCurrentTab', e)
    }
}


const isYouTubeUrl = (url) => {
    try {
        const {hostname, pathname} = new URL(url);
        return (hostname === 'youtube.com' || hostname === 'www.youtube.com' || hostname === 'youtu.be' || hostname === 'm.youtube.com') &&
            /^\/(watch|shorts)/.test(pathname)
    } catch (e) {
        console.error('isYouTubeUrl:', e);
        return false;
    }
};

//меняем скорость
const changeSpeed = async (speed) => {
    try {
        const tab = await getCurrentTab();
        console.log('tab changeSpeed:', tab)
        if (isYouTubeUrl(tab?.url)) {
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


chrome.tabs.onUpdated.addListener(async () => {
    try {
        const {playbackRate} = await getPlaybackRate()
        if (playbackRate) {
            await changeSpeed(playbackRate);
            await chrome.action.setBadgeText({text: playbackRate});
        }
    } catch (e) {
        console.error('chrome.tabs.onUpdated handler:', e)
    }
});
