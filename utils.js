//Retrieves the current active tab in the current window.
export async function getCurrentTab(){
    let queryOptions = {active:true, currentWindow: true};
    let[tab] = await chrome.tabs.query(queryOptions);
    return tab;
}
