const additionalSpeedValue = ['2.25', '2.5', '2.75', '3', '3.25', '3.5', '3.75', '4']
const getPattern = (value) => `<div class="ytp-menuitem" tabindex="0" role="menuitemradio"><div class="ytp-menuitem-label">${value}</div></div>`
const MAX_SPEED_DEFAULT = 2;
const SPEED_PLAYBACK = 'Скорость воспроизведения'

const ytpSettingsButton = document.querySelector('.ytp-settings-button')

const getSetPlaybackRate = (speed) => speed
    ? String(document.getElementsByClassName('video-stream html5-main-video')[0].playbackRate = isNaN(speed) ? 1 : speed)
    : document.getElementsByClassName('video-stream html5-main-video')[0].playbackRate;

let isMenuItemsAdded = false;

const setSpeedInSettingsMenu = () => {
    const playbackRate = getSetPlaybackRate();
    document.querySelectorAll('.ytp-menuitem').forEach(item => {
        if (item.querySelector('.ytp-menuitem-label').innerHTML === SPEED_PLAYBACK) {
            item.querySelector('.ytp-menuitem-content').innerHTML = playbackRate;
        }
    })
}

const savePlayBackRateInLocalStorage = (playbackRate) => {
    chrome.storage.local.set({playbackRate: String(playbackRate)}).then(() => {
    });
}

const addMenuItems = () => {
    if (isMenuItemsAdded) return

    let ytpPanelMenuSpeed;
    const ytpPanel = document.querySelectorAll('.ytp-panel')

    ytpPanel.forEach((item, i) => {
        if (item.querySelector('.ytp-panel-header')?.querySelector('.ytp-panel-title')?.innerHTML
            === SPEED_PLAYBACK) {
            ytpPanelMenuSpeed = ytpPanel[i].querySelector('.ytp-panel-menu')
            isMenuItemsAdded = true
        }
    })

    additionalSpeedValue.forEach(item => {
        const newMenuItem = document.createRange().createContextualFragment(getPattern(item))
        ytpPanelMenuSpeed.appendChild(newMenuItem)
    })

    const updatedSpeedMenuItems = ytpPanelMenuSpeed.querySelectorAll('.ytp-menuitem');

    updatedSpeedMenuItems.forEach(item => {
        item.addEventListener('click', (e) => {
            const playbackRate = item.textContent;
            updatedSpeedMenuItems.forEach(node => node.removeAttribute('aria-checked'));
            e.target.parentNode.setAttribute('aria-checked', 'true');
            getSetPlaybackRate(playbackRate);

            savePlayBackRateInLocalStorage(playbackRate);

            if (parseFloat(playbackRate) <= MAX_SPEED_DEFAULT) {
                setSpeedInSettingsMenu()
            }
        })
    })
}

const handleClick = () => {
    const ytpMenuItems = document.querySelectorAll('.ytp-menuitem');

    setSpeedInSettingsMenu()

    ytpMenuItems.forEach((item, i) => {
        const node = item.querySelector('.ytp-menuitem-label');
        if (node.innerHTML === SPEED_PLAYBACK) {
            ytpMenuItems[i].addEventListener('click', () => addMenuItems())
        }
    })
}

ytpSettingsButton.addEventListener('click', handleClick)

chrome.runtime.onMessage.addListener((request) => {
    if (request.action === 'set-playback-rate') {
        chrome.storage.local.get(['playbackRate']).then((result) => {
            getSetPlaybackRate(result.playbackRate)
        });
    }
});

chrome.runtime.sendMessage('i-prepare', (response) => {
  console.log('received user data', response);
});
