const error = new Error();
const callerFile = error.stack?.split('\n')[3].trim().replace(/^at /, '');
const insidePerantheses = callerFile?.match(/\(([^)]+)\)/)?.[1];
const getOnlyfilePaths = insidePerantheses?.split(':')[0]
console.log(getOnlyfilePaths);
