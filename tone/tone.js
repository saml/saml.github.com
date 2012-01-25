var AudioOut = function(config) {
    if (typeof Audio === 'undefined'
        || typeof Float32Array !== 'function') {
        return false;
    }

    if (typeof config === 'undefined') {
        config = {};
    }

    var me = {};
    
    var audio = config.audio || new Audio();
    if (typeof audio.mozSetup !== 'function'
        || typeof audio.mozWriteAudio !== 'function'
        || typeof audio.mozCurrentSampleOffset !== 'function') {
        return false;
    }


    var channels = config.channels || 1;
    var sampleRate = config.sampleRate || 44100;
    var preBufferSize = config.preBufferSize || sampleRate;//defaults to 1000ms worth sample.
    var writeInterval = config.writeInterval || 100;//msec.
    var intervalId;
    var currentWritePosition = 0;
    var tail = null;
    var tailPosition = 0;


    //init
    audio.mozSetup(channels, sampleRate);

    var writeFunction = function() {
        var written;
    
        if (tail) {
            written = audio.mozWriteAudio(tail.subarray(tailPosition));
            currentWritePosition += written;
            tailPosition += written;
            if (tailPosition < tail.length) {
                return;
            }
            tail = null;
        }

        var currentPosition = audio.mozCurrentSampleOffset();
        var available = currentPosition + preBufferSize - currentWritePosition;

        if (available > 0) {
            var soundData = new Float32Array(available);
            me.readFn(soundData);

            written = audio.mozWriteAudio(soundData);
            if (written < available) {
                tail = soundData;
                tailPosition = written;
            }

            currentWritePosition += written;
        }
    };

    me.sineGenerator = function(freq, duration_msec) {
        var currentSoundSample = 0;
        var maxSoundSample = sampleRate * duration_msec/1000.0;
        var k = 2 * Math.PI * freq / sampleRate;
        var diff = function(a,b) {
            var result = b - a;
            return result < 0 ? 0 : result / maxSoundSample;
        };
        return (function(soundData) {
            var i = 0;
            var size = soundData.length;
            for (i = 0; i < size; i++) {
                var volume = diff(currentSoundSample, maxSoundSample);
                soundData[i] = Math.sin(k * currentSoundSample++) * volume;
            }
        });
    };

    me.readFn = undefined;
    me.start = function() {
        if (typeof me.readFn !== 'function') {
            return false;
        }
        intervalId = window.setInterval(writeFunction, writeInterval);
        return true;
    };

    me.stop = function() {
        if (intervalId) {
            window.clearInterval(intervalId);
        }
    };


    return me;
};

