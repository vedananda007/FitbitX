// ========================
// NAVIGATION
// ========================
const sections = {
  today:   { id:'sec-today',   title:'Today',    sub:'Track your health & fitness journey' },
  coach:   { id:'sec-coach',   title:'AI Coach', sub:'Personalized fitness recommendations' },
  health:  { id:'sec-health',  title:'Health',   sub:'Monitor body wellness and vitals' },
  sleep:   { id:'sec-sleep',   title:'Sleep',    sub:'Recovery and sleep quality tracking' },
  activity:{ id:'sec-activity',title:'Activity', sub:'Movement and exercise analytics' },
  profile: { id:'sec-profile', title:'Profile',  sub:'Achievements and wellness profile' }
};

function switchSection(key) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const sec = sections[key];
  if (!sec) return;
  document.getElementById(sec.id).classList.add('active');
  document.querySelector(`[data-section="${key}"]`).classList.add('active');
  document.getElementById('pageTitle').textContent = sec.title;
  document.getElementById('pageSubtitle').textContent = sec.sub;
  closeNotif();
}

document.querySelectorAll('.nav-item[data-section]').forEach(item => {
  item.addEventListener('click', () => switchSection(item.dataset.section));
});

// ========================
// SIDEBAR HAMBURGER
// ========================
const sidebar = document.getElementById('sidebar');
document.getElementById('hamburger').addEventListener('click', () => {
  sidebar.classList.toggle('open');
});
document.addEventListener('click', e => {
  if (!sidebar.contains(e.target) && !document.getElementById('hamburger').contains(e.target)) {
    sidebar.classList.remove('open');
  }
});

// ========================
// NOTIFICATIONS
// ========================
const notifPanel = document.getElementById('notifPanel');
const notifBadge = document.getElementById('notifBadge');
let notifOpen = false;

document.getElementById('notifBtn').addEventListener('click', e => {
  e.stopPropagation();
  notifOpen = !notifOpen;
  notifPanel.classList.toggle('open', notifOpen);
  if (notifOpen) { notifBadge.style.display='none'; }
});
document.getElementById('closeNotif').addEventListener('click', closeNotif);
document.addEventListener('click', e => {
  if (!notifPanel.contains(e.target) && e.target !== document.getElementById('notifBtn')) closeNotif();
});
function closeNotif() { notifOpen=false; notifPanel.classList.remove('open'); }

// ========================
// SETTINGS
// ========================
const settingsOverlay = document.getElementById('settingsOverlay');
document.getElementById('settingsBtn').addEventListener('click', () => {
  settingsOverlay.classList.add('open');
});
function closeSettings() { settingsOverlay.classList.remove('open'); }
settingsOverlay.addEventListener('click', e => {
  if (e.target === settingsOverlay) closeSettings();
});

// ========================
// STEP COUNTER ANIMATION
// ========================
(function animateSteps() {
  const el = document.getElementById('stepCounter');
  const target = 2244;
  let count = 0;
  const interval = setInterval(() => {
    count += 26;
    if (count >= target) { count = target; clearInterval(interval); }
    el.textContent = count.toLocaleString();
  }, 16);
})();

// ========================
// HEART RATE MINI CHART
// ========================
let hrChart;
const hrData = [72,74,78,76,80,76,74,77,76,82,79,76];
function initHRMini() {
  const ctx = document.getElementById('hrMini');
  if (!ctx) return;
  hrChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: hrData.map((_,i)=>i),
      datasets:[{ data: hrData, borderColor:'#f472b6', borderWidth:2,
        fill:true, backgroundColor:'rgba(244,114,182,.1)',
        tension:.4, pointRadius:0 }]
    },
    options: { responsive:true, plugins:{legend:{display:false}},
      scales:{ x:{display:false}, y:{display:false} },
      animation:{ duration:800 }
    }
  });
}

// Live heart rate update
let hrBase = 76;
setInterval(() => {
  hrBase += Math.round((Math.random()-.5)*6);
  hrBase = Math.max(60, Math.min(105, hrBase));
  const el = document.getElementById('hrVal');
  const status = document.getElementById('hrStatus');
  if (el) el.textContent = hrBase;
  if (status) {
    if (hrBase < 70) status.textContent = 'Resting';
    else if (hrBase < 85) status.textContent = 'Normal range';
    else status.textContent = 'Elevated';
  }
  if (hrChart) {
    hrChart.data.datasets[0].data.shift();
    hrChart.data.datasets[0].data.push(hrBase);
    hrChart.update('none');
  }
  // Update modal BPM if workout running
  const bpmEl = document.getElementById('modalBPM');
  if (bpmEl && workoutRunning) bpmEl.textContent = hrBase;
}, 2000);

