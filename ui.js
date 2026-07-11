// ============================================================
// TLI v16 - MODULE: Timer
// Boucle de gestion des timers d'impression
// ============================================================
var TLI = window.TLI || {};

TLI.Timer = {
  loop: function() {
    setInterval(function() {
      var now = Date.now();
      var changed = false;
      TLI.Data.activeTimers.forEach(function(t) {
        if (!t.finished && now >= t.endTime) {
          t.finished = true;
          TLI.Data.finishedTimers.push(t);
          changed = true;
          if (document.getElementById('notifSound').checked) {
            try { var audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZSA0PVanu87plHQUuh9Dz2YU2Bhxqv+zplkcODVGm5O+4YRsGN5bW9N2GNAcdcL7s5pZJDQtPp+XysWUeBjiX1/PShjYGHXC+7eaaSQ0MTKjl8blnHwU2ltXz3YU1Bhxwv+zmmUgNC1Ko5O+5ZSAF'); audio.play().catch(function(){}); } catch(e){}
          }
          if (document.getElementById('notifVibrate').checked && navigator.vibrate) {
            navigator.vibrate([200, 100, 200]);
          }
          TLI.Notifs.send('\u23f0 Timer TLI', 'L\'impression "' + t.name + '" est termin\u00e9e !');
          TLI.UI.showToast('Timer termin\u00e9 : ' + t.name, 'success');
        }
      });
      if (changed) {
        TLI.Data.activeTimers = TLI.Data.activeTimers.filter(function(t) { return !t.finished; });
        TLI.Data.saveTimers();
        TLI.UI.renderTimers();
        TLI.UI.renderStats();
      }
      // Update active timer displays
      TLI.Data.activeTimers.forEach(function(t) {
        if (t.finished) return;
        var remEl = document.getElementById('timer-rem-' + t.id);
        var barEl = document.getElementById('timer-bar-' + t.id);
        if (remEl) remEl.textContent = TLI.Utils.formatTimer(t.endTime - now);
        if (barEl) {
          var pct = Math.max(0, Math.min(100, 100 - ((t.endTime - now) / t.duration) * 100));
          barEl.style.width = pct + '%';
        }
      });
    }, 1000);
  }
};
