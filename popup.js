window.onload = function () {
    document.getElementById('detectVideoBtn').addEventListener('click', function () {
        setVideoControlArea();
    });
};

function sendMessageToContentScript(message, callback) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, message, function (response) {
            if (callback) callback(response);
        })
    });
}

function setVideoControlArea() {
    document.getElementById('videos_speed_control_area').innerHTML = '';
    sendMessageToContentScript({ action: 'set_video_control_area' }, function (response) {
        document.getElementById('video_control_area').style.display = "block";
        response = response === undefined ? 0 : response;
        document.getElementById('videos_count').innerHTML = response;

        // loop
        for (let i = 0; i < response; i++) {
            let playbackRateControlElement = createPlaybackRateControlElement();
            ['mouseup', 'keyup'].forEach(function (eventType) {
                playbackRateControlElement.addEventListener(eventType, function (event) {
                    setVideoPlaybackRate(i, event.target.value);
                })
            })
            document.getElementById('videos_speed_control_area')
                .appendChild(createTableRow((i + 1), playbackRateControlElement));
        }
    });
}

function setVideoPlaybackRate(index, playbackRate) {
    sendMessageToContentScript({ action: 'set_video_playback_rate', payload: { index: index, playbackRate: playbackRate } }, function () {
        // do nothing
    })
}

function createPlaybackRateLabel(index) {
    let playbackRateLabel = document.createElement('p');
    playbackRateLabel.innerHTML = '调整第' + index + '个视频倍速'
    return playbackRateLabel;
}

function createPlaybackRateControlElement() {
    let playbackRateControl = document.createElement('input');
    playbackRateControl.type = "number";
    playbackRateControl.step = "0.1";
    // TODO
    playbackRateControl.value = '1.0';
    return playbackRateControl;
}

function createTableRow(index, inputElement) {
    let tr = document.createElement('tr');
    let th = document.createElement('th');
    let td = document.createElement('td');
    th.innerHTML = index;
    td.innerHTML = inputElement;

    tr.appendChild(th);
    tr.appendChild(td);
    return tr;
}