// ========================
// ACTIVITY CHART
// ========================
const chartData = {
  steps:    { data:[6200,8100,5400,9300,7800,2244,0], label:'Steps' },
  calories: { data:[1800,2100,1600,2200,1950,939,0], label:'Calories (kcal)' },
  distance: { data:[4.8,6.2,4.1,7.3,6.0,1.8,0], label:'Distance (km)' }
};
const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
let activityChart;

function createGradient(ctx, color) {
  const g = ctx.createLinearGradient(0,0,0,300);
  g.addColorStop(0, color+'33');
  g.addColorStop(1, color+'00');
  return g;
}

function initActivityChart(metric='steps') {
  const canvas = document.getElementById('activityChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const d = chartData[metric];
  if (activityChart) activityChart.destroy();
  activityChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: days,
      datasets:[{
        label: d.label, data: d.data,
        borderColor:'#00e5c3', borderWidth:2.5,
        fill:true, backgroundColor: createGradient(ctx,'#00e5c3'),
        tension:.4, pointRadius:5, pointBackgroundColor:'#00e5c3',
        pointBorderColor:'#080d16', pointBorderWidth:2
      }]
    },
    options: {
      responsive:true,
      plugins:{ legend:{display:false}, tooltip:{
        backgroundColor:'#0e1623', borderColor:'rgba(255,255,255,.1)', borderWidth:1,
        titleColor:'#e2e8f0', bodyColor:'#64748b', padding:10, cornerRadius:10
      }},
      scales:{
        x:{ grid:{color:'rgba(255,255,255,.04)'}, ticks:{color:'#64748b', font:{size:11}} },
        y:{ grid:{color:'rgba(255,255,255,.04)'}, ticks:{color:'#64748b', font:{size:11}} }
      },
      animation:{ duration:600 }
    }
  });
}

document.querySelectorAll('.tab-group .tab').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-group .tab').forEach(t=>t.classList.remove('active'));
    btn.classList.add('active');
    initActivityChart(btn.dataset.metric);
  });
});

// ========================
// SLEEP DONUT (Today)
// ========================
function initSleepDonut() {
  const canvas = document.getElementById('sleepDonut');
  if (!canvas) return;
  new Chart(canvas, {
    type: 'doughnut',
    data: {
      labels:['Deep Sleep','REM','Light Sleep','Awake'],
      datasets:[{
        data:[1.8,2.1,3.1,.5],
        backgroundColor:['#8b5cf6','#00e5c3','#3b82f6','rgba(255,255,255,.1)'],
        borderWidth:0, hoverBorderWidth:0
      }]
    },
    options:{
      responsive:true, cutout:'70%',
      plugins:{ legend:{display:false}, tooltip:{
        backgroundColor:'#0e1623', borderColor:'rgba(255,255,255,.1)', borderWidth:1,
        titleColor:'#e2e8f0', bodyColor:'#64748b', padding:10, cornerRadius:10
      }}
    }
  });
}

