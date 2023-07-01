const additionalSpeedValue = ['2.25', '2.5', '2.75', '3', '3.25', '3.5', '3.75', '4']
const getPattern = (value) => `<div class="ytp-menuitem" tabindex="0" role="menuitemradio"><div class="ytp-menuitem-label">${value}</div></div>`

let isMenuItemsAdded = false;

const ytpSettingsButton = document.querySelector('.ytp-settings-button')

const addMenuItems = () => {
    if (isMenuItemsAdded) {
        return
    }
    let ytpPanelMenuSpeed;
    const ytpPanel = document.querySelectorAll('.ytp-panel')

    ytpPanel.forEach((item, i) => {
        if (item.querySelector('.ytp-panel-header')?.querySelector('.ytp-panel-title')?.innerHTML
            === 'Скорость воспроизведения') {
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
            const speedValue = item.textContent;
            if (parseFloat(speedValue) > 2) {
                updatedSpeedMenuItems.forEach(node => node.removeAttribute('aria-checked'));
                document.getElementsByClassName('video-stream html5-main-video')[0].playbackRate = speedValue;
                e.target.parentNode.setAttribute('aria-checked', 'true');
                ytpSettingsButton.setAttribute('display', 'none')
            }
        })
    })
}

const handleClick = () => {
    const ytpMenuItems = document.querySelectorAll('.ytp-menuitem');

    ytpMenuItems.forEach((item, i) => {
        const node = item.querySelector('.ytp-menuitem-label');
        if (node.innerHTML === 'Скорость воспроизведения') {
            ytpMenuItems[i].addEventListener('click', () => addMenuItems())
            // ytpSettingsButton.removeEventListener('click', handleClick)
        }
    })
}

ytpSettingsButton.addEventListener('click', handleClick)
