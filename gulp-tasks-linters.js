import path from 'path';
import eslint from 'gulp-eslint';
import shelljs from 'shelljs';
import deepAssign from 'deep-assign';

import gulpOptionsBuilder from './gulp-options-builder';

export function linterTasks (gulp) {

  const options = gulpOptionsBuilder();

  const scssLintPath = path.resolve(__dirname, '.scss-lint.yml');
  const esLintPath = path.resolve(__dirname, '.eslintrc');
  const customEslint = options.customEslintPath ?
    require(options.customEslintPath) : {};

  gulp.task('scsslint', () => {
    if (options.scsslint) {
      if (shelljs.which('scss-lint')) {
        var scsslint = require('gulp-scss-lint');
        return gulp.src(options.scssAssets || []).pipe(scsslint({
          'config': scssLintPath
        })).pipe(scsslint.failReporter());
      } else {
        console.error('[scsslint] scsslint skipped!');
        console.error(
          '[scsslint] scss-lint is not installed. Please install ruby and the ruby gem scss-lint.'
        );
      }
    }
    return false;
  });

  gulp.task('jslint', () => {
    const eslintRules = deepAssign({
      configFile: esLintPath
    }, customEslint);
    return gulp.src(options.jsAssets || [])
      .pipe(eslint(eslintRules))
      .pipe(eslint.formatEach())
      .pipe(eslint.failOnError());
  });
};

export default linterTasks;
