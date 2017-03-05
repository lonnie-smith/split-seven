/**
 * Builds all source code in /src, and outputs to /web
 *
 * @usage gulp
 */

import del from 'del';
import gulp from 'gulp';
import notify from './notify';
import runSequence from 'run-sequence';

function clean() {
    return del(process.env.DIRECTORY_DEST, {
        force: process.env.ENABLE_UNSAFE_CLEAN === 'true',
    });
}

gulp.task('clean', clean);

export default function build(done) {
    return runSequence(
        'clean', ['media', 'styles', 'scripts', 'vendor'],
        // ['media', 'styles', 'scripts', 'vendor'],
        () => {
            process.env.watchStarted = true;
            done();
            notify.log(
                'Build complete!',
                process.env.WATCH === 'true' ? 'Starting watch...' : '',
                true
            );
        }
    );
}

