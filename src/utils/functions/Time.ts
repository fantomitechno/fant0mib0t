import { languageBuild, objectConstructor } from "../structure";
import { error } from "../errors/err";

const lang = languageBuild();
const format = ["Y","MO","W","D","H","M","S","MS"];
const keysSeparator = [",", "/", ";", ":", "_"];


/**
 * 
 * @lang => Choose the language of the values.
 * @long => Choose if you want abbreviations or not (true = no).
 * @format => Choose the String format (Y-MO-W-D-H-M-S-MS) => (MS-Y-D).
 * @separator => Choose the separator values (default is ", ").
 * @valueNull => Choose if it sets the value equal to 0.
 * @suppressTag => suppress the values name.
 * 
 **/
export const stringifyTime = (time: number, option: objectConstructor["stringifyTime"] = {lang: "en", long: false, format: "Y-MO-W-D-H-M-S-MS", separator: ", ", valueNull: false, suppressTag: false}) => {
  if (!time) return error(lang.errors["VALUE_IS_NOT_DEFINED"], {type: "stringifyTime"}, "stringifyTime(500)");

  if (!lang[option.lang]) option.lang = "en";

  let values: (number|null)[] = [31556926000, 2629743000, 604800000, 86400000, 3600000, 60000, 1000, 1];
  let optionFormat = false;

  if (option.format && typeof(option.format) === "string") {
    option.format = option.format.toUpperCase().split("-");
    for (let i = 0; i < format.length; i++) {
      if (!option.format.includes(format[i])) {
        values[i] = null;
      };
    };

    if (values.filter(r => r).length === 0) return error(lang.errors["TIMES_NULL"], {type: "stringifyTime"}, "stringifyTime(500, {format: 'Y-MO-W-D-H-M-S-MS'})");
    option.format = option.format.filter(r => format.includes(r));
    optionFormat = true;
  }

  let times = [];
  for (let i = 0; i < values.length; i++) {
    if (values[i]){
      times.push(Math.floor(time / (values[i]??1)));
      time -= times[i] * (values[i]??1);
    } else times.push(0);
  }

  times = times.map((t, i) => t === 0 && !option.valueNull ? null : t + (!option.suppressTag ? (option.long ? " " : "") + lang[option.lang??"en"].times[i][!option.long ? 2 : t < 2 ? 0 : 1] : ""));
  
  if (optionFormat) {    
    const newTimes = [];

    for (let i = 0; i < option.format.length; i++) {
      const key = option.format[i];
      const find = format.indexOf(key);
      newTimes.push(times[find]);
    }

    times = newTimes;
  }
  const sep = option.separator && typeof(option.separator) === "string" ? option.separator : ", ";

  return times.filter(r => r).join(sep);
};
 
/**
 * 
 * @ms => Have the value in ms or in seconds.
 * 
 **/
 export const parseTime = (timeStr:string, option: objectConstructor["parseTime"] = {ms: true}) => {
  if (!timeStr) return error(lang.errors["VALUE_IS_NOT_DEFINED"], {type: "parseTime"}, "parseTime('2 days')");
    
  let values = [31556926000, 2629743000, 604800000, 86400000, 3600000, 60000, 1000, 1];
  let times = 0;
  
  for (const separator of keysSeparator) {
    const reg = new RegExp(separator, "g");
    timeStr = timeStr.replace(reg, " ");
  };

  let time: (string|number)[] = timeStr.trim().split(" ").filter(r => r.length != 0);
  
  for (let i = 0; i < time.length; i++) {
    if (typeof time[i] === "number") {
      if (typeof time[i+1] === "number") time[i+1] = (time[i] as number) + (time[i+1] as number);
      time.splice(i, 1);
    };
  };
  
  for (const t of time) {
    if (typeof t !== "string") continue;

    const number = Number(t.replace(/[^0-9-]/g, "").replace(/--/g, ""));
    if (!isNaN(number)) {
      const key = t.toLowerCase().replace(/[^a-z]/g, "");
      let num = -1;

      Object.values(lang).find((r: any) => r.times && r.times.find((b: any[] ,i: number) => {
        num = i;
        return b.find(y => y === key);
      }));

      if (num != -1) {
        times += (number * values[num]);
      };

    } else return error(lang.errors["VALUE_NOT_NUMBER"], {type: "parseTime"}, "parseTime('2 days')");
  };
  if (!option.ms) times = Math.floor(times/1000)
  return times;
};

export const wait = (time: number|string|Error) => {
  if (!time) return error(lang.errors["VALUE_IS_NOT_DEFINED"], {type: "wait"}, "wait('10s') || wait(10000)");

  if (typeof time  === "string") time = parseTime(time);

  if (typeof time === "number") {
    const json = {startTime: Date.now(), endTime: (Date.now() + time), durationTime: time};
  
    return new Promise((resolve, N_w) => {
      setTimeout(function(){
        resolve(json);
      }, time as number);
    });

  } else error(lang.errors["VALUE_NOT_NUMBER"], {type: "wait"}, "wait('10s') || wait(10000)");

};

/**
 * 
 * @MMMM => Month all
 * @MM => 3 char Month
 * @Do => dayNumber
 * @dddd => Day all
 * @dd => 3 char Day
 * @YYYY => Année full
 * @YY => 2 char Année
 * 
 * @hh => houre
 * @mm => minute
 * @ss => second
 **/
 export const formatTime = (time: number|string, option: objectConstructor["formatTime"] = {lang: "en", format: "MMMM Do YYYY, hh:mm:ss"}) => {
  if (!time) return error(lang.errors["VALUE_IS_NOT_DEFINED"], {type: "formatTime"}, "formatTime('2021-06-10') || formatTime(1623329849143)");

  if (typeof(time) === "string") time = new Date(time).getTime()
  if (typeof(time) !== "number") return error(lang.errors["VALUE_NOT_NUMBER"], {type: "formatTime"}, "formatTime('2021-06-10') || formatTime(1623329849143)");
  
  if (!option.format) option.format = "MMMM Do YYYY, h:mm:ss";
  if (!lang[option.lang]) option.lang = "en";

  const key = lang[option.lang].format.day;
  const date = new Date(time);
  const month = lang[option.lang].format.months[date.getMonth()];
  const day = lang[option.lang].format.days[date.getDay()];
  const dayNumber = ("00" + date.getDate()).slice(-2) + (key[date.getDate()-1] ? key[date.getDate()-1] : lang[option.lang].format.th)
  const years = date.getFullYear();

  const hours = ("00" + date.getHours()).slice(-2);
  const minutes = ("00" + date.getMinutes()).slice(-2);
  const second = ("00" + date.getSeconds()).slice(-2);
  
  const updateText = ["MMMM", "MM", "Do", "dddd", "dd", "YYYY", "YY", "hh", "mm", "ss"];
  const updateValue = [month, month.slice(0, 3), dayNumber, day, day.slice(0, 3), years, years.toString().slice(2, 4), hours, minutes, second]
  
  for (let i = 0; i < updateText.length; i++) {
    const reg = new RegExp(updateText[i], "g");
    option.format = option.format.replace(reg, String(updateValue[i]))
  }

  return option.format
}