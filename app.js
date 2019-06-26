'use strict';
//2010 年から 2015 年にかけて 15〜19 歳の人が増えた割合の都道府県ランキング
/*
1.ファイルを読み込む
2.使用する数字を抜き出す
    ・2010年から2015年のデータ
    ・15～19歳のデータ
3.抜き出したデータを計算する
    2010 = x, 2015 = y, y / x * 100"%"
4.集計したデータを整形する
5.整形したデータを出力する 
*/
//1.ファイルを読み込む
const fs = require('fs');
const readline = require('readline');
const rs = fs.createReadStream('./popu-pref.csv');
const rl = readline.createInterface({ 'input': rs, 'output': {} });
//2.使用する数字を抜き出す。県名を名前(キー)にして
const prefDataMap = new Map(); // key: 都道府県名　value:集計データのオブジェクト
rl.on('line', (lineString) => {
    const columns = lineString.split(",");
    const year = parseInt(columns[0]);
    const pref = columns[1];
    const popu = parseInt(columns[3]);
    if (year === 2010 || year === 2015){
        let value = prefDataMap.get(pref);
        if(!value){
            value = {
                popu10: 0,
                popu15: 0,
                change: null
            };
        }
        if (year === 2010){
            value.popu10 = popu;
        }
        if (year === 2015){
            value.popu15 = popu;
        }
        prefDataMap.set(pref, value);
    }
  });
  rl.on('close', () => {
      for (let [key, value] of prefDataMap){
          value.change = value.popu15 / value.popu10 * 100;
      }
      const rankingArray = Array.from(prefDataMap).sort((pair1, pair2) => {
        return pair2[1].change - pair1[1].change;
      });
      const rankingStrings = rankingArray.map(([key, value]) => {
          return key + ': ' + value.popu10 + '人' + '  =>  ' + value.popu15 + '人' + '   変化率：' + value.change + '%';
      });
    console.log(rankingStrings);
});