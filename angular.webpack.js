/**
 * Custom angular webpack configuration
 */

module.exports = (config, options) => {
    config.target = 'electron-renderer';


    if (options.fileReplacements) {
        for(let fileReplacement of options.fileReplacements) {
            if (fileReplacement.replace !== 'src/environments/environment.ts') {
                continue;
            }

            let fileReplacementParts = fileReplacement['with'].split('.');
            if (fileReplacementParts.length > 1 && ['web'].indexOf(fileReplacementParts[1]) >= 0) {
                // config.target = 'web';
                //WORKAROUND PER EVITARE CHE QUANDO APRE ANCHE IL BROWSER
                //SI CERCA UNA DIPENDENZA CHE NON VIENE INCLUSA COL RENDEreR WEB
                //QUESTO NON FA FUNZIONARE PERO' NEL BROWSER
                config.target = 'electron-renderer';
            }
            break;
        }
    }

    return config;
}
