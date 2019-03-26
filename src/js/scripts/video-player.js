const supportsVideo = !!document.createElement('video').canPlayType;

if (supportsVideo) {
    const video = document.querySelector('.video');
    const videoControls = document.querySelector('.video-controls');
    const videoContainer = document.querySelector('.video-container');
    const graphicElements = document.querySelector('.graphic-elements-list');

    const fullScreen = document.querySelector('.btn-fullscreen');
    const settings = document.querySelector('.btn-settings');
    const durationElement = document.querySelector('.video-data__duration');
    const currTimeElement = document.querySelector('.video-data__current-time');
    const playpause = document.querySelector('.btn-play-pause');
    const mute = document.querySelector('.btn-mute');
    const progress = document.querySelector('.progress-range');
    const timelineIndicator = document.querySelector('.timeline-indicator');
    const tooltipText = document.querySelector('.tooltip__text');

    const sliderRange = [...document.querySelectorAll('input[type = "range"]')];
    const sliderZoom = document.querySelector('.slider-range.zoom-slider__range');
    const sliderVolume = document.querySelector('.slider-range.volume-slider__range');
    const outputZoom = document.querySelector('.zoom-slider__value');
    const outputVolume = document.querySelector('.volume-slider__value');
    const zoomMinusButton = document.querySelector('.btn-zoom-minus');
    const zoomPlusButton = document.querySelector('.btn-zoom-plus');

    // Hide the default controls
    video.controls = false;

    // Display the user defined video controls
    videoControls.style.display = 'block';

    // If the browser doesn't support the progress element, set its state for some different styling
    const supportsProgress = (document.createElement('progress').max !== undefined);

    if (!supportsProgress) {
        progress.setAttribute('data-state', 'fake');
    }

    // Check if the browser supports the Fullscreen API
    const fullScreenEnabled = !!(document.fullscreenEnabled
        || document.mozFullScreenEnabled
        || document.msFullscreenEnabled
        || document.webkitSupportsFullscreen
        || document.webkitFullscreenEnabled
        || document.createElement('video').webkitRequestFullScreen);

    // If the browser doesn't support the Fulscreen API then hide the fullscreen button
    if (!fullScreenEnabled) {
        fullscreen.style.display = 'none';
    }

    // Check the volume
    const checkVolume = function (value) {
        let currentVolume = value / 100;

        if (value) {
            video.volume = currentVolume;
        } else {
            video.muted = currentVolume <= 0;
            changeButtonState('mute');
        }
    };

    // Set the video container's fullscreen state
    const setFullscreenData = function (state) {
        videoContainer.setAttribute('data-fullscreen', !!state);
        // Set the fullscreen button's 'data-state' which allows the correct button image to be set via CSS
        fullscreen.setAttribute('data-state', !!state ? 'cancel-fullscreen' : 'go-fullscreen');
    };

    // Checks if the document is currently in fullscreen mode
    const isFullScreen = () => {
        return !!(document.fullScreen || document.webkitIsFullScreen || document.mozFullScreen || document.msFullscreenElement || document.fullscreenElement);
    };

    // Fullscreen
    const handleFullscreen = () => {
        // If fullscreen mode is active...
        if (isFullScreen()) {
            // ...exit fullscreen mode
            // (Note: this can only be called on document)
            if (document.exitFullscreen) document.exitFullscreen();
            else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
            else if (document.webkitCancelFullScreen) document.webkitCancelFullScreen();
            else if (document.msExitFullscreen) document.msExitFullscreen();
            setFullscreenData(false);
        } else {
            // ...otherwise enter fullscreen mode
            // (Note: can be called on document, but here the specific element is used as it will also ensure that the element's children, e.g. the custom controls, go fullscreen also)
            if (videoContainer.requestFullscreen) videoContainer.requestFullscreen();
            else if (videoContainer.mozRequestFullScreen) videoContainer.mozRequestFullScreen();
            else if (videoContainer.webkitRequestFullScreen) {
                // Safari 5.1 only allows proper fullscreen on the video element. This also works fine on other WebKit browsers as the following CSS (set in styles.css) hides the default controls that appear again, and
                // ensures that our custom controls are visible:
                // figure[data-fullscreen=true] video::-webkit-media-controls { display:none !important; }
                // figure[data-fullscreen=true] .controls { z-index:2147483647; }
                video.webkitRequestFullScreen();
            } else if (videoContainer.msRequestFullscreen) videoContainer.msRequestFullscreen();
            setFullscreenData(true);
        }
    };

    // Only add the events if addEventListener is supported (IE8 and less don't support it, but that will use Flash anyway)
    if (document.addEventListener) {
        // Wait for the video's meta data to be loaded, then set the progress bar's max value to the duration of the video
        video.addEventListener('loadedmetadata', () => {
            progress.setAttribute('max', video.duration);

            durationElement.innerHTML = `${video.duration.toFixed(2)}`;
            outputVolume.innerHTML = `${sliderVolume.value}%`;

            updateZoomValue();
            updateZoomProgress();
        });

        // Changes the button state of certain button's so the correct visuals can be displayed with CSS
        const changeButtonState = (type) => {
            // Play/Pause button
            if (type === 'playpause') {
                if (video.paused || video.ended) {
                    playpause.setAttribute('data-state', 'play');
                }
                else {
                    playpause.setAttribute('data-state', 'pause');
                }

                [...playpause.querySelectorAll('.svg')].forEach(item => item.classList.toggle('hidden'));
            }
            // Mute button
            else if (type === 'mute') {
                mute.setAttribute('data-state', video.muted ? 'unmute' : 'mute');
            }
        };

        const updateZoomProgress = () => {
            sliderRange.forEach(item => {
                let percent = Math.round(((item.value - item.min) / (item.max - item.min)) * 100);

                item.style.background = '-webkit-linear-gradient(left, #25ACFA ' + percent + '%, #0D0B2F ' + percent + '%)';
            });
        };

        const updateZoomValue = () => outputZoom.innerHTML = `${sliderZoom.value}%`;

        // Update the current slider value (each time you drag the slider handle)
        sliderZoom.addEventListener('input', function () {
            outputZoom.innerHTML = `${this.value}%`;
        });

        sliderVolume.addEventListener('input', function () {
            outputVolume.innerHTML = `${this.value}%`;
        });

        sliderRange.forEach(item => item.addEventListener('input', function () {
            let percent = Math.round(((item.value - item.min) / (item.max - item.min)) * 100);
            item.style.background = '-webkit-linear-gradient(left, #25ACFA ' + percent + '%, #0D0B2F ' + percent + '%)';
        }));

        // Add event listeners for zoom buttons
        zoomMinusButton.addEventListener('click', () => {
            const zoomMin = Number(sliderZoom.min);
            let zoomValue = Number(sliderZoom.value);

            if (zoomValue >= zoomMin) {
                sliderZoom.value -= 10;
                updateZoomValue();
                updateZoomProgress();
            }
        });

        zoomPlusButton.addEventListener('click', () => {
            const zoomMax = Number(sliderZoom.max);
            let zoomValue = Number(sliderZoom.value);

            if (zoomValue <= zoomMax) {
                sliderZoom.value = zoomValue + 10;
                updateZoomValue();
                updateZoomProgress();
            }
        });

        // Add event listeners for video specific events
        video.addEventListener('play', function () {
            changeButtonState('playpause');
        }, false);

        video.addEventListener('pause', function () {
            changeButtonState('playpause');
        }, false);

        // Add events for all buttons
        playpause.addEventListener('click', function (e) {
            if (video.paused || video.ended) video.play();
            else video.pause();
        });

        mute.addEventListener('click', function (e) {
            video.muted = !video.muted;
            changeButtonState('mute');
        });

        sliderVolume.addEventListener('input', function (e) {
            checkVolume(this.value);
        });

        if (fullScreen) {
            fullScreen.addEventListener('click', function (e) {
                handleFullscreen();
            });
        }

        // As the video is playing, update the progress bar
        video.addEventListener('timeupdate', function () {
            if (!progress.getAttribute('max')) {
                progress.setAttribute('max', video.duration);
            }

            let position = Math.round((progress.value / progress.max) * 100);
            const currTime = video.currentTime.toFixed(2);

            progress.value = currTime;
            currTimeElement.innerHTML = `${currTime}`;

            tooltipText.style.left = `calc(${position}%)`;
            timelineIndicator.style.left = `calc(${position}%)`;

            updateZoomProgress();
        });

        // Listen for fullscreen change events (from other controls, e.g. right clicking on the video itself)
        document.addEventListener('fullscreenchange', function () {
            setFullscreenData(!!(document.fullScreen || document.fullscreenElement));
        });
        document.addEventListener('webkitfullscreenchange', function () {
            setFullscreenData(!!document.webkitIsFullScreen);
        });
        document.addEventListener('mozfullscreenchange', function () {
            setFullscreenData(!!document.mozFullScreen);
        });
        document.addEventListener('msfullscreenchange', function () {
            setFullscreenData(!!document.msFullscreenElement);
        });
    }
}