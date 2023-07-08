const setPlaybackRate = (playbackRate) => {
    document.querySelector('.video-stream.html5-main-video').playbackRate = playbackRate;
    const short = document.querySelector('.video-stream.html5-main-video[loop]')
    if (short) short.playbackRate = playbackRate;
}

const changeSpeed = async (playbackRate) => {
    const queryOptions = {active: true, currentWindow: true};
    try {
        let [tab] = await chrome.tabs.query(queryOptions);
        await chrome.scripting.executeScript({
            target: {tabId: tab.id},
            func: setPlaybackRate,
            args: [playbackRate],
        });
        await chrome.storage.local.set({playbackRate: String(playbackRate)});
        await chrome.action.setBadgeText({text: String(playbackRate)});
    } catch (e) {
        console.error('changeSpeed', e)
    }
}

let prevBtnSelected;

const setFirstSelected = async (domElement) => {
    try {
        const {playbackRate} = await chrome.storage.local.get(['playbackRate']);
        if (playbackRate) {
            const selectedId = `#speed${playbackRate.replaceAll('.', '')}`;
            const selectedElement = domElement.querySelector(selectedId)
            selectedElement.classList.add('selected');
            prevBtnSelected = selectedElement;
            await chrome.action.setBadgeText({text: playbackRate});
        }
    } catch (e) {
        console.error('storage.local get playbackRate', e)
    }
}

const handleClick = async (e) => {
    const targetElement = e.target;
    prevBtnSelected?.classList.remove('selected')
    targetElement.classList.add('selected');
    prevBtnSelected = targetElement;
    const playbackRate = targetElement.innerText.replaceAll('x', '');
    try {
        await changeSpeed(parseFloat(playbackRate));
    } catch (e) {
        console.error('changeSpeed', e)
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const youtubeOverSpeed = document.querySelector('.grid__youtube-over-speed');
    const speedButtons = youtubeOverSpeed.querySelectorAll('button');

    if (!prevBtnSelected) {
        setFirstSelected(youtubeOverSpeed).catch((e) => console.error('setFirstSelected', e));
    }

    speedButtons.forEach((btn) => {
        btn.addEventListener('click', handleClick)
    })
})
