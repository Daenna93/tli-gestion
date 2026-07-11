// ============================================================
// TLI v16 - MODULE: Notifications
// Gestion des notifications navigateur et rappels
// ============================================================
var TLI = window.TLI || {};

TLI.Notifs = {
  requestPermission: function() {
    if (!('Notification' in window)) return;
    Notification.requestPermission().then(function(p) {
      console.log("[TLI.Notifs] Permission:", p);
    });
  },

  send: function(title, body) {
    if (!('Notification' in window)) return;
    if (Notification.permission !== 'granted') return;
    var opts = { body: body, icon: './icon-192.png', badge: './icon-192.png', tag: 'tli-' + Date.now() };
    if (navigator.serviceWorker && navigator.serviceWorker.ready) {
      navigator.serviceWorker.ready.then(function(reg) {
        if (reg.active) { reg.showNotification(title, opts); }
        else { new Notification(title, opts); }
      }).catch(function() { new Notification(title, opts); });
    } else {
      try { new Notification(title, opts); } catch(e) {}
    }
  },

  checkReminders: function() {
    var now = new Date().getTime();
    for (var i = 0; i < TLI.Data.planningEvents.length; i++) {
      var e = TLI.Data.planningEvents[i];
      if (!e.reminder || !e.reminderMinutes) continue;
      var eventDate = new Date(e.date + 'T' + (e.startTime || '00:00'));
      var reminderMs = eventDate.getTime() - (parseInt(e.reminderMinutes) * 60 * 1000);
      var reminderId = e.id + '_' + e.reminderMinutes;
      if (now >= reminderMs && now < eventDate.getTime()) {
        if (!TLI.Data.checkedReminders[reminderId]) {
          TLI.Data.checkedReminders[reminderId] = true;
          TLI.Data.saveReminders();
          this.send('\ud83d\udd14 Rappel TLI', e.title + ' dans ' + e.reminderMinutes + ' min');
          TLI.UI.showToast('\ud83d\udd14 ' + e.title + ' dans ' + e.reminderMinutes + ' min', 'warning');
        }
      } else if (now >= eventDate.getTime() + 60 * 60 * 1000) {
        if (TLI.Data.checkedReminders[reminderId]) {
          delete TLI.Data.checkedReminders[reminderId];
          TLI.Data.saveReminders();
        }
      }
    }
  }
};
