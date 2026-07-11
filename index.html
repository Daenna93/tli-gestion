<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<meta name="theme-color" content="#1a1a2e">
<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
<meta http-equiv="Pragma" content="no-cache">
<meta http-equiv="Expires" content="0">
<title>TLI v16 - Technical Layer Innovation</title>
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
<link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.css" />
<link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.Default.css" />
<style>
:root{--primary:#00d4ff;--secondary:#ff6b6b;--accent:#7b2cbf;--dark:#1a1a2e;--darker:#0f0f1a;--light:#e0e0e0;--success:#00ff88;--warning:#ffaa00;--danger:#ff3333;--glass:rgba(255,255,255,0.05);--glass-border:rgba(255,255,255,0.1)}
*{margin:0;padding:0;box-sizing:border-box;-webkit-tap-highlight-color:transparent}
body{font-family:'Segoe UI',system-ui,sans-serif;background:var(--darker);color:var(--light);min-height:100vh;overflow-x:hidden;padding-bottom:80px}
.app-header{background:linear-gradient(135deg,var(--dark) 0%,var(--accent) 100%);padding:18px 20px;position:sticky;top:0;z-index:100;box-shadow:0 4px 20px rgba(0,0,0,0.3);display:flex;justify-content:space-between;align-items:center}
.app-header h1{font-size:1.1rem;font-weight:800}
.app-header .white{color:#fff}.app-header .blue{color:var(--primary);text-shadow:0 0 10px rgba(0,212,255,0.4)}
.sync-btn{background:var(--glass);border:1px solid var(--glass-border);color:var(--light);padding:8px 14px;border-radius:20px;font-size:.8rem;font-weight:600;cursor:pointer;display:flex;align-items:center;gap:6px;font-family:inherit}
.nav-tabs{display:flex;gap:8px;padding:12px 10px;overflow-x:auto;background:var(--dark);position:sticky;top:58px;z-index:99;border-bottom:1px solid var(--glass-border);scrollbar-width:none}
.nav-tabs::-webkit-scrollbar{display:none}
.nav-tab{flex-shrink:0;padding:8px 16px;border-radius:25px;background:var(--glass);border:1px solid var(--glass-border);color:var(--light);font-size:.8rem;font-weight:600;cursor:pointer;transition:all .3s;white-space:nowrap;font-family:inherit}
.nav-tab.active{background:linear-gradient(135deg,var(--primary),var(--accent));color:#fff;border-color:transparent;box-shadow:0 4px 15px rgba(0,212,255,0.3)}
.section{display:none;padding:15px;animation:fadeIn .3s}
.section.active{display:block}
@keyframes fadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
.card{background:var(--glass);border:1px solid var(--glass-border);border-radius:16px;padding:18px;margin-bottom:12px}
.card-title{font-size:1rem;font-weight:700;margin-bottom:12px}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:12px 20px;border-radius:12px;border:none;font-family:inherit;font-size:.9rem;font-weight:700;cursor:pointer;transition:all .2s;width:100%;margin-top:8px}
.btn:active{transform:scale(.97)}
.btn-primary{background:linear-gradient(135deg,var(--primary),var(--accent));color:#fff;box-shadow:0 4px 15px rgba(0,212,255,0.3)}
.btn-secondary{background:var(--glass);border:1px solid var(--glass-border);color:var(--light)}
.btn-danger{background:linear-gradient(135deg,var(--secondary),#cc5555);color:#fff}
.btn-success{background:linear-gradient(135deg,var(--success),#00cc66);color:#fff}
.btn-sm{padding:8px 14px;font-size:.8rem;width:auto}
.btn-row{display:flex;gap:8px;margin-top:8px}
.btn-row .btn{margin-top:0}
.form-group{margin-bottom:14px}
.form-label{display:block;margin-bottom:5px;font-size:.8rem;color:#aaa}
.form-input,.form-select,.form-textarea{width:100%;padding:12px 14px;border-radius:12px;border:1px solid var(--glass-border);background:var(--darker);color:var(--light);font-family:inherit;font-size:1rem;outline:none}
.form-textarea{min-height:70px;resize:vertical}
.search-box{width:100%;padding:10px 14px;border-radius:12px;border:1px solid var(--glass-border);background:var(--darker);color:var(--light);font-family:inherit;font-size:.9rem;outline:none;margin-bottom:12px}
.badge{display:inline-flex;align-items:center;gap:4px;padding:4px 10px;border-radius:20px;font-size:.7rem;font-weight:700;text-transform:uppercase}
.badge-pending{background:rgba(255,170,0,0.2);color:var(--warning)}
.badge-printing{background:rgba(0,212,255,0.2);color:var(--primary)}
.badge-finished{background:rgba(0,255,136,0.2);color:var(--success)}
.badge-delivered{background:rgba(123,44,191,0.2);color:#c77dff}
.badge-low{background:rgba(0,255,136,0.2);color:var(--success)}
.badge-medium{background:rgba(255,170,0,0.2);color:var(--warning)}
.badge-high{background:rgba(255,51,51,0.2);color:var(--danger)}
.order-item{background:var(--glass);border:1px solid var(--glass-border);border-radius:12px;padding:14px;margin-bottom:10px;cursor:pointer;transition:all .3s}
.order-item:hover{border-color:var(--primary)}
.order-item-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:6px}
.order-item-title{font-weight:700;font-size:.95rem}
.order-item-meta{font-size:.8rem;color:#888;display:flex;gap:12px;flex-wrap:wrap}
.modal-overlay{position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.85);z-index:500;display:none;align-items:center;justify-content:center;padding:16px}
.modal-overlay.active{display:flex}
.modal-content{background:var(--dark);border:1px solid var(--glass-border);border-radius:20px;padding:22px;width:100%;max-height:90vh;overflow-y:auto;max-width:480px}
.modal-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:18px}
.modal-title{font-size:1.1rem;font-weight:700}
.modal-close{background:none;border:none;color:var(--light);font-size:1.5rem;cursor:pointer}
.toast{position:fixed;bottom:90px;left:50%;transform:translateX(-50%) translateY(100px);background:var(--dark);border:1px solid var(--primary);color:var(--light);padding:12px 20px;border-radius:12px;font-size:.9rem;z-index:2000;opacity:0;transition:all .3s;white-space:nowrap}
.toast.show{opacity:1;transform:translateX(-50%) translateY(0)}
.toast-success{border-color:var(--success)}.toast-error{border-color:var(--secondary)}.toast-warning{border-color:var(--warning)}
.empty-state{text-align:center;padding:30px 20px;color:#666}
.empty-state .icon{font-size:2.5rem;margin-bottom:10px;opacity:.5}
.timer-card{background:linear-gradient(135deg,rgba(0,212,255,0.1),rgba(123,44,191,0.1));border:1px solid var(--primary);border-radius:12px;padding:14px;margin-bottom:10px;position:relative}
.timer-card.finished{border-color:var(--success);background:linear-gradient(135deg,rgba(0,255,136,0.1),rgba(0,255,136,0.05))}
.timer-name{font-weight:700;margin-bottom:4px}
.timer-info{font-size:.8rem;color:#888}
.timer-remaining{font-size:1.5rem;font-weight:700;color:var(--primary);margin-top:6px}
.progress-bar{height:6px;background:var(--darker);border-radius:3px;overflow:hidden;margin-top:8px}
.progress-fill{height:100%;background:linear-gradient(90deg,var(--primary),var(--accent));border-radius:3px;transition:width .5s}
.planning-calendar{display:grid;grid-template-columns:repeat(7,1fr);gap:4px;margin-bottom:12px}
.planning-day-header{text-align:center;font-size:.7rem;color:#888;padding:6px 2px}
.planning-day{background:var(--glass);border:1px solid var(--glass-border);border-radius:8px;padding:5px;min-height:55px;cursor:pointer;transition:all .2s;position:relative}
.planning-day:hover{border-color:var(--primary)}.planning-day.today{border-color:var(--primary);background:rgba(0,212,255,0.1)}
.planning-day.selected{border-color:var(--success);background:rgba(0,255,136,0.1)}
.planning-day-number{font-size:.75rem;font-weight:700;margin-bottom:3px}
.planning-day.today .planning-day-number{color:var(--primary)}
.planning-day.selected .planning-day-number{color:var(--success)}
.planning-event-dot{width:5px;height:5px;border-radius:50%;display:inline-block;margin:1px}
.event-item{background:var(--glass);border:1px solid var(--glass-border);border-radius:12px;padding:12px;margin-bottom:8px;cursor:pointer;transition:all .2s;border-left:3px solid var(--primary);position:relative}
.event-item:hover{border-color:var(--primary)}
.event-item-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:4px}
.event-item-title{font-weight:700;font-size:.9rem}
.event-item-meta{font-size:.75rem;color:#888;display:flex;gap:10px;flex-wrap:wrap}
.event-item-actions{position:absolute;top:8px;right:8px;display:flex;gap:6px}
.event-item-actions button{background:var(--glass);border:1px solid var(--glass-border);color:var(--light);border-radius:6px;width:28px;height:28px;font-size:.8rem;cursor:pointer}
.photo-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:10px}
.photo-item{aspect-ratio:1;border-radius:10px;overflow:hidden;background:var(--darker);border:1px solid var(--glass-border);position:relative;cursor:pointer}
.photo-item img{width:100%;height:100%;object-fit:cover}
.photo-delete{position:absolute;top:4px;right:4px;background:var(--secondary);color:#fff;border:none;border-radius:50%;width:22px;height:22px;font-size:.75rem;cursor:pointer;z-index:2}
.checklist-item{display:flex;align-items:center;gap:10px;padding:10px;background:var(--glass);border-radius:10px;margin-bottom:8px;cursor:pointer}
.checklist-item input[type="checkbox"]{width:20px;height:20px;accent-color:var(--primary);cursor:pointer}
.checklist-item label{flex:1;cursor:pointer;font-size:.9rem}
.quality-overlay{position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.92);z-index:2000;display:none;align-items:center;justify-content:center;padding:16px}
.quality-overlay.active{display:flex}
.quality-content{background:var(--dark);border:1px solid var(--primary);border-radius:20px;padding:24px;width:100%;max-width:450px;box-shadow:0 0 30px rgba(0,212,255,0.3)}
.quality-header{text-align:center;margin-bottom:18px}
.quality-header h3{font-size:1.2rem;font-weight:800;color:var(--primary);text-shadow:0 0 10px rgba(0,212,255,0.3)}
.quality-header p{color:#888;font-size:.85rem;margin-top:6px}
.order-tabs{display:flex;gap:6px;margin-bottom:12px;overflow-x:auto;scrollbar-width:none}
.order-tabs::-webkit-scrollbar{display:none}
.order-tab{flex-shrink:0;padding:6px 14px;border-radius:20px;background:var(--glass);border:1px solid var(--glass-border);color:var(--light);font-size:.75rem;font-weight:600;cursor:pointer;transition:all .2s;white-space:nowrap}
.order-tab.active{background:linear-gradient(135deg,var(--primary),var(--accent));color:#fff;border-color:transparent}
.photo-overlay{position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.95);z-index:3000;display:none;align-items:center;justify-content:center;padding:20px}
.photo-overlay.active{display:flex}
.photo-overlay img{max-width:100%;max-height:80vh;border-radius:12px;object-fit:contain}
.photo-overlay-close{position:absolute;top:20px;right:20px;background:var(--secondary);color:#fff;border:none;border-radius:50%;width:40px;height:40px;font-size:1.2rem;cursor:pointer}
.client-card{background:var(--glass);border:1px solid var(--glass-border);border-radius:12px;padding:14px;margin-bottom:10px;cursor:pointer;transition:all .3s}
.client-card:hover{border-color:var(--primary)}
.client-name{font-weight:700;font-size:1.05rem}
.client-info{font-size:.8rem;color:#888;margin-top:4px}
.client-orders{font-size:.75rem;color:#666;margin-top:4px}
.client-order-row{background:var(--glass);border:1px solid var(--glass-border);border-radius:8px;padding:10px;margin-bottom:6px;cursor:pointer}
.machine-card{background:var(--glass);border:1px solid var(--glass-border);border-radius:12px;padding:14px;margin-bottom:10px;cursor:pointer;transition:all .3s;border-left:3px solid var(--primary)}
.machine-card:hover{border-color:var(--primary)}
.machine-card.busy{border-left-color:var(--warning)}
.machine-card.available{border-left-color:var(--success)}
.machine-name{font-weight:700;font-size:1.05rem}
.machine-info{font-size:.8rem;color:#888;margin-top:4px}
.machine-hours{font-size:.75rem;color:#666;margin-top:4px}
.maintenance-item{background:var(--glass);border:1px solid var(--glass-border);border-radius:8px;padding:10px;margin-bottom:6px}
.maintenance-item-header{display:flex;justify-content:space-between;align-items:center}
.maintenance-item-title{font-weight:700;font-size:.9rem}
.maintenance-item-date{font-size:.75rem;color:#888}
.maintenance-item-notes{font-size:.8rem;color:#aaa;margin-top:4px}
.ca-card{background:linear-gradient(135deg,rgba(0,212,255,0.1),rgba(123,44,191,0.1));border:1px solid var(--primary);border-radius:12px;padding:14px;margin-bottom:10px;text-align:center}
.ca-amount{font-size:1.8rem;font-weight:800;color:var(--primary)}
.ca-label{font-size:.75rem;color:#888;margin-top:4px}
.call-overlay{position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.9);z-index:4000;display:none;align-items:center;justify-content:center;padding:16px}
.call-overlay.active{display:flex}
.call-content{background:var(--dark);border:1px solid var(--primary);border-radius:20px;padding:24px;width:100%;max-width:350px;text-align:center}
.call-content h3{color:var(--primary);margin-bottom:8px}
.call-content p{color:#888;margin-bottom:20px}
.call-number{font-size:1.4rem;font-weight:700;color:#fff;margin-bottom:20px}
.plan-filter-row{display:flex;gap:8px;margin-bottom:12px;align-items:center}
.plan-filter-row .btn{margin-top:0}
.date-info{font-size:.75rem;color:#888;margin-top:4px}

/* ─── PROSPECTION ─── */
#prospection .prospect-wrap{display:flex;height:calc(100vh - 170px);gap:0}
#prospection .sidebar{width:360px;min-width:300px;background:var(--dark);border-right:1px solid var(--glass-border);display:flex;flex-direction:column;overflow:hidden}
#prospection .sidebar.hidden{display:none}
#prospection .sb-top{padding:14px;border-bottom:1px solid var(--glass-border)}
#prospection .sb-filters{padding:12px 14px;border-bottom:1px solid var(--glass-border);max-height:200px;overflow-y:auto}
#prospection .sb-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;padding:10px 14px;border-bottom:1px solid var(--glass-border);background:var(--darker)}
#prospection .sb-stat{text-align:center;padding:8px;border-radius:10px;background:var(--glass);border:1px solid var(--glass-border)}
#prospection .sb-stat .n{font-size:1.1rem;font-weight:800}
#prospection .sb-stat .l{font-size:.65rem;color:#888;text-transform:uppercase;letter-spacing:.3px}
#prospection .sb-stat.a .n{color:var(--primary)}
#prospection .sb-stat.b .n{color:var(--warning)}
#prospection .sb-stat.c .n{color:#a0aec0}
#prospection .sb-stat.s .n{color:var(--secondary)}
#prospection .sb-results{flex:1;overflow-y:auto;padding:8px 0}
#prospection .res-item{display:flex;align-items:flex-start;gap:10px;padding:12px 14px;border-bottom:1px solid var(--glass-border);cursor:pointer;transition:all .2s;border-left:3px solid transparent}
#prospection .res-item:hover{background:var(--glass);border-left-color:var(--primary)}
#prospection .res-item.active{background:rgba(0,212,255,0.08);border-left-color:var(--primary)}
#prospection .res-check{margin-top:2px}
#prospection .res-check input{width:18px;height:18px;accent-color:var(--primary);cursor:pointer}
#prospection .res-body{flex:1;min-width:0}
#prospection .res-name{font-size:.88rem;font-weight:700;color:var(--light);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#prospection .res-meta{font-size:.75rem;color:#888;margin-top:3px;display:flex;gap:8px;flex-wrap:wrap;align-items:center}
#prospection .res-badge{display:inline-flex;align-items:center;padding:3px 8px;border-radius:20px;font-size:.65rem;font-weight:700;text-transform:uppercase}
#prospection .res-badge.A{background:rgba(0,212,255,0.15);color:var(--primary)}
#prospection .res-badge.B{background:rgba(255,170,0,0.15);color:var(--warning)}
#prospection .res-badge.C{background:rgba(160,174,192,0.15);color:#a0aec0}
#prospection .res-badge.sol{background:rgba(255,107,107,0.15);color:var(--secondary)}
#prospection .res-count{padding:10px 14px;font-size:.8rem;color:#888;border-bottom:1px solid var(--glass-border);background:var(--darker)}
#prospection .map-wrap{flex:1;position:relative;background:#111;min-height:300px}
#prospection #prospectMap{width:100%;height:100%;border-radius:0}
#prospection .leaflet-popup-content-wrapper{background:var(--dark);color:var(--light);border-radius:14px;border:1px solid var(--glass-border);box-shadow:0 8px 32px rgba(0,0,0,0.5)}
#prospection .leaflet-popup-tip{background:var(--dark)}
#prospection .popup-prospect h3{margin:0 0 8px;font-size:1rem;color:var(--primary);font-weight:800}
#prospection .popup-prospect p{margin:4px 0;font-size:.82rem;color:#aaa}
#prospection .popup-prospect .badge{display:inline-flex;padding:4px 10px;border-radius:20px;font-size:.7rem;font-weight:700;margin-top:8px;text-transform:uppercase}
#prospection .popup-prospect .badge.A{background:rgba(0,212,255,0.15);color:var(--primary)}
#prospection .popup-prospect .badge.B{background:rgba(255,170,0,0.15);color:var(--warning)}
#prospection .popup-prospect .badge.C{background:rgba(160,174,192,0.15);color:#a0aec0}
#prospection .popup-prospect .badge.sol{background:rgba(255,107,107,0.15);color:var(--secondary)}
#prospection .popup-prospect .btn{margin-top:10px;width:auto;padding:6px 14px;font-size:.75rem}
#prospection .filter-label{font-size:.75rem;text-transform:uppercase;letter-spacing:.5px;color:#888;margin-bottom:4px;display:block}
#prospection .filter-row{display:flex;gap:8px;align-items:center;margin-bottom:6px}
#prospection select,#prospection input[type="range"]{width:100%;background:var(--darker);border:1px solid var(--glass-border);color:var(--light);padding:8px 10px;border-radius:10px;font-size:.82rem;outline:none;font-family:inherit}
#prospection select:focus,#prospection input[type="range"]:focus{border-color:var(--primary)}
#prospection .range-val{font-size:.75rem;color:var(--primary);min-width:50px;text-align:right;font-weight:600}
#prospection .checkboxes{display:flex;gap:14px;flex-wrap:wrap}
#prospection .checkboxes label{font-size:.8rem;display:flex;align-items:center;gap:5px;cursor:pointer;color:#aaa}
#prospection .checkboxes input{accent-color:var(--primary);width:16px;height:16px}
#prospection .toggle-sb{display:none;position:absolute;bottom:20px;left:20px;z-index:1000;width:50px;height:50px;border-radius:50%;background:linear-gradient(135deg,var(--primary),var(--accent));color:#fff;border:none;font-size:1.3rem;cursor:pointer;box-shadow:0 4px 20px rgba(0,212,255,0.4);align-items:center;justify-content:center}
/* ─── Accordéons ─── */
.accordion{border-bottom:1px solid var(--glass-border)}
.accordion-header{display:flex;justify-content:space-between;align-items:center;padding:10px 14px;cursor:pointer;background:var(--darker);font-size:.85rem;font-weight:600;color:var(--text);transition:background .2s}
.accordion-header:hover{background:rgba(255,255,255,.05)}
.accordion-arrow{font-size:.7rem;transition:transform .3s;color:var(--text-muted)}
.accordion.open .accordion-arrow{transform:rotate(90deg)}
.accordion-body{max-height:0;overflow:hidden;transition:max-height .4s ease,padding .4s ease;padding:0 14px;background:var(--darker)}
.accordion.open .accordion-body{max-height:800px;padding:8px 14px}

/* ─── Splash Screen ─── */
#splashScreen{position:fixed;inset:0;z-index:99999;display:flex;flex-direction:column;align-items:center;justify-content:center;background:#1a1a1f;transition:opacity .9s ease,transform .9s ease}
#splashScreen::before{content:'';position:absolute;inset:0;background:repeating-linear-gradient(0deg,transparent 0px,transparent 1px,rgba(255,255,255,.03) 1px,rgba(255,255,255,.03) 2px),repeating-linear-gradient(90deg,transparent 0px,transparent 1px,rgba(255,255,255,.02) 1px,rgba(255,255,255,.02) 2px);pointer-events:none}
#splashScreen.fade-out{opacity:0;transform:scale(1.08);pointer-events:none}
#splashScreen .splash-logo-wrap{position:relative;animation:splashLogoPop 7s ease forwards}
#splashScreen .splash-logo{width:160px;height:160px;border-radius:28px;box-shadow:0 0 60px rgba(0,212,255,.25),0 20px 40px rgba(0,0,0,.5);animation:splashLogoGlow 3s ease-in-out infinite alternate;image-rendering:-webkit-optimize-contrast;image-rendering:crisp-edges;transform:translateZ(0);backface-visibility:hidden}
#splashScreen .splash-title{margin-top:28px;font-size:1.5rem;font-weight:700;display:flex;gap:8px;flex-wrap:wrap;justify-content:center}
#splashScreen .splash-title .splash-word{display:inline-block;overflow:hidden;white-space:nowrap}
#splashScreen .splash-title .splash-word span{display:inline-block;transform:translateY(100%);opacity:0;animation:splashLetterReveal .5s ease forwards}
#splashScreen .splash-title .splash-blue{color:#00d4ff;text-shadow:0 0 20px rgba(0,212,255,.5)}
#splashScreen .splash-subtitle{margin-top:10px;font-size:.85rem;color:rgba(255,255,255,.6);opacity:0;animation:splashFadeIn .8s 2.5s ease forwards}
@keyframes splashLogoPop{0%{transform:scale(0) rotate(-15deg);opacity:0}20%{transform:scale(1.15) rotate(3deg)}30%{transform:scale(1) rotate(0)}100%{transform:scale(1) rotate(0);opacity:1}}
@keyframes splashLogoGlow{0%{box-shadow:0 0 40px rgba(0,212,255,.2),0 20px 40px rgba(0,0,0,.5)}100%{box-shadow:0 0 70px rgba(0,212,255,.4),0 20px 40px rgba(0,0,0,.5)}}
@keyframes splashLetterReveal{from{transform:translateY(100%) scale(.8);opacity:0}to{transform:translateY(0) scale(1);opacity:1}}
@keyframes splashFadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}

@media (max-width:768px){
  #prospection .sidebar{position:absolute;z-index:900;height:100%;width:90%;max-width:380px;transition:transform .3s ease}
  #prospection .sidebar.hidden{transform:translateX(-110%)}
  #prospection .toggle-sb{display:flex}
}
#prospection .sidebar.hidden{transform:translateX(-100%);width:0;padding:0;overflow:hidden;opacity:0;transition:all .3s ease}
#prospection .sidebar.hidden + .map-wrap #prospectMap{width:100% !important}

/* ─── PROSPECTION EXTRA ─── */
#prospection .prospect-toolbar{display:flex;gap:8px;padding:0 14px 10px;border-bottom:1px solid var(--glass-border);flex-wrap:wrap}
#prospection .prospect-toolbar .btn{margin-top:0;width:auto}
#prospection .sort-bar{display:flex;gap:8px;padding:8px 14px;border-bottom:1px solid var(--glass-border);align-items:center}
#prospection .sort-bar span{font-size:.75rem;color:#888}
#prospection .sort-btn{padding:4px 10px;border-radius:20px;background:var(--glass);border:1px solid var(--glass-border);color:#aaa;font-size:.75rem;cursor:pointer;transition:all .2s}
#prospection .sort-btn.active{background:var(--primary);color:#000;border-color:var(--primary);font-weight:700}
#prospection .res-item .res-actions{display:none;gap:4px;margin-left:auto}
#prospection .res-item:hover .res-actions{display:flex}
#prospection .res-action-btn{width:26px;height:26px;border-radius:6px;background:var(--glass);border:1px solid var(--glass-border);color:var(--light);font-size:.75rem;cursor:pointer;display:flex;align-items:center;justify-content:center}
#prospection .res-action-btn:hover{background:var(--primary);color:#000}
#prospection .prospect-detail-modal .modal-content{max-width:520px}
#prospection .detail-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:10px 0}
#prospection .detail-field{background:var(--glass);border:1px solid var(--glass-border);border-radius:10px;padding:10px}
#prospection .detail-field label{font-size:.7rem;color:#888;text-transform:uppercase;display:block;margin-bottom:3px}
#prospection .detail-field span{font-size:.9rem;color:var(--light);font-weight:600}
#prospection .detail-notes{width:100%;min-height:60px;background:var(--darker);border:1px solid var(--glass-border);border-radius:10px;padding:10px;color:var(--light);font-family:inherit;font-size:.85rem;resize:vertical;outline:none}
#prospection .detail-notes:focus{border-color:var(--primary)}
#prospection .status-select{width:100%;background:var(--darker);border:1px solid var(--glass-border);color:var(--light);padding:8px 10px;border-radius:10px;font-size:.85rem;outline:none;font-family:inherit}
#prospection .status-select:focus{border-color:var(--primary)}
#prospection .last-contact{display:flex;gap:8px;align-items:center;margin-top:8px}
#prospection .last-contact input{background:var(--darker);border:1px solid var(--glass-border);color:var(--light);padding:6px 10px;border-radius:8px;font-size:.85rem;outline:none;font-family:inherit}
#prospection .history-list{max-height:120px;overflow-y:auto;margin-top:8px}
#prospection .history-item{padding:6px 10px;background:var(--glass);border-radius:8px;margin-bottom:4px;font-size:.8rem;color:#aaa}
#prospection .history-item b{color:var(--light)}

/* ─── Bouton ghost ─── */
.btn-ghost{background:transparent;border:1px solid var(--glass-border);color:var(--light);transition:all .2s}
.btn-ghost:hover{background:var(--glass)}
/* ─── Badge sol ─── */
#prospection .res-badge.sol{background:rgba(255,107,107,0.15);color:var(--secondary)}
#prospection .popup-prospect .badge.sol{background:rgba(255,107,107,0.15);color:var(--secondary)}
/* ─── Transitions modals ─── */
.modal-overlay,.quality-overlay,.call-overlay,.photo-overlay{opacity:0;visibility:hidden;transition:opacity .35s ease,visibility .35s ease}
.modal-overlay.active,.quality-overlay.active,.call-overlay.active,.photo-overlay.active{opacity:1;visibility:visible}
.modal-content,.quality-content,.call-content{transform:scale(.92) translateY(20px);transition:transform .4s cubic-bezier(.34,1.56,.64,1),opacity .35s ease;opacity:0}
.modal-overlay.active .modal-content,.quality-overlay.active .quality-content,.call-overlay.active .call-content{transform:scale(1) translateY(0);opacity:1}
/* ─── Dropdown z-index fix ─── */
.dropdown-menu{z-index:1000!important}
/* ─── Tooltip hover ─── */
.leaflet-tooltip.permanent-tooltip{background:var(--dark);border:1px solid var(--glass-border);color:var(--light);font-size:12px;font-weight:700;padding:6px 10px;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,0.5);white-space:nowrap}
.leaflet-tooltip-left.permanent-tooltip:before,.leaflet-tooltip-right.permanent-tooltip:before{border-left-color:var(--dark)}
</style>
<link rel="manifest" href="manifest.json">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="TLI">
<link rel="apple-touch-icon" href="logo-192.png">
</head>
<body>

<header class="app-header">
  <div style="display:flex;align-items:center;gap:10px;flex:1;min-width:0">
    <img src="logo-192.png" alt="TLI" style="height:36px;width:36px;border-radius:8px;object-fit:cover;box-shadow:0 2px 8px rgba(0,0,0,0.3);flex-shrink:0">
    <h1 style="margin:0"><span class="white">Technical Layer</span> <span class="blue">Innovation</span></h1>
  </div>
  <button class="sync-btn" id="btnSync"><span id="syncIcon">&#x1F504;</span><span id="syncText">Sync</span></button>
</header>

<nav class="nav-tabs">
  <div class="nav-tab active" data-section="dashboard">&#x1F4CA; Tableau</div>
  <div class="nav-tab" data-section="orders">&#x1F4E6; Commandes</div>
  <div class="nav-tab" data-section="clients">&#x1F465; Clients</div>
  <div class="nav-tab" data-section="catalog">&#x1F3A8; Catalogue</div>
  <div class="nav-tab" data-section="stock">&#x1F4CB; Stock</div>
  <div class="nav-tab" data-section="planning">&#x1F4C5; Planning</div>
  <div class="nav-tab" data-section="timer">&#x23F0; Timer</div>
  <div class="nav-tab" data-section="machines">&#x1F5A8; Machines</div>
  <div class="nav-tab" data-section="calculator">&#x1F9EE; Devis</div>
  <div class="nav-tab" data-section="photos">&#x1F4F7; Photos</div>
  <div class="nav-tab" data-section="prospection">&#x1F5FA; Prospection</div>
  <div class="nav-tab" data-section="settings">&#x2699; Config</div>
</nav>


<section id="dashboard" class="section active">
  <div class="card"><div class="card-title">&#x1F4CA; Stats</div><div id="statsDisplay">Chargement...</div></div>
  <div class="card">
    <div class="card-title">&#x1F4B0; Chiffre d'affaires</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
      <div class="ca-card"><div class="ca-amount" id="caMonth">0&#x20AC;</div><div class="ca-label">Ce mois</div></div>
      <div class="ca-card"><div class="ca-amount" id="caYear">0&#x20AC;</div><div class="ca-label">Cette annee</div></div>
    </div>
  </div>
  <div class="card">
    <div class="card-title">&#x26A1; Actions rapides</div>
    <button class="btn btn-primary" id="btnNewOrderDash">+ Nouvelle commande</button>
    <button class="btn btn-secondary" id="btnNewClientDash" style="margin-top:8px">+ Nouveau client</button>
    <button class="btn btn-secondary" id="btnTimerDash" style="margin-top:8px">&#x23F0; Lancer timer</button>
  </div>
  <div class="card" id="activeTimersCard" style="display:none">
    <div class="card-title">&#x1F525; Impressions en cours</div>
    <div id="activeTimersList"></div>
  </div>
  <div class="card"><div class="card-title">&#x1F514; Alertes stock</div><div id="stockAlerts"></div></div>
</section>

<section id="orders" class="section">
  <button class="btn btn-primary" id="btnNewOrder">+ Nouvelle commande</button>
  <div class="order-tabs" style="margin-top:12px">
    <div class="order-tab active" data-filter="all">Toutes</div>
    <div class="order-tab" data-filter="pending">A faire</div>
    <div class="order-tab" data-filter="printing">En cours</div>
    <div class="order-tab" data-filter="finished">Terminees</div>
    <div class="order-tab" data-filter="delivered">Livrees</div>
  </div>
  <div id="ordersList"></div>
</section>

<section id="clients" class="section">
  <button class="btn btn-primary" id="btnNewClient">+ Nouveau client</button>
  <input type="text" class="search-box" id="clientSearch" placeholder="&#x1F50D; Rechercher un client...">
  <div id="clientsList"></div>
</section>

<section id="catalog" class="section">
  <button class="btn btn-primary" id="btnNewModel">+ Ajouter modele</button>
  <input type="text" class="search-box" id="catalogSearch" placeholder="&#x1F50D; Rechercher un modele...">
  <div id="catalogList"></div>
</section>

<section id="stock" class="section">
  <button class="btn btn-primary" id="btnNewStock">+ Ajouter stock</button>
  <input type="text" class="search-box" id="stockSearch" placeholder="&#x1F50D; Rechercher un article...">
  <div id="stockList"></div>
</section>

<section id="planning" class="section">
  <div class="card">
    <div class="card-title">&#x1F4C5; Calendrier</div>
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
      <button class="btn btn-sm btn-secondary" id="btnPlanPrev" style="width:auto">&#x25C0;</button>
      <div id="planningMonthLabel" style="font-weight:700"></div>
      <button class="btn btn-sm btn-secondary" id="btnPlanNext" style="width:auto">&#x25B6;</button>
    </div>
    <div class="planning-calendar" id="planningCalendar"></div>
  </div>
  <div class="card">
    <div class="card-title">&#x1F4CB; Evenements</div>
    <div class="plan-filter-row">
      <div id="planSelectedDayLabel" style="font-size:.85rem;color:#888"></div>
      <button class="btn btn-sm btn-secondary" id="btnShowAllEvents" style="width:auto;margin-left:auto">Tout afficher</button>
    </div>
    <div id="planningEventsList"></div>
  </div>
  <button class="btn btn-primary" id="btnNewEvent">+ Ajouter evenement</button>
</section>

<section id="timer" class="section">
  <div class="card">
    <div class="card-title">&#x23F0; Nouveau timer</div>
    <div class="form-group"><label class="form-label">Nom</label><input type="text" class="form-input" id="timerName" placeholder="ex: Support telephone"></div>
    <div class="form-group"><label class="form-label">Machine</label><select class="form-select" id="timerMachine"></select></div>
    <div class="form-group"><label class="form-label">Duree (h)</label><input type="number" class="form-input" id="timerHours" value="4" min="0.5" step="0.5"></div>
    <div class="form-group"><label class="form-label">Duree (min)</label><input type="number" class="form-input" id="timerMinutes" value="0" min="0" max="59"></div>
    <button class="btn btn-primary" id="btnStartTimer">&#x1F680; Demarrer</button>
  </div>
  <div class="card" id="activeTimersSection" style="display:none">
    <div class="card-title">&#x1F525; En cours</div>
    <div id="timerList"></div>
  </div>
  <div class="card" id="finishedTimersSection" style="display:none">
    <div class="card-title">&#x2705; Terminees</div>
    <div id="finishedTimerList"></div>
  </div>
</section>

<section id="machines" class="section">
  <div class="card">
    <div class="card-title">&#x1F5A8; Parc machine</div>
    <button class="btn btn-primary" id="btnAddMachine" style="margin-bottom:12px">+ Ajouter machine</button>
    <div id="machinesList"></div>
  </div>
</section>

<section id="calculator" class="section">
  <div class="card">
    <div class="card-title">&#x1F9EE; Calculateur de devis</div>
    <div class="form-group"><label class="form-label">Type de service</label><select class="form-select" id="calcService"><option value="print">Impression 3D</option><option value="modeling">Modelisation 3D</option><option value="design">Conception</option></select></div>
    <div class="form-group"><label class="form-label">Technologie</label><select class="form-select" id="calcType"><option value="fdm">FDM</option><option value="resin">Resine</option></select></div>
    <div class="form-group"><label class="form-label">Poids (g)</label><input type="number" class="form-input" id="calcWeight" value="50"></div>
    <div class="form-group"><label class="form-label">Heures d'impression</label><input type="number" class="form-input" id="calcPrintHours" value="0" step="0.5"></div>
    <div class="form-group"><label class="form-label">Heures de modelisation</label><input type="number" class="form-input" id="calcModelingHours" value="0" step="0.5"></div>
    <div class="form-group"><label class="form-label">Heures de conception</label><input type="number" class="form-input" id="calcDesignHours" value="0" step="0.5"></div>
    <div class="form-group"><label class="form-label">Heures de post-production</label><input type="number" class="form-input" id="calcPostProdHours" value="0" step="0.5"></div>
    <div class="form-group"><label class="form-label">Quantite</label><input type="number" class="form-input" id="calcQty" value="1" min="1"></div>
    <div class="card" style="background:linear-gradient(135deg,var(--primary),var(--accent));margin-top:14px">
      <div style="text-align:center"><div style="font-size:.85rem;opacity:.9;color:#fff">Devis estime</div><div style="font-size:2.2rem;font-weight:800;color:#fff" id="calcTotal">0.00&#x20AC;</div></div>
    </div>
  </div>
  <div class="card">
    <div class="card-title">&#x2699; Tarifs personnalises</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
      <div class="form-group" style="margin-bottom:0"><label class="form-label">Modelisation (&#x20AC;/h)</label><input type="number" class="form-input" id="rateModeling" value="35" step="0.5"></div>
      <div class="form-group" style="margin-bottom:0"><label class="form-label">Conception (&#x20AC;/h)</label><input type="number" class="form-input" id="rateDesign" value="45" step="0.5"></div>
      <div class="form-group" style="margin-bottom:0"><label class="form-label">Impression FDM (&#x20AC;/h)</label><input type="number" class="form-input" id="rateFdm" value="2" step="0.5"></div>
      <div class="form-group" style="margin-bottom:0"><label class="form-label">Impression Resine (&#x20AC;/h)</label><input type="number" class="form-input" id="rateResin" value="3" step="0.5"></div>
      <div class="form-group" style="margin-bottom:0"><label class="form-label">Post-prod (&#x20AC;/h)</label><input type="number" class="form-input" id="ratePostProd" value="15" step="0.5"></div>
      <div class="form-group" style="margin-bottom:0"><label class="form-label">Filament (&#x20AC;/kg)</label><input type="number" class="form-input" id="priceFilament" value="25" step="0.5"></div>
      <div class="form-group" style="margin-bottom:0"><label class="form-label">Resine (&#x20AC;/kg)</label><input type="number" class="form-input" id="priceResinKg" value="60" step="0.5"></div>
    </div>
    <button class="btn btn-secondary" id="btnSaveRates" style="margin-top:12px">&#x1F4BE; Sauvegarder les tarifs</button>
  </div>
</section>

<section id="photos" class="section">
  <div class="card">
    <div class="card-title">&#x1F4F7; Galerie photos</div>
    <button type="button" class="btn btn-primary" style="display:block;text-align:center;margin-bottom:12px;width:100%" onclick="TLI.Photos.prepareForGallery()">&#x1F4F7; Prendre une photo</button>
    <div id="photosGallery"></div>
  </div>
</section>

<section id="settings" class="section">
  <div class="card">
    <div class="card-title">&#x1F517; Synchronisation</div>
    <div class="form-group"><label class="form-label">URL API Apps Script</label><input type="text" class="form-input" id="apiUrl" placeholder="https://script.google.com/macros/s/.../exec"></div>
    <button class="btn btn-primary" id="btnSaveConfig">&#x1F4BE; Sauvegarder</button>
    <button class="btn btn-secondary" id="btnTestConn" style="margin-top:8px">&#x1F9EA; Tester</button>
  </div>
  <div class="card">
    <div class="card-title">&#x1F514; Notifications</div>
    <div class="checklist-item"><input type="checkbox" id="notifSound" checked><label for="notifSound">Son timer termine</label></div>
    <div class="checklist-item"><input type="checkbox" id="notifVibrate" checked><label for="notifVibrate">Vibration</label></div>
  </div>
  <div class="card">
    <div class="card-title">&#x1F4E4; Export / Import</div>
    <button class="btn btn-secondary" id="btnExport">&#x1F4E4; Exporter JSON</button>
    <button class="btn btn-secondary" id="btnImportTrigger" style="margin-top:8px">&#x1F4E5; Importer JSON</button>
    <input type="file" id="importFile" style="display:none" accept=".json">
  </div>
  <div class="card">
    <div class="card-title">&#x1F464; Compte</div>
    <div id="authInfo" style="font-size:.85rem;color:#888;margin-bottom:10px">Non connecte</div>
    <button class="btn btn-secondary" id="btnLogout">&#x1F6AA; Se deconnecter</button>
  </div>
  <div class="card">
    <div class="card-title">&#x1F4F1; Installation</div>
    <button class="btn btn-primary" id="btnInstallPWA" style="display:none">&#x1F4F2; Installer l'application</button>
    <p id="pwaInstallHint" style="font-size:.75rem;color:#888;margin-top:8px">Ajoutez cette page a votre ecran d'accueil :<br>&#x2022; <b>Chrome Android</b> : Menu &#x22EE; &#x2192; "Ajouter a l'ecran d'accueil"<br>&#x2022; <b>Safari iOS</b> : Partager &#x2192; "Sur l'ecran d'accueil"<br>&#x2022; <b>Chrome Desktop</b> : Menu &#x22EE; &#x2192; "Installer l'application"</p>
  </div>
  <div class="card">
    <div class="card-title">&#x26A0; Danger Zone</div>
    <button class="btn btn-danger" id="btnClearAll">&#x1F5D1; Tout effacer</button>
  </div>
</section>

<section id="prospection" class="section">
  <div class="prospect-wrap">
    <div class="sidebar" id="prospectSidebar">
      <!-- Stats rapides -->
      <div class="stats-row" style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;padding:10px 14px;border-bottom:1px solid var(--glass-border);background:var(--darker)">
        <div class="stat-card" style="text-align:center;padding:8px 4px;border-radius:10px;background:var(--glass-bg);border:1px solid var(--glass-border)">
          <div style="font-size:1.1rem;font-weight:700;color:var(--primary)" id="statA">0</div>
          <div style="font-size:.65rem;color:var(--text-muted);text-transform:uppercase">Prioritaires</div>
        </div>
        <div class="stat-card" style="text-align:center;padding:8px 4px;border-radius:10px;background:var(--glass-bg);border:1px solid var(--glass-border)">
          <div style="font-size:1.1rem;font-weight:700;color:var(--accent)" id="statB">0</div>
          <div style="font-size:.65rem;color:var(--text-muted);text-transform:uppercase">Secondaires</div>
        </div>
        <div class="stat-card" style="text-align:center;padding:8px 4px;border-radius:10px;background:var(--glass-bg);border:1px solid var(--glass-border)">
          <div style="font-size:1.1rem;font-weight:700;color:var(--text-muted)" id="statC">0</div>
          <div style="font-size:.65rem;color:var(--text-muted);text-transform:uppercase">Faible pot.</div>
        </div>
        <div class="stat-card" style="text-align:center;padding:8px 4px;border-radius:10px;background:var(--glass-bg);border:1px solid var(--glass-border)">
          <div style="font-size:1.1rem;font-weight:700;color:#ef4444" id="statSol">0</div>
          <div style="font-size:.65rem;color:var(--text-muted);text-transform:uppercase">A solliciter</div>
        </div>
      </div>

      <div class="sb-top">
        <input type="text" class="search-box" id="prospectSearch" placeholder="&#x1F50D; Rechercher une entreprise, un secteur, un NAF..." oninput="TLI.Prospection.applyFilters()">
      </div>

      <!-- Accordeon: Actions -->
      <div class="accordion" data-accordion="actions">
        <div class="accordion-header" onclick="TLI.UI.toggleAccordion('actions')">
          <span>&#x26A1; Actions</span><span class="accordion-arrow">&#x25B6;</span>
        </div>
        <div class="accordion-body" id="acc-actions">
          <div class="prospect-toolbar" style="padding:8px 0">
            <button class="btn btn-primary btn-sm" style="flex:1" onclick="TLI.Prospection.exportCSV()">&#x1F4E4; Export CSV</button>
            <button class="btn btn-primary btn-sm" style="flex:1" onclick="TLI.Prospection.importCSV()">&#x1F4E5; Import CSV</button>
            <button class="btn btn-ghost btn-sm" style="flex:1" onclick="TLI.Prospection.resetFilters()">&#x1F504; Reinit.</button>
            <button class="btn btn-ghost btn-sm" style="flex:1" onclick="TLI.Prospection.showAddModal()">&#x2795; Prospect</button>
            <button class="btn btn-ghost btn-sm" id="btnAnnotation" style="flex:1" onclick="TLI.Prospection.toggleAnnotation()">&#x1F4DD; Annotation</button>
          </div>
        </div>
      </div>

      <!-- Accordeon: Trier par -->
      <div class="accordion" data-accordion="sort">
        <div class="accordion-header" onclick="TLI.UI.toggleAccordion('sort')">
          <span>&#x1F4CA; Trier par</span><span class="accordion-arrow">&#x25B6;</span>
        </div>
        <div class="accordion-body" id="acc-sort">
          <div class="sort-bar" style="padding:8px 0">
            <button class="sort-btn active" id="sort-dist" onclick="TLI.Prospection.setSort('dist')">&#x1F4CF; Distance</button>
            <button class="sort-btn" id="sort-eff" onclick="TLI.Prospection.setSort('eff')">&#x1F465; Effectif</button>
            <button class="sort-btn" id="sort-note" onclick="TLI.Prospection.setSort('note')">&#x2B50; Notation</button>
            <button class="sort-btn" id="sort-name" onclick="TLI.Prospection.setSort('name')">&#x1F524; Nom</button>
          </div>
        </div>
      </div>

      <!-- Accordeon: Filtres -->
      <div class="accordion" data-accordion="filters">
        <div class="accordion-header" onclick="TLI.UI.toggleAccordion('filters')">
          <span>&#x1F50E; Filtres</span><span class="accordion-arrow">&#x25B6;</span>
        </div>
        <div class="accordion-body" id="acc-filters">
          <div class="sb-filters" style="padding:8px 0">
            <div class="filter-group">
              <span class="filter-label">Secteur</span>
              <select id="prospectSecteur" onchange="TLI.Prospection.applyFilters()"><option value="">Tous les secteurs</option></select>
            </div>
            <div class="filter-group">
              <span class="filter-label">Notation</span>
              <select id="prospectNotation" onchange="TLI.Prospection.applyFilters()">
                <option value="">Toutes</option>
                <option value="A">A &#x2014; Prioritaire</option>
                <option value="B">B &#x2014; Secondaire</option>
                <option value="C">C &#x2014; Faible potentiel</option>
              </select>
            </div>
            <div class="filter-group">
              <div class="filter-row">
                <span class="filter-label" style="margin:0;flex:1">Distance max</span>
                <span class="range-val" id="prospectValDist">200 km</span>
              </div>
              <input type="range" id="prospectDist" min="0" max="200" value="200" oninput="document.getElementById('prospectValDist').textContent=this.value+' km'; TLI.Prospection.applyFilters()">
            </div>
            <div class="filter-group">
              <div class="filter-row">
                <span class="filter-label" style="margin:0;flex:1">Effectif min</span>
                <span class="range-val" id="prospectValEff">0</span>
              </div>
              <input type="range" id="prospectEff" min="0" max="100" value="0" oninput="document.getElementById('prospectValEff').textContent=this.value; TLI.Prospection.applyFilters()">
            </div>
            <div class="filter-group">
              <span class="filter-label">Categorie</span>
              <div class="checkboxes">
                <label><input type="checkbox" id="prospectCatPme" checked onchange="TLI.Prospection.applyFilters()"> PME</label>
                <label><input type="checkbox" id="prospectCatEti" checked onchange="TLI.Prospection.applyFilters()"> ETI</label>
                <label><input type="checkbox" id="prospectCatGe" checked onchange="TLI.Prospection.applyFilters()"> GE</label>
              </div>
            </div>
            <div class="filter-group">
              <label style="font-size:.82rem;color:#aaa;display:flex;align-items:center;gap:6px;cursor:pointer">
                <input type="checkbox" id="prospectOnlyNotes" onchange="TLI.Prospection.applyFilters()"> Uniquement avec notes
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- Accordeon: Point de depart -->
      <div class="accordion open" data-accordion="origin">
        <div class="accordion-header" onclick="TLI.UI.toggleAccordion('origin')">
          <span>&#x1F4CD; Point de depart</span><span class="accordion-arrow">&#x25BC;</span>
        </div>
        <div class="accordion-body" id="acc-origin">
          <input type="text" class="search-box" id="prospectOrigin" placeholder="Votre adresse..." style="margin-bottom:6px;font-size:.82rem">
          <div style="display:flex;gap:6px;margin-bottom:6px">
            <button class="btn btn-sm btn-secondary" id="btnUseMyPos" style="flex:1;font-size:11px;padding:6px 8px">&#x1F4E1; Ma position</button>
            <button class="btn btn-sm btn-primary" id="btnSetOrigin" style="flex:1;font-size:11px;padding:6px 8px">&#x2705; Appliquer</button>
            <button class="btn btn-sm btn-danger" id="btnResetOrigin" style="flex:1;font-size:11px;padding:6px 8px" onclick="TLI.Prospection.resetOrigin()">&#x1F504; Reinit.</button>
          </div>
          <div id="originStatus" style="font-size:11px;color:var(--text-muted);min-height:16px"></div>
        </div>
      </div>
      <div class="res-count" id="prospectCount">0 resultats</div>
      <div class="sb-results" id="prospectResults"></div>
    </div>
    <div class="map-wrap">
      <div id="prospectMap"></div>
      <button class="toggle-sb" id="prospectToggleSb" onclick="TLI.Prospection.toggleSidebar()">&#x2630;</button>
    </div>
  </div>
</section>

<!-- ==================== MODALS ==================== -->

<!-- newOrderModal -->
<div class="modal-overlay" id="newOrderModal">
  <div class="modal-content">
    <div class="modal-header"><div class="modal-title">Nouvelle commande</div><button class="modal-close" data-close="newOrderModal">&times;</button></div>
    <div class="form-group"><label class="form-label">Client</label><select class="form-select" id="orderClient"></select></div>
    <div class="form-group"><label class="form-label">Nom du projet</label><input type="text" class="form-input" id="orderName" placeholder="ex: Support telephone"></div>
    <div class="form-group"><label class="form-label">Type</label><select class="form-select" id="orderService"><option value="print">Impression 3D</option><option value="modeling">Modelisation 3D</option><option value="design">Conception</option></select></div>
    <div class="form-group" id="printTypeGroup"><label class="form-label">Technologie</label><select class="form-select" id="orderType"><option value="fdm">FDM</option><option value="resin">Resine</option></select></div>
    <div class="form-group" id="machineGroup"><label class="form-label">Machine</label><select class="form-select" id="orderMachine"></select></div>
    <div class="form-group"><label class="form-label">Materiau</label><input type="text" class="form-input" id="orderMaterial" placeholder="ex: PLA, Resine..."></div>
    <div class="form-group"><label class="form-label">Poids (g)</label><input type="number" class="form-input" id="orderWeight" placeholder="50"></div>
    <div class="form-group"><label class="form-label">Temps (h)</label><input type="number" class="form-input" id="orderTime" placeholder="4"></div>
    <div class="form-group"><label class="form-label">Prix (&euro;)</label><input type="number" class="form-input" id="orderPrice" placeholder="15.00" step="0.01"></div>
    <div class="form-group"><label class="form-label">Priorite</label><select class="form-select" id="orderPriority"><option value="low">Basse</option><option value="medium" selected>Moyenne</option><option value="high">Haute</option></select></div>
    <div class="form-group"><label class="form-label">Notes</label><textarea class="form-textarea" id="orderNotes" placeholder="Details..."></textarea></div>
    <button class="btn btn-primary" id="btnSaveOrder">Creer</button>
  </div>
</div>

<!-- orderDetailModal -->
<div class="modal-overlay" id="orderDetailModal">
  <div class="modal-content">
    <div class="modal-header"><div class="modal-title" id="detailTitle">Detail</div><button class="modal-close" data-close="orderDetailModal">&times;</button></div>
    <div id="orderDetailContent"></div>
    <div class="form-group" style="margin-top:14px">
      <label class="form-label">Statut</label>
      <select class="form-select" id="detailStatus">
        <option value="pending">A faire</option>
        <option value="printing">En cours</option>
        <option value="finished">Terminee</option>
        <option value="delivered">Livree / Payee</option>
      </select>
    </div>
    <div class="form-group">
      <label class="form-label">Photos</label>
      <div class="photo-grid" id="detailPhotos"></div>
      <button type="button" class="btn btn-secondary" style="display:block;text-align:center;margin-top:8px;width:100%" onclick="TLI.Photos.prepareForOrder(TLI.Data.currentOrderId)">&#x1F4F7; Ajouter une photo</button>
    </div>
    <button class="btn btn-danger" id="btnDeleteOrder">&#x1F5D1; Supprimer</button>
  </div>
</div>

<!-- newClientModal -->
<div class="modal-overlay" id="newClientModal">
  <div class="modal-content">
    <div class="modal-header"><div class="modal-title">Nouveau client</div><button class="modal-close" data-close="newClientModal">&times;</button></div>
    <div class="form-group"><label class="form-label">Nom</label><input type="text" class="form-input" id="clientName" placeholder="Nom"></div>
    <div class="form-group"><label class="form-label">Entreprise</label><input type="text" class="form-input" id="clientCompany" placeholder="Nom de l'entreprise"></div>
    <div class="form-group"><label class="form-label">Fonction</label><input type="text" class="form-input" id="clientRole" placeholder="ex: Directeur, Responsable..."></div>
    <div class="form-group"><label class="form-label">Telephone</label><input type="tel" class="form-input" id="clientPhone" placeholder="06 12 34 56 78"></div>
    <div class="form-group"><label class="form-label">Email</label><input type="email" class="form-input" id="clientEmail" placeholder="email@exemple.com"></div>
    <div class="form-group"><label class="form-label">Adresse</label><textarea class="form-textarea" id="clientAddress" placeholder="Adresse..."></textarea></div>
    <div class="form-group"><label class="form-label">Notes</label><textarea class="form-textarea" id="clientNotes" placeholder="Infos..."></textarea></div>
    <button class="btn btn-primary" id="btnSaveClient">Ajouter</button>
  </div>
</div>

<!-- editClientModal -->
<div class="modal-overlay" id="editClientModal">
  <div class="modal-content">
    <div class="modal-header"><div class="modal-title">Modifier client</div><button class="modal-close" data-close="editClientModal">&times;</button></div>
    <div class="form-group"><label class="form-label">Nom</label><input type="text" class="form-input" id="editClientName"></div>
    <div class="form-group"><label class="form-label">Entreprise</label><input type="text" class="form-input" id="editClientCompany"></div>
    <div class="form-group"><label class="form-label">Fonction</label><input type="text" class="form-input" id="editClientRole"></div>
    <div class="form-group"><label class="form-label">Telephone</label><input type="tel" class="form-input" id="editClientPhone"></div>
    <div class="form-group"><label class="form-label">Email</label><input type="email" class="form-input" id="editClientEmail"></div>
    <div class="form-group"><label class="form-label">Adresse</label><textarea class="form-textarea" id="editClientAddress"></textarea></div>
    <div class="form-group"><label class="form-label">Notes</label><textarea class="form-textarea" id="editClientNotes"></textarea></div>
    <button class="btn btn-primary" id="btnUpdateClient">&#x1F4BE; Enregistrer</button>
  </div>
</div>

<!-- clientDetailModal -->
<div class="modal-overlay" id="clientDetailModal">
  <div class="modal-content">
    <div class="modal-header"><div class="modal-title" id="clientDetailTitle">Client</div><button class="modal-close" data-close="clientDetailModal">&times;</button></div>
    <div id="clientDetailContent"></div>
    <div class="btn-row">
      <button class="btn btn-primary" id="btnCallClient" style="flex:1">&#x1F4DE; Appeler</button>
      <button class="btn btn-secondary" id="btnEditClient" style="flex:1">&#x270F; Modifier</button>
    </div>
    <button class="btn btn-danger" id="btnDeleteClient" style="margin-top:8px">&#x1F5D1; Supprimer</button>
  </div>
</div>

<!-- newModelModal -->
<div class="modal-overlay" id="newModelModal">
  <div class="modal-content">
    <div class="modal-header"><div class="modal-title">Nouveau modele</div><button class="modal-close" data-close="newModelModal">&times;</button></div>
    <div class="form-group"><label class="form-label">Nom</label><input type="text" class="form-input" id="modelName" placeholder="ex: Porte-cles"></div>
    <div class="form-group"><label class="form-label">Categorie</label><select class="form-select" id="modelCategory"><option value="prototype">Prototype</option><option value="decoration">Decoration</option><option value="functional">Fonctionnel</option><option value="jewelry">Bijouterie</option><option value="other">Autre</option></select></div>
    <div class="form-group"><label class="form-label">Type</label><select class="form-select" id="modelType"><option value="fdm">FDM</option><option value="resin">Resine</option><option value="both">Les deux</option></select></div>
    <div class="form-group"><label class="form-label">Temps moyen (h)</label><input type="number" class="form-input" id="modelTime" placeholder="3"></div>
    <div class="form-group"><label class="form-label">Poids moyen (g)</label><input type="number" class="form-input" id="modelWeight" placeholder="30"></div>
    <div class="form-group"><label class="form-label">Prix base (&euro;)</label><input type="number" class="form-input" id="modelPrice" placeholder="10.00" step="0.01"></div>
    <div class="form-group"><label class="form-label">Description</label><textarea class="form-textarea" id="modelDesc" placeholder="Description..."></textarea></div>
    <button class="btn btn-primary" id="btnSaveModel">Ajouter</button>
  </div>
</div>

<!-- editModelModal -->
<div class="modal-overlay" id="editModelModal">
  <div class="modal-content">
    <div class="modal-header"><div class="modal-title">Modifier modele</div><button class="modal-close" data-close="editModelModal">&times;</button></div>
    <div class="form-group"><label class="form-label">Nom</label><input type="text" class="form-input" id="editModelName"></div>
    <div class="form-group"><label class="form-label">Categorie</label><select class="form-select" id="editModelCategory"><option value="prototype">Prototype</option><option value="decoration">Decoration</option><option value="functional">Fonctionnel</option><option value="jewelry">Bijouterie</option><option value="other">Autre</option></select></div>
    <div class="form-group"><label class="form-label">Type</label><select class="form-select" id="editModelType"><option value="fdm">FDM</option><option value="resin">Resine</option><option value="both">Les deux</option></select></div>
    <div class="form-group"><label class="form-label">Temps moyen (h)</label><input type="number" class="form-input" id="editModelTime"></div>
    <div class="form-group"><label class="form-label">Poids moyen (g)</label><input type="number" class="form-input" id="editModelWeight"></div>
    <div class="form-group"><label class="form-label">Prix base (&euro;)</label><input type="number" class="form-input" id="editModelPrice" step="0.01"></div>
    <div class="form-group"><label class="form-label">Description</label><textarea class="form-textarea" id="editModelDesc"></textarea></div>
    <div class="btn-row">
      <button class="btn btn-primary" id="btnUpdateModel" style="flex:1">&#x1F4BE; Enregistrer</button>
      <button class="btn btn-danger" id="btnDeleteModel" style="flex:1">&#x1F5D1; Supprimer</button>
    </div>
  </div>
</div>

<!-- newStockModal -->
<div class="modal-overlay" id="newStockModal">
  <div class="modal-content">
    <div class="modal-header"><div class="modal-title">Ajouter stock</div><button class="modal-close" data-close="newStockModal">&times;</button></div>
    <div class="form-group"><label class="form-label">Type</label><select class="form-select" id="stockType"><option value="filament">Filament</option><option value="resin">Resine</option><option value="part">Piece detachee</option><option value="tool">Outil</option><option value="other">Autre</option></select></div>
    <div class="form-group"><label class="form-label">Nom</label><input type="text" class="form-input" id="stockName" placeholder="ex: PLA Blanc 1.75mm"></div>
    <div class="form-group"><label class="form-label">Quantite</label><input type="number" class="form-input" id="stockQty" placeholder="1"></div>
    <div class="form-group"><label class="form-label">Unite</label><select class="form-select" id="stockUnit"><option value="kg">kg</option><option value="g">g</option><option value="L">L</option><option value="ml">ml</option><option value="pcs">pieces</option><option value="m">metres</option></select></div>
    <div class="form-group"><label class="form-label">Seuil alerte</label><input type="number" class="form-input" id="stockAlert" value="1"></div>
    <div class="form-group"><label class="form-label">Fournisseur</label><input type="text" class="form-input" id="stockSupplier" placeholder="Amazon, 3DJake..."></div>
    <button class="btn btn-primary" id="btnSaveStock">Ajouter</button>
  </div>
</div>

<!-- editStockModal -->
<div class="modal-overlay" id="editStockModal">
  <div class="modal-content">
    <div class="modal-header"><div class="modal-title">Modifier stock</div><button class="modal-close" data-close="editStockModal">&times;</button></div>
    <div class="form-group"><label class="form-label">Type</label><select class="form-select" id="editStockType"><option value="filament">Filament</option><option value="resin">Resine</option><option value="part">Piece detachee</option><option value="tool">Outil</option><option value="other">Autre</option></select></div>
    <div class="form-group"><label class="form-label">Nom</label><input type="text" class="form-input" id="editStockName"></div>
    <div class="form-group"><label class="form-label">Quantite</label><input type="number" class="form-input" id="editStockQty"></div>
    <div class="form-group"><label class="form-label">Unite</label><select class="form-select" id="editStockUnit"><option value="kg">kg</option><option value="g">g</option><option value="L">L</option><option value="ml">ml</option><option value="pcs">pieces</option><option value="m">metres</option></select></div>
    <div class="form-group"><label class="form-label">Seuil alerte</label><input type="number" class="form-input" id="editStockAlert"></div>
    <div class="form-group"><label class="form-label">Fournisseur</label><input type="text" class="form-input" id="editStockSupplier"></div>
    <div class="btn-row">
      <button class="btn btn-primary" id="btnUpdateStock" style="flex:1">&#x1F4BE; Enregistrer</button>
      <button class="btn btn-danger" id="btnDeleteStock" style="flex:1">&#x1F5D1; Supprimer</button>
    </div>
  </div>
</div>

<!-- planningModal -->
<div class="modal-overlay" id="planningModal">
  <div class="modal-content">
    <div class="modal-header"><div class="modal-title">&#x1F4C5; Ajouter evenement</div><button class="modal-close" data-close="planningModal">&times;</button></div>
    <div class="form-group"><label class="form-label">Titre</label><input type="text" class="form-input" id="planTitle" placeholder="ex: Impression support Jean"></div>
    <div class="form-group"><label class="form-label">Type</label><select class="form-select" id="planType"><option value="printing">Impression 3D</option><option value="modeling">Modelisation 3D</option><option value="design">Conception</option><option value="maintenance">Maintenance</option><option value="rdv">RDV client</option><option value="logistics">Logistique</option><option value="other">Divers</option></select></div>
    <div class="form-group"><label class="form-label">Date</label><input type="date" class="form-input" id="planDate"></div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
      <div class="form-group"><label class="form-label">Debut</label><input type="time" class="form-input" id="planStartTime" value="09:00"></div>
      <div class="form-group"><label class="form-label">Fin</label><input type="time" class="form-input" id="planEndTime" value="12:00"></div>
    </div>
    <div class="form-group"><label class="form-label">Assigne a</label><select class="form-select" id="planAssignee"><option value="florian">Florian</option><option value="elie">Elie</option><option value="both">Les deux</option></select></div>
    <div class="form-group"><label class="form-label">Priorite</label><select class="form-select" id="planPriority"><option value="low">Basse</option><option value="medium" selected>Moyenne</option><option value="high">Haute</option></select></div>
    <div class="form-group"><label class="form-label">Notes</label><textarea class="form-textarea" id="planNotes" placeholder="Details..."></textarea></div>
    <div class="checklist-item" style="margin-bottom:14px"><input type="checkbox" id="planReminder"><label for="planReminder">&#x1F514; Me rappeler</label></div>
    <div class="form-group" id="planReminderMinutesGroup" style="display:none"><label class="form-label">Minutes avant l'evenement</label><input type="number" class="form-input" id="planReminderMinutes" value="30" min="5" step="5"></div>
    <button class="btn btn-primary" id="btnSaveEvent">Ajouter</button>
  </div>
</div>

<!-- editPlanningModal -->
<div class="modal-overlay" id="editPlanningModal">
  <div class="modal-content">
    <div class="modal-header"><div class="modal-title">&#x1F4C5; Modifier evenement</div><button class="modal-close" data-close="editPlanningModal">&times;</button></div>
    <div class="form-group"><label class="form-label">Titre</label><input type="text" class="form-input" id="editPlanTitle"></div>
    <div class="form-group"><label class="form-label">Type</label><select class="form-select" id="editPlanType"><option value="printing">Impression 3D</option><option value="modeling">Modelisation 3D</option><option value="design">Conception</option><option value="maintenance">Maintenance</option><option value="rdv">RDV client</option><option value="logistics">Logistique</option><option value="other">Divers</option></select></div>
    <div class="form-group"><label class="form-label">Date</label><input type="date" class="form-input" id="editPlanDate"></div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
      <div class="form-group"><label class="form-label">Debut</label><input type="time" class="form-input" id="editPlanStartTime"></div>
      <div class="form-group"><label class="form-label">Fin</label><input type="time" class="form-input" id="editPlanEndTime"></div>
    </div>
    <div class="form-group"><label class="form-label">Assigne a</label><select class="form-select" id="editPlanAssignee"><option value="florian">Florian</option><option value="elie">Elie</option><option value="both">Les deux</option></select></div>
    <div class="form-group"><label class="form-label">Priorite</label><select class="form-select" id="editPlanPriority"><option value="low">Basse</option><option value="medium">Moyenne</option><option value="high">Haute</option></select></div>
    <div class="form-group"><label class="form-label">Notes</label><textarea class="form-textarea" id="editPlanNotes"></textarea></div>
    <div class="checklist-item" style="margin-bottom:14px"><input type="checkbox" id="editPlanReminder"><label for="editPlanReminder">&#x1F514; Me rappeler</label></div>
    <div class="form-group" id="editPlanReminderMinutesGroup" style="display:none"><label class="form-label">Minutes avant l'evenement</label><input type="number" class="form-input" id="editPlanReminderMinutes" value="30" min="5" step="5"></div>
    <div class="btn-row">
      <button class="btn btn-primary" id="btnUpdateEvent" style="flex:1">&#x1F4BE; Enregistrer</button>
      <button class="btn btn-danger" id="btnDeleteEvent" style="flex:1">&#x1F5D1; Supprimer</button>
    </div>
  </div>
</div>

<!-- machineDetailModal -->
<div class="modal-overlay" id="machineDetailModal">
  <div class="modal-content">
    <div class="modal-header"><div class="modal-title" id="machineDetailTitle">Machine</div><button class="modal-close" data-close="machineDetailModal">&times;</button></div>
    <div id="machineDetailContent"></div>
    <div class="card" style="margin-top:14px">
      <div class="card-title">&#x1F527; Ajouter entretien</div>
      <div class="form-group"><label class="form-label">Type d'entretien</label><select class="form-select" id="maintType"><option value="cleaning">Nettoyage / Graissage</option><option value="nozzle">Changement de buse</option><option value="belt">Tension courroies</option><option value="bed">Nivellement plateau</option><option value="firmware">Mise a jour firmware</option><option value="filter">Filtre / Ventilation</option><option value="other">Autre</option></select></div>
      <div class="form-group"><label class="form-label">Date</label><input type="date" class="form-input" id="maintDate"></div>
      <div class="form-group"><label class="form-label">Heures machine au moment de l'entretien</label><input type="number" class="form-input" id="maintHours" placeholder="ex: 150"></div>
      <div class="form-group"><label class="form-label">Notes</label><textarea class="form-textarea" id="maintNotes" placeholder="Details..."></textarea></div>
      <button class="btn btn-primary" id="btnSaveMaint">Ajouter</button>
    </div>
    <div class="card" style="margin-top:14px">
      <div class="card-title">&#x1F4CB; Historique entretien</div>
      <div id="machineMaintList"></div>
    </div>
  </div>
</div>

<!-- addMachineModal -->
<div class="modal-overlay" id="addMachineModal">
  <div class="modal-content">
    <div class="modal-header"><div class="modal-title">&#x1F5A8; Ajouter machine</div><button class="modal-close" data-close="addMachineModal">&times;</button></div>
    <div class="form-group"><label class="form-label">Nom</label><input type="text" class="form-input" id="newMachineName" placeholder="ex: Bambulab X1C"></div>
    <div class="form-group"><label class="form-label">Type</label><select class="form-select" id="newMachineType"><option value="fdm">FDM</option><option value="resin">Resine</option></select></div>
    <button class="btn btn-primary" id="btnSaveNewMachine">Ajouter</button>
  </div>
</div>

<!-- editMachineInfoModal -->
<div class="modal-overlay" id="editMachineInfoModal">
  <div class="modal-content">
    <div class="modal-header"><div class="modal-title">Modifier machine</div><button class="modal-close" data-close="editMachineInfoModal">&times;</button></div>
    <div class="form-group"><label class="form-label">Nom</label><input type="text" class="form-input" id="editMachineInfoName"></div>
    <div class="form-group"><label class="form-label">Type</label><select class="form-select" id="editMachineInfoType"><option value="fdm">FDM</option><option value="resin">Resine</option></select></div>
    <div class="btn-row">
      <button class="btn btn-primary" id="btnUpdateMachineInfo" style="flex:1">&#x1F4BE; Enregistrer</button>
      <button class="btn btn-danger" id="btnDeleteMachineInfo" style="flex:1">&#x1F5D1; Supprimer</button>
    </div>
  </div>
</div>

<!-- rdvClientModal -->
<div class="modal-overlay" id="rdvClientModal">
  <div class="modal-content">
    <div class="modal-header"><div class="modal-title">&#x1F4C5; Lier un client au RDV</div><button class="modal-close" data-close="rdvClientModal">&times;</button></div>
    <p style="color:#888;font-size:.85rem;margin-bottom:14px;text-align:center">Souhaites-tu lier ce rendez-vous a un client ?</p>
    <button class="btn btn-primary" id="btnRdvExisting">&#x1F465; Client existant</button>
    <button class="btn btn-secondary" id="btnRdvNew" style="margin-top:8px">&#x2795; Nouveau client</button>
    <button class="btn btn-secondary" id="btnRdvSkip" style="margin-top:8px">&#x23ED; Passer</button>
    <div id="rdvClientList" style="display:none;margin-top:12px;max-height:220px;overflow-y:auto"></div>
  </div>
</div>

<!-- qualityOverlay -->
<div class="quality-overlay" id="qualityOverlay">
  <div class="quality-content">
    <div class="quality-header"><h3>&#x2705; Validation qualite</h3><p id="qualityOrderName">Commande terminee</p></div>
    <div id="qualityChecklist"></div>
    <div class="progress-bar" style="margin:14px 0"><div class="progress-fill" id="qualityProgress" style="width:0%"></div></div>
    <div style="text-align:center;font-size:.8rem;color:#888;margin-bottom:14px" id="qualityPercent">0% complete</div>
    <div class="form-group" style="margin:14px 0">
      <label class="form-label">&#x1F4F7; Photo de la piece finie</label>
      <div class="photo-grid" id="qualityPhotoPreview" style="display:none;margin-bottom:8px"></div>
      <button type="button" class="btn btn-secondary" style="display:block;text-align:center;margin-top:0;width:100%" onclick="TLI.Photos.prepareForQuality(TLI.Data.qualityOrderId)">&#x1F4F7; Prendre une photo</button>
    </div>
    <button class="btn btn-primary" id="qualityValidateBtn" disabled>Valider la cloture</button>
    <button class="btn btn-secondary" id="btnSkipQuality" style="margin-top:8px">Passer</button>
  </div>
</div>

<!-- callOverlay -->
<div class="call-overlay" id="callOverlay">
  <div class="call-content">
    <h3>&#x1F4DE; Confirmer l'appel</h3>
    <p id="callClientName">Client</p>
    <div class="call-number" id="callNumber">06 12 34 56 78</div>
    <div class="btn-row">
      <button class="btn btn-danger" id="btnCancelCall" style="flex:1">&#x274C; Annuler</button>
      <button class="btn btn-success" id="btnConfirmCall" style="flex:1">&#x2705; Appeler</button>
    </div>
  </div>
</div>

<!-- photoOverlay -->
<div class="photo-overlay" id="photoOverlay">
  <button class="photo-overlay-close" id="btnClosePhoto">&times;</button>
  <img id="photoOverlayImg" src="" alt="Photo">
</div>

<!-- galleryPhotoOverlay -->
<div class="photo-overlay" id="galleryPhotoOverlay">
  <button class="photo-overlay-close" id="btnCloseGalleryPhoto">&times;</button>
  <img id="galleryPhotoOverlayImg" src="" alt="Photo">
  <div id="galleryPhotoInfo" style="position:absolute;bottom:20px;left:50%;transform:translateX(-50%);background:rgba(0,0,0,0.8);padding:10px 20px;border-radius:12px;text-align:center;max-width:90%"></div>
</div>

<!-- MODAL: DETAIL PROSPECT -->
<div class="modal-overlay prospect-detail-modal" id="prospectDetailModal">
  <div class="modal-content" style="max-width:520px">
    <div class="modal-header">
      <div class="modal-title" id="prospectDetailTitle">Detail prospect</div>
      <button class="modal-close" data-close="prospectDetailModal">&times;</button>
    </div>
    <div id="prospectDetailContent"></div>
    <!-- Champs d'edition pour TOUS les champs du prospect -->
    <div class="detail-grid" style="margin-top:12px">
      <div class="form-group" style="margin-bottom:10px">
        <label class="form-label">Nom entreprise</label>
        <input type="text" class="form-input" id="prospectDetailName" placeholder="Nom de l'entreprise">
      </div>
      <div class="form-group" style="margin-bottom:10px">
        <label class="form-label">SIRET</label>
        <input type="text" class="form-input" id="prospectDetailSiret" placeholder="Numero SIRET">
      </div>
      <div class="form-group" style="margin-bottom:10px">
        <label class="form-label">Secteur</label>
        <input type="text" class="form-input" id="prospectDetailSecteur" placeholder="ex: Machines et equipements">
      </div>
      <div class="form-group" style="margin-bottom:10px">
        <label class="form-label">Effectif</label>
        <input type="number" class="form-input" id="prospectDetailEff" min="1">
      </div>
      <div class="form-group" style="margin-bottom:10px">
        <label class="form-label">Categorie</label>
        <select class="form-select" id="prospectDetailCat">
          <option value="PME">PME</option>
          <option value="ETI">ETI</option>
          <option value="GE">GE</option>
        </select>
      </div>
      <div class="form-group" style="margin-bottom:10px">
        <label class="form-label">Notation</label>
        <select class="form-select" id="prospectDetailNotation">
          <option value="A">A &#x2014; Prioritaire</option>
          <option value="B">B &#x2014; Secondaire</option>
          <option value="C">C &#x2014; Faible potentiel</option>
        </select>
      </div>
      <div class="form-group" style="grid-column:1/3;margin-bottom:10px">
        <label class="form-label">Adresse</label>
        <input type="text" class="form-input" id="prospectDetailAdresse" placeholder="Adresse complete">
      </div>
      <div class="form-group" style="margin-bottom:10px">
        <label class="form-label">Code postal</label>
        <input type="text" class="form-input" id="prospectDetailCp" placeholder="CP">
      </div>
      <div class="form-group" style="margin-bottom:10px">
        <label class="form-label">Ville</label>
        <input type="text" class="form-input" id="prospectDetailVille" placeholder="Ville">
      </div>
      <div class="form-group" style="margin-bottom:10px">
        <label class="form-label">Latitude</label>
        <input type="number" class="form-input" id="prospectDetailLat" placeholder="47.3" step="any">
      </div>
      <div class="form-group" style="margin-bottom:10px">
        <label class="form-label">Longitude</label>
        <input type="number" class="form-input" id="prospectDetailLng" placeholder="-1.5" step="any">
      </div>
    </div>
    <div class="form-group" style="margin-top:12px">
      <label class="form-label">&#x1F4DD; Notes</label>
      <textarea class="detail-notes" id="prospectDetailNotes" placeholder="Notes personnelles..."></textarea>
    </div>
    <div class="form-group">
      <label class="form-label">&#x1F4CC; Statut</label>
      <select class="status-select" id="prospectDetailStatus">
        <option value="">&#x2014; Non defini</option>
        <option value="a_contacter">&#x1F4DE; A contacter</option>
        <option value="relance">&#x1F504; En relance</option>
        <option value="contacte">&#x2705; Contacte</option>
        <option value="client">&#x1F91D; Client</option>
        <option value="perdu">&#x274C; Perdu</option>
      </select>
    </div>
    <div class="form-group last-contact">
      <label class="form-label">&#x1F4C5; Dernier contact</label>
      <input type="date" id="prospectDetailLastContact">
    </div>
    <div id="prospectDetailHistory" style="margin-top:12px"></div>
    <div class="form-group" style="margin-top:12px">
      <label class="form-label">&#x1F464; Lier un client</label>
      <div id="prospectDetailClients" style="margin-bottom:8px"></div>
      <select class="form-select" id="prospectDetailClientSelect" style="margin-bottom:6px">
        <option value="">-- Choisir un client existant --</option>
      </select>
      <div style="display:flex;gap:6px">
        <button class="btn btn-sm btn-secondary" style="flex:1;margin-top:0" onclick="TLI.Prospection.linkClient()">&#x1F517; Lier</button>
        <button class="btn btn-sm btn-primary" style="flex:1;margin-top:0" onclick="TLI.Prospection.createClientFromProspect()">&#x2795; Nouveau client</button>
      </div>
    </div>
    <div class="btn-row" style="margin-top:14px">
      <button class="btn btn-primary" id="btnSaveProspectDetail" style="flex:1">&#x1F4BE; Enregistrer</button>
      <button class="btn btn-danger" id="btnDeleteProspect" style="flex:1">&#x1F5D1; Supprimer</button>
    </div>
  </div>
</div>

<!-- MODAL: AJOUTER PROSPECT -->
<div class="modal-overlay" id="prospectAddModal">
  <div class="modal-content" style="max-width:520px">
    <div class="modal-header">
      <div class="modal-title">&#x2795; Ajouter un prospect</div>
      <button class="modal-close" data-close="prospectAddModal">&times;</button>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
      <div class="form-group" style="margin-bottom:10px">
        <label class="form-label">Nom entreprise *</label>
        <input type="text" class="form-input" id="prospectAddName" placeholder="Nom de l'entreprise">
      </div>
      <div class="form-group" style="margin-bottom:10px">
        <label class="form-label">SIRET</label>
        <input type="text" class="form-input" id="prospectAddSiret" placeholder="Numero SIRET">
      </div>
      <div class="form-group" style="margin-bottom:10px">
        <label class="form-label">Secteur</label>
        <input type="text" class="form-input" id="prospectAddSecteur" placeholder="ex: Machines et equipements">
      </div>
      <div class="form-group" style="margin-bottom:10px">
        <label class="form-label">Effectif</label>
        <input type="number" class="form-input" id="prospectAddEff" value="10" min="1">
      </div>
      <div class="form-group" style="margin-bottom:10px">
        <label class="form-label">Categorie</label>
        <select class="form-select" id="prospectAddCat">
          <option value="PME">PME</option>
          <option value="ETI">ETI</option>
          <option value="GE">GE</option>
        </select>
      </div>
      <div class="form-group" style="margin-bottom:10px">
        <label class="form-label">Notation</label>
        <select class="form-select" id="prospectAddNotation">
          <option value="A">A &#x2014; Prioritaire</option>
          <option value="B" selected>B &#x2014; Secondaire</option>
          <option value="C">C &#x2014; Faible potentiel</option>
        </select>
      </div>
      <div class="form-group" style="grid-column:1/3;margin-bottom:10px">
        <label class="form-label">Adresse</label>
        <input type="text" class="form-input" id="prospectAddAdresse" placeholder="Adresse complete">
      </div>
      <div class="form-group" style="margin-bottom:10px">
        <label class="form-label">Code postal</label>
        <input type="text" class="form-input" id="prospectAddCp" placeholder="CP">
      </div>
      <div class="form-group" style="margin-bottom:10px">
        <label class="form-label">Ville</label>
        <input type="text" class="form-input" id="prospectAddVille" placeholder="Ville">
      </div>
      <div class="form-group" style="margin-bottom:10px">
        <label class="form-label">Latitude *</label>
        <input type="number" class="form-input" id="prospectAddLat" placeholder="47.3" step="any">
      </div>
      <div class="form-group" style="margin-bottom:10px">
        <label class="form-label">Longitude *</label>
        <input type="number" class="form-input" id="prospectAddLng" placeholder="-1.5" step="any">
      </div>
      <div class="form-group" style="grid-column:1/3;margin-bottom:10px">
        <label class="form-label">Notes</label>
        <textarea class="form-textarea" id="prospectAddNotes" placeholder="Notes..."></textarea>
      </div>
    </div>
    <button class="btn btn-primary" id="btnSaveNewProspect" style="margin-top:4px">&#x1F4BE; Ajouter le prospect</button>
  </div>
</div>

<!-- Inputs camera caches -->
<input type="file" id="cameraInput" accept="image/*" capture="environment" style="opacity:0;position:absolute;width:0;height:0;overflow:hidden;z-index:-1">
<input type="file" id="qualityCameraInput" accept="image/*" capture="environment" style="opacity:0;position:absolute;width:0;height:0;overflow:hidden;z-index:-1">

<!-- Toast -->
<div class="toast" id="toast"></div>

<!-- authModal -->
<div class="modal-overlay" id="authModal">
  <div class="modal-content">
    <div class="modal-header"><div class="modal-title">&#x1F510; Connexion TLI</div></div>
    <div id="authForm">
      <div class="form-group"><label class="form-label">Email</label><input type="email" class="form-input" id="authEmail" placeholder="florian@exemple.com"></div>
      <div class="form-group"><label class="form-label">Mot de passe</label><input type="password" class="form-input" id="authPassword" placeholder="&#x2022;&#x2022;&#x2022;&#x2022;&#x2022;&#x2022;&#x2022;&#x2022;"></div>
      <button class="btn btn-primary" id="btnLogin" onclick="TLI.Server.login()" type="button">Se connecter</button>
      <button class="btn btn-secondary" id="btnRegister" style="margin-top:8px" onclick="TLI.Server.register()" type="button">Creer un compte</button>
      <button class="btn btn-secondary" id="btnOffline" style="margin-top:8px" onclick="TLI.Server.goOffline()" type="button">Continuer hors-ligne</button>
      <div id="authError" style="color:var(--danger);font-size:.8rem;margin-top:10px;text-align:center;display:none"></div>
    </div>
  </div>
</div>

<!-- Splash Screen -->
<div id="splashScreen">
  <div class="splash-logo-wrap">
    <img src="logo-192.png" alt="TLI" class="splash-logo">
  </div>
  <div class="splash-title" id="splashTitle">
    <span class="splash-word">Technical</span>
    <span class="splash-word">Layer</span>
    <span class="splash-word splash-blue">Innovation</span>
  </div>
  <div class="splash-subtitle">Impression 3D &#xB7; Prototypage &#xB7; Innovation</div>
</div>

<!-- Splash screen independant - animation lettre par lettre + auto-hide -->
<script>
(function() {
  // Animation lettre par lettre
  var title = document.getElementById('splashTitle');
  if (title) {
    var words = title.querySelectorAll('.splash-word');
    var delay = 1.2; // debut apres 1.2s (le temps que le logo apparaisse)
    var letterDelay = 0.06; // 60ms entre chaque lettre
    words.forEach(function(word) {
      var text = word.textContent;
      word.innerHTML = '';
      for (var i = 0; i < text.length; i++) {
        var span = document.createElement('span');
        span.textContent = text[i] === ' ' ? '\u00A0' : text[i];
        span.style.animationDelay = (delay + i * letterDelay) + 's';
        word.appendChild(span);
      }
    });
  }

  function hideSplash() {
    var s = document.getElementById('splashScreen');
    if (s) {
      s.classList.add('fade-out');
      setTimeout(function() { s.style.display = 'none'; }, 900);
    }
  }
  // 7 secondes
  setTimeout(hideSplash, 7000);
  // Fallback
  if (window.performance && performance.timing && (Date.now() - performance.timing.navigationStart > 7000)) {
    hideSplash();
  }
})();
</script>

<!-- Chargement des modules JS -->
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<script src="https://unpkg.com/leaflet.markercluster@1.5.3/dist/leaflet.markercluster.js"></script>
<script src="data_prospects.js"></script>
<script src="modules/utils.js"></script>
<script src="modules/data.js"></script>
<script src="modules/server.js"></script>
<script src="modules/notifs.js"></script>
<script src="modules/photos.js"></script>
<script src="modules/timer.js"></script>
<script src="modules/calc.js"></script>
<script src="modules/ui.js"></script>
<script src="modules/prospection.js"></script>
<script src="app.js"></script>

<!-- Service Worker Registration -->
<script>
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('sw.js')
      .then(function(reg) { console.log('SW registered:', reg.scope); })
      .catch(function(err) { console.log('SW failed:', err); });
  });
}
</script>

</body>
</html>
