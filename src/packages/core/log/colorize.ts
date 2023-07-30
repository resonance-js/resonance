// Note - imported from utils so as not to add utils as a dependency for access
// to this single file.
export namespace Colorize {
    export const green = (text: any) => `\x1B[32m${text}\x1B[39m`;
    export const yellow = (text: any) => `\x1B[33m${text}\x1B[39m`;
    export const red = (text: any) => `\x1B[31m${text}\x1B[39m`;
    export const magentaBright = (text: any) => `\x1B[95m${text}\x1B[39m`;
    export const cyanBright = (text: any) => `\x1B[96m${text}\x1B[39m`;
}
