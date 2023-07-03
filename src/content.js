const additionalSpeedValue = ['2.25', '2.5', '2.75', '3', '3.25', '3.5', '3.75', '4']
const getPattern = (value) => `<div class="ytp-menuitem" tabindex="0" role="menuitemradio"><div class="ytp-menuitem-label">${value}</div></div>`
const MAX_SPEED_DEFAULT = 2;
const SPEED_PLAYBACK = 'Скорость воспроизведения'

const ytpSettingsButton = document.querySelector('.ytp-settings-button')

let isMenuItemsAdded = false;

//установить скорость воспроизведения видео, либо вернуть значение скорости
const getSetPlaybackRate = (speed) => speed
    ? String(document.querySelector('.video-stream.html5-main-video').playbackRate = isNaN(speed) ? 1 : speed)
    : document.querySelector('.video-stream.html5-main-video').playbackRate;

//установить значение скорости в основном меню настроек
const setSpeedInSettingsMenu = () => {
    const playbackRate = getSetPlaybackRate();
    document.querySelectorAll('.ytp-menuitem').forEach(item => {
        if (item.querySelector('.ytp-menuitem-label').innerHTML === SPEED_PLAYBACK) {
            item.querySelector('.ytp-menuitem-content').innerHTML = playbackRate;
        }
    })
}

//сохранить значение скорости в localStorage
const savePlayBackRateInLocalStorage = (playbackRate) => {
    chrome.storage.local.set({playbackRate: String(playbackRate)}).then(() => {
    });
}

//добавление пунктов меню с дополнительными значениями скорости
const addMenuItems = () => {
    if (isMenuItemsAdded) return

    let ytpPanelMenuSpeed;
    const ytpPanel = document.querySelectorAll('.ytp-panel')

    //находим нужный элемент, куда будем добавлять пункты меню
    ytpPanel.forEach((item, i) => {
        if (item.querySelector('.ytp-panel-header')?.querySelector('.ytp-panel-title')?.innerHTML
            === SPEED_PLAYBACK) {
            ytpPanelMenuSpeed = ytpPanel[i].querySelector('.ytp-panel-menu')
            isMenuItemsAdded = true
        }
    })

    //добавляем пункты меню
    additionalSpeedValue.forEach(item => {
        const newMenuItem = document.createRange().createContextualFragment(getPattern(item))
        ytpPanelMenuSpeed.appendChild(newMenuItem)
    })

    const updatedSpeedMenuItems = ytpPanelMenuSpeed.querySelectorAll('.ytp-menuitem');

    //на каждый пункт меню выбора скорости вешаем слушатель
    updatedSpeedMenuItems.forEach(item => {
        item.addEventListener('click', (e) => {
            //устанавливаем указатель выбранной скорости (галочку)
            const playbackRate = item.textContent;
            updatedSpeedMenuItems.forEach(node => node.removeAttribute('aria-checked'));
            e.target.parentNode.setAttribute('aria-checked', 'true');
            getSetPlaybackRate(playbackRate);

            savePlayBackRateInLocalStorage(playbackRate);

            //если кликаем на одно из оригинальных значений скорости, то устанавливаем эту скорость в меню настроек
            if (parseFloat(playbackRate) <= MAX_SPEED_DEFAULT) {
                setSpeedInSettingsMenu()
            }
        })
    })
}

//вешаем слушатель на кнопку перехода из основного меню настроек в настройки скорости
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

//слушатель на кнопку входа в меню настроек
ytpSettingsButton?.addEventListener('click', handleClick)