// ========================
// WEEKLY PROGRESS CHART
// ========================
function initProgressChart() {
  const canvas = document.getElementById('progressChart');
  if (!canvas) return;
  new Chart(canvas, {
    type:'bar',
    data:{
      labels:['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
      datasets:[
        { label:'Achieved', data:[100,100,80,60,0,0,0], backgroundColor:'rgba(0,229,195,.7)', borderRadius:6 },
        { label:'Remaining', data:[0,0,20,40,100,100,100], backgroundColor:'rgba(255,255,255,.06)', borderRadius:6 }
      ]
    },
    options:{
      responsive:true, scales:{
        x:{ stacked:true, grid:{display:false}, ticks:{color:'#64748b',font:{size:11}} },
        y:{ stacked:true, grid:{color:'rgba(255,255,255,.04)'}, ticks:{color:'#64748b',font:{size:11}}, max:100,
          title:{display:true,text:'% Complete',color:'#64748b',font:{size:10}} }
      },
      plugins:{ legend:{
        labels:{color:'#64748b',font:{size:11},usePointStyle:true,pointStyle:'circle'},
        position:'bottom'
      }, tooltip:{
        backgroundColor:'#0e1623', borderColor:'rgba(255,255,255,.1)', borderWidth:1,
        titleColor:'#e2e8f0', bodyColor:'#64748b', padding:10, cornerRadius:10
      }},
      animation:{duration:600}
    }
  });
}

// ========================
// SLEEP STAGES CHART
// ========================
function initSleepStagesChart() {
  const canvas = document.getElementById('sleepStagesChart');
  if (!canvas) return;
  new Chart(canvas, {
    type:'bar',
    data:{
      labels:['11 PM','12 AM','1 AM','2 AM','3 AM','4 AM','5 AM','6 AM','6:50 AM'],
      datasets:[
        { label:'Awake',  data:[.5,0,0,0,.2,0,0,0,.3], backgroundColor:'rgba(251,146,60,.7)',  borderRadius:4 },
        { label:'Light',  data:[0,.8,.5,0,0,.6,.7,.5,0], backgroundColor:'rgba(59,130,246,.7)',  borderRadius:4 },
        { label:'Deep',   data:[0,0,.5,.8,.3,0,0,0,0],   backgroundColor:'rgba(139,92,246,.7)',  borderRadius:4 },
        { label:'REM',    data:[0,0,0,.2,.5,.4,.3,.6,0],  backgroundColor:'rgba(0,229,195,.7)',   borderRadius:4 }
      ]
    },
    options:{
      responsive:true, scales:{
        x:{ stacked:true, grid:{display:false}, ticks:{color:'#64748b',font:{size:10}} },
        y:{ stacked:true, grid:{color:'rgba(255,255,255,.04)'}, ticks:{color:'#64748b',font:{size:10}},
          title:{display:true,text:'Hours',color:'#64748b',font:{size:10}} }
      },
      plugins:{ legend:{
        labels:{color:'#64748b',font:{size:11},usePointStyle:true,pointStyle:'circle'},
        position:'bottom'
      }, tooltip:{
        backgroundColor:'#0e1623', borderColor:'rgba(255,255,255,.1)', borderWidth:1,
        titleColor:'#e2e8f0', bodyColor:'#64748b', padding:10, cornerRadius:10
      }},
      animation:{duration:600}
    }
  });
}

// ========================
// SLEEP HISTORY CHART
// ========================
function initSleepHistChart() {
  const canvas = document.getElementById('sleepHistChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  new Chart(canvas, {
    type:'line',
    data:{
      labels:['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
      datasets:[{
        label:'Sleep (hrs)', data:[6.5,7.2,8.0,6.8,7.5,8.5,7.5],
        borderColor:'#8b5cf6', borderWidth:2.5, fill:true,
        backgroundColor:createGradient(ctx,'#8b5cf6'),
        tension:.4, pointRadius:5, pointBackgroundColor:'#8b5cf6',
        pointBorderColor:'#080d16', pointBorderWidth:2
      }]
    },
    options:{
      responsive:true,
      plugins:{ legend:{display:false}, tooltip:{
        backgroundColor:'#0e1623', borderColor:'rgba(255,255,255,.1)', borderWidth:1,
        titleColor:'#e2e8f0', bodyColor:'#64748b', padding:10, cornerRadius:10
      }},
      scales:{
        x:{ grid:{color:'rgba(255,255,255,.04)'}, ticks:{color:'#64748b',font:{size:11}} },
        y:{ grid:{color:'rgba(255,255,255,.04)'}, ticks:{color:'#64748b',font:{size:11}},
          min:4, max:10,
          title:{display:true,text:'Hours',color:'#64748b',font:{size:10}} }
      },
      animation:{duration:600}
    }
  });
}

// ========================
// HOURLY STEPS CHART
// ========================
function initHourlyChart() {
  const canvas = document.getElementById('hourlyChart');
  if (!canvas) return;
  new Chart(canvas, {
    type:'bar',
    data:{
      labels:['6AM','7AM','8AM','9AM','10AM','11AM','12PM','1PM','2PM','3PM','4PM','5PM'],
      datasets:[{
        label:'Steps', data:[120,480,310,550,180,390,240,160,300,200,150,164],
        backgroundColor: 'rgba(0,229,195,.6)', borderRadius:6,
        hoverBackgroundColor:'rgba(0,229,195,.9)'
      }]
    },
    options:{
      responsive:true,
      plugins:{ legend:{display:false}, tooltip:{
        backgroundColor:'#0e1623', borderColor:'rgba(255,255,255,.1)', borderWidth:1,
        titleColor:'#e2e8f0', bodyColor:'#64748b', padding:10, cornerRadius:10
      }},
      scales:{
        x:{ grid:{display:false}, ticks:{color:'#64748b',font:{size:10}} },
        y:{ grid:{color:'rgba(255,255,255,.04)'}, ticks:{color:'#64748b',font:{size:10}} }
      },
      animation:{duration:600}
    }
  });
}

// ========================
// WATER TRACKER
// ========================
let waterGlasses = 5;
const MAX_GLASSES = 8;

function toggleGlass(el) {
  if (el.classList.contains('filled')) {
    el.classList.remove('filled');
    waterGlasses = Math.max(0, waterGlasses - 1);
  } else {
    el.classList.add('filled');
    waterGlasses = Math.min(MAX_GLASSES, waterGlasses + 1);
  }
  updateWaterUI();
}

function updateWaterUI() {
  const pct = Math.round((waterGlasses / MAX_GLASSES) * 100);
  const litres = (waterGlasses * 0.375).toFixed(1);
  const fill = document.getElementById('waterFill');
  const label = document.getElementById('waterLabel');
  const bar = document.getElementById('waterBarFill');
  const num = document.getElementById('waterNum');
  const count = document.getElementById('glassCount');
  if (fill)  fill.style.height = pct + '%';
  if (label) label.textContent = pct + '%';
  if (bar)   bar.style.width = pct + '%';
  if (num)   num.innerHTML = litres + ' <small>L</small>';
  if (count) count.textContent = waterGlasses + ' / ' + MAX_GLASSES + ' glasses';
}

// ========================
// WORKOUT MODAL
// ========================
let workoutTimer = null;
let workoutRunning = false;
let workoutPaused = false;
let elapsedSeconds = 0;
let workoutDuration = 15;
let workoutKcalPerMin = 8;
let timerTotal;

function openWorkout(name, durationMin, kcal) {
  workoutDuration = durationMin;
  workoutKcalPerMin = kcal / durationMin;
  timerTotal = durationMin * 60;
  elapsedSeconds = 0;
  workoutRunning = false;
  workoutPaused = false;
  document.getElementById('modalTitle').textContent = name;
  document.getElementById('modalDur').textContent = durationMin;
  document.getElementById('modalKcal').textContent = 0;
  document.getElementById('modalBPM').textContent = hrBase;
  document.getElementById('timerDisplay').textContent = '00:00';
  document.getElementById('timerRing').style.strokeDashoffset = 326.7;
  document.getElementById('startModalBtn').innerHTML = '<i class="fa-solid fa-play"></i> Begin';
  document.getElementById('startModalBtn').style.display = '';
  document.getElementById('pauseIcon').className = 'fa-solid fa-pause';
  if (workoutTimer) clearInterval(workoutTimer);
  document.getElementById('workoutOverlay').classList.add('open');
}

function beginWorkout() {
  if (workoutRunning) return;
  workoutRunning = true;
  workoutPaused = false;
  document.getElementById('startModalBtn').style.display = 'none';
  workoutTimer = setInterval(tickTimer, 1000);
}

function togglePause() {
  if (!workoutRunning) return;
  workoutPaused = !workoutPaused;
  document.getElementById('pauseIcon').className =
    workoutPaused ? 'fa-solid fa-play' : 'fa-solid fa-pause';
}

function tickTimer() {
  if (workoutPaused) return;
  elapsedSeconds++;
  const m = String(Math.floor(elapsedSeconds/60)).padStart(2,'0');
  const s = String(elapsedSeconds%60).padStart(2,'0');
  document.getElementById('timerDisplay').textContent = m+':'+s;
  document.getElementById('modalKcal').textContent = Math.round(elapsedSeconds/60 * workoutKcalPerMin);
  const progress = elapsedSeconds / timerTotal;
  document.getElementById('timerRing').style.strokeDashoffset = 326.7 * (1 - progress);
  if (elapsedSeconds >= timerTotal) {
    clearInterval(workoutTimer);
    workoutRunning = false;
    document.getElementById('timerDisplay').textContent = 'Done!';
    setTimeout(closeWorkout, 2000);
  }
}

function closeWorkout() {
  if (workoutTimer) clearInterval(workoutTimer);
  workoutRunning = false;
  document.getElementById('workoutOverlay').classList.remove('open');
}

document.getElementById('workoutOverlay').addEventListener('click', e => {
  if (e.target === document.getElementById('workoutOverlay')) closeWorkout();
});

// ========================
// AI TIP DONE
// ========================
function markDone(btn) {
  const tip = btn.closest('.ai-tip');
  tip.classList.add('done-tip');
  btn.textContent = '✓';
  btn.style.color = '#00e5c3';
  btn.style.borderColor = 'rgba(0,229,195,.4)';
  btn.disabled = true;
}

// ========================
// PROFILE EDIT
// ========================
function toggleEditForm() {
  const form = document.getElementById('editFormCard');
  form.style.display = form.style.display === 'none' ? 'block' : 'none';
}

function saveProfile() {
  const name = document.getElementById('editName').value.trim();
  if (name) {
    document.getElementById('profileName').textContent = name;
  }
  toggleEditForm();
  showToast('Profile saved!');
}

function changeAvatar(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    document.getElementById('profileAvatar').src = e.target.result;
    document.getElementById('avatarTopBtn').src = e.target.result;
  };
  reader.readAsDataURL(file);
}

