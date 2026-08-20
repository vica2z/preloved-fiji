// ==== PreLoved Fiji — demo data & persistence ====
// All names, phone numbers and details below are fictional sample data for the demo.

export const CATS = [["Women","👗"],["Men","👔"],["Kids","🧸"],["Home","🏠"],["Electronics","📱"],["Accessories","👜"],["Hobbies","🎸"],["Beauty","💄"]];
export const CITIES = ["Suva","Nadi","Lautoka","Labasa","Ba","Sigatoka"];
export const BGS = ["#EAF3F0","#EDEFF6","#F5EEE2","#FCE8E2"];

const SEED_ITEMS = [
  {id:1,title:"Sulu Jaba, hand-stitched",price:28,cond:"Excellent",city:"Suva",cat:"Women",emoji:"👗",seller:"Mere T.",rating:4.9,bg:"#EAF3F0",desc:"Traditional two-piece, worn once for a wedding. Beautiful masi-print trim.",status:"live",size:"M",featured:true},
  {id:2,title:"Bluetooth speaker (JBL)",price:45,cond:"Good",city:"Nadi",cat:"Electronics",emoji:"🔊",seller:"Ravi P.",rating:4.7,bg:"#EDEFF6",desc:"JBL Flip, works perfectly, small scuff on base. Charger included.",status:"live",size:"—"},
  {id:3,title:"Rattan beach bag",price:15,cond:"Like new",city:"Lautoka",cat:"Accessories",emoji:"👜",seller:"Ana K.",rating:5.0,bg:"#F5EEE2",desc:"Handwoven, bought in Sigatoka market. Barely used.",status:"live",size:"One size"},
  {id:4,title:"Kids' school shoes, sz 12",price:12,cond:"Good",city:"Suva",cat:"Kids",emoji:"👟",seller:"Litia V.",rating:4.8,bg:"#EAF3F0",desc:"Black leather school shoes, outgrown. Plenty of life left.",status:"live",size:"UK 12"},
  {id:5,title:"Cast iron pot, large",price:35,cond:"Good",city:"Labasa",cat:"Home",emoji:"🍲",seller:"Sef R.",rating:4.6,bg:"#F5EEE2",desc:"Heavy cast iron, seasoned and ready. Perfect for lovo prep.",status:"live",size:"6L"},
  {id:6,title:"Denim jacket, vintage",price:30,cond:"Excellent",city:"Nadi",cat:"Men",emoji:"🧥",seller:"Mere T.",rating:4.9,bg:"#EDEFF6",desc:"Classic wash, size L, no flaws.",status:"pending",size:"L"},
  {id:7,title:"Acoustic guitar (Yamaha)",price:90,cond:"Good",city:"Suva",cat:"Hobbies",emoji:"🎸",seller:"Ravi P.",rating:4.7,bg:"#F5EEE2",desc:"Lovely tone, few marks, new strings fitted.",status:"live",size:"Full",featured:true},
];

export function freshStore(){
  return {
    items: JSON.parse(JSON.stringify(SEED_ITEMS)),
    users: [
      {id:1,name:"Adi Vakalolo",phone:"+679 999 1234",city:"Suva",sales:42,rating:4.9,verified:true,status:"active"},
      {id:2,name:"Ravi P.",phone:"+679 888 5678",city:"Nadi",sales:12,rating:4.7,verified:true,status:"active"},
      {id:3,name:"Mere T.",phone:"+679 777 2345",city:"Suva",sales:31,rating:4.9,verified:true,status:"active"},
      {id:4,name:"Josua N.",phone:"+679 666 8899",city:"Suva",sales:3,rating:4.5,verified:false,status:"active"},
    ],
    orders: [
      {id:1001,item:"Acoustic guitar (Yamaha)",emoji:"🎸",buyer:"Adi V.",seller:"Ravi P.",amount:91.5,method:"M-PAiSA",status:"paid",date:"Today"},
      {id:1002,item:"Cast iron pot, large",emoji:"🍲",buyer:"Litia V.",seller:"Sef R.",amount:35,method:"Cash on meetup",status:"meetup",date:"Yesterday"},
    ],
    disputes: [
      {id:1,item:"Bluetooth speaker (JBL)",buyer:"Adi V.",seller:"Ravi P.",reason:"Item not as described",status:"open"},
      {id:2,item:"Rattan beach bag",buyer:"Litia V.",seller:"Ana K.",reason:"No-show at meetup",status:"resolved"},
    ],
    reports: [
      {id:1,type:"Listing",target:"Fake designer bag",by:"Ana K.",reason:"Counterfeit goods",status:"open"},
    ],
    offers: [],
    reviews: {
      "Mere T.":[["Ravi P.","Lovely seller, item just as described. Vinaka!",5],["Ana K.","Quick friendly meetup in Suva.",5]],
      "Ravi P.":[["Adi V.","Good comms, fair price.",4]],
    },
    featureRequests: [
      {id:1,item:"Rattan beach bag",seller:"Ana K.",status:"pending"},
    ],
    banners: [
      {id:1,title:"Nadi Handicrafts Market",sub:"Every Saturday · Sponsored",bg:"#0B6E6E",active:true},
      {id:2,title:"Your ad here",sub:"Promote your business to Fiji buyers",bg:"#F26A4B",active:false},
    ],
    categoryFees: [
      {cat:"Vehicles",fee:20,on:true},
      {cat:"Electronics",fee:5,on:true},
      {cat:"Women",fee:0,on:false},
      {cat:"Home",fee:0,on:false},
    ],
    settlement: {
      // Bank settlement runs weekly, OR early once the held balance reaches the threshold.
      schedule: "weekly",          // "weekly" | "threshold"
      thresholdFJD: 500,           // trigger an early bulk transfer at this held balance
      lastRun: "Mon, this week",
      nextRun: "Mon, next week",
      history: [
        { id: 1, date: "Mon, last week", amount: 642.50, method: "Bulk bank transfer" },
      ],
    },
    nextId:8, nextOrder:1003, nextOffer:1, nextFR:2, nextSettle:2,
  };
}

const KEY = "prelovedfiji_react_v1";

export function loadStore(){
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch(e){}
  return freshStore();
}
export function saveStore(store){
  try { localStorage.setItem(KEY, JSON.stringify(store)); } catch(e){}
}
export function clearStore(){
  try { localStorage.removeItem(KEY); } catch(e){}
}

// helpers
export function starStr(n){ const full=Math.round(n); return "★".repeat(full)+"☆".repeat(5-full); }
export function shade(hex,pct){
  try{
    const n=parseInt(hex.slice(1),16);
    let r=(n>>16)+pct, g=((n>>8)&255)+pct, b=(n&255)+pct;
    r=Math.max(0,Math.min(255,r)); g=Math.max(0,Math.min(255,g)); b=Math.max(0,Math.min(255,b));
    return "#"+((r<<16)|(g<<8)|b).toString(16).padStart(6,"0");
  }catch(e){ return hex; }
}
