/* eslint-disable @typescript-eslint/no-var-requires */
const gulp = require('gulp');
const ts = require('gulp-typescript');
const path = require('path');
const terser = require('gulp-terser');

const buildDir = path.resolve(__dirname, './_build');
const distDir = path.resolve(buildDir, './dist');
const project = ts.createProject({
  target: 'es2018',
  lib: ['esnext'],
  allowSyntheticDefaultImports: true,
  module: 'commonjs',
  esModuleInterop: true,
  moduleResolution: 'node',
  experimentalDecorators: true,
  emitDecoratorMetadata: true,
  allowJs: true,
  checkJs: false,
  skipLibCheck: true,
  strictNullChecks: true
});

function compile() {
  return gulp
    .src(['./src/**/*.js', './src/**/*.ts', '!**/node_modules/**/*'], {
      cwd: __dirname,
    })
    .pipe(project())
    .pipe(terser())
    .pipe(gulp.dest(distDir));
}

function copyPackageJson() {
  return gulp.src(['package.json', 'yarn.lock'], { cwd: __dirname }).pipe(gulp.dest(buildDir));
}

function copySwagger() {
  return gulp.src(['./swagger/**/*'], { cwd: __dirname }).pipe(gulp.dest(buildDir + '/swagger/'));
}

const build = gulp.parallel(copyPackageJson, copySwagger, compile);

module.exports = {
  build,
};