// ========================
// TOAST NOTIFICATION
// ========================
function showToast(msg) {
  let toast = document.getElementById('toastEl');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toastEl';
    toast.style.cssText =
      'position:fixed;bottom:28px;right:28px;background:#00e5c3;color:#080d16;'+
      'font-family:Outfit,sans-serif;font-weight:600;font-size:.88rem;'+
      'padding:12px 20px;border-radius:12px;z-index:1000;transition:.3s;opacity:0';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.style.opacity = '1';
  setTimeout(() => { toast.style.opacity = '0'; }, 2500);
}

// ========================
// SEARCH FUNCTIONALITY
// ========================
document.getElementById('searchInput').addEventListener('input', function() {
  const q = this.value.toLowerCase();
  if (!q) return;
  const map = {
    'step':'today','calorie':'today','heart':'today','workout':'coach',
    'coach':'coach','goal':'coach','water':'health','weight':'health',
    'sleep':'sleep','recovery':'sleep','activity':'activity','floor':'activity',
    'profile':'profile','badge':'profile','achievement':'profile'
  };
  for (const [kw, sec] of Object.entries(map)) {
    if (q.includes(kw)) { switchSection(sec); this.value=''; return; }
  }
});

// ========================
// INIT ALL CHARTS
// ========================
window.addEventListener('load', () => {
  initHRMini();
  initActivityChart('steps');
  initSleepDonut();
  initProgressChart();
  initSleepStagesChart();
  initSleepHistChart();
  initHourlyChart();
});
// ========================
// INTRO TEXT SCRAMBLE
// ========================

