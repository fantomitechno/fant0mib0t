import { languageBuild, objectConstructor } from "../structure";
import { error } from "../errors/err";

const lang = languageBuild();
/**
 * 
 * @param array any[]
 * @param search string
 * @param option The options for the functions
 * They are : 
 * `
 * {
 *    all: boolean
 * }
 * `
 */
export const findArray = (array: any[], search: string, option?: objectConstructor["findArray"]) => {
    if (!array || !search) return error(lang.errors["VALUE_IS_NOT_DEFINED"], {type: "findArray"}, "findArray(['a','b','c'], 'a')");
 
    let boolean = false;
    let findValue = new Map();

    findOneDimension(array);
    
    function findOneDimension(a: any[], opt?: string) {
        for (let i = 0; i < a.length; i++ ) {
            if (!opt) opt = "";
            if (boolean) break;
            if (a[i] instanceof Array) {
                opt += (opt.length === 0 ? "" : ";") + i;
                findOneDimension(a[i], opt);
            } else if (a[i] === search) {
                opt += (opt.length === 0 ? "" : ";") + i;
                const searchValue = opt.split(";").map(n => Number(n));
                findValue.set(findValue.size, searchValue);

                if (!option?.all) {
                    boolean = true;
                };
            };
        };
    };
    return findValue;
};


/**
 * 
 * @param a any[]
 * @param option The options for the functions
 * They are : 
 * `
 * {
 *  number: number;
    double: boolean;
 * }
 * `
 */
export const randomArray = (a: any[], option: objectConstructor["randomArray"] = {number: 1, double: true}) => {
    if (!a) return error(lang.errors["VALUE_IS_NOT_DEFINED"], {type: "randomArray"}, "randomArray(['a','b','c'])");

    const randomList = [];
    const array = a.slice(0, a.length);

    for (let i = 0; i < option.number; i++) {
        if (array.length === 0) break;
        const random = Math.floor(Math.random() * array.length);
        randomList.push(array[random]);

        if (!option.double) {
            array.splice(random, 1);
        };
    };

    return randomList.length === 0 ? undefined : randomList.length === 1 ? randomList[0] : randomList;
};