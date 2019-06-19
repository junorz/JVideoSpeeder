chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    // 获取网页视频数
    if (request.action == 'set_video_control_area') {
        let videosCount = document.getElementsByTagName('video').length;
        sendResponse(videosCount);
    }

    // 调整倍速
    if (request.action == 'set_video_playback_rate') {
        let videoElement = document.getElementsByTagName('video')[request.payload.index];
        videoElement.playbackRate = request.payload.playbackRate;
        console.log('已将第', (request.payload.index + 1), '个视频播放倍速调整为', request.payload.playbackRate);
        sendResponse('');
    }
});