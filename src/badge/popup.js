function setPlaybackRate(speed) {
    document.querySelectorAll('.video-stream.html5-main-video').forEach(item => item.playbackRate = speed);
}

async function changeSpeed(speed) {
    const queryOptions = {active: true, currentWindow: true};
    try {
        let [tab] = await chrome.tabs.query(queryOptions);
        await chrome.scripting.executeScript({
            target: {tabId: tab.id},
            func: setPlaybackRate,
            args: [speed],
        })
    } catch (e) {
        console.error('changeSpeed', e)
    }
}

async function savePlayBackRateToStorage(playbackRate) {
    try {
        await chrome.storage.local.set({playbackRate: String(playbackRate)})
    } catch (e) {
        console.error('savePlayBackRateToStorage:', e)
    }
}

const handleMessage = async (playbackRate) => {
    try {
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, {action: playbackRate});
        });
    } catch (e) {
        console.error('handleMessage', e);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const youtubeOverSpeed = document.querySelector('.grid__youtube-over-speed');
    const speedButtons = youtubeOverSpeed.querySelectorAll('button');

    let prevBtnSelected;

    const setFirstSelected = async () => {
        try {
            const {playbackRate} = await chrome.storage.local.get(['playbackRate']);
            if (playbackRate) {
                const selectedId = `#speed${playbackRate.replaceAll('.', '')}`;
                const selectedElement = youtubeOverSpeed.querySelector(selectedId)
                selectedElement.classList.add('selected');
                prevBtnSelected = selectedElement;
                await chrome.action.setBadgeText({text: playbackRate});
            }
        } catch (e) {
            console.error('storage.local get playbackRate', e)
        }
    }

    if (!prevBtnSelected) {
        setFirstSelected().catch((e) => console.error('setFirstSelected', e));
    }

    speedButtons.forEach((btn) => {
        btn.addEventListener('click', async (e) => {
            prevBtnSelected?.classList.remove('selected')
            const targetElement = e.target;
            targetElement.classList.add('selected');
            prevBtnSelected = targetElement;
            const playbackRate = targetElement.innerText.replaceAll('x', '');
            try {
                await changeSpeed(parseFloat(playbackRate));
                await chrome.action.setBadgeText({text: playbackRate});
                await savePlayBackRateToStorage(playbackRate)
                await handleMessage(playbackRate)
            } catch (e) {
                console.error('changeSpeed', e)
            }
        })
    })
})
