const speedValues = ['1', '1.25', '1.5', '1.75', '2', '2.25', '2.5', '2.75', '3', '3.25', '3.5', '3.75', '4']
const optionPattern = (value) => `<option value="${value}">${value}x</option>`
const menuWrapper = `.menu__root {
    display: grid;
    justify-content: end;
    width: 100%;
    margin: 0 5px
}`;
const menu = document.querySelector('.ytp-chapter-title.ytp-button');

const speedMenu =
    `<select class="menu__select">
${speedValues.map(value => optionPattern(value))}
</select>`

const style = document.createElement('style');
style.textContent = menuWrapper;

const cssUrl = chrome.runtime.getURL('menu-style.css')
const link = document.createElement('link');
link.setAttribute('rel', 'stylesheet');
link.setAttribute('href', cssUrl);

const root = document.createElement('div');
root.classList.add('menu__root');

root.appendChild(style);
const shadowRoot = root.attachShadow({mode: 'open'});
shadowRoot.appendChild(link)

const select = document.createRange().createContextualFragment(speedMenu);

shadowRoot.prepend(select)

menu.appendChild(root)
