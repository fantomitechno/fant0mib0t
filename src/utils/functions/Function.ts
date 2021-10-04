import { languageBuild } from "../structure";
import { error } from "../errors/err";

const lang = languageBuild();

export const multiFunction = async (f: Function, value: any[], async: boolean = false) => {
    if (!f || !value) return error(lang.errors["VALUE_IS_NOT_DEFINED"], {type: "multiFunctions"}, "multiFunctions(numberToRoman, [10, 30])");

    const results = [];
    for (let i = 0; i < value.length; i++) {
        if (async) {
            if (!(value[i] instanceof Array)) results.push(await f(value[i]??null));
            else results.push(await f(value[i][0]??null,value[i][1]??null,value[i][2]??null,value[i][3]??null,value[i][4]??null,value[i][5]??null));
        } else {
            if (!(value[i] instanceof Array)) results.push(f(value[i]));
            else results.push(f(value[i][0]??null,value[i][1]??null,value[i][2]??null,value[i][3]??null,value[i][4]??null,value[i][5]??null));
        };
    };

    return results;
};