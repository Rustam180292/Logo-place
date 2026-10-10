/**
 * Yandex Maps JS API 3.0 uchun WebView ichida ishlaydigan HTML sahifa.
 *
 * Nega WebView: Yandex'ning rasmiy native MapKit SDK'si Expo'ning boshqariladigan
 * workflow'ida ishlamaydi (native build talab qiladi). JS API esa kalit bilan
 * darhol ishlaydi va Expo Go'da sinab ko'rish mumkin. Harita shu fayl va
 * `CentersMap.tsx` ortida to'liq izolyatsiya qilingan — keyinchalik native
 * MapKit'ga o'tishda faqat shu papka o'zgaradi.
 *
 * MUHIM: Yandex JS API koordinatalarni [lng, lat] tartibida kutadi.
 */

export interface MapMarkerInput {
  id: string;
  lat: number;
  lng: number;
  /** Reklama darajasi — belgining o'lchami va rangini belgilaydi. */
  tier: 'free' | 'standard' | 'premium';
}

export interface MapHtmlOptions {
  apiKey: string;
  /** Harita yorliqlari tili. Yandex JS API qiymatlari: ru_RU, en_US, tr_TR. */
  mapLang: string;
  theme: 'light' | 'dark';
  initialCenter: { lat: number; lng: number };
  initialZoom: number;
}

/**
 * RN tomoniga keladigan xabarlar.
 * `select` — belgi bosildi, `deselect` — haritaning bo'sh joyi bosildi.
 */
export type MapMessage =
  | { type: 'ready' }
  | { type: 'select'; id: string }
  | { type: 'deselect' }
  | { type: 'error'; message: string };

