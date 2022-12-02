
function setupNotie(notie, socket) {    
    socket.on('success', function(msg) {
        notie.alert({ type: 'success', text: msg })
    });
    socket.on('info', function(msg) {
        notie.alert({ type: 'info', text: msg })
    });
    socket.on('err', function(msg) {
        notie.alert({ type: 'error', text: msg })
    });
}

function getTimestamp() {
    return Math.floor(Date.now() / 1000);
}

function getSessionIdFromURL() {
    let arr = window.location.href.split('/');
    if (arr[arr.length - 1].length === 0) // to accommodate case of "/" at end of URL
        arr.pop();
    if (arr[arr.length - 1] === 'results')
        arr.pop();
    return arr.pop();
}

function getFormattedTimestamp(unixTimestamp) {
    let d = new Date(unixTimestamp * 1000);
    return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
}

function getURLparams(url) {
    let params = {};
    if (url.length > 0) {
        let arr = url.substring(1).split('&');
        for (let i = 0; i < arr.length; i ++)
            if (arr[i].split('=').length > 1)
                params[arr[i].split('=')[0]] = arr[i].split('=')[1];
    }
    return params;
}

function createElement(type, parent, content, className) {
    let element = document.createElement(type);
    element.className = className;
    element.textContent = content;
    parent.appendChild(element);
    return element;
}
