const additionalSpeedValue = ['2.25', '2.5', '2.75', '3', '3.25', '3.5', '3.75', '4']
const getPattern = (value) => `<div class="ytp-menuitem" tabindex="0" role="menuitemradio"><div class="ytp-menuitem-label">${value}</div></div>`

const ytpSettingsButton = document.querySelector('.ytp-settings-button')

const addMenuItems = () => additionalSpeedValue.forEach(item => {
    const ytpPanelMenu = document.querySelector('.ytp-panel-menu');
    const newMenuItem = document.createRange().createContextualFragment(getPattern(item))
    ytpPanelMenu.appendChild(newMenuItem)
})

ytpSettingsButton.addEventListener('click', () => {
    const ytpPanelMenuItems = document.querySelectorAll('.ytp-panel-menu');

    ytpPanelMenuItems.forEach((item, i) => {
        const node = item.querySelector('.ytp-menuitem-label');
        console.log('node.innerHTML:', node.innerHTML)
        if (node.innerHTML === 'Скорость воспроизведения') {
            ytpPanelMenuItems[i].addEventListener('click', addMenuItems)
        }
    })

})
