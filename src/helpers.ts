const ReadTime = require('reading-time/lib/reading-time')
import PrettyMilliseconds from "pretty-ms"
import ReadingTime from "./main";


export function readingTimeText(text: string, plugin: ReadingTime) {
  const result = ReadTime(text, {
    wordsPerMinute: plugin.settings.readingSpeed,
  })
  let options: any = {
    secondsDecimalDigits: 0
  }
  switch (plugin.settings.format) {
    case 'simple':
      break;
    case 'compact':
      if (result.time > 3600000) {
        options.unitCount = 2;
      } else {
        options.compact = true
      }
      break;
    case 'verbose':
      options.verbose = true;
      break;
    case 'digital':
      options.colonNotation = true;
      break;
    case 'default':
      return result.text.replace('read', plugin.settings.appendText);
  }
  let output = PrettyMilliseconds(result.time, options);
  console.log("output",output);
  console.log("plugin.settings.appendText",plugin.settings.appendText);
  return plugin.settings.appendText ? `${output} ${plugin.settings.appendText}` : output;
}

export function readingTimeText2(text: string, plugin: ReadingTime) {
    const result = ReadTime(text, {
      wordsPerMinute: plugin.settings.readingSpeed2,
    })
    let options:any = {
      secondsDecimalDigits: 0
    }
    switch (plugin.settings.format) {
      case 'simple':
        break;
      case 'compact':
        if (result.time > 3600000) {
          options.unitCount = 2;
        } else {
          options.compact = true
        }
        break;
      case 'verbose':
        options.verbose = true;
        break;
      case 'digital':
        options.colonNotation = true;
        break;
      case 'default':
        return result.text.replace('read', plugin.settings.appendText2);
    }
    let output = PrettyMilliseconds(result.time, options)
    return plugin.settings.appendText2 ? `${output} ${plugin.settings.appendText2}` : output;
  }
