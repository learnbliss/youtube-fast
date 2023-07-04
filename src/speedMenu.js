const speedValues = ['1', '1.25', '1.5', '1.75', '2', '2.25', '2.5', '2.75', '3', '3.25', '3.5', '3.75', '4']
const menuWrapper = `.menu__root {
    display: grid;
    justify-content: end;
    margin: 0 15px;
    align-items: center;
    float: left;
    height: 100%;
}`;
const menu = document.querySelector('.ytp-right-controls');
const menuBtn = menu.querySelector('.ytp-button');

const style = document.createElement('style');
style.textContent = menuWrapper;

const cssUrl = chrome.runtime.getURL('menu-style.css')
const link = document.createElement('link');
link.setAttribute('rel', 'stylesheet');
link.setAttribute('href', cssUrl);

const root = document.createElement('div');
root.addEventListener('click', (e) => e.stopPropagation())
root.classList.add('menu__root');

root.appendChild(style);
const shadowRoot = root.attachShadow({mode: 'open'});
shadowRoot.appendChild(link)

const select = document.createElement('select');
select.classList.add('menu__select-custom-speed');
select.addEventListener('change', handleChangeSpeed);

speedValues.forEach((value) => {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = `${value}x`;
    select.prepend(option);
});

shadowRoot.prepend(select)
menu.insertBefore(root, menuBtn)

async function savePlayBackRateToStorage(playbackRate) {
    try {
        await chrome.storage.local.set({playbackRate: String(playbackRate)})
    } catch (e) {
        console.error('savePlayBackRateToStorage:', e)
    }
}

async function handleChangeSpeed(event) {
    const speed = event.target.value;
    document.querySelector('.video-stream.html5-main-video').playbackRate = speed;
    try {
        await savePlayBackRateToStorage(speed)
        await chrome.runtime.sendMessage({badgeText: speed});
    } catch (e) {
        console.error('handleChangeSpeed:', e)
    }
}

(async () => {
    try {
        const {playbackRate} = await chrome.storage.local.get(['playbackRate']);
        if (playbackRate) {
            select.value = playbackRate
        }
    } catch (e) {
        console.error('storage.local get playbackRate', e)
    }
})()

chrome.runtime.onMessage.addListener(({action}) => {
    select.value = action;
})