const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";

function scrambleText(element, finalText, speed = 40) {

    let iteration = 0;

    const interval = setInterval(() => {

        element.innerText = finalText
            .split("")
            .map((letter, index) => {

                if(index < iteration){
                    return finalText[index];
                }

                return letters[Math.floor(Math.random() * letters.length)];
            })
            .join("");

        if(iteration >= finalText.length){
            clearInterval(interval);
        }

        iteration += 1 / 2;

    }, speed);
}

// Run intro animation
window.addEventListener("load", () => {

    const title = document.querySelector(".intro-title");
    const sub = document.querySelector(".intro-sub");

    scrambleText(title, "FitbitX", 50);

    setTimeout(() => {
        scrambleText(sub, "Smart Health Intelligence", 30);
    }, 700);

});
/* CONTACT PAGE FIX */

function switchSection(sectionName) {
  document.querySelectorAll(".section").forEach(section => {
    section.classList.remove("active");
  });

  document.querySelectorAll(".nav-item").forEach(item => {
    item.classList.remove("active");
  });

  const targetSection = document.getElementById("sec-" + sectionName);
  if (targetSection) {
    targetSection.classList.add("active");
  }

  const activeNav = document.querySelector(`[data-section="${sectionName}"]`);
  if (activeNav) {
    activeNav.classList.add("active");
  }

  document.getElementById("pageTitle").innerText =
    sectionName.charAt(0).toUpperCase() + sectionName.slice(1);
}


/* NAVIGATION CLICK */

document.querySelectorAll(".nav-item").forEach(item => {
  item.addEventListener("click", function () {
    const section = this.getAttribute("data-section");
    if (section) {
      switchSection(section);
    }
  });
});


/* CONTACT FORM SUBMIT */

document
  .getElementById("contactForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    alert("Message sent successfully!");

    this.reset();
  });