export function buildMapHtml(options: MapHtmlOptions): string {
  const { apiKey, mapLang, theme, initialCenter, initialZoom } = options;
  const config = JSON.stringify({
    theme,
    center: [initialCenter.lng, initialCenter.lat],
    zoom: initialZoom,
  });

  // Sahifa ichidagi JS ataylab template literal ishlatmaydi, shunda bu faylda
  // qo'shimcha qochirish (escaping) kerak bo'lmaydi.
  return [
    '<!DOCTYPE html>',
    '<html lang="uz">',
    '<head>',
    '<meta charset="utf-8" />',
    '<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />',
    '<style>',
    '  html, body, #map { margin:0; padding:0; width:100%; height:100%; overflow:hidden; }',
    '  body { background:' + (theme === 'dark' ? '#0C1116' : '#F4F7FA') + '; }',
    '  .lp-pin { position:relative; display:flex; align-items:center; justify-content:center;',
    '    border-radius:50% 50% 50% 4px; transform:rotate(-45deg); cursor:pointer;',
    '    border:2px solid #fff; box-shadow:0 2px 6px rgba(0,0,0,.35); transition:transform .15s; }',
    '  .lp-pin span { transform:rotate(45deg); font:600 11px/1 system-ui, sans-serif; color:#fff; }',
    '  .lp-free { width:26px; height:26px; background:#0E7C86; }',
    '  .lp-standard { width:32px; height:32px; background:#0E7C86; }',
    '  .lp-premium { width:38px; height:38px; background:#E8833A; }',
    '  .lp-selected { transform:rotate(-45deg) scale(1.25); z-index:10; border-color:#0B1F33; }',
    '  .lp-user { width:18px; height:18px; border-radius:50%; background:#2D7FF9;',
    '    border:3px solid #fff; box-shadow:0 0 0 6px rgba(45,127,249,.25); }',
    '  .lp-fatal { display:flex; align-items:center; justify-content:center; height:100%;',
    '    padding:24px; text-align:center; font:14px/1.5 system-ui, sans-serif;',
    '    color:' + (theme === 'dark' ? '#A9B6C4' : '#5A6B7D') + '; }',
    '</style>',
    '<script src="https://api-maps.yandex.ru/v3/?apikey=' +
      encodeURIComponent(apiKey) +
      '&lang=' +
      encodeURIComponent(mapLang) +
      '"></script>',
    '</head>',
    '<body>',
    '<div id="map"></div>',
    '<script>',
    'var CONFIG = ' + config + ';',
    'var state = { map:null, markers:{}, userMarker:null, selectedId:null, centers:[] };',
    '',
    'function post(payload) {',
    '  if (window.ReactNativeWebView) {',
    '    window.ReactNativeWebView.postMessage(JSON.stringify(payload));',
    '  }',
    '}',
    '',
    'function showFatal(message) {',
    '  document.body.innerHTML = \'<div class="lp-fatal">\' + message + \'</div>\';',
    '  post({ type:"error", message: message });',
    '}',
    '',
    'function pinElement(center) {',
    '  var el = document.createElement("div");',
    '  el.className = "lp-pin lp-" + center.tier;',
    '  if (center.tier === "premium") {',
    '    var label = document.createElement("span");',
    '    label.textContent = "\\u2605";',
    '    el.appendChild(label);',
    '  }',
    '  el.addEventListener("click", function (event) {',
    '    event.stopPropagation();',
    '    post({ type:"select", id: center.id });',
    '  });',
    '  return el;',
    '}',
    '',
    '// Belgilarni qaytadan chizadi. Markazlar ro\\u2019yxati o\\u2019zgarganda chaqiriladi.',
    'function renderMarkers() {',
    '  if (!state.map) return;',
    '  var ymaps3 = window.ymaps3;',
    '  Object.keys(state.markers).forEach(function (id) {',
    '    state.map.removeChild(state.markers[id].marker);',
    '  });',
    '  state.markers = {};',
    '  state.centers.forEach(function (center) {',
    '    var el = pinElement(center);',
    '    var marker = new ymaps3.YMapMarker(',
    '      { coordinates: [center.lng, center.lat], zIndex: center.tier === "premium" ? 5 : 1 },',
    '      el',
    '    );',
    '    state.map.addChild(marker);',
    '    state.markers[center.id] = { marker: marker, el: el };',
    '  });',
    '  applySelection();',
    '}',
    '',
    'function applySelection() {',
    '  Object.keys(state.markers).forEach(function (id) {',
    '    var entry = state.markers[id];',
    '    if (id === state.selectedId) {',
    '      entry.el.classList.add("lp-selected");',
    '    } else {',
    '      entry.el.classList.remove("lp-selected");',
    '    }',
    '  });',
    '}',
    '',
    '// RN tomoni chaqiradigan buyruqlar.',
    'window.LP = {',
    '  setCenters: function (centers) {',
    '    state.centers = centers || [];',
    '    renderMarkers();',
    '  },',
    '  setSelected: function (id) {',
    '    state.selectedId = id;',
    '    applySelection();',
    '  },',
    '  setUser: function (coords) {',
    '    if (!state.map) return;',
    '    var ymaps3 = window.ymaps3;',
    '    if (state.userMarker) {',
    '      state.map.removeChild(state.userMarker);',
    '      state.userMarker = null;',
    '    }',
    '    if (!coords) return;',
    '    var el = document.createElement("div");',
    '    el.className = "lp-user";',
    '    state.userMarker = new ymaps3.YMapMarker(',
    '      { coordinates: [coords.lng, coords.lat], zIndex: 20 },',
    '      el',
    '    );',
    '    state.map.addChild(state.userMarker);',
    '  },',
    '  moveTo: function (coords, zoom) {',
    '    if (!state.map || !coords) return;',
    '    state.map.setLocation({',
    '      center: [coords.lng, coords.lat],',
    '      zoom: zoom || state.map.zoom,',
    '      duration: 350',
    '    });',
    '  }',
    '};',
    '',
    'async function init() {',
    '  if (!window.ymaps3) {',
    '    showFatal("Yandex Maps yuklanmadi. Internet aloqasi yoki API kalitini tekshiring.");',
    '    return;',
    '  }',
    '  try {',
    '    var ymaps3 = window.ymaps3;',
    '    await ymaps3.ready;',
    '    state.map = new ymaps3.YMap(document.getElementById("map"), {',
    '      location: { center: CONFIG.center, zoom: CONFIG.zoom },',
    '      behaviors: ["drag", "pinchZoom", "dblClick", "multiTouch"]',
    '    });',
    '    state.map.addChild(new ymaps3.YMapDefaultSchemeLayer({ theme: CONFIG.theme }));',
    '    state.map.addChild(new ymaps3.YMapDefaultFeaturesLayer({}));',
    '    state.map.addChild(new ymaps3.YMapListener({',
    '      layer: "any",',
    '      onClick: function () { post({ type:"deselect" }); }',
    '    }));',
    '    renderMarkers();',
    '    post({ type:"ready" });',
    '  } catch (err) {',
    '    showFatal("Haritani ishga tushirishda xatolik: " + (err && err.message ? err.message : err));',
    '  }',
    '}',
    '',
    'if (document.readyState === "complete" || document.readyState === "interactive") {',
    '  init();',
    '} else {',
    '  window.addEventListener("DOMContentLoaded", init);',
    '}',
    '</script>',
    '</body>',
    '</html>',
  ].join('\n');
}
