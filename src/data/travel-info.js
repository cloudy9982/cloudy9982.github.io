// ============================================================
// travel-info.js — 函館遊記資料層（桌面版專用，可自由編輯）
// ============================================================

export const TRIP_INFO = {
  title: 'Hakodate 遊記',
  subtitle: 'Bon Voyage · 函館之旅',
  destination: '函館',
  dates: { start: '2026-05-18', end: '2026-05-25', totalDays: 8 },

  hotel: {
    name: '函館恆星飯店',
    nameEn: 'Hakodate Stella Hotel',
    totalJPY: 34800,
    checkIn: '2026-05-18',
    checkOut: '2026-05-25',
    address: '北海道函館市若松町 33-7',
  },

  flights: {
    outbound: {
      from: 'TPE', fromCity: '台北桃園',
      to: 'HKD', toCity: '函館',
      departTime: '07:00', arriveTime: '11:30',
      duration: '3h 30m',
      airline: '台灣虎航', airlineEn: 'Tigerair Taiwan',
      flightNo: 'IT 236',
      aircraft: 'Airbus A320',
      cabin: '經濟艙',
      date: '2026-05-18',
    },
    inbound: {
      from: 'HKD', fromCity: '函館',
      to: 'TPE', toCity: '台北桃園',
      departTime: '12:30', arriveTime: '15:45',
      duration: '4h 15m',
      airline: '台灣虎航', airlineEn: 'Tigerair Taiwan',
      flightNo: 'IT 237',
      aircraft: 'Airbus A320',
      cabin: '經濟艙',
      date: '2026-05-25',
    },
  },

  days: [
    {
      day: 1, date: '2026-05-18', weekday: 'MON',
      schedules: [
        { id: 'd1-1', time: '15:45', name: '函館機場抵達', location: '函館空港', note: '搭利木津巴士前往市區，約 30 分鐘', lat: 41.7716, lng: 140.8219 },
        { id: 'd1-2', time: '17:30', name: '恆星飯店 Check-in', location: '函館市元町', note: '放行李，換上輕便服裝休息一下', lat: 41.7724, lng: 140.7257 },
        { id: 'd1-3', time: '18:30', name: '函館朝市晚市', location: '函館朝市', note: '海鮮丼首夜！記得試試海膽', lat: 41.7744, lng: 140.7272 },
        { id: 'd1-4', time: '20:30', name: '金森倉庫夜景', location: '金森紅磚倉庫', note: '橘燈倒映海面，浪漫初探', lat: 41.7710, lng: 140.7188 },
      ],
    },
    {
      day: 2, date: '2026-05-19', weekday: 'TUE',
      schedules: [
        { id: 'd2-1', time: '06:30', name: '函館朝市早餐', location: '函館朝市', note: '帝王蟹 + 海鮮丼，早來才排得到！', lat: 41.7744, lng: 140.7272 },
        { id: 'd2-2', time: '09:30', name: '五稜郭公園', location: '五稜郭', note: '星形要塞，昔日幕末古戰場', lat: 41.7965, lng: 140.7575 },
        { id: 'd2-3', time: '12:00', name: 'Lucky Pierrot 午餐', location: '十字街本店', note: '函館限定！必點中式炒麵堡', lat: 41.7718, lng: 140.7200 },
        { id: 'd2-4', time: '14:00', name: '八幡坂展望', location: '八幡坂', note: '日本最美坡道，正對函館港', lat: 41.7733, lng: 140.7147 },
        { id: 'd2-5', time: '16:00', name: '元町西洋館街道', location: '元町', note: '紅磚教堂與洋館，異國氛圍滿點', lat: 41.7739, lng: 140.7129 },
        { id: 'd2-6', time: '19:30', name: '函館山夜景', location: '函館山展望台', note: '世界三大夜景！搭纜車上山', lat: 41.7617, lng: 140.6989 },
      ],
    },
    {
      day: 3, date: '2026-05-20', weekday: 'WED',
      schedules: [
        { id: 'd3-1', time: '09:00', name: '湯之川温泉足湯', location: '湯之川温泉街', note: '免費足湯散策', lat: 41.7487, lng: 140.7869 },
        { id: 'd3-2', time: '11:00', name: '熱帶植物園', location: '函館市熱帶植物園', note: '猴子泡溫泉！春天必看', lat: 41.7460, lng: 140.7898 },
        { id: 'd3-3', time: '13:00', name: '濱膳海鮮定食', location: '函館港附近', note: '當日漁獲，鮮甜到流淚', lat: 41.7715, lng: 140.7175 },
        { id: 'd3-4', time: '18:00', name: '美鈴咖啡', location: '美鈴咖啡本店', note: '1938 年老字號，濃郁手沖咖啡', lat: 41.7710, lng: 140.7222 },
      ],
    },
    {
      day: 4, date: '2026-05-21', weekday: 'THU',
      schedules: [
        { id: 'd4-1', time: '08:00', name: '朝市再訪', location: '函館朝市', note: '今天試試活螃蟹！', lat: 41.7744, lng: 140.7272 },
        { id: 'd4-2', time: '10:00', name: '舊函館區公會堂', location: '函館市中央院', note: '明治洋館，藍色外牆超上相', lat: 41.7736, lng: 140.7124 },
        { id: 'd4-3', time: '12:00', name: '函館鹽拉麵', location: '一文字家', note: '清澈鹽味湯底，函館必吃', lat: 41.7723, lng: 140.7234 },
        { id: 'd4-4', time: '16:30', name: '函館正教會', location: '函館正教會', note: '1916 年建築，金色洋蔥穹頂', lat: 41.7738, lng: 140.7138 },
        { id: 'd4-5', time: '19:00', name: '大門橫丁', location: '大門橫丁', note: '10 間小吃攤，烤串喝酒好去處', lat: 41.7726, lng: 140.7268 },
      ],
    },
    {
      day: 5, date: '2026-05-22', weekday: 'FRI',
      schedules: [
        { id: 'd5-1', time: '08:30', name: '搭 JR 前往大沼', location: '函館站', note: '車程約 30 分鐘', lat: 41.9865, lng: 140.6608 },
        { id: 'd5-2', time: '10:00', name: '大沼湖景遊船', location: '大沼國定公園', note: '駒ケ岳倒影，絕美！', lat: 41.9902, lng: 140.6643 },
        { id: 'd5-3', time: '12:00', name: '大沼名物糰子', location: '大沼公園前商店', note: '三色串糰子，甜點必買', lat: 41.9887, lng: 140.6630 },
        { id: 'd5-4', time: '16:30', name: 'Milkissimo 冰淇淋', location: '金森倉庫附近', note: '北海道牛奶爆濃！排隊值得', lat: 41.7710, lng: 140.7190 },
        { id: 'd5-5', time: '19:00', name: '海鮮燒烤居酒屋', location: '港口周邊', note: '現烤生蠔 + 干貝，人生巔峰', lat: 41.7715, lng: 140.7178 },
      ],
    },
    {
      day: 6, date: '2026-05-23', weekday: 'SAT',
      schedules: [
        { id: 'd6-1', time: '09:00', name: '朝市最後一次', location: '函館朝市', note: '跟攤主道別，珍惜最後早餐', lat: 41.7744, lng: 140.7272 },
        { id: 'd6-2', time: '13:30', name: 'Hakodate Beer 午餐', location: '金森倉庫內', note: '精釀啤酒配函館食材料理', lat: 41.7712, lng: 140.7186 },
        { id: 'd6-3', time: '15:30', name: '金森倉庫購物', location: '金森紅磚倉庫', note: '紀念品一次買齊', lat: 41.7710, lng: 140.7188 },
        { id: 'd6-4', time: '17:30', name: '夕陽下的八幡坂', location: '八幡坂', note: '傍晚光線最美！', lat: 41.7733, lng: 140.7147 },
        { id: 'd6-5', time: '19:30', name: '山頭火拉麵', location: '山頭火函館店', note: '北海道鹽味叉燒拉麵', lat: 41.7719, lng: 140.7231 },
      ],
    },
    {
      day: 7, date: '2026-05-24', weekday: 'SUN',
      schedules: [
        { id: 'd7-1', time: '09:30', name: '元町 Café 早午餐', location: '元町咖啡廳', note: '慢慢來，今天輕鬆行程', lat: 41.7735, lng: 140.7132 },
        { id: 'd7-2', time: '11:00', name: '五稜郭塔觀景台', location: '五稜郭塔', note: '107m 俯瞰星形城牆', lat: 41.7962, lng: 140.7572 },
        { id: 'd7-3', time: '15:00', name: '八幡坂最後告別', location: '八幡坂', note: '拍最後一張照片', lat: 41.7733, lng: 140.7147 },
        { id: 'd7-4', time: '19:00', name: '告別晚宴', location: '函館港景餐廳', note: '望著海灣，記住最後一夜', lat: 41.7716, lng: 140.7176 },
      ],
    },
    {
      day: 8, date: '2026-05-25', weekday: 'MON',
      schedules: [
        { id: 'd8-1', time: '06:30', name: '朝市最後早餐', location: '函館朝市', note: '帶著滿滿記憶說再見', lat: 41.7744, lng: 140.7272 },
        { id: 'd8-2', time: '09:00', name: '前往函館機場', location: '函館市區 → 空港', note: '搭利木津巴士', lat: 41.7737, lng: 140.7265 },
        { id: 'd8-3', time: '11:30', name: '機場免稅店掃貨', location: '函館空港', note: '六花亭、白色戀人最後補貨！', lat: 41.7716, lng: 140.8219 },
        { id: 'd8-4', time: '12:30', name: '搭機返台', location: 'IT 237 · HKD → TPE', note: 'Bon Voyage！下次還要回來！', lat: 41.7716, lng: 140.8219 },
      ],
    },
  ],

  savedSpots: [
    { id: 1, name: '函館朝市', nameEn: 'Hakodate Morning Market', location: '若松町 9-19', desc: '新鮮海鮮丼、帝王蟹、活海膽，早 5 點開市', lat: 41.7744, lng: 140.7272 },
    { id: 2, name: '五稜郭塔', nameEn: 'Goryokaku Tower', location: '五稜郭町 43-9', desc: '107m 展望台，俯瞰星形城郭全貌', lat: 41.7962, lng: 140.7572 },
    { id: 3, name: '八幡坂', nameEn: 'Hachimanaka Slope', location: '末広町', desc: '日本最上相坡道，正對函館港灣', lat: 41.7733, lng: 140.7147 },
    { id: 4, name: '金森倉庫', nameEn: 'Kanemori Warehouse', location: '末広町 14-12', desc: '紅磚倉庫改建商場，夜晚燈光絕美', lat: 41.7710, lng: 140.7188 },
    { id: 5, name: 'Lucky Pierrot', nameEn: 'Lucky Pierrot', location: '末広町 23-18', desc: '函館限定漢堡，中式炒麵堡人氣 No.1', lat: 41.7718, lng: 140.7200 },
  ],
};
