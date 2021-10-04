export const error = (str: string, option = {}, correction: string) => {
    if (!str) str = "undefined";
    str = "\n[Package Name] - "+ "Functions tools" +"@"+ "0" +"\n\x1b[31m" + str + "\x1b[0m";
    
    if (option && typeof(option) === "object") {
        for (const [key, value] of Object.entries(option)){
            const regexp = new RegExp(`{${key}}`, "g");
            str = str.replace(regexp, value as string);
        }
    }

    if (correction)  str += "\n\x1b[32mCorrect usage: "+ correction +"\x1b[0m\n";
    return new Error(str);
}