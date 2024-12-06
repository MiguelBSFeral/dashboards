type NullableString = string | null | undefined;

const stringUtils = {
    isNullOrWhiteSpace: function (str: NullableString) {
        return str == null || str.trim() === '';
    },
    anyIsNullOrWhiteSpace: function (...args: NullableString[]) {
        return args.some((str) => this.isNullOrWhiteSpace(str));
    },
    allIsNullOrWhiteSpace: function (...args: NullableString[]) {
        return args.every((str) => this.isNullOrWhiteSpace(str));
    },
    join: function (separator: string, ...args: NullableString[]) {
        return args.filter((str) => !this.isNullOrWhiteSpace(str)).join(separator);
    },
    insensitiveEquals: function (strA: string, strB: string) {
        return strA.toLowerCase() === strB.toLowerCase();
    },
    insensitiveIncludes: function (str: string, searchString: string) {
        return str.toLowerCase().includes(searchString.toLowerCase());
    },
    removeWhiteSpaces: function (str: string) {
        return str.replace(/\s/g, '');
    },
    replaceAll: function (str: string, target: string, replacement: string) {
        return str.replace(new RegExp(target, 'g'), replacement);
    },
    replaceAt: function (str: string, index: number, replacement: string) {
        if (index >= str.length) return str;
        return str.substring(0, index) + replacement + str.substring(index + 1);
    },
    format: function (str: string, ...args: string[]) {
        return str.replace(/{(\d+)}/g, (match, index) => {
            return args.length > index ? args[index] : match;
        });
    },
    unicodeIncludes: function (str: string, searchString: string) {
        return str
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .includes(
                searchString
                    .toLowerCase()
                    .normalize('NFD')
                    .replace(/[\u0300-\u036f]/g, ''),
            );
    },
    unicodeStartsWith: function (str: string, searchString: string) {
        return str
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .startsWith(
                searchString
                    .toLowerCase()
                    .normalize('NFD')
                    .replace(/[\u0300-\u036f]/g, ''),
            );
    },
};

export default stringUtils;
