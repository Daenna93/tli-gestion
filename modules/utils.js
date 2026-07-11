// ============================================================
// TLI v16 - MODULE: Utils
// Fonctions utilitaires génériques
// ============================================================
var TLI = window.TLI || {};

TLI.Utils = {
  escapeHtml: function(text) {
    if (!text) return "";
    var div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  },
  formatDate: function(iso) {
    if (!iso) return "";
    return new Date(iso).toLocaleDateString("fr-FR");
  },
  formatTime: function(iso) {
    if (!iso) return "";
    return new Date(iso).toLocaleTimeString("fr-FR", {hour:'2-digit', minute:'2-digit'});
  },
  formatDateTime: function(iso) {
    if (!iso) return "";
    var d = new Date(iso);
    return d.toLocaleDateString("fr-FR") + ' ' + d.toLocaleTimeString("fr-FR", {hour:'2-digit', minute:'2-digit'});
  },
  formatTimer: function(ms) {
    if (ms <= 0) return "00:00:00";
    var s = Math.floor(ms / 1000);
    var h = Math.floor(s / 3600);
    var m = Math.floor((s % 3600) / 60);
    var sec = s % 60;
    return h.toString().padStart(2, "0") + ":" + m.toString().padStart(2, "0") + ":" + sec.toString().padStart(2, "0");
  },
  generateId: function() {
    return Date.now() + Math.floor(Math.random() * 1000);
  },
  cleanPhone: function(num) {
    return num ? num.replace(/[\s\.\-]/g, "") : "";
  },
  toISODate: function(d) {
    return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
  },
  resizeImage: function(base64, maxWidth, maxHeight, quality, callback) {
    var img = new Image();
    img.onload = function() {
      var canvas = document.createElement('canvas');
      var width = img.width;
      var height = img.height;
      if (width > maxWidth || height > maxHeight) {
        var ratio = Math.min(maxWidth / width, maxHeight / height);
        width *= ratio;
        height *= ratio;
      }
      canvas.width = width;
      canvas.height = height;
      var ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      var resized = canvas.toDataURL('image/jpeg', quality);
      callback(resized);
    };
    img.onerror = function() { callback(base64); };
    img.src = base64;
  }
};
