chrome.runtime.onInstalled.addListener(() => {
    console.log('onInstalled')
    chrome.storage.local.get(['playbackRate']).then((result) => {
        console.log('Value currently is ' + result.playbackRate);
        if (result.playbackRate) {
            getCurrentTab().then(tab => {
                chrome.tabs.sendMessage(tab.id, {action: 'set-playback-rate'}).then((response) => {
                    console.log(response)
                })
            })
        }
    });
});

async function getCurrentTab() {
    let queryOptions = {active: true, lastFocusedWindow: true};
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
}
