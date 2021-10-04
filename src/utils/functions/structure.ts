export type objectConstructor = {
    stringifyTime: {
        lang: "fr"|"en";
        long: boolean;
        format: string|string[];
        separator: string;
        valueNull: boolean;
        suppressTag: boolean;
    };
    parseTime: {
        ms: boolean;
    };
    findArray: {
        all: boolean;
    };
    formatTime: {
        lang: "fr"|"en";
        format: string;
    };
    randomArray: {
        number: number;
        double: boolean;
    }
};

type language = {
    times: string[][];
    format: {
        months: string[];
        days: string[];
        day: string[];
        th: string;
    };
};
type error = {
    VALUE_NOT_NUMBER: string;
    VALUE_NOT_STRING: string;
    VALUE_NOT_ARRAY: string;
    VALUE_NOT_OBJECT: string;
    VALUE_NOT_BOOLEAN: string;
    VALUE_NOT_FUNCTION: string;
    VALUE_IS_NOT_DEFINED: string;
    TIMES_NULL: string;
};

type langType = {
    fr: language;
    en: language;
    errors: error;
};

let lang: any;

export const languageBuild = (): langType => {
    if (lang) {
        return lang;
    } else {
        lang.fr = require("./json/fr.json");
        lang.en = require("./json/en.json");
        lang.errors = require("./errors/Message.json");

        return lang;
    }
};