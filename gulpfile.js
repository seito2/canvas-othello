const gulp = require("gulp");
const closureCompiler = require("google-closure-compiler").gulp();

gulp.task("compile", () => {
  return gulp
    .src("./src/othelloNoEval.js", { base: "./" })
    .pipe(
      closureCompiler(
        {
          compilation_level: "ADVANCED",
          warning_level: "VERBOSE",
          language_in: "ECMASCRIPT6_STRICT",
          language_out: "ECMASCRIPT5_STRICT",
          output_wrapper: "(function(){\n%output%\n}).call(this)",
          js_output_file: "output.min.js"
        },
        {
          platform: ["native", "java", "javascript"]
        }
      )
    )
    .pipe(gulp.dest("./dist"));
});

gulp.task("watch", () => {
  gulp.watch("./src/*.js", gulp.series("compile"));
});
