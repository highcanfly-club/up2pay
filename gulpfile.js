/*!
=========================================================
* © 2024 Ronan LE MEILLAT for SCTG Development
=========================================================
* RUN WITH
* cd webconsole
* npx gulp -f setlicenserust.js licensesRust
*/
import fs from 'fs'
import gulp from 'gulp'
import gap from 'gulp-append-prepend'
import gulpif from 'gulp-if'

function checkCopyright(file) {
  const content = fs.readFileSync(file.path, 'utf8')
  return !content.includes('Ronan LE MEILLAT for SCTG Development')
}

const copyrightText = `/*
 * Copyright© 2024 Ronan LE MEILLAT for SCTG Development,
 * Association High Can Fly and Les Ailes du Mont-Blanc
 *
 * Up2Pay is free software: you can redistribute it and/or modify
 * it under the terms of the Affero General Public License version 3 as
 * published by the Free Software Foundation.
 *
 * Up2Pay is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * Affero General Public License for more details.
 *
 * You should have received a copy of the Affero General Public License
 * along with Up2Pay. If not, see <https://www.gnu.org/licenses/agpl-3.0.html>.
 */`

gulp.task('licenses', async function () {
  gulp
    .src(['**/*.ts', '**/*.js', '!node_modules/**', '!dist/**', '!**/node_modules/**', '!**/dist/**'])
    .pipe(gulpif(checkCopyright, gap.prependText(copyrightText)))
    .pipe(gulp.dest('.', { overwrite: true }))
  return
})
