1. Remove bower_components from git
2. No need for the config/express.js file. Move logic to server.js
3. When using 'require' - please target a specific file and don't count on index.js (why not to be specific?). Like the great singer Jack Johnson said - "shortcuts can slow you down".. be specific..
4. Please use only 1 return per function (you'll thank me later :))
5. Remove all "things" references
6. Add 'gulp-shell' and 'gulp-util' to npm devDependancies
