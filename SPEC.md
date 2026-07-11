// ============================================================
// TLI v16 - Point d'entree de l'application
// Orchestration et demarrage
// ============================================================
var TLI = window.TLI || {};

TLI.App = {
  deferredPrompt: null
};

document.addEventListener('DOMContentLoaded', function() {
  console.log('[TLI.App] DOM ready');
  TLI.Data.load();
  TLI.UI.init();
  TLI.Photos.init();
  TLI.Timer.loop();
  TLI.Server.init();
  TLI.Calc.update();
  TLI.Prospection.init();

  // PWA install
  window.addEventListener('beforeinstallprompt', function(e) {
    e.preventDefault();
    TLI.App.deferredPrompt = e;
    var btn = document.getElementById('btnInstallPWA');
    if (btn) btn.style.display = 'inline-flex';
    var hint = document.getElementById('pwaInstallHint');
    if (hint) hint.style.display = 'none';
  });
  window.addEventListener('appinstalled', function() {
    TLI.App.deferredPrompt = null;
    var btn = document.getElementById('btnInstallPWA');
    if (btn) btn.style.display = 'none';
    TLI.UI.showToast('Application installee !', 'success');
  });

  // Reminders
  setInterval(function() { TLI.Notifs.checkReminders(); }, 30000);

  // SW reload
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('message', function(event) {
      if (event.data && event.data.type === 'SW_UPDATED') {
        console.log('[TLI.App] SW updated to ' + event.data.version);
        window.location.reload();
      }
    });
  }

  // Load rates
  document.getElementById('rateModeling').value = TLI.Data.rates.modeling;
  document.getElementById('rateDesign').value = TLI.Data.rates.design;
  document.getElementById('rateFdm').value = TLI.Data.rates.fdm;
  document.getElementById('rateResin').value = TLI.Data.rates.resin;
  document.getElementById('ratePostProd').value = TLI.Data.rates.postProd;
  document.getElementById('priceFilament').value = TLI.Data.rates.filamentKg;
  document.getElementById('priceResinKg').value = TLI.Data.rates.resinKg;

  // Attendre un peu pour voir si la connexion auto fonctionne
  // avant d'ouvrir la modal auth
  setTimeout(function() {
    if (!TLI.Data.currentUserEmail && !TLI.Server.isConnected) {
      TLI.UI.openModal('authModal');
    }
  }, 2000);

  console.log('[TLI.App] Initialized successfully');
});

// Register SW
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('sw.js')
      .then(function(reg) { console.log('[TLI.App] SW registered:', reg.scope); })
      .catch(function(err) { console.log('[TLI.App] SW failed:', err); });
  });
}
