var publicAssets = "./dist";
var sourceFiles  = "./src";

module.exports = {
  bowerDir: './bower_components',
  publicAssets: publicAssets,
  sass: {
    src: sourceFiles + "/styles/scss/**/*.{sass,scss}",
    dest: publicAssets + "/css",
    settings: {
      indentedSyntax: true, // Enable .sass syntax!
      imagePath: '/assets/images' // Used by the image-url helper
    }
  },
  browserify: {
    bundleConfigs: [{
      entries: sourceFiles + '/js/index.js',
      dest: publicAssets,
      outputName: 'index.js',
      extensions: ['.js']
    }]
  }
}