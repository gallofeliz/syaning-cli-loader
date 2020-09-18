'use strict';

module.exports = loader;

var lib = {
    basic: {
        frames: ['-', '\\', '|', '/'],
        interval: 100
    },
    'basic-reverse': {
        frames: ['-', '/', '|', '\\'],
        interval: 100
    },
    stack: {
        frames: ['▁', '▂', '▃', '▄', '▅', '▆', '▇', '█'],
        interval: 200
    },
    beautiful: {
        frames: [
            '▁      ',
            '▁ ▃    ',
            '▁ ▃ ▅  ',
            '▁ ▃ ▅ ▇',
            '  ▃ ▅ ▇',
            '    ▅ ▇',
            '      ▇',
            '       ',
        ],
        interval: 150

    },
    arrow: {
        frames: ['>  ', '>> ', '>>>', '   '],
        interval: 200
    },
    dots: {
        frames: ['.  ', '.. ', '...', '   '],
        interval: 200
    }
};

function loader(preset, opts) {
    var id,
        spinner,
        stream = process.stdout;

    if (!preset) {
        preset = 'basic';
    }

    spinner = typeof preset === 'string' ? lib[preset] : preset;

    opts = opts || {};

    if (opts.frames) {
        spinner.frames = opts.frames;
    }

    if (opts.interval) {
        spinner.interval = opts.interval;
    }

    var speedMap = {
        fast: 2,
        faster: 1.5,
        normal: 1,
        slower: 0.75,
        slow: 0.5
    };
    if (opts.speed) {
        if (typeof opts.speed === 'string' && speedMap[opts.speed]) {
            spinner.interval /= speedMap[opts.speed];
        } else if (typeof opts.speed === 'number') {
            spinner.interval /= opts.speed;
        }
    }


    return {
        start: start,
        stop: stop
    };

    function start() {
        var frames = spinner.frames,
            len = frames.length,
            interval = spinner.interval,
            i = 0;

        if (opts.hideCursor) {
            stream.write('\x1B[?25l');
        }

        stream.cursorTo(frames[0].length);
        clearInterval(id);
        id = setInterval(function() {
            stream.clearLine();
            stream.cursorTo(0);
            stream.write(frames[i++ % len]);
        }, interval);
    }

    function stop() {
        if (opts.hideCursor) {
            stream.write('\x1B[?25h');
        }

        stream.clearLine();
        stream.cursorTo(0);
        clearInterval(id);
    }
}

loader.spinner = function(name) {
    return lib[name];
};
