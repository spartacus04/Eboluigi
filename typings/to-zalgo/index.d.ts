declare module 'to-zalgo'{
    type options = {
        up: boolean,
        middle: boolean,
        down: boolean,
        size: 'mini' | 'maxi'
    };
    declare function _exports(text: string, options?: options): string;
    export = _exports;
}
