const DF = require('./dataFormator');
const Iconv = require('utf8');
const Tp = require('../templates/template.json');

class dfBody extends DF {
  get output() {
    return this.format(this._data)
  }

  format(data){
    let result = {}
    if(typeof Tp.version !== "undefined") {
        result.version = data.version
    }
    if(typeof Tp.emojis !== "undefined"){
        result.emojis = []
        let isMapper = Tp.emojis.length >0
        let limiter = Tp.emojis[0]
        for(let it in data.emojis) {
            let info = data.emojis[it]
            if(isMapper && limiter!==undefined) {
              let tmp = {}
              let len  = 0 
              for(let key in limiter){
                if(typeof info[key] !== "undefined"){
                    tmp[key] = info[key]
                    len++
                    continue
                }
                if(key === "${utf8}") {
                  tmp[this.toUnicode(info.emoji)] = info.emoji
                  len++
                  continue
                }
                if(key == "utf8") {
                  tmp["utf8"] =  this.toUnicode(info.emoji)
                  len++
                  continue
                }
              }
              if(len>0) {
                 result.emojis.push(tmp)
              }
            }else{
               result.emojis.push(info.emoji)
            }
        }
        data = result
    }
    return JSON.stringify(data, null, 2);
  }

  toUnicode(str){
    let encode = '' 
    for (let i=0;i<str.length;i++){
        encode += `\\u${str.charCodeAt(i).toString(16)}`
     }
     return encode
  }
}

module.exports = dfBody;
