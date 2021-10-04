import { languageBuild } from "../structure";
import { error } from "../errors/err";

const lang = languageBuild();

export const replaceText = (string: string, replace: Object = {}) => {
    if (!string || !replace) return error(lang.errors["VALUE_IS_NOT_DEFINED"], {type: "replaceText"}, "replaceText('Hello {user}', {user: 'NewGlace'})");

    for (const [key, value] of Object.entries(replace)) {
        const regexp = new RegExp(`{${key}}`, "g");
        string = string.replace(regexp, value);
    };

    return string;
};