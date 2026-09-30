const app = document.querySelector('#app');
const nav = document.querySelector('#bottomNav');
const toastEl = document.querySelector('#toast');
const installBanner = document.querySelector('#installBanner');

const cityCenters = {
  'Hà Nội': {lat:21.0285,lng:105.8542},
  'TP. Hồ Chí Minh': {lat:10.7769,lng:106.7009},
  'Đà Nẵng': {lat:16.0544,lng:108.2022},
  'Đà Lạt': {lat:11.9404,lng:108.4583}
};
const cities = [
  {name:'Hà Nội',img:'https://images.unsplash.com/photo-1509030450996-dd1a26dda07a?auto=format&fit=crop&w=900&q=82'},
  {name:'TP. Hồ Chí Minh',img:'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=900&q=82'},
  {name:'Đà Nẵng',img:'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=900&q=82'},
  {name:'Đà Lạt',img:'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=82'}
];

const fallbackPlaces = [
  {id:'demo-hn1',source:'demo',city:'Hà Nội',name:'Cà phê phố cổ',category:'Cafe',segment:'0–100k',price:'50–100k',rating:4.7,ratingCount:358,address:'Hoàn Kiếm, Hà Nội',image:'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1000&q=84',tags:['View đẹp','Yên tĩnh'],lat:21.031,lng:105.852,hours:'07:00 – 22:00'},
  {id:'demo-hn2',source:'demo',city:'Hà Nội',name:'Lẩu nhóm cuối tuần',category:'Ăn uống',segment:'100–200k',price:'100–200k',rating:4.6,ratingCount:856,address:'Ba Đình, Hà Nội',image:'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?auto=format&fit=crop&w=1000&q=84',tags:['Nhóm đông','Ăn tối'],lat:21.038,lng:105.826,hours:'10:30 – 23:00'},
  {id:'demo-hn3',source:'demo',city:'Hà Nội',name:'Game & Bowling Center',category:'Vui chơi',segment:'200–400k',price:'200–400k',rating:4.5,ratingCount:421,address:'Cầu Giấy, Hà Nội',image:'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1000&q=84',tags:['Chơi vui','Nhóm bạn'],lat:21.036,lng:105.793,hours:'09:00 – 23:30'},
  {id:'demo-hn4',source:'demo',city:'Hà Nội',name:'Rooftop Dinner',category:'Ăn uống',segment:'400k+',price:'Từ 400k',rating:4.8,ratingCount:607,address:'Tây Hồ, Hà Nội',image:'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1000&q=84',tags:['Cao cấp','View đẹp'],lat:21.064,lng:105.823,hours:'17:00 – 23:00'},
  {id:'demo-hcm1',source:'demo',city:'TP. Hồ Chí Minh',name:'Coffee District 1',category:'Cafe',segment:'0–100k',price:'50–100k',rating:4.7,ratingCount:1040,address:'Quận 1, TP. Hồ Chí Minh',image:'https://images.unsplash.com/photo-1445116572660-236099ec97a0?auto=format&fit=crop&w=1000&q=84',tags:['Trung tâm','Chill'],lat:10.775,lng:106.704,hours:'08:00 – 21:00'},
  {id:'demo-hcm2',source:'demo',city:'TP. Hồ Chí Minh',name:'Phố đi bộ Nguyễn Huệ',category:'Ngoài trời',segment:'0–100k',price:'Miễn phí',rating:4.6,ratingCount:28000,address:'Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh',image:'https://images.unsplash.com/photo-1557750255-c76072a7aad1?auto=format&fit=crop&w=1000&q=84',tags:['Check-in','Đi bộ'],lat:10.773,lng:106.704,hours:'Mở cả ngày'},
  {id:'demo-dn1',source:'demo',city:'Đà Nẵng',name:'Sơn Trà Marina',category:'Check-in',segment:'100–200k',price:'100–200k',rating:4.6,ratingCount:3910,address:'Sơn Trà, Đà Nẵng',image:'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=84',tags:['Biển','View đẹp'],lat:16.091,lng:108.243,hours:'07:00 – 22:00'},
  {id:'demo-dl1',source:'demo',city:'Đà Lạt',name:'Đồi chè Cầu Đất',category:'Ngoài trời',segment:'0–100k',price:'0–100k',rating:4.7,ratingCount:6200,address:'Xuân Trường, Đà Lạt',image:'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1000&q=84',tags:['Thiên nhiên','Check-in'],lat:11.886,lng:108.575,hours:'06:00 – 17:30'}
];

const state = {
  user: JSON.parse(localStorage.getItem('didau_user') || 'null'),
  city: localStorage.getItem('didau_city') || '',
  plan: JSON.parse(localStorage.getItem('didau_plan') || 'null'),
  category: 'Tất cả',
  exploreView: 'list',
  googlePlaces: [],
  googleReady: false,
  selectedPlace: null,
  shortlist: JSON.parse(localStorage.getItem('didau_shortlist') || '[]'),
  budgetPicks: {},
  deferredInstall: null
};

const getApiKey = () => localStorage.getItem('didau_google_key') || window.DIDAU_CONFIG?.GOOGLE_MAPS_API_KEY || '';
const hasRealApiKey = () => { const k=getApiKey(); return Boolean(k && k.length>20 && !k.includes('PASTE')); };
const save = () => {
  localStorage.setItem('didau_user',JSON.stringify(state.user));
  localStorage.setItem('didau_city',state.city);
  localStorage.setItem('didau_plan',JSON.stringify(state.plan));
  localStorage.setItem('didau_shortlist',JSON.stringify(state.shortlist));
};
const esc = (s='') => String(s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
const layout = (html,showNav=false) => { app.innerHTML=html; nav.classList.toggle('hidden',!showNav); window.scrollTo(0,0); };
const toast = msg => { toastEl.textContent=msg;toastEl.classList.add('show');setTimeout(()=>toastEl.classList.remove('show'),1800); };
const backBtn = (target='home') => `<button class="back" data-go="${target}" aria-label="Quay lại">‹</button>`;
const moneyVnd = n => new Intl.NumberFormat('vi-VN',{style:'currency',currency:'VND',maximumFractionDigits:0}).format(n);
const sourceLabel = p => p.source==='google' ? `<div class="source-line"><span class="live-dot"></span>Dữ liệu Google Maps</div>` : `<div class="source-line">Dữ liệu demo</div>`;

function routeImage(p){return p.image || 'https://images.unsplash.com/photo-1481833761820-0509d3217039?auto=format&fit=crop&w=1000&q=82'}
function categoryFromTypes(types=[]){
  if(types.some(t=>['cafe','coffee_shop','tea_house'].includes(t))) return 'Cafe';
  if(types.some(t=>['restaurant','meal_takeaway','bakery','food'].includes(t))) return 'Ăn uống';
  if(types.some(t=>['movie_theater','amusement_park','bowling_alley','video_arcade','karaoke','night_club'].includes(t))) return 'Vui chơi';
  if(types.some(t=>['park','garden','beach','hiking_area','campground'].includes(t))) return 'Ngoài trời';
  return 'Check-in';
}
function moneyValue(m){
  if(!m) return null;
  const units = Number(m.units ?? m.amount ?? NaN);
  const nanos = Number(m.nanos ?? 0);
  return Number.isFinite(units) ? units+nanos/1e9 : null;
}
function getRangeInfo(p){
  const pr=p.priceRange;
  if(!pr) return null;
  const start=moneyValue(pr.startPrice); const end=moneyValue(pr.endPrice);
  const currency=pr.startPrice?.currencyCode || pr.startPrice?.currency || pr.endPrice?.currencyCode || '';
  return {start,end,currency};
}
function budgetSegment(p){
  const r=getRangeInfo(p);
  if(r && r.currency==='VND'){
    const ref = r.end ?? r.start;
    if(ref!=null){
      if(ref<=100000) return '0–100k';
      if(ref<=200000) return '100–200k';
      if(ref<=400000) return '200–400k';
      return '400k+';
    }
  }
  const level=String(p.priceLevel||'');
  if(level.includes('FREE')||level==='FREE') return '0–100k';
  if(level.includes('INEXPENSIVE')||level==='INEXPENSIVE') return '0–100k';
  if(level.includes('MODERATE')||level==='MODERATE') return '100–200k';
  if(level.includes('VERY_EXPENSIVE')||level==='VERY_EXPENSIVE') return '400k+';
  if(level.includes('EXPENSIVE')||level==='EXPENSIVE') return '200–400k';
  return 'Không rõ';
}
function priceText(p){
  const r=getRangeInfo(p);
  if(r && r.currency==='VND'){
    if(r.start!=null && r.end!=null) return `${moneyVnd(r.start)} – ${moneyVnd(r.end)}`;
    if(r.start!=null) return `Từ ${moneyVnd(r.start)}`;
  }
  const seg=budgetSegment(p);
  if(seg!=='Không rõ') return seg==='400k+'?'Trên 400k':seg;
  return p.price || 'Chưa có giá';
}
function activePlaces(){
  if(hasRealApiKey() && state.googlePlaces.length) return state.googlePlaces;
  return fallbackPlaces.filter(p=>p.city===state.city);
}
function stars(r){
  const x=Math.max(0,Math.min(5,Number(r)||0));
  return '★'.repeat(Math.round(x))+'☆'.repeat(5-Math.round(x));
}
function placeCard(p,action='detail'){
  return `<article class="place" data-place="${esc(p.id)}" data-action="${action}">
    <img src="${esc(routeImage(p))}" alt="${esc(p.name)}">
    <div><h3>${esc(p.name)}</h3>
      <div class="small">⭐ ${p.rating??'–'}${p.ratingCount?` (${Number(p.ratingCount).toLocaleString('vi-VN')})`:''} · ${esc(priceText(p))}</div>
      <div class="meta"><span class="tag">${esc(p.category||'Địa điểm')}</span><span class="tag">${esc(budgetSegment(p))}</span></div>
      ${sourceLabel(p)}
    </div>
  </article>`;
}

function splash(){layout(`<img class="logo" src="assets/logo.png" alt="Đi Đâu?"><p class="tagline">Chốt kèo nhanh hơn<br>Đi chơi vui hơn</p><img class="hero-friends" src="assets/friends.png" alt="Nhóm bạn"><div class="stack"><button class="btn btn-primary" data-go="login">Bắt đầu</button><button class="btn btn-ghost" data-go="city">Xem thử</button></div>`)}
function login(){layout(`<div class="topbar">${backBtn('splash')}<div></div></div><img class="logo" src="assets/logo.png" style="width:145px;margin-top:0"><h1 class="center">Chào mừng trở lại 👋</h1><p class="sub center">Cùng nhau khám phá những địa điểm tuyệt vời</p><div class="field"><label>Email hoặc số điện thoại</label><input id="email" placeholder="you@example.com"></div><div class="field"><label>Mật khẩu</label><input id="pass" type="password" placeholder="••••••••"></div><button class="btn btn-primary" id="doLogin">Đăng nhập</button><div class="divider"></div><div class="auth-social"><button>Google</button><button>Apple</button><button>Facebook</button></div><p class="center small">Chưa có tài khoản? <span class="link" data-go="register">Đăng ký ngay</span></p>`)}
function register(){layout(`<div class="topbar">${backBtn('login')}<div></div></div><h1>Tạo tài khoản mới ✨</h1><p class="sub">Tham gia cộng đồng mê khám phá cùng bạn bè.</p><div class="field"><label>Họ và tên</label><input id="name" placeholder="Nguyễn Minh Anh"></div><div class="field"><label>Email</label><input id="email" placeholder="minhanh@example.com"></div><div class="field"><label>Mật khẩu</label><input id="pass" type="password" placeholder="••••••••"></div><button class="btn btn-primary" id="doRegister">Đăng ký</button><p class="center small">Đã có tài khoản? <span class="link" data-go="login">Đăng nhập</span></p>`)}
function city(){layout(`<div class="topbar">${state.user?'<div></div>':backBtn('splash')}<span class="status-badge ${hasRealApiKey()?'live':''}">${hasRealApiKey()?'<span class="live-dot"></span> Google live':'Demo'}</span></div><h1>Chọn thành phố<br>bạn muốn khám phá</h1><p class="sub">App sẽ chỉ gợi ý địa điểm trong thành phố bạn chọn.</p><div class="city-grid">${cities.map(c=>`<button class="city-card ${state.city===c.name?'active':''}" data-city="${c.name}"><img src="${c.img}" alt="${c.name}"><b>${c.name}</b></button>`).join('')}</div><div style="height:16px"></div><button id="cityContinue" class="btn btn-primary">Tiếp tục</button>`)}
function home(){
  const ps=activePlaces();
  layout(`<div class="topbar"><div><div class="tiny">Xin chào,</div><b>${esc(state.user?.name||'bạn')} 👋</b></div><button class="chip" data-go="city">📍 ${esc(state.city||'Chọn thành phố')}</button></div>
  <div class="hero-card"><span class="pill-live">${hasRealApiKey()?'<span class="live-dot"></span> Google Maps live':'Bản demo'}</span><h2>Đi đâu hôm nay?</h2><p class="small">Tạo kèo, gửi link, rồi cả nhóm cùng vote.</p><button class="round-arrow" data-go="create">→</button></div>
  <div class="quickcats">${['Tất cả','Cafe','Ăn uống','Vui chơi','Check-in','Ngoài trời'].map((x,i)=>`<button class="chip ${i===0?'active':''}" data-home-filter="${x}">${x}</button>`).join('')}</div>
  <div class="section-head"><h2>Gợi ý ở ${esc(state.city||'gần bạn')}</h2><span class="link" data-go="explore">Xem tất cả</span></div><div id="homePlaces" class="place-list">${ps.slice(0,4).map(p=>placeCard(p)).join('')||'<div class="card">Chưa có địa điểm. Hãy bật Google Maps live.</div>'}</div>
  <div class="section-head"><h2>Theo phân khúc</h2><span class="link" data-go="budget">Xem 4 mức</span></div><div class="card"><b>Mỗi phân khúc 1 gợi ý</b><p class="small" style="margin:6px 0 0">0–100k · 100–200k · 200–400k · 400k+. Nếu Google có khoảng giá VND, app dùng khoảng giá thật; nếu không, app quy đổi từ Price Level.</p></div>`,true);
  if(hasRealApiKey() && !state.googlePlaces.length) refreshGooglePlaces({silent:true});
}
function explore(){
  const ps=activePlaces().filter(p=>state.category==='Tất cả'||p.category===state.category);
  layout(`<div class="topbar">${backBtn('home')}<h3>Khám phá ${esc(state.city)}</h3><button class="icon-btn" data-go="city">⌖</button></div>
  <div class="explore-toolbar"><input id="search" class="searchbox" placeholder="Tìm cafe, vui chơi, check-in..."><div class="toggle"><button class="${state.exploreView==='list'?'active':''}" data-view="list">☷</button><button class="${state.exploreView==='map'?'active':''}" data-view="map">⌖</button></div></div>
  <div class="chips" style="margin:10px 0 14px">${['Tất cả','Cafe','Ăn uống','Vui chơi','Check-in','Ngoài trời'].map(x=>`<button class="chip ${state.category===x?'active':''}" data-category="${x}">${x}</button>`).join('')}</div>
  <div id="exploreContent">${state.exploreView==='map' ? (hasRealApiKey()?'<div id="map"></div>':'<div class="map-fallback"><div><h2>Bật Google Maps live</h2><p class="small">Vào Cá nhân → Google Maps API để nhập key.</p><button class="btn btn-primary" data-go="mapssettings">Bật ngay</button></div></div>') : `<div id="searchList" class="place-list">${ps.map(p=>placeCard(p)).join('')||'<div class="card">Không có kết quả.</div>'}</div>`}</div>`,true);
  if(state.exploreView==='map'&&hasRealApiKey()) renderMap(ps);
}
function createPlan(){layout(`<div class="topbar">${backBtn('home')}<h3>Tạo kèo mới</h3><div></div></div><div class="field"><label>Tên kèo</label><input id="planName" value="Cafe cuối tuần ☕"></div><div class="field"><label>Thành phố</label><select id="planCity">${cities.map(c=>`<option ${c.name===state.city?'selected':''}>${c.name}</option>`).join('')}</select></div><div class="field"><label>Ngày đi</label><input id="date" type="date"></div><div class="field"><label>Thời gian</label><input id="time" type="time" value="19:00"></div><div class="field"><label>Số người dự kiến</label><input id="people" type="number" value="5" min="2" max="20"></div><button class="btn btn-primary" id="savePlan">Tiếp tục</button>`,true)}
function invite(){
  const url=`${location.origin}${location.pathname}?join=${encodeURIComponent(state.plan?.id||'demo')}`;
  layout(`<div class="topbar">${backBtn('create')}<h3>Mời bạn bè</h3><div></div></div><div class="card center"><div style="font-size:58px">🔗</div><h2>Chia sẻ link tham gia nhóm</h2><p class="small">Bạn bè mở link để tham gia kèo và cùng chọn tiêu chí.</p><div class="field"><input id="shareLink" value="${esc(url)}" readonly></div><button class="btn btn-primary" id="copyLink">Sao chép link</button></div><div style="height:12px"></div><button class="btn btn-ghost" data-go="preferences">Tự chọn tiêu chí trước</button>`,true)
}
function join(){layout(`<div class="topbar">${backBtn('splash')}<h3>Tham gia kèo</h3><div></div></div><img class="hero-friends" src="assets/friends.png" style="max-height:260px"><div class="card center"><h1>Tham gia kèo này?</h1><p class="sub">Sau khi vào nhóm, bạn chọn mood, ngân sách và cùng bình chọn địa điểm.</p><button class="btn btn-primary" data-go="preferences">Tham gia nhóm</button></div>`)}
function preferences(){layout(`<div class="topbar">${backBtn('invite')}<h3>Hôm nay muốn gì?</h3><div></div></div><p class="small">Mỗi người tự chọn. App sẽ lọc địa điểm Google Maps phù hợp với nhóm.</p><h2>Mood</h2><div class="option-grid">${['🍜 Ăn ngon','☕ Ngồi chill','🎮 Chơi vui','📸 Check-in','🌲 Thiên nhiên','🎬 Xem phim'].map((x,i)=>`<button class="option ${i===1?'active':''}">${x}</button>`).join('')}</div><h2>Ngân sách / người</h2><div class="chips">${['0–100k','100–200k','200–400k','400k+'].map((x,i)=>`<button class="chip ${i===1?'active':''}">${x}</button>`).join('')}</div><h2>Đi tối đa bao xa?</h2><div class="chips">${['2 km','5 km','10 km','Không quan trọng'].map((x,i)=>`<button class="chip ${i===1?'active':''}">${x}</button>`).join('')}</div><div style="height:18px"></div><button class="btn btn-primary" data-go="budget">Gợi ý theo phân khúc</button>`,true)}

const budgetDefs = [
  {id:'0–100k',label:'0–100k / người',levels:['FREE','INEXPENSIVE'],query:'địa điểm vui chơi giá rẻ'},
  {id:'100–200k',label:'100–200k / người',levels:['MODERATE'],query:'địa điểm đi chơi ăn uống phổ biến'},
  {id:'200–400k',label:'200–400k / người',levels:['EXPENSIVE'],query:'địa điểm vui chơi cao cấp'},
  {id:'400k+',label:'400k+ / người',levels:['VERY_EXPENSIVE'],query:'nhà hàng trải nghiệm cao cấp'}
];
function budget(){
  const picks=state.budgetPicks;
  layout(`<div class="topbar">${backBtn('preferences')}<h3>Chọn theo phân khúc</h3><div></div></div><p class="small">Mỗi mức giá có 1 địa điểm nổi bật để nhóm dễ so sánh.</p>
  <div id="budgetGrid" class="budget-grid">${budgetDefs.map(d=>budgetPickCard(d,picks[d.id])).join('')}</div>
  <p class="budget-note">Lưu ý: Google có thể trả Price Range theo tiền tệ hoặc chỉ Price Level. App ưu tiên khoảng giá VND khi có; trường hợp chỉ có Price Level, nhãn 0–100k/100–200k/... là quy đổi UX gần đúng để phân nhóm, không phải báo giá chính thức của địa điểm.</p>
  <div style="height:14px"></div><button class="btn btn-primary" data-go="recommend">Xem danh sách gợi ý</button>`,true);
  if(hasRealApiKey() && Object.keys(state.budgetPicks).length<2) loadBudgetPicks();
}
function budgetPickCard(def,p){
  if(!p) return `<div class="budget-card empty"><div><b>${def.label}</b><div class="tiny">${hasRealApiKey()?'Đang tìm trên Google Maps…':'Bật Google live để tìm thật'}</div></div></div>`;
  return `<div class="budget-card" data-place="${esc(p.id)}"><div class="budget-label">${def.label}</div><img src="${esc(routeImage(p))}" alt=""><h3>${esc(p.name)}</h3><div class="tiny">⭐ ${p.rating??'–'} · ${esc(priceText(p))}</div></div>`;
}
async function loadBudgetPicks(){
  const grid=document.querySelector('#budgetGrid');
  if(grid) grid.innerHTML=budgetDefs.map(d=>`<div class="budget-card empty"><div><div class="spinner"></div><b>${d.label}</b></div></div>`).join('');
  const results=await Promise.all(budgetDefs.map(d=>searchGoogle(`${d.query} ở ${state.city}`,state.city,8,d.levels)));
  state.budgetPicks={};
  budgetDefs.forEach((d,i)=>{
    const list=results[i]||[];
    state.budgetPicks[d.id]=list.find(p=>budgetSegment(p)===d.id)||list[0]||null;
  });
  if(document.querySelector('#budgetGrid')) budget();
}
function recommend(){
  const ps=activePlaces().slice(0,12);
  layout(`<div class="topbar">${backBtn('budget')}<h3>Gợi ý địa điểm</h3><div></div></div><p class="small">Rating, số lượt đánh giá, ảnh và địa chỉ được lấy từ Google Maps khi bật live.</p><div class="place-list">${ps.map(p=>placeCard(p,'shortlist')).join('')}</div><div style="height:16px"></div><button class="btn btn-primary" data-go="vote">Đi tới bình chọn (${state.shortlist.length})</button>`,true)
}
function vote(){
  let ps=state.shortlist.map(id=>[...state.googlePlaces,...fallbackPlaces].find(p=>p.id===id)).filter(Boolean);
  if(ps.length<2) ps=activePlaces().slice(0,4);
  layout(`<div class="topbar">${backBtn('recommend')}<h3>Cả hội vote địa điểm</h3><div></div></div><p class="small">Chọn 1 nơi rồi chốt kèo.</p>${ps.map((p,i)=>`<label class="vote-card"><img src="${esc(routeImage(p))}"><div><b>${esc(p.name)}</b><div class="tiny">⭐ ${p.rating??'–'} · ${esc(priceText(p))}</div></div><input type="radio" name="vote" value="${esc(p.id)}" ${i===0?'checked':''}></label>`).join('')}<button class="btn btn-primary" id="submitVote">Bình chọn</button>`,true)
}
function result(){
  const id=document.querySelector('input[name="vote"]:checked')?.value || localStorage.getItem('didau_vote');
  const p=[...state.googlePlaces,...fallbackPlaces].find(x=>x.id===id)||activePlaces()[0];
  state.selectedPlace=p;
  layout(`<div class="center"><div style="font-size:56px">🎉</div><h1>Kèo chốt!</h1><p class="sub">Cả nhóm đã có điểm đến rồi.</p></div>${p?placeCard(p):''}<div style="height:14px"></div><div class="btn-row"><button class="btn btn-primary" id="openDirections">Chỉ đường</button><button class="btn btn-ghost" id="shareResult">Chia sẻ</button></div>`,true)
}
function plans(){layout(`<div class="topbar"><h1 style="margin:0">Kèo của tôi</h1><div></div></div>${state.plan?`<div class="card"><h3>${esc(state.plan.name)}</h3><div class="small">📍 ${esc(state.plan.city)} · ${esc(state.plan.date||'Chưa chọn ngày')} · ${esc(state.plan.time||'')}</div><div style="height:10px"></div><button class="btn btn-soft" data-go="invite">Mời thêm bạn</button></div>`:'<div class="card center"><h2>Chưa có kèo nào</h2><button class="btn btn-primary" data-go="create">Tạo kèo</button></div>'}`,true)}
function profile(){layout(`<div class="topbar"><h1 style="margin:0">Cá nhân</h1><span class="status-badge ${hasRealApiKey()?'live':''}">${hasRealApiKey()?'<span class="live-dot"></span> Google live':'Demo'}</span></div><div class="card"><h3>${esc(state.user?.name||'Khách')}</h3><div class="small">${esc(state.user?.email||'')}</div></div><h2>Cài đặt dữ liệu</h2><div class="profile-menu"><div class="menu-item" data-go="mapssettings"><div><b>Google Maps API</b><div class="tiny">Map, Places, ảnh, rating, review</div></div><span>›</span></div><div class="menu-item" data-go="explore"><div><b>Khám phá địa điểm live</b><div class="tiny">Tìm theo thành phố trên bản đồ</div></div><span>›</span></div><div class="menu-item" id="showInstallGuide"><div><b>Cài lên điện thoại</b><div class="tiny">PWA chạy như app</div></div><span>›</span></div></div><div id="installGuide"></div><div style="height:18px"></div><button class="btn btn-ghost" id="logout">Đăng xuất</button>`,true)}
function mapsSettings(){layout(`<div class="topbar">${backBtn('profile')}<h3>Google Maps live</h3><div></div></div><div class="card"><h2 style="margin-top:0">Kết nối dữ liệu thật</h2><p class="small">Bật Maps JavaScript API + Places API (New), rồi dán API key đã khóa theo domain Vercel.</p><div class="field"><label>Google Maps API key</label><input id="googleKey" type="password" value="${esc(getApiKey())}" placeholder="AIza..."></div><button class="btn btn-primary" id="saveGoogleKey">Lưu & kiểm tra</button></div><div style="height:12px"></div><div class="card"><b>Sau khi bật live, app sẽ lấy:</b><p class="small" style="margin:8px 0 0">Tên, địa chỉ, tọa độ, ảnh, rating, số lượt đánh giá, giờ mở cửa, Price Level/Price Range và tối đa các review Google cho phép trả về.</p></div>`)}

async function detail(id){
  let p=[...state.googlePlaces,...fallbackPlaces].find(x=>x.id===id);
  if(p?.source==='google' && p.googlePlaceId) p=await fetchGooglePlaceById(p.googlePlaceId) || p;
  if(!p) return toast('Không tìm thấy địa điểm');
  state.selectedPlace=p;
  const gallery=(p.gallery?.length?p.gallery:[routeImage(p)]).slice(0,3);
  const reviewHtml=(p.reviews||[]).map(r=>`<div class="review"><div class="review-head">${r.photo?`<img class="review-avatar" src="${esc(r.photo)}" alt="">`:'<div class="review-avatar"></div>'}<div><div class="review-name">${esc(r.author||'Người dùng Google')}</div><div class="tiny"><span class="stars">${stars(r.rating)}</span> · ${esc(r.time||'')}</div></div></div>${r.text?`<p>${esc(r.text)}</p>`:''}${r.uri?`<a class="google-link" href="${esc(r.uri)}" target="_blank" rel="noopener">Xem review trên Google Maps</a>`:''}</div>`).join('');
  layout(`<div class="detail-hero"><img src="${esc(routeImage(p))}" alt="${esc(p.name)}"><div class="detail-gradient"></div><button class="back detail-back" data-go="explore">‹</button><button class="icon-btn detail-save" id="savePlace">♡</button><div class="detail-title"><h1>${esc(p.name)}</h1><div>⭐ ${p.rating??'–'}${p.ratingCount?` (${Number(p.ratingCount).toLocaleString('vi-VN')})`:''} · ${esc(priceText(p))}</div></div></div>
  <div class="detail-body"><div class="chips"><span class="chip active">${esc(p.category)}</span><span class="chip">${esc(budgetSegment(p))}</span>${(p.tags||[]).slice(0,2).map(t=>`<span class="chip">${esc(t)}</span>`).join('')}</div>
  <div class="action-row"><button class="action-btn" id="openDirections"><span>➤</span>Chỉ đường</button><button class="action-btn" id="callPlace"><span>☎</span>Gọi</button><button class="action-btn" id="sharePlace"><span>⇧</span>Chia sẻ</button><button class="action-btn" id="savePlace2"><span>♡</span>Lưu</button></div>
  <div class="info-row"><b>Địa chỉ</b><span>${esc(p.address||'Chưa có')}</span></div><div class="info-row"><b>Giờ mở cửa</b><span>${esc(p.hours||'Xem trên Google Maps')}</span></div><div class="info-row"><b>Phân khúc</b><span>${esc(budgetSegment(p))} <span class="tiny">${getRangeInfo(p)?.currency==='VND'?'(từ khoảng giá Google)':'(quy đổi từ Price Level nếu không có khoảng giá)'}</span></span></div>
  <h2>Ảnh địa điểm</h2><div class="gallery">${gallery.map(x=>`<img src="${esc(x)}" alt="">`).join('')}</div>${p.googleMapsURI?`<div class="tiny">Ảnh và dữ liệu địa điểm từ Google Maps. <a class="google-link" href="${esc(p.googleMapsURI)}" target="_blank" rel="noopener">Mở trên Google Maps</a></div>`:''}
  <div class="rating-card"><div class="rating-top"><div><div class="tiny">Tóm tắt đánh giá</div><div class="rating-score">${p.rating??'–'}</div><div class="stars">${stars(p.rating)}</div><div class="rating-count">${p.ratingCount?`${Number(p.ratingCount).toLocaleString('vi-VN')} lượt đánh giá`:'Chưa có số lượt đánh giá'}</div></div>${p.googleMapsURI?`<a class="google-link" href="${esc(p.googleMapsURI)}" target="_blank" rel="noopener">Xem tất cả</a>`:''}</div>${p.reviewSummary?`<div class="review-summary">${esc(p.reviewSummary)}</div>`:'<div class="review-summary">Google Places API không cung cấp phân bố 1–5 sao đầy đủ như giao diện Google Maps. App hiển thị rating tổng, tổng lượt đánh giá và các review được API trả về.</div>'}</div>
  ${reviewHtml?`<div class="section-head"><h2>Đánh giá nổi bật</h2></div><div class="review-list">${reviewHtml}</div>`:''}
  <div style="height:16px"></div><button class="btn btn-primary" id="addShortlist">Thêm vào bình chọn</button></div>`,true)
}

let googleLoadPromise=null;
function loadGoogleMaps(){
  if(window.google?.maps?.importLibrary){state.googleReady=true;return Promise.resolve(true)}
  if(!hasRealApiKey()){toast('Chưa có Google Maps API key');return Promise.resolve(false)}
  if(googleLoadPromise) return googleLoadPromise;
  googleLoadPromise=new Promise(resolve=>{
    const cb='__didauGoogleReady'+Date.now();
    window[cb]=()=>{delete window[cb];state.googleReady=true;resolve(true)};
    const s=document.createElement('script');
    s.src=`https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(getApiKey())}&v=weekly&libraries=places,marker&callback=${cb}`;
    s.async=true;s.defer=true;
    s.onerror=()=>{googleLoadPromise=null;toast('Không tải được Google Maps. Kiểm tra key / domain / billing.');resolve(false)};
    document.head.appendChild(s);
  });
  return googleLoadPromise;
}
function normalizeGooglePlace(p,city){
  const photo=p.photos?.[0];
  const gallery=(p.photos||[]).slice(0,3).map(ph=>ph.getURI({maxWidth:1200}));
  const n={
    id:`google:${p.id}`,googlePlaceId:p.id,source:'google',city,
    name:p.displayName||'Địa điểm',address:p.formattedAddress||'',lat:p.location?.lat?.()??p.location?.lat,lng:p.location?.lng?.()??p.location?.lng,
    rating:p.rating??null,ratingCount:p.userRatingCount??null,priceLevel:p.priceLevel??null,priceRange:p.priceRange??null,
    category:categoryFromTypes(p.types||[]),types:p.types||[],googleMapsURI:p.googleMapsURI||'',image:photo?photo.getURI({maxWidth:1200}):'',gallery,
    tags:(p.types||[]).slice(0,3).map(t=>t.replaceAll('_',' '))
  };
  n.segment=budgetSegment(n);
  return n;
}
async function searchGoogle(query,city=state.city,limit=15,priceLevels=null){
  const ok=await loadGoogleMaps();if(!ok)return[];
  try{
    const {Place}=await google.maps.importLibrary('places');
    const center=cityCenters[city];
    const request={
      textQuery:query,
      fields:['id','displayName','formattedAddress','location','rating','userRatingCount','priceLevel','priceRange','photos','googleMapsURI','types'],
      language:'vi',region:'vn',maxResultCount:Math.min(20,limit),
      ...(center?{locationBias:{center,radius:18000}}:{}),
      ...(priceLevels?.length?{priceLevels}:{})
    };
    const {places}=await Place.searchByText(request);
    return (places||[]).map(p=>normalizeGooglePlace(p,city));
  }catch(err){console.error(err);toast('Places API trả lỗi. Kiểm tra API key, Places API (New) và billing.');return[]}
}
async function fetchGooglePlaceById(placeId){
  const ok=await loadGoogleMaps();if(!ok)return null;
  try{
    const {Place}=await google.maps.importLibrary('places');
    const p=new Place({id:placeId});
    await p.fetchFields({fields:['id','displayName','formattedAddress','location','rating','userRatingCount','priceLevel','priceRange','photos','googleMapsURI','types','regularOpeningHours','nationalPhoneNumber','websiteURI','reviews','reviewSummary']});
    const n=normalizeGooglePlace(p,state.city||state.plan?.city||'');
    n.hours=p.regularOpeningHours?.weekdayDescriptions?.join(' · ') || (p.regularOpeningHours?.openNow?'Đang mở cửa':'Xem giờ trên Google Maps');
    n.phone=p.nationalPhoneNumber||''; n.website=p.websiteURI||'';
    n.reviewSummary=p.reviewSummary?.text||'';
    n.reviews=(p.reviews||[]).map(r=>({
      author:r.authorAttribution?.displayName||'Người dùng Google',
      photo:r.authorAttribution?.photoURI||'',
      profile:r.authorAttribution?.uri||'',
      rating:r.rating||0,text:r.text||r.originalText||'',time:r.relativePublishTimeDescription||'',uri:r.googleMapsURI||r.authorAttribution?.uri||''
    }));
    return n;
  }catch(err){console.error(err);return null}
}
async function refreshGooglePlaces({query=null,silent=false}={}){
  if(!hasRealApiKey()) return;
  const qmap={
    'Tất cả':`địa điểm đi chơi nổi tiếng ở ${state.city}`,
    'Cafe':`quán cafe đẹp ở ${state.city}`,
    'Ăn uống':`nhà hàng đi nhóm ở ${state.city}`,
    'Vui chơi':`khu vui chơi giải trí ở ${state.city}`,
    'Check-in':`địa điểm check in đẹp ở ${state.city}`,
    'Ngoài trời':`công viên điểm tham quan ngoài trời ở ${state.city}`
  };
  if(!silent){const el=document.querySelector('#exploreContent');if(el)el.innerHTML='<div class="loading"><div class="spinner"></div>Đang lấy địa điểm từ Google Maps…</div>'}
  state.googlePlaces=await searchGoogle(query||qmap[state.category]||qmap['Tất cả'],state.city,18);
  if(!silent) explore(); else if(document.querySelector('#homePlaces')) home();
}
async function renderMap(ps){
  const ok=await loadGoogleMaps();if(!ok)return;
  const el=document.querySelector('#map');if(!el)return;
  const center=cityCenters[state.city]||cityCenters['Hà Nội'];
  const {Map}=await google.maps.importLibrary('maps');
  const map=new Map(el,{center,zoom:13,mapTypeControl:false,streetViewControl:false,fullscreenControl:false,mapId:window.DIDAU_CONFIG?.GOOGLE_MAP_ID||'DEMO_MAP_ID'});
  try{
    const {AdvancedMarkerElement}=await google.maps.importLibrary('marker');
    ps.filter(p=>Number.isFinite(Number(p.lat))&&Number.isFinite(Number(p.lng))).forEach(p=>{
      const m=new AdvancedMarkerElement({map,position:{lat:Number(p.lat),lng:Number(p.lng)},title:p.name});
      m.addListener('click',()=>detail(p.id));
    });
  }catch(_){
    ps.forEach(p=>{if(!Number.isFinite(Number(p.lat)))return;const m=new google.maps.Marker({map,position:{lat:Number(p.lat),lng:Number(p.lng)},title:p.name});m.addListener('click',()=>detail(p.id));});
  }
}

const routes={splash,login,register,city,home,explore,create:createPlan,invite,join,preferences,budget,recommend,vote,result,plans,profile,mapssettings:mapsSettings};
function go(name){history.replaceState(null,'',location.pathname+location.search+(name==='home'?'#home':''));(routes[name]||splash)()}

document.addEventListener('click',async e=>{
  const goEl=e.target.closest('[data-go]');if(goEl){go(goEl.dataset.go);return}
  const cityEl=e.target.closest('[data-city]');if(cityEl){state.city=cityEl.dataset.city;state.googlePlaces=[];state.budgetPicks={};save();city();return}
  const pEl=e.target.closest('[data-place]');if(pEl){
    if(pEl.dataset.action==='shortlist'){
      const id=pEl.dataset.place;if(!state.shortlist.includes(id))state.shortlist.push(id);save();toast('Đã thêm vào bình chọn');
    } else await detail(pEl.dataset.place);
    return;
  }
  if(e.target.id==='doLogin'){state.user={name:'Minh Anh',email:document.querySelector('#email').value};save();go(state.city?'home':'city')}
  if(e.target.id==='doRegister'){state.user={name:document.querySelector('#name').value||'Minh Anh',email:document.querySelector('#email').value};save();go('city')}
  if(e.target.id==='cityContinue'){if(!state.city){toast('Chọn thành phố trước nhé');return}go('home');if(hasRealApiKey())refreshGooglePlaces({silent:true})}
  if(e.target.id==='savePlan'){state.plan={id:Date.now().toString(36),name:document.querySelector('#planName').value,city:document.querySelector('#planCity').value,date:document.querySelector('#date').value,time:document.querySelector('#time').value,people:document.querySelector('#people').value};state.city=state.plan.city;state.googlePlaces=[];save();go('invite')}
  if(e.target.id==='copyLink'){const i=document.querySelector('#shareLink');navigator.clipboard?.writeText(i.value);toast('Đã copy link')}
  if(e.target.id==='submitVote'){const id=document.querySelector('input[name="vote"]:checked')?.value;if(id)localStorage.setItem('didau_vote',id);go('result')}
  if(e.target.id==='shareResult'||e.target.id==='sharePlace'){const p=state.selectedPlace;navigator.share?.({title:p?.name||'Đi Đâu?',text:p?.address||'Kèo đi chơi',url:p?.googleMapsURI||location.href}).catch(()=>{});toast('Sẵn sàng chia sẻ')}
  if(e.target.id==='openDirections'){const p=state.selectedPlace;if(p?.googleMapsURI)window.open(p.googleMapsURI,'_blank');else if(p?.lat)window.open(`https://www.google.com/maps/search/?api=1&query=${p.lat},${p.lng}`,'_blank')}
  if(e.target.id==='callPlace'){const p=state.selectedPlace;if(p?.phone)location.href=`tel:${p.phone}`;else toast('Google chưa trả số điện thoại cho địa điểm này')}
  if(e.target.id==='savePlace'||e.target.id==='savePlace2'){toast('Đã lưu địa điểm ♡')}
  if(e.target.id==='addShortlist'){const p=state.selectedPlace;if(p&&!state.shortlist.includes(p.id))state.shortlist.push(p.id);save();toast('Đã thêm vào bình chọn')}
  if(e.target.id==='logout'){['didau_user','didau_city','didau_plan','didau_shortlist','didau_vote'].forEach(k=>localStorage.removeItem(k));state.user=null;state.city='';state.plan=null;state.shortlist=[];go('splash')}
  if(e.target.id==='saveGoogleKey'){
    const v=document.querySelector('#googleKey').value.trim();
    if(!v){localStorage.removeItem('didau_google_key');state.googleReady=false;googleLoadPromise=null;toast('Đã xóa API key');mapsSettings();return}
    localStorage.setItem('didau_google_key',v);state.googleReady=false;googleLoadPromise=null;toast('Đã lưu. Đang kiểm tra…');
    const ok=await loadGoogleMaps();if(ok){toast('Google Maps đã kết nối');state.googlePlaces=[];setTimeout(()=>go(state.city?'home':'city'),450)}
  }
  if(e.target.id==='googleSearchBtn'){const q=document.querySelector('#search')?.value.trim();await refreshGooglePlaces({query:q?`${q} ở ${state.city}`:null});return}
  const cat=e.target.closest('[data-category]');if(cat){state.category=cat.dataset.category;if(hasRealApiKey())await refreshGooglePlaces();else explore();return}
  const view=e.target.closest('[data-view]');if(view){state.exploreView=view.dataset.view;explore();return}
  const hf=e.target.closest('[data-home-filter]');if(hf){document.querySelectorAll('[data-home-filter]').forEach(x=>x.classList.remove('active'));hf.classList.add('active');const cat=hf.dataset.homeFilter;const ps=activePlaces().filter(p=>cat==='Tất cả'||p.category===cat);const box=document.querySelector('#homePlaces');if(box)box.innerHTML=ps.slice(0,4).map(p=>placeCard(p)).join('')||'<div class="card">Không có địa điểm phù hợp.</div>';return}
  if(e.target.classList.contains('option')) e.target.classList.toggle('active');
  if(e.target.classList.contains('chip')&&!e.target.dataset.category&&!e.target.dataset.homeFilter&&!e.target.dataset.go)e.target.classList.toggle('active');
  if(e.target.id==='showInstallGuide'){
    const box=document.querySelector('#installGuide');box.innerHTML=`<div class="install-guide"><b>iPhone</b><div class="small">Safari → Share → Add to Home Screen.</div><br><b>Android</b><div class="small">Chrome → ⋮ → Install app / Add to Home screen.</div></div>`;
  }
});

document.addEventListener('keydown',async e=>{
  if(e.key==='Enter'&&e.target.id==='search'&&hasRealApiKey()){await refreshGooglePlaces({query:`${e.target.value} ở ${state.city}`})}
});
document.addEventListener('input',e=>{
  if(e.target.id==='search'&&!hasRealApiKey()){
    const q=e.target.value.toLowerCase();document.querySelectorAll('#searchList .place').forEach(el=>{const p=fallbackPlaces.find(x=>x.id===el.dataset.place);if(!p)return;el.style.display=(p.name+' '+p.category+' '+(p.tags||[]).join(' ')).toLowerCase().includes(q)?'grid':'none'});
  }
});

window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();state.deferredInstall=e;installBanner.classList.remove('hidden')});
document.querySelector('#installPwa')?.addEventListener('click',async()=>{if(!state.deferredInstall)return;state.deferredInstall.prompt();await state.deferredInstall.userChoice;state.deferredInstall=null;installBanner.classList.add('hidden')});
document.querySelector('#dismissInstall')?.addEventListener('click',()=>installBanner.classList.add('hidden'));

const joinId=new URLSearchParams(location.search).get('join');
if(joinId) go('join'); else if(state.user) go(state.city?'home':'city'); else go('splash');
if('serviceWorker' in navigator && location.protocol!=='file:') window.addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}));
