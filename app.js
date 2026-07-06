
// ============================================================
// TLI v15 - ARCHITECTURE MODULAIRE PROPRE
// ============================================================
// Structure: TLI.App (orchestration) -> modules spécialisés
// - TLI.Data      : persistence localStorage + données
// - TLI.Photos    : gestion photos (galerie, commandes, checklist)
// - TLI.UI        : rendu interface
// - TLI.Firebase  : auth + sync temps réel
// - TLI.Notifs    : notifications locales
// - TLI.Timer     : timers d'impression
// - TLI.Planning  : calendrier + rappels
// - TLI.Calc      : calculateur devis
// - TLI.Utils     : utilitaires
// ============================================================

var TLI = TLI || {};

// ============================================================
// MODULE: Utils
// ============================================================
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
    return num.replace(/[\s\.\-]/g, "");
  }
};

// ============================================================
// MODULE: Data (Persistence + State)
// ============================================================
TLI.Data = {
  // State
  orders: [],
  clients: [{id: 1, name: "Client Test", company: "", role: "", phone: "", email: ""}],
  models: [],
  stock: [],
  planningEvents: [],
  machines: [
    {id: 1, name: "Elegoo Saturn 4 Ultra", type: "resin", totalHours: 0, maintenance: []},
    {id: 2, name: "Bambulab P2S #1", type: "fdm", totalHours: 0, maintenance: []},
    {id: 3, name: "Bambulab P2S #2", type: "fdm", totalHours: 0, maintenance: []},
    {id: 4, name: "Bambulab H2C", type: "fdm", totalHours: 0, maintenance: []}
  ],
  generalPhotos: [],
  qualityResults: {},
  checklist: [
    {id: 1, text: "Adhesion plateau OK", checked: false},
    {id: 2, text: "Pas de warping / deformation", checked: false},
    {id: 3, text: "Finition surface correcte", checked: false},
    {id: 4, text: "Supports retires proprement", checked: false},
    {id: 5, text: "Post-traitement resine (lavage+UV)", checked: false},
    {id: 6, text: "Dimensions conformes", checked: false},
    {id: 7, text: "Emballage adapte", checked: false},
    {id: 8, text: "Photo finale prise", checked: false}
  ],

  // Timers
  activeTimers: [],
  finishedTimers: [],

  // Rates
  rates: {
    modeling: 35, design: 45, fdm: 2, resin: 3,
    postProd: 15, filamentKg: 25, resinKg: 60
  },

  // Navigation state
  currentOrderId: null,
  currentClientId: null,
  currentModelId: null,
  currentStockId: null,
  currentEventId: null,
  currentMachineId: null,
  currentOrderFilter: "all",
  planningCurrentDate: new Date(),
  planningSelectedDay: null,
  planningSelectedDayStr: null,

  // Auth
  currentUserId: null,
  currentUserEmail: null,
  isOnline: false,
  syncInProgress: false,

  // Reminders
  checkedReminders: {},

  // Quality temp
  qualityOrderId: null,
  tempQualityPhoto: null,

  // Call
  callNumber: "",

  // Load all
  load: function() {
    try {
      var saved = localStorage.getItem("tli15_data");
      if (saved) {
        var parsed = JSON.parse(saved);
        if (parsed.orders) this.orders = parsed.orders;
        if (parsed.clients) this.clients = parsed.clients;
        if (parsed.models) this.models = parsed.models;
        if (parsed.stock) this.stock = parsed.stock;
        if (parsed.planningEvents) this.planningEvents = parsed.planningEvents;
        if (parsed.qualityResults) this.qualityResults = parsed.qualityResults;
        if (parsed.machines && parsed.machines.length > 0) this.machines = parsed.machines;
        if (parsed.generalPhotos) this.generalPhotos = parsed.generalPhotos;
      }
      var savedTimers = localStorage.getItem("tli15_timers");
      if (savedTimers) {
        var t = JSON.parse(savedTimers);
        if (t.active) this.activeTimers = t.active;
        if (t.finished) this.finishedTimers = t.finished;
      }
      var savedRates = localStorage.getItem("tli15_rates");
      if (savedRates) this.rates = JSON.parse(savedRates);
      var savedReminders = localStorage.getItem("tli15_checkedReminders");
      if (savedReminders) this.checkedReminders = JSON.parse(savedReminders);
    } catch(e) { console.error("[TLI.Data] load error:", e); }
  },

  save: function() {
    try {
      localStorage.setItem("tli15_data", JSON.stringify({
        orders: this.orders, clients: this.clients, models: this.models,
        stock: this.stock, planningEvents: this.planningEvents,
        machines: this.machines, qualityResults: this.qualityResults,
        generalPhotos: this.generalPhotos
      }));
    } catch(e) { console.error("[TLI.Data] save error:", e); }
  },

  saveTimers: function() {
    try {
      localStorage.setItem("tli15_timers", JSON.stringify({
        active: this.activeTimers, finished: this.finishedTimers
      }));
    } catch(e) {}
  },

  saveRates: function() {
    try { localStorage.setItem("tli15_rates", JSON.stringify(this.rates)); } catch(e) {}
  },

  saveReminders: function() {
    try { localStorage.setItem("tli15_checkedReminders", JSON.stringify(this.checkedReminders)); } catch(e) {}
  },

  getOrder: function(id) {
    for (var i = 0; i < this.orders.length; i++) if (this.orders[i].id === id) return this.orders[i];
    return null;
  },

  getClient: function(id) {
    for (var i = 0; i < this.clients.length; i++) if (this.clients[i].id === id) return this.clients[i];
    return null;
  },

  getMachine: function(id) {
    for (var i = 0; i < this.machines.length; i++) if (this.machines[i].id === id) return this.machines[i];
    return null;
  },

  isMachineBusy: function(machineId) {
    for (var i = 0; i < this.orders.length; i++) {
      if (this.orders[i].machineId === machineId && this.orders[i].status === "printing") return true;
    }
    for (var i = 0; i < this.activeTimers.length; i++) {
      if (this.activeTimers[i].machineId === machineId && !this.activeTimers[i].finished) return true;
    }
    return false;
  },

  addPhotoToOrder: function(orderId, photoData) {
    var order = this.getOrder(orderId);
    if (!order) { console.error("[TLI.Data] Order not found:", orderId); return false; }
    if (!order.photos) order.photos = [];
    order.photos.push(photoData);
    this.save();
    console.log("[TLI.Data] Photo added to order", orderId, "total:", order.photos.length);
    return true;
  },

  addGeneralPhoto: function(photoData) {
    this.generalPhotos.push({
      id: TLI.Utils.generateId(),
      src: photoData,
      date: new Date().toISOString()
    });
    this.save();
    console.log("[TLI.Data] General photo added, total:", this.generalPhotos.length);
    return true;
  },

  deletePhotoFromOrder: function(orderId, photoIdx) {
    var order = this.getOrder(orderId);
    if (!order || !order.photos) return false;
    order.photos.splice(photoIdx, 1);
    this.save();
    return true;
  }
};

// ============================================================
// MODULE: Photos
// ============================================================
TLI.Photos = {
  // État temporaire pour savoir où envoyer la prochaine photo
  pendingTarget: null,  // {type: 'order', id: 123} ou {type: 'quality', id: 123} ou {type: 'gallery'}

  init: function() {
    // Écouter le input file principal
    var input = document.getElementById('cameraInput');
    if (input) {
      input.addEventListener('change', function() {
        TLI.Photos.handleFile(this);
      });
    }
    // Écouter le input file qualité
    var qInput = document.getElementById('qualityCameraInput');
    if (qInput) {
      qInput.addEventListener('change', function() {
        TLI.Photos.handleQualityFile(this);
      });
    }
    console.log("[TLI.Photos] Initialized");
  },

  // Préparer la prise de photo pour une commande
  prepareForOrder: function(orderId) {
    this.pendingTarget = { type: 'order', id: orderId };
    console.log("[TLI.Photos] Prepared for order:", orderId);
    var input = document.getElementById('cameraInput');
    if (input) { input.value = ''; input.click(); }
  },

  // Préparer la prise de photo pour la galerie générale
  prepareForGallery: function() {
    this.pendingTarget = { type: 'gallery' };
    console.log("[TLI.Photos] Prepared for gallery");
    var input = document.getElementById('cameraInput');
    if (input) { input.value = ''; input.click(); }
  },

  // Préparer la prise de photo pour la checklist qualité
  prepareForQuality: function(orderId) {
    this.pendingTarget = { type: 'quality', id: orderId };
    console.log("[TLI.Photos] Prepared for quality:", orderId);
    var input = document.getElementById('qualityCameraInput');
    if (input) { input.value = ''; input.click(); }
  },

  handleFile: function(input) {
    var file = input.files[0];
    if (!file) { console.log("[TLI.Photos] No file selected"); return; }
    console.log("[TLI.Photos] File selected:", file.name, "target:", this.pendingTarget);

    var target = this.pendingTarget;  // Capture locale
    this.pendingTarget = null;        // Reset immédiat

    var reader = new FileReader();
    reader.onload = function(e) {
      var photoData = e.target.result;
      console.log("[TLI.Photos] File loaded, size:", photoData.length, "target:", target);

      if (target && target.type === 'order' && target.id) {
        // Photo pour une commande
        if (TLI.Data.addPhotoToOrder(target.id, photoData)) {
          TLI.UI.renderOrderPhotos(target.id);
          TLI.UI.showToast("Photo ajoutée à la commande", "success");
        } else {
          TLI.UI.showToast("Erreur: commande introuvable", "error");
        }
      } else {
        // Photo générale (galerie)
        TLI.Data.addGeneralPhoto(photoData);
        TLI.UI.renderPhotos();
        TLI.UI.showToast("Photo ajoutée à la galerie", "success");
      }
      TLI.Firebase.push();
    };
    reader.onerror = function(e) {
      console.error("[TLI.Photos] FileReader error:", e);
      TLI.UI.showToast("Erreur lecture photo", "error");
    };
    reader.readAsDataURL(file);
    input.value = "";
  },

  handleQualityFile: function(input) {
    var file = input.files[0];
    if (!file) { console.log("[TLI.Photos] No quality file selected"); return; }
    console.log("[TLI.Photos] Quality file selected:", file.name);

    var target = this.pendingTarget;
    this.pendingTarget = null;

    var reader = new FileReader();
    reader.onload = function(e) {
      TLI.Data.tempQualityPhoto = e.target.result;
      console.log("[TLI.Photos] Quality photo loaded, size:", TLI.Data.tempQualityPhoto.length);
      var preview = document.getElementById("qualityPhotoPreview");
      if (preview) {
        preview.innerHTML = '<div class="photo-item"><img src="' + TLI.Data.tempQualityPhoto + '" alt="Photo qualite"></div>';
        preview.style.display = "grid";
      }
      TLI.UI.showToast("Photo qualité prise", "success");
    };
    reader.onerror = function(e) {
      console.error("[TLI.Photos] Quality FileReader error:", e);
      TLI.UI.showToast("Erreur photo qualité", "error");
    };
    reader.readAsDataURL(file);
    input.value = "";
  },

  // Valider la qualité et sauvegarder la photo dans la commande
  validateQuality: function() {
    var orderId = TLI.Data.qualityOrderId;
    console.log("[TLI.Photos] Validate quality, orderId:", orderId, "tempPhoto:", !!TLI.Data.tempQualityPhoto);

    if (TLI.Data.tempQualityPhoto && orderId) {
      if (TLI.Data.addPhotoToOrder(orderId, TLI.Data.tempQualityPhoto)) {
        console.log("[TLI.Photos] Quality photo saved to order", orderId);
        TLI.UI.renderOrderPhotos(orderId);
      }
      TLI.Data.tempQualityPhoto = null;
    }
    document.getElementById("qualityOverlay").classList.remove("active");
    TLI.UI.showToast("Qualité validée !", "success");
    TLI.Firebase.push();
  },

  skipQuality: function() {
    TLI.Data.tempQualityPhoto = null;
    document.getElementById("qualityOverlay").classList.remove("active");
    TLI.UI.showToast("Clôture sans validation", "warning");
  }
};

// ============================================================
// MODULE: Notifications
// ============================================================
TLI.Notifs = {
  requestPermission: function() {
    if (!('Notification' in window)) return;
    Notification.requestPermission().then(function(p) {
      console.log("[TLI.Notifs] Permission:", p);
    });
  },

  send: function(title, body) {
    if (!('Notification' in window)) { console.log("[TLI.Notifs] Not supported"); return; }
    if (Notification.permission !== 'granted') { console.log("[TLI.Notifs] Permission denied"); return; }

    var opts = { body: body, icon: './icon-192.png', badge: './icon-192.png', tag: 'tli-' + Date.now() };

    if (navigator.serviceWorker && navigator.serviceWorker.ready) {
      navigator.serviceWorker.ready.then(function(reg) {
        if (reg.active) {
          reg.showNotification(title, opts);
          console.log("[TLI.Notifs] SW notification sent:", title);
        } else {
          new Notification(title, opts);
        }
      }).catch(function() { new Notification(title, opts); });
    } else {
      try { new Notification(title, opts); } catch(e) {}
    }
  },

  checkReminders: function() {
    var now = new Date().getTime();
    var triggered = false;

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
          console.log("[TLI.Notifs] Reminder triggered:", e.title);
          this.send('🔔 Rappel TLI', e.title + ' dans ' + e.reminderMinutes + ' min');
          TLI.UI.showToast('🔔 ' + e.title + ' dans ' + e.reminderMinutes + ' min', 'warning');
          triggered = true;
        }
      } else if (now >= eventDate.getTime() + 60 * 60 * 1000) {
        if (TLI.Data.checkedReminders[reminderId]) {
          delete TLI.Data.checkedReminders[reminderId];
          TLI.Data.saveReminders();
        }
      }
    }
    return triggered;
  }
};

// ============================================================
// MODULE: Firebase (Auth + Sync)
// ============================================================
TLI.Firebase = {
  db: null,
  auth: null,
  dataRef: null,
  usersRef: null,
  timersRef: null,

  init: function() {
    var config = {
      apiKey: "AIzaSyB2jCioCr3WpNvtKNNqlFhXtKJmpgjTj9A",
      authDomain: "tli-gestion.firebaseapp.com",
      databaseURL: "https://tli-gestion-default-rtdb.europe-west1.firebasedatabase.app",
      projectId: "tli-gestion",
      storageBucket: "tli-gestion.firebasestorage.app",
      messagingSenderId: "540516964273",
      appId: "1:540516964273:web:04713d8c584b7c23230f90",
      measurementId: "G-4STXLSXY3N"
    };

    firebase.initializeApp(config);
    this.db = firebase.database();
    this.auth = firebase.auth();
    this.dataRef = this.db.ref('tli-data');
    this.usersRef = this.db.ref('tli-users');
    this.timersRef = this.db.ref('tli-timers');

    TLI.Notifs.requestPermission();
    this.setupAuth();
    console.log("[TLI.Firebase] Initialized");
  },

  setupAuth: function() {
    var self = this;
    var authModalTimeout = null;

    this.auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL).then(function() {
      console.log("[TLI.Firebase] Auth persistence LOCAL");
    }).catch(function(err) {
      console.error("[TLI.Firebase] Auth persistence error:", err);
    });

    this.auth.onAuthStateChanged(function(user) {
      if (user) {
        TLI.Data.currentUserId = user.uid;
        TLI.Data.currentUserEmail = user.email;
        console.log("[TLI.Firebase] Connected:", TLI.Data.currentUserEmail);
        TLI.UI.closeModal("authModal");
        document.getElementById("authError").style.display = "none";
        if (authModalTimeout) { clearTimeout(authModalTimeout); authModalTimeout = null; }

        var userRef = self.usersRef.child(TLI.Data.currentUserId);
        userRef.set({
          online: true, email: TLI.Data.currentUserEmail,
          lastSeen: firebase.database.ServerValue.TIMESTAMP,
          device: navigator.userAgent.substring(0, 50)
        });
        userRef.onDisconnect().remove();

        self.startRealtimeSync();
        self.startTimerSync();
        TLI.UI.updateSyncStatus("synced");
        TLI.UI.showToast("Connecté: " + TLI.Data.currentUserEmail, "success");
        TLI.UI.updateAuthDisplay();
      } else {
        console.log("[TLI.Firebase] Auth state null, waiting 2s...");
        if (authModalTimeout) clearTimeout(authModalTimeout);
        authModalTimeout = setTimeout(function() {
          if (!TLI.Data.currentUserId) {
            TLI.Data.currentUserId = null;
            TLI.Data.currentUserEmail = null;
            TLI.UI.updateSyncStatus("offline");
            TLI.UI.openModal("authModal");
            TLI.UI.updateAuthDisplay();
          }
        }, 2000);
      }
    });
  },

  login: function() {
    var email = document.getElementById("authEmail").value.trim();
    var password = document.getElementById("authPassword").value;
    var errorDiv = document.getElementById("authError");
    if (!email || !password) { errorDiv.textContent = "Email et mot de passe requis"; errorDiv.style.display = "block"; return; }

    this.auth.signInWithEmailAndPassword(email, password).then(function() {
      errorDiv.style.display = "none";
    }).catch(function(err) {
      errorDiv.textContent = "Erreur: " + err.message;
      errorDiv.style.display = "block";
    });
  },

  register: function() {
    var email = document.getElementById("authEmail").value.trim();
    var password = document.getElementById("authPassword").value;
    var errorDiv = document.getElementById("authError");
    if (!email || !password) { errorDiv.textContent = "Champs requis"; errorDiv.style.display = "block"; return; }
    if (password.length < 6) { errorDiv.textContent = "6 caractères minimum"; errorDiv.style.display = "block"; return; }

    this.auth.createUserWithEmailAndPassword(email, password).then(function() {
      errorDiv.style.display = "none";
      TLI.UI.showToast("Compte créé !", "success");
    }).catch(function(err) {
      errorDiv.textContent = "Erreur: " + err.message;
      errorDiv.style.display = "block";
    });
  },

  logout: function() {
    if (confirm("Se déconnecter ?")) {
      this.auth.signOut().then(function() {
        TLI.UI.showToast("Déconnecté", "warning");
      });
    }
  },

  startRealtimeSync: function() {
    var self = this;
    this.dataRef.on('value', function(snapshot) {
      if (TLI.Data.syncInProgress) return;
      var remoteData = snapshot.val();
      if (!remoteData) { self.push(); return; }

      var localTime = parseInt(localStorage.getItem("tli15_lastSync") || "0");
      var remoteTime = remoteData.lastUpdated || 0;

      if (remoteTime > localTime) {
        TLI.Data.syncInProgress = true;
        self.notifyRemoteChanges(remoteData);
        if (remoteData.orders) TLI.Data.orders = remoteData.orders;
        if (remoteData.clients) TLI.Data.clients = remoteData.clients;
        if (remoteData.models) TLI.Data.models = remoteData.models;
        if (remoteData.stock) TLI.Data.stock = remoteData.stock;
        if (remoteData.planningEvents) TLI.Data.planningEvents = remoteData.planningEvents;
        if (remoteData.machines) TLI.Data.machines = remoteData.machines;
        if (remoteData.qualityResults) TLI.Data.qualityResults = remoteData.qualityResults;
        if (remoteData.generalPhotos) TLI.Data.generalPhotos = remoteData.generalPhotos;
        TLI.Data.save();
        localStorage.setItem("tli15_lastSync", remoteTime.toString());
        TLI.UI.renderAll();
        TLI.Data.syncInProgress = false;
      }
      TLI.UI.updateSyncStatus("synced");
    });

    this.db.ref('.info/connected').on('value', function(snapshot) {
      TLI.Data.isOnline = snapshot.val() === true;
      TLI.UI.updateSyncStatus(TLI.Data.isOnline ? "synced" : "offline");
    });
  },

  startTimerSync: function() {
    var self = this;
    this.timersRef.on('value', function(snapshot) {
      if (TLI.Data.syncInProgress) return;
      var timers = snapshot.val();
      if (!timers) return;
      var localTime = parseInt(localStorage.getItem("tli15_timersSync") || "0");
      var remoteTime = timers.lastUpdated || 0;
      if (remoteTime > localTime) {
        TLI.Data.activeTimers = timers.active || [];
        TLI.Data.finishedTimers = timers.finished || [];
        TLI.Data.saveTimers();
        TLI.UI.renderTimers();
      }
    });
  },

  push: function() {
    if (!TLI.Data.currentUserId || !TLI.Data.isOnline) return;
    TLI.Data.syncInProgress = true;
    var now = Date.now();
    this.dataRef.set({
      orders: TLI.Data.orders, clients: TLI.Data.clients, models: TLI.Data.models,
      stock: TLI.Data.stock, planningEvents: TLI.Data.planningEvents,
      machines: TLI.Data.machines, qualityResults: TLI.Data.qualityResults,
      generalPhotos: TLI.Data.generalPhotos,
      lastUpdated: now, updatedBy: TLI.Data.currentUserId
    }).then(function() {
      localStorage.setItem("tli15_lastSync", now.toString());
      TLI.Data.syncInProgress = false;
      TLI.UI.updateSyncStatus("synced");
    }).catch(function() {
      TLI.Data.syncInProgress = false;
      TLI.UI.updateSyncStatus("error");
    });
  },

  pushTimers: function() {
    if (!TLI.Data.currentUserId || !TLI.Data.isOnline) return;
    this.timersRef.set({
      active: TLI.Data.activeTimers, finished: TLI.Data.finishedTimers, lastUpdated: Date.now()
    });
  },

  notifyRemoteChanges: function(remoteData) {
    if (!remoteData) return;
    if (remoteData.orders && remoteData.orders.length > this.lastNotifiedOrders && this.lastNotifiedOrders > 0) {
      var newOrder = remoteData.orders[remoteData.orders.length - 1];
      if (newOrder.updatedBy && newOrder.updatedBy !== TLI.Data.currentUserId) {
        TLI.Notifs.send('📦 Nouvelle commande', newOrder.name);
        TLI.UI.showToast('📦 Nouvelle commande: ' + newOrder.name, 'success');
      }
    }
    if (remoteData.orders) this.lastNotifiedOrders = remoteData.orders.length;

    if (remoteData.planningEvents && remoteData.planningEvents.length > this.lastNotifiedEvents && this.lastNotifiedEvents > 0) {
      var newEvent = remoteData.planningEvents[remoteData.planningEvents.length - 1];
      TLI.Notifs.send('📅 Planning modifié', newEvent.title);
      TLI.UI.showToast('📅 Planning modifié: ' + newEvent.title, 'success');
    }
    if (remoteData.planningEvents) this.lastNotifiedEvents = remoteData.planningEvents.length;

    if (remoteData.stock) {
      for (var i = 0; i < remoteData.stock.length; i++) {
        var s = remoteData.stock[i];
        if (parseFloat(s.qty) <= parseFloat(s.alert)) {
          TLI.Notifs.send('⚠️ Stock bas', s.name + ' : ' + s.qty + ' ' + s.unit);
        }
      }
    }
  },

  lastNotifiedOrders: 0,
  lastNotifiedEvents: 0,

  sync: function() {
    if (!navigator.onLine) { TLI.UI.showToast("Hors-ligne", "warning"); return; }
    if (!TLI.Data.isOnline || !TLI.Data.currentUserId) { TLI.UI.showToast("Firebase non connecté", "warning"); return; }
    TLI.UI.showToast("Synchronisation...", "success");
    this.push();
    this.pushTimers();
    TLI.UI.showToast("Synchronisé pour " + (TLI.Data.currentUserEmail || "vous"), "success");
  }
};

// ============================================================
// MODULE: UI (Rendu + Interactions)
// ============================================================
TLI.UI = {
  init: function() {
    this.attachNavListeners();
    this.attachModalListeners();
    this.attachActionListeners();
    this.attachSearchListeners();
    this.attachPlanningListeners();
    this.attachTimerListeners();
    this.attachCalculatorListeners();
    this.attachConfigListeners();
    this.attachQualityListeners();
    this.attachPhotoListeners();
    this.attachCallListeners();
    this.renderAll();
    TLI.Calc.update();
    TLI.UI.updateMachineSelects();
    console.log("[TLI.UI] Initialized");
  },

  attachNavListeners: function() {
    var self = this;
    document.querySelectorAll('.nav-tab').forEach(function(tab) {
      tab.addEventListener('click', function() { self.showSection(this.dataset.section); });
    });
    document.querySelectorAll('.order-tab').forEach(function(tab) {
      tab.addEventListener('click', function() {
        TLI.Data.currentOrderFilter = this.dataset.filter;
        document.querySelectorAll('.order-tab').forEach(function(t) { t.classList.remove('active'); });
        this.classList.add('active');
        self.renderOrders();
      });
    });
  },

  attachModalListeners: function() {
    var self = this;
    document.querySelectorAll('.modal-close').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var id = this.dataset.close;
        if (id) self.closeModal(id);
      });
    });
    document.querySelectorAll('.modal-overlay').forEach(function(overlay) {
      overlay.addEventListener('click', function(e) {
        if (e.target === this) {
          this.classList.remove('active');
        }
      });
    });
  },

  attachActionListeners: function() {
    var self = this;
    document.getElementById('btnNewOrderDash').addEventListener('click', function() { self.openModal('newOrderModal'); });
    document.getElementById('btnNewClientDash').addEventListener('click', function() { self.openModal('newClientModal'); });
    document.getElementById('btnTimerDash').addEventListener('click', function() { self.showSection('timer'); });
    document.getElementById('btnSync').addEventListener('click', function() { TLI.Firebase.sync(); });
    document.getElementById('btnNewOrder').addEventListener('click', function() { self.openModal('newOrderModal'); });
    document.getElementById('btnNewClient').addEventListener('click', function() { self.openModal('newClientModal'); });
    document.getElementById('btnNewModel').addEventListener('click', function() { self.openModal('newModelModal'); });
    document.getElementById('btnNewStock').addEventListener('click', function() { self.openModal('newStockModal'); });
    document.getElementById('btnNewEvent').addEventListener('click', function() { self.openPlanningModal(); });
    document.getElementById('btnAddMachine').addEventListener('click', function() { self.openModal('addMachineModal'); });
    document.getElementById('btnSaveOrder').addEventListener('click', function() { self.saveOrder(); });
    document.getElementById('btnSaveClient').addEventListener('click', function() { self.saveClient(); });
    document.getElementById('btnUpdateClient').addEventListener('click', function() { self.updateClient(); });
    document.getElementById('btnSaveModel').addEventListener('click', function() { self.saveModel(); });
    document.getElementById('btnUpdateModel').addEventListener('click', function() { self.updateModel(); });
    document.getElementById('btnDeleteModel').addEventListener('click', function() { self.deleteModel(); });
    document.getElementById('btnSaveStock').addEventListener('click', function() { self.saveStock(); });
    document.getElementById('btnUpdateStock').addEventListener('click', function() { self.updateStock(); });
    document.getElementById('btnDeleteStock').addEventListener('click', function() { self.deleteStock(); });
    document.getElementById('btnSaveEvent').addEventListener('click', function() { self.saveEvent(); });
    document.getElementById('btnUpdateEvent').addEventListener('click', function() { self.updateEvent(); });
    document.getElementById('btnDeleteEvent').addEventListener('click', function() { self.deleteEvent(); });
    document.getElementById('btnSaveMaint').addEventListener('click', function() { self.saveMaintenance(); });
    document.getElementById('btnSaveNewMachine').addEventListener('click', function() { self.saveNewMachine(); });
    document.getElementById('btnRdvExisting').addEventListener('click', function() { self.showRdvClientList(); });
    document.getElementById('btnRdvNew').addEventListener('click', function() { self.newRdvClient(); });
    document.getElementById('btnRdvSkip').addEventListener('click', function() { self.skipRdvClient(); });
    document.getElementById('btnUpdateMachineInfo').addEventListener('click', function() { self.updateMachineInfo(); });
    document.getElementById('btnDeleteMachineInfo').addEventListener('click', function() { self.deleteMachineInfo(); });
    document.getElementById('detailStatus').addEventListener('change', function() { self.updateOrderStatus(); });
    document.getElementById('btnDeleteOrder').addEventListener('click', function() { self.deleteOrder(); });
    document.getElementById('btnDeleteClient').addEventListener('click', function() { self.deleteClient(); });
    document.getElementById('btnCallClient').addEventListener('click', function() { self.openCallOverlay(); });
    document.getElementById('btnEditClient').addEventListener('click', function() { self.openEditClient(); });
    document.getElementById('btnLogout').addEventListener('click', function() { TLI.Firebase.logout(); });
    document.getElementById('btnClearAll').addEventListener('click', function() { self.clearAll(); });
    document.getElementById('btnExport').addEventListener('click', function() { self.exportData(); });
    document.getElementById('btnImportTrigger').addEventListener('click', function() { document.getElementById('importFile').click(); });
    document.getElementById('importFile').addEventListener('change', function() { self.importData(this); });
    document.getElementById('btnSaveConfig').addEventListener('click', function() { self.saveConfig(); });
    document.getElementById('btnTestConn').addEventListener('click', function() { self.testConnection(); });
    document.getElementById('btnSaveRates').addEventListener('click', function() { self.saveRates(); });
    document.getElementById('orderService').addEventListener('change', function() { self.toggleOrderFields(); });
  },

  attachSearchListeners: function() {
    document.getElementById('clientSearch').addEventListener('input', function() { TLI.UI.renderClients(); });
    document.getElementById('catalogSearch').addEventListener('input', function() { TLI.UI.renderCatalog(); });
    document.getElementById('stockSearch').addEventListener('input', function() { TLI.UI.renderStock(); });
  },

  attachPlanningListeners: function() {
    var self = this;
    document.getElementById('btnPlanPrev').addEventListener('click', function() { self.changePlanningMonth(-1); });
    document.getElementById('btnPlanNext').addEventListener('click', function() { self.changePlanningMonth(1); });
    document.getElementById('btnShowAllEvents').addEventListener('click', function() {
      TLI.Data.planningSelectedDay = null;
      TLI.Data.planningSelectedDayStr = null;
      self.renderPlanning();
    });
    document.getElementById('planReminder').addEventListener('change', function() {
      var g = document.getElementById('planReminderMinutesGroup');
      if (g) g.style.display = this.checked ? 'block' : 'none';
    });
    document.getElementById('editPlanReminder').addEventListener('change', function() {
      var g = document.getElementById('editPlanReminderMinutesGroup');
      if (g) g.style.display = this.checked ? 'block' : 'none';
    });
  },

  attachTimerListeners: function() {
    document.getElementById('btnStartTimer').addEventListener('click', function() { TLI.Timer.start(); });
  },

  attachCalculatorListeners: function() {
    var ids = ['calcService','calcType','calcWeight','calcPrintHours','calcModelingHours','calcDesignHours','calcPostProdHours','calcQty'];
    ids.forEach(function(id) {
      var el = document.getElementById(id);
      if (el) el.addEventListener('input', function() { TLI.Calc.update(); });
    });
    var rateIds = ['rateModeling','rateDesign','rateFdm','rateResin','ratePostProd','priceFilament','priceResinKg'];
    rateIds.forEach(function(id) {
      var el = document.getElementById(id);
      if (el) el.addEventListener('input', function() { TLI.Calc.update(); });
    });
  },

  attachConfigListeners: function() {
    // Rien de spécial
  },

  attachQualityListeners: function() {
    document.getElementById('qualityValidateBtn').addEventListener('click', function() { TLI.Photos.validateQuality(); });
    document.getElementById('btnSkipQuality').addEventListener('click', function() { TLI.Photos.skipQuality(); });
  },

  attachPhotoListeners: function() {
    var self = this;
    document.getElementById('photoOverlay').addEventListener('click', function() { this.classList.remove('active'); });
    document.getElementById('btnClosePhoto').addEventListener('click', function() { document.getElementById('photoOverlay').classList.remove('active'); });
    document.getElementById('btnCloseGalleryPhoto').addEventListener('click', function() { document.getElementById('galleryPhotoOverlay').classList.remove('active'); });
  },

  attachCallListeners: function() {
    document.getElementById('btnCancelCall').addEventListener('click', function() { document.getElementById('callOverlay').classList.remove('active'); });
    document.getElementById('btnConfirmCall').addEventListener('click', function() {
      if (TLI.Data.callNumber) {
        window.location.href = "tel:" + TLI.Utils.cleanPhone(TLI.Data.callNumber);
      }
      document.getElementById('callOverlay').classList.remove('active');
    });
  },

  showSection: function(id) {
    document.querySelectorAll('.section').forEach(function(s) { s.classList.remove('active'); });
    document.querySelectorAll('.nav-tab').forEach(function(t) { t.classList.remove('active'); });
    document.getElementById(id).classList.add('active');
    document.querySelector('.nav-tab[data-section="' + id + '"]').classList.add('active');

    if (id === 'orders') this.renderOrders();
    if (id === 'clients') this.renderClients();
    if (id === 'catalog') this.renderCatalog();
    if (id === 'stock') this.renderStock();
    if (id === 'planning') this.renderPlanning();
    if (id === 'timer') this.renderTimers();
    if (id === 'machines') this.renderMachines();
    if (id === 'dashboard') this.renderStats();
    if (id === 'photos') this.renderPhotos();
  },

  openModal: function(id) {
    var el = document.getElementById(id);
    if (el) {
      el.classList.add('active');
      if (id === 'newOrderModal') { this.updateClientSelect(); this.updateMachineSelects(); }
      if (id === 'planningModal') { this.setPlanningDate(); }
      if (id === 'machineDetailModal') { this.setMaintDate(); }
    }
  },

  closeModal: function(id) {
    var el = document.getElementById(id);
    if (el) el.classList.remove('active');
  },

  showToast: function(msg, type) {
    var toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.className = 'toast' + (type ? ' ' + type : '');
    toast.classList.add('show');
    setTimeout(function() { toast.classList.remove('show'); }, 3000);
  },

  updateSyncStatus: function(status) {
    var btn = document.getElementById('btnSync');
    if (!btn) return;
    var span = btn.querySelector('span:last-child');
    if (!span) return;
    if (status === 'synced') { btn.style.borderColor = 'var(--success)'; btn.style.background = 'rgba(0,255,136,0.1)'; span.textContent = 'Sync OK'; }
    else if (status === 'offline') { btn.style.borderColor = 'var(--danger)'; btn.style.background = 'rgba(255,51,51,0.1)'; span.textContent = 'Non connecté'; }
    else if (status === 'error') { btn.style.borderColor = 'var(--secondary)'; span.textContent = 'Erreur Firebase'; }
    else { btn.style.borderColor = 'var(--warning)'; span.textContent = 'Connexion...'; }
  },

  updateAuthDisplay: function() {
    var info = document.getElementById('authInfo');
    if (info) {
      if (TLI.Data.currentUserEmail) {
        info.textContent = 'Connecté: ' + TLI.Data.currentUserEmail;
        info.style.color = 'var(--success)';
      } else {
        info.textContent = 'Non connecté';
        info.style.color = '#888';
      }
    }
  },

  // --- RENDERING ---
  renderAll: function() {
    this.renderStats();
    this.renderOrders();
    this.renderClients();
    this.renderCatalog();
    this.renderStock();
    this.renderPlanning();
    this.renderTimers();
    this.renderMachines();
    this.renderPhotos();
  },

  renderStats: function() {
    var active = 0;
    for (var i = 0; i < TLI.Data.orders.length; i++) if (TLI.Data.orders[i].status !== 'delivered') active++;
    var html = '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;text-align:center;">';
    html += '<div style="background:var(--glass);border:1px solid var(--glass-border);border-radius:12px;padding:14px;"><div style="font-size:1.6rem;font-weight:800;color:var(--primary);">' + active + '</div><div style="font-size:.75rem;color:#888;">En cours</div></div>';
    html += '<div style="background:var(--glass);border:1px solid var(--glass-border);border-radius:12px;padding:14px;"><div style="font-size:1.6rem;font-weight:800;color:var(--primary);">' + TLI.Data.orders.length + '</div><div style="font-size:.75rem;color:#888;">Total</div></div>';
    html += '<div style="background:var(--glass);border:1px solid var(--glass-border);border-radius:12px;padding:14px;"><div style="font-size:1.6rem;font-weight:800;color:var(--primary);">' + TLI.Data.clients.length + '</div><div style="font-size:.75rem;color:#888;">Clients</div></div>';
    html += '<div style="background:var(--glass);border:1px solid var(--glass-border);border-radius:12px;padding:14px;"><div style="font-size:1.6rem;font-weight:800;color:var(--primary);">' + TLI.Data.machines.length + '</div><div style="font-size:.75rem;color:#888;">Machines</div></div>';
    html += '</div>';
    document.getElementById('statsDisplay').innerHTML = html;

    var now = new Date();
    var caMonth = 0, caYear = 0;
    for (var i = 0; i < TLI.Data.orders.length; i++) {
      var o = TLI.Data.orders[i];
      if (o.status === 'delivered' || o.status === 'finished') {
        var d = new Date(o.dateCreated);
        var price = parseFloat(o.price) || 0;
        if (d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()) caMonth += price;
        if (d.getFullYear() === now.getFullYear()) caYear += price;
      }
    }
    document.getElementById('caMonth').textContent = caMonth.toFixed(2) + '€';
    document.getElementById('caYear').textContent = caYear.toFixed(2) + '€';

    var alerts = [];
    for (var i = 0; i < TLI.Data.stock.length; i++) {
      if (parseFloat(TLI.Data.stock[i].qty) <= parseFloat(TLI.Data.stock[i].alert)) alerts.push(TLI.Data.stock[i]);
    }
    var adiv = document.getElementById('stockAlerts');
    if (alerts.length === 0) adiv.innerHTML = '<div class="empty-state"><div class="icon">✅</div>Aucune alerte</div>';
    else {
      var ahtml = '';
      for (var i = 0; i < alerts.length; i++) {
        ahtml += '<div style="padding:10px;background:rgba(255,170,0,0.1);border-radius:8px;margin-bottom:6px;border-left:3px solid var(--warning)"><strong>' + TLI.Utils.escapeHtml(alerts[i].name) + '</strong> — ' + alerts[i].qty + ' ' + alerts[i].unit + ' restant(s)</div>';
      }
      adiv.innerHTML = ahtml;
    }
  },

  renderOrders: function() {
    var div = document.getElementById('ordersList');
    div.innerHTML = '';
    var orders = TLI.Data.orders.filter(function(o) {
      return TLI.Data.currentOrderFilter === 'all' || o.status === TLI.Data.currentOrderFilter;
    });
    orders.sort(function(a, b) { return b.id - a.id; });

    if (orders.length === 0) {
      var msg = TLI.Data.currentOrderFilter === 'all' ? 'Aucune commande' : 'Aucune commande dans cette categorie';
      div.innerHTML = '<div class="empty-state"><div class="icon">📦</div>' + msg + '</div>';
      return;
    }

    for (var i = 0; i < orders.length; i++) {
      var o = orders[i];
      var statusLabel = o.status === 'pending' ? 'A faire' : o.status === 'printing' ? 'En cours' : o.status === 'finished' ? 'Terminee' : 'Livree';
      var hasPhotos = (o.photos && o.photos.length > 0) ? '<span>📷</span>' : '';
      var item = document.createElement('div');
      item.className = 'order-item';
      item.innerHTML = '<div class="order-item-header"><span class="order-item-title">#' + o.id + ' — ' + TLI.Utils.escapeHtml(o.name) + '</span><span class="badge badge-' + o.status + '">' + statusLabel + '</span></div><div class="order-item-meta"><span>👤 ' + TLI.Utils.escapeHtml(o.clientName) + '</span><span>💰 ' + o.price + '€</span>' + hasPhotos + '</div>';
      (function(oid) { item.addEventListener('click', function() { TLI.UI.openOrderDetail(oid); }); })(o.id);
      div.appendChild(item);
    }
  },

  openOrderDetail: function(id) {
    TLI.Data.currentOrderId = id;
    var order = TLI.Data.getOrder(id);
    if (!order) return;
    document.getElementById('detailTitle').textContent = '#' + order.id + ' — ' + (order.name || 'Sans nom');
    document.getElementById('detailStatus').value = order.status || 'pending';

    var svc = order.service === 'print' ? '🖨️ Impression' : order.service === 'modeling' ? '🎨 Modelisation' : '💡 Conception';
    var typeLabel = order.type === 'fdm' ? 'FDM' : order.type === 'resin' ? 'Resine' : '-';
    var notesHtml = order.notes ? '<div style="margin-bottom:12px"><div style="font-size:.8rem;color:#888">Notes</div><div style="background:var(--darker);padding:10px;border-radius:8px;margin-top:4px;font-size:.9rem">' + TLI.Utils.escapeHtml(order.notes) + '</div></div>' : '';
    var datesHtml = '<div style="margin-bottom:12px;font-size:.75rem;color:#888">';
    datesHtml += '📅 Cree : ' + TLI.Utils.formatDateTime(order.dateCreated) + '<br>';
    if (order.dateFinished) datesHtml += '✅ Terminee : ' + TLI.Utils.formatDate(order.dateFinished) + '<br>';
    if (order.dateDelivered) datesHtml += '📦 Livree : ' + TLI.Utils.formatDate(order.dateDelivered) + '<br>';
    datesHtml += '</div>';

    document.getElementById('orderDetailContent').innerHTML = 
      datesHtml +
      '<div style="margin-bottom:12px"><div style="font-size:.8rem;color:#888;margin-bottom:4px">Client</div><div style="font-weight:700">' + TLI.Utils.escapeHtml(order.clientName || 'Inconnu') + '</div></div>' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px">' +
      '<div><div style="font-size:.8rem;color:#888">Service</div><div>' + svc + '</div></div>' +
      '<div><div style="font-size:.8rem;color:#888">Technologie</div><div>' + typeLabel + '</div></div>' +
      '<div><div style="font-size:.8rem;color:#888">Poids</div><div>' + (order.weight || 0) + 'g</div></div>' +
      '<div><div style="font-size:.8rem;color:#888">Temps</div><div>' + (order.time || 0) + 'h</div></div>' +
      '<div><div style="font-size:.8rem;color:#888">Prix</div><div style="color:var(--primary);font-weight:700">' + (order.price || 0) + '€</div></div>' +
      '<div><div style="font-size:.8rem;color:#888">Priorite</div><div>' + (order.priority || 'medium') + '</div></div>' +
      '</div>' + notesHtml;

    this.renderOrderPhotos(id);
    this.openModal('orderDetailModal');
  },

  renderOrderPhotos: function(orderId) {
    var order = TLI.Data.getOrder(orderId);
    if (!order) return;
    var div = document.getElementById('detailPhotos');
    div.innerHTML = '';
    if (!order.photos || order.photos.length === 0) {
      div.innerHTML = '<div style="grid-column:1/-1;text-align:center;color:#888;padding:16px">Aucune photo</div>';
      return;
    }
    for (var i = 0; i < order.photos.length; i++) {
      var item = document.createElement('div');
      item.className = 'photo-item';
      item.innerHTML = '<img src="' + TLI.Utils.escapeHtml(order.photos[i]) + '" alt="Photo"><button class="photo-delete">×</button>';
      (function(src, idx) {
        item.querySelector('img').addEventListener('click', function(e) { e.stopPropagation(); TLI.UI.openPhotoOverlay(src); });
        item.querySelector('.photo-delete').addEventListener('click', function(e) { e.stopPropagation(); TLI.UI.deletePhoto(orderId, idx); });
      })(order.photos[i], i);
      div.appendChild(item);
    }
  },

  deletePhoto: function(orderId, idx) {
    if (TLI.Data.deletePhotoFromOrder(orderId, idx)) {
      this.renderOrderPhotos(orderId);
      this.showToast('Photo supprimée', 'warning');
      TLI.Firebase.push();
    }
  },

  openPhotoOverlay: function(src) {
    document.getElementById('photoOverlayImg').src = src;
    document.getElementById('photoOverlay').classList.add('active');
  },

  renderClients: function() {
    var div = document.getElementById('clientsList');
    div.innerHTML = '';
    var search = (document.getElementById('clientSearch')?.value || '').toLowerCase();
    var clients = TLI.Data.clients.filter(function(c) {
      if (!search) return true;
      var text = (c.name + ' ' + (c.company || '') + ' ' + (c.role || '') + ' ' + (c.phone || '') + ' ' + (c.email || '')).toLowerCase();
      return text.indexOf(search) !== -1;
    });
    if (clients.length === 0) { div.innerHTML = '<div class="empty-state"><div class="icon">👥</div>Aucun client</div>'; return; }
    for (var i = 0; i < clients.length; i++) {
      var c = clients[i];
      var orderCount = TLI.Data.orders.filter(function(o) { return o.clientId === c.id; }).length;
      var item = document.createElement('div');
      item.className = 'client-card';
      item.innerHTML = '<div class="client-name">' + TLI.Utils.escapeHtml(c.name || 'Sans nom') + '</div><div class="client-info">' + (c.company ? '🏢 ' + TLI.Utils.escapeHtml(c.company) + ' ' : '') + (c.phone ? '📞 ' + TLI.Utils.escapeHtml(c.phone) : '') + '</div><div class="client-orders">' + orderCount + ' commande(s)</div>';
      (function(cid) { item.addEventListener('click', function() { TLI.UI.openClientDetail(cid); }); })(c.id);
      div.appendChild(item);
    }
  },

  openClientDetail: function(id) {
    TLI.Data.currentClientId = id;
    var client = TLI.Data.getClient(id);
    if (!client) return;
    document.getElementById('clientDetailTitle').textContent = client.name || 'Client';

    var content = document.getElementById('clientDetailContent');
    var html = '';
    if (client.company) html += '<div style="margin-bottom:8px"><span style="color:#888">🏢 </span>' + TLI.Utils.escapeHtml(client.company) + '</div>';
    if (client.role) html += '<div style="margin-bottom:8px"><span style="color:#888">💼 </span>' + TLI.Utils.escapeHtml(client.role) + '</div>';
    if (client.phone) html += '<div style="margin-bottom:8px"><span style="color:#888">📞 </span>' + TLI.Utils.escapeHtml(client.phone) + '</div>';
    if (client.email) html += '<div style="margin-bottom:8px"><span style="color:#888">✉️ </span>' + TLI.Utils.escapeHtml(client.email) + '</div>';
    if (client.address) html += '<div style="margin-bottom:8px"><span style="color:#888">📍 </span>' + TLI.Utils.escapeHtml(client.address) + '</div>';
    if (client.notes) html += '<div style="margin-bottom:12px"><div style="font-size:.8rem;color:#888">Notes</div><div style="background:var(--darker);padding:10px;border-radius:8px;margin-top:4px;font-size:.9rem">' + TLI.Utils.escapeHtml(client.notes) + '</div></div>';

    var clientOrders = TLI.Data.orders.filter(function(o) { return o.clientId === id; });
    html += '<div style="margin-top:14px"><div style="font-size:.9rem;font-weight:700;margin-bottom:8px">Commandes (' + clientOrders.length + ')</div>';
    if (clientOrders.length === 0) html += '<div style="color:#888;font-size:.85rem">Aucune commande</div>';
    else {
      for (var i = 0; i < clientOrders.length; i++) {
        var o = clientOrders[i];
        var statusLabel = o.status === 'pending' ? 'A faire' : o.status === 'printing' ? 'En cours' : o.status === 'finished' ? 'Terminee' : 'Livree';
        html += '<div class="client-order-row" data-oid="' + o.id + '"><div style="display:flex;justify-content:space-between"><span style="font-weight:700;font-size:.9rem">' + TLI.Utils.escapeHtml(o.name) + '</span><span style="font-size:.7rem;color:var(--warning)">' + statusLabel + '</span></div><div style="font-size:.8rem;color:#888">' + o.price + '€ • ' + TLI.Utils.formatDate(o.dateCreated) + '</div></div>';
      }
    }
    html += '</div>';
    content.innerHTML = html;

    // Attach click handlers for order rows
    content.querySelectorAll('.client-order-row').forEach(function(row) {
      row.addEventListener('click', function() {
        TLI.UI.closeModal('clientDetailModal');
        TLI.UI.openOrderDetail(parseInt(this.dataset.oid));
      });
    });

    TLI.Data.callNumber = client.phone || '';
    document.getElementById('btnCallClient').style.display = TLI.Data.callNumber ? 'flex' : 'none';

    var delBtn = document.getElementById('btnDeleteClient');
    if (clientOrders.length > 0) {
      delBtn.textContent = '🔒 Verrouille (' + clientOrders.length + ' commande(s))';
      delBtn.disabled = true; delBtn.style.opacity = '0.5';
    } else {
      delBtn.textContent = '🗑️ Supprimer';
      delBtn.disabled = false; delBtn.style.opacity = '1';
    }
    this.openModal('clientDetailModal');
  },

  openEditClient: function() {
    var client = TLI.Data.getClient(TLI.Data.currentClientId);
    if (!client) return;
    document.getElementById('editClientName').value = client.name || '';
    document.getElementById('editClientCompany').value = client.company || '';
    document.getElementById('editClientRole').value = client.role || '';
    document.getElementById('editClientPhone').value = client.phone || '';
    document.getElementById('editClientEmail').value = client.email || '';
    document.getElementById('editClientAddress').value = client.address || '';
    document.getElementById('editClientNotes').value = client.notes || '';
    this.closeModal('clientDetailModal');
    this.openModal('editClientModal');
  },

  openCallOverlay: function() {
    if (!TLI.Data.callNumber) { this.showToast('Aucun numero enregistre', 'warning'); return; }
    var client = TLI.Data.getClient(TLI.Data.currentClientId);
    document.getElementById("callClientName").textContent = client ? "Appeler " + client.name : "Confirmer l'appel";
    document.getElementById('callNumber').textContent = TLI.Data.callNumber;
    document.getElementById('callOverlay').classList.add('active');
  },

  renderCatalog: function() {
    var div = document.getElementById('catalogList');
    div.innerHTML = '';
    var search = (document.getElementById('catalogSearch')?.value || '').toLowerCase();
    var models = TLI.Data.models.filter(function(m) {
      if (!search) return true;
      var text = (m.name + ' ' + (m.category || '') + ' ' + (m.description || '')).toLowerCase();
      return text.indexOf(search) !== -1;
    });
    if (models.length === 0) { div.innerHTML = '<div class="empty-state"><div class="icon">🎨</div>Catalogue vide</div>'; return; }
    for (var i = 0; i < models.length; i++) {
      var m = models[i];
      var typeLabel = m.type === 'fdm' ? 'FDM' : m.type === 'resin' ? 'Resine' : 'FDM + Resine';
      var card = document.createElement('div');
      card.className = 'card'; card.style.cursor = 'pointer';
      card.innerHTML = '<div style="font-weight:700">' + TLI.Utils.escapeHtml(m.name || 'Sans nom') + '</div><div style="font-size:.8rem;color:#888;margin-top:4px">' + (m.category || '') + ' • ' + typeLabel + '</div><div style="display:flex;gap:12px;margin-top:8px;font-size:.8rem;color:#aaa"><span>⏱️ ' + (m.time || 0) + 'h</span><span>⚖️ ' + (m.weight || 0) + 'g</span><span style="color:var(--primary);font-weight:700">' + (m.price || 0) + '€</span></div>';
      (function(mid) { card.addEventListener('click', function() { TLI.UI.openEditModel(mid); }); })(m.id);
      div.appendChild(card);
    }
  },

  openEditModel: function(id) {
    TLI.Data.currentModelId = id;
    var m = TLI.Data.models.find(function(x) { return x.id === id; });
    if (!m) return;
    document.getElementById('editModelName').value = m.name || '';
    document.getElementById('editModelCategory').value = m.category || 'prototype';
    document.getElementById('editModelType').value = m.type || 'fdm';
    document.getElementById('editModelTime').value = m.time || 0;
    document.getElementById('editModelWeight').value = m.weight || 0;
    document.getElementById('editModelPrice').value = m.price || 0;
    document.getElementById('editModelDesc').value = m.description || '';
    this.openModal('editModelModal');
  },

  renderStock: function() {
    var div = document.getElementById('stockList');
    div.innerHTML = '';
    var search = (document.getElementById('stockSearch')?.value || '').toLowerCase();
    var stock = TLI.Data.stock.filter(function(s) {
      if (!search) return true;
      var text = (s.name + ' ' + (s.type || '') + ' ' + (s.supplier || '')).toLowerCase();
      return text.indexOf(search) !== -1;
    });
    if (stock.length === 0) { div.innerHTML = '<div class="empty-state"><div class="icon">📋</div>Stock vide</div>'; return; }
    for (var i = 0; i < stock.length; i++) {
      var s = stock[i];
      var qty = parseFloat(s.qty) || 0;
      var alert = parseFloat(s.alert) || 0;
      var isLow = qty <= alert;
      var card = document.createElement('div');
      card.className = 'card'; card.style.cursor = 'pointer';
      card.style.borderLeft = isLow ? '3px solid var(--warning)' : '3px solid var(--success)';
      card.innerHTML = '<div style="display:flex;justify-content:space-between;align-items:center"><div><div style="font-weight:700">' + TLI.Utils.escapeHtml(s.name || 'Sans nom') + '</div><div style="font-size:.75rem;color:#888">' + (s.type || '') + '</div></div><div style="text-align:right"><div style="font-size:1.2rem;font-weight:800;color:' + (isLow ? 'var(--warning)' : 'var(--success)') + '">' + qty + ' ' + (s.unit || '') + '</div><div style="font-size:.7rem;color:#666">Seuil: ' + alert + '</div></div></div>';
      (function(sid) { card.addEventListener('click', function() { TLI.UI.openEditStock(sid); }); })(s.id);
      div.appendChild(card);
    }
  },

  openEditStock: function(id) {
    TLI.Data.currentStockId = id;
    var item = TLI.Data.stock.find(function(x) { return x.id === id; });
    if (!item) return;
    document.getElementById('editStockType').value = item.type || 'filament';
    document.getElementById('editStockName').value = item.name || '';
    document.getElementById('editStockQty').value = item.qty || 0;
    document.getElementById('editStockUnit').value = item.unit || 'kg';
    document.getElementById('editStockAlert').value = item.alert || 1;
    document.getElementById('editStockSupplier').value = item.supplier || '';
    this.openModal('editStockModal');
  },

  renderPlanning: function() {
    var calDiv = document.getElementById('planningCalendar');
    if (!calDiv) return;
    var year = TLI.Data.planningCurrentDate.getFullYear();
    var month = TLI.Data.planningCurrentDate.getMonth();
    var monthNames = ['Janvier','Fevrier','Mars','Avril','Mai','Juin','Juillet','Aout','Septembre','Octobre','Novembre','Decembre'];
    document.getElementById('planningMonthLabel').textContent = monthNames[month] + ' ' + year;

    var firstDay = new Date(year, month, 1).getDay();
    var daysInMonth = new Date(year, month + 1, 0).getDate();
    var days = ['Dim','Lun','Mar','Mer','Jeu','Ven','Sam'];
    var html = '';
    for (var i = 0; i < days.length; i++) html += '<div class="planning-day-header">' + days[i] + '</div>';
    for (var i = 0; i < firstDay; i++) html += '<div></div>';
    var today = new Date();
    for (var d = 1; d <= daysInMonth; d++) {
      var isToday = d === today.getDate() && month === today.getMonth() && year === today.getFullYear();
      var isSelected = TLI.Data.planningSelectedDay && d === TLI.Data.planningSelectedDay.getDate() && month === TLI.Data.planningSelectedDay.getMonth() && year === TLI.Data.planningSelectedDay.getFullYear();
      var dayEvents = TLI.Data.planningEvents.filter(function(e) {
        var ed = new Date(e.date);
        return ed.getDate() === d && ed.getMonth() === month && ed.getFullYear() === year;
      });
      var dots = '';
      for (var j = 0; j < Math.min(dayEvents.length, 3); j++) {
        var color = dayEvents[j].priority === 'high' ? 'var(--danger)' : dayEvents[j].priority === 'medium' ? 'var(--warning)' : 'var(--success)';
        dots += '<span class="planning-event-dot" style="background:' + color + '"></span>';
      }
      html += '<div class="planning-day ' + (isToday ? 'today' : '') + ' ' + (isSelected ? 'selected' : '') + '" data-day="' + d + '"><div class="planning-day-number">' + d + '</div><div>' + dots + '</div></div>';
    }
    calDiv.innerHTML = html;

    var self = this;
    calDiv.querySelectorAll('.planning-day[data-day]').forEach(function(dayEl) {
      dayEl.addEventListener('click', function() {
        var d = parseInt(this.dataset.day);
        TLI.Data.planningSelectedDay = new Date(year, month, d, 12, 0, 0);
        TLI.Data.planningSelectedDayStr = year + '-' + String(month+1).padStart(2,'0') + '-' + String(d).padStart(2,'0');
        self.renderPlanning();
      });
    });

    this.renderPlanningEvents();
  },

  renderPlanningEvents: function() {
    var div = document.getElementById('planningEventsList');
    var label = document.getElementById('planSelectedDayLabel');
    if (!div) return;
    div.innerHTML = '';

    var events = TLI.Data.planningEvents;
    if (TLI.Data.planningSelectedDayStr) {
      events = events.filter(function(e) { return e.date === TLI.Data.planningSelectedDayStr; });
      if (label) label.textContent = '📅 ' + TLI.Data.planningSelectedDay.toLocaleDateString('fr-FR');
    } else {
      if (label) label.textContent = '📅 Tous les evenements';
    }

    if (events.length === 0) { div.innerHTML = '<div class="empty-state"><div class="icon">📅</div>Aucun evenement</div>'; return; }

    var typeLabels = {printing: 'Impression', modeling: 'Modelisation', design: 'Conception', maintenance: 'Maintenance', rdv: 'RDV', logistics: 'Logistique', other: 'Divers'};
    for (var i = 0; i < events.length; i++) {
      var e = events[i];
      var priorityColor = e.priority === 'high' ? 'var(--danger)' : e.priority === 'medium' ? 'var(--warning)' : 'var(--success)';
      var priorityLabel = e.priority === 'high' ? '🔴 Haute' : e.priority === 'medium' ? '🟠 Moyenne' : '🟢 Basse';
      var clientInfo = (e.type === 'rdv' && e.clientName) ? '<span>👤 ' + TLI.Utils.escapeHtml(e.clientName) + '</span>' : '';

      var item = document.createElement('div');
      item.className = 'event-item';
      item.style.borderLeftColor = priorityColor;
      item.innerHTML = '<div class="event-item-header"><span class="event-item-title">' + TLI.Utils.escapeHtml(e.title) + '</span><span style="font-size:.7rem;color:' + priorityColor + ';font-weight:700">' + (typeLabels[e.type] || e.type) + '</span></div><div class="event-item-meta"><span>🕐 ' + e.startTime + ' — ' + e.endTime + '</span><span>👤 ' + (e.assignee === 'florian' ? 'Florian' : e.assignee === 'elie' ? 'Elie' : 'Les deux') + '</span><span style="color:' + priorityColor + '">' + priorityLabel + '</span>' + (clientInfo ? ' • ' + clientInfo : '') + '</div><div class="event-item-actions"><button class="btn-edit-event">✏️</button><button class="btn-delete-event">🗑️</button></div>';
      (function(eid) {
        item.querySelector('.btn-edit-event').addEventListener('click', function(ev) { ev.stopPropagation(); TLI.UI.openEditEvent(eid); });
        item.querySelector('.btn-delete-event').addEventListener('click', function(ev) { ev.stopPropagation(); TLI.UI.deleteEventDirect(eid); });
      })(e.id);
      div.appendChild(item);
    }
  },

  renderTimers: function() {
    var as = document.getElementById('activeTimersSection');
    var fs = document.getElementById('finishedTimersSection');
    var al = document.getElementById('timerList');
    var fl = document.getElementById('finishedTimerList');
    var active = TLI.Data.activeTimers.filter(function(t) { return !t.finished; });
    var finished = TLI.Data.finishedTimers.slice(-10).reverse();

    if (active.length === 0) as.style.display = 'none';
    else {
      as.style.display = 'block'; al.innerHTML = '';
      for (var i = 0; i < active.length; i++) {
        var t = active[i];
        var remaining = Math.max(0, t.endTime - Date.now());
        var pct = t.duration > 0 ? Math.min(100, ((t.duration - remaining) / t.duration) * 100) : 100;
        var card = document.createElement('div');
        card.className = 'timer-card';
        card.id = 'timerCard_' + t.id;
        card.innerHTML = '<div style="display:flex;justify-content:space-between;align-items:center"><div class="timer-name">' + TLI.Utils.escapeHtml(t.name) + '</div><button class="btn btn-sm btn-danger btn-stop-timer" style="width:auto">⏹️ Arreter</button></div><div class="timer-info">🖨️ ' + TLI.Utils.escapeHtml(t.machineName) + '</div><div class="timer-remaining" id="timer_' + t.id + '">' + TLI.Utils.formatTimer(remaining) + '</div><div class="progress-bar"><div class="progress-fill" id="timerBar_' + t.id + '" style="width:' + pct + '%"></div></div>';
        (function(tid) { card.querySelector('.btn-stop-timer').addEventListener('click', function(e) { e.stopPropagation(); TLI.Timer.stop(tid); }); })(t.id);
        al.appendChild(card);
      }
    }

    if (finished.length === 0) fs.style.display = 'none';
    else {
      fs.style.display = 'block'; fl.innerHTML = '';
      for (var i = 0; i < finished.length; i++) {
        var t = finished[i];
        var card = document.createElement('div');
        card.className = 'timer-card finished';
        card.innerHTML = '<div style="display:flex;justify-content:space-between;align-items:center"><div class="timer-name">✅ ' + TLI.Utils.escapeHtml(t.name) + '</div><button class="btn btn-sm btn-danger btn-del-timer" style="width:auto">🗑️</button></div><div class="timer-info">🖨️ ' + TLI.Utils.escapeHtml(t.machineName) + ' • ' + new Date(t.endTime).toLocaleTimeString('fr-FR') + '</div>';
        (function(tid) { card.querySelector('.btn-del-timer').addEventListener('click', function(e) { e.stopPropagation(); TLI.Timer.deleteFinished(tid); }); })(t.id);
        fl.appendChild(card);
      }
    }

    var card = document.getElementById('activeTimersCard');
    if (card) {
      card.style.display = active.length > 0 ? 'block' : 'none';
      var list = document.getElementById('activeTimersList');
      if (list && active.length > 0) {
        list.innerHTML = '';
        for (var i = 0; i < active.length; i++) {
          var t = active[i];
          var remaining = Math.max(0, t.endTime - Date.now());
          var card2 = document.createElement('div');
          card2.className = 'timer-card';
          card2.innerHTML = '<div class="timer-name">' + TLI.Utils.escapeHtml(t.name) + '</div><div class="timer-info">🖨️ ' + TLI.Utils.escapeHtml(t.machineName) + '</div><div class="timer-remaining">' + TLI.Utils.formatTimer(remaining) + '</div>';
          list.appendChild(card2);
        }
      }
    }
  },

  renderMachines: function() {
    var div = document.getElementById('machinesList');
    if (!div) return;
    div.innerHTML = '';
    if (TLI.Data.machines.length === 0) { div.innerHTML = '<div class="empty-state"><div class="icon">🖨️</div>Aucune machine</div>'; return; }
    for (var i = 0; i < TLI.Data.machines.length; i++) {
      var m = TLI.Data.machines[i];
      var busy = TLI.Data.isMachineBusy(m.id);
      var statusText = busy ? '🔴 Indisponible' : '🟢 Disponible';
      var hours = m.totalHours || 0;
      var card = document.createElement('div');
      card.className = 'machine-card ' + (busy ? 'busy' : 'available');
      card.innerHTML = '<div style="display:flex;justify-content:space-between;align-items:center"><div class="machine-name">' + TLI.Utils.escapeHtml(m.name) + '</div><span style="font-size:.75rem;font-weight:700">' + statusText + '</span></div><div class="machine-info">' + (m.type === 'fdm' ? 'FDM' : 'Resine') + '</div><div class="machine-hours">⏱️ ' + hours.toFixed(1) + 'h cumulees • 🔧 ' + (m.maintenance ? m.maintenance.length : 0) + ' entretien(s)</div>';
      (function(mid) { card.addEventListener('click', function() { TLI.UI.openMachineDetail(mid); }); })(m.id);
      div.appendChild(card);
    }
  },

  renderPhotos: function() {
    console.log("[TLI.UI] renderPhotos called, generalPhotos:", TLI.Data.generalPhotos.length);
    var div = document.getElementById('photosGallery');
    if (!div) return;
    div.innerHTML = '';

    var allPhotos = [];
    TLI.Data.generalPhotos.forEach(function(gp) {
      allPhotos.push({ src: gp.src, orderId: null, orderName: 'Photo generale', clientName: '', date: gp.date });
    });
    TLI.Data.orders.forEach(function(o) {
      if (o.photos && o.photos.length > 0) {
        o.photos.forEach(function(p) {
          allPhotos.push({ src: p, orderId: o.id, orderName: o.name, clientName: o.clientName });
        });
      }
    });

    if (allPhotos.length === 0) {
      div.innerHTML = '<div class="empty-state"><div class="icon">📷</div>Aucune photo</div>';
      return;
    }

    var grid = document.createElement('div');
    grid.className = 'photo-grid';
    for (var i = 0; i < allPhotos.length; i++) {
      var p = allPhotos[i];
      var item = document.createElement('div');
      item.className = 'photo-item';
      item.innerHTML = '<img src="' + TLI.Utils.escapeHtml(p.src) + '" alt="Photo">';
      (function(photoData) {
        item.addEventListener('click', function() { TLI.UI.openGalleryPhoto(photoData); });
      })(p);
      grid.appendChild(item);
    }
    div.appendChild(grid);
  },

  openGalleryPhoto: function(photoData) {
    document.getElementById('galleryPhotoOverlayImg').src = photoData.src;
    var info = document.getElementById('galleryPhotoInfo');
    if (photoData.orderId) {
      info.innerHTML = '<div style="font-weight:700">' + TLI.Utils.escapeHtml(photoData.orderName) + '</div><div style="font-size:.8rem;color:#aaa">👤 ' + TLI.Utils.escapeHtml(photoData.clientName || 'Inconnu') + '</div><button class="btn btn-sm btn-primary" style="margin-top:8px;width:auto;padding:6px 12px;font-size:.75rem" id="btnGoToOrder">📦 Voir la commande</button>';
      document.getElementById('galleryPhotoOverlay').classList.add('active');
      document.getElementById('btnGoToOrder').addEventListener('click', function() {
        document.getElementById('galleryPhotoOverlay').classList.remove('active');
        TLI.UI.openOrderDetail(photoData.orderId);
      });
    } else {
      info.innerHTML = '<div style="font-weight:700">' + TLI.Utils.escapeHtml(photoData.orderName) + '</div><div style="font-size:.8rem;color:#aaa">' + TLI.Utils.formatDate(photoData.date) + '</div>';
      document.getElementById('galleryPhotoOverlay').classList.add('active');
    }
  },

  // --- ACTIONS ---
  saveOrder: function() {
    try {
      var clientId = parseInt(document.getElementById('orderClient').value);
      var client = TLI.Data.getClient(clientId);
      var service = document.getElementById('orderService').value;
      var order = {
        id: TLI.Utils.generateId(),
        clientId: clientId,
        clientName: client ? client.name : 'Inconnu',
        name: document.getElementById('orderName').value || 'Sans nom',
        service: service,
        type: service === 'print' ? document.getElementById('orderType').value : null,
        machineId: service === 'print' ? parseInt(document.getElementById('orderMachine').value) : null,
        material: document.getElementById('orderMaterial').value || '',
        weight: document.getElementById('orderWeight').value || 0,
        time: document.getElementById('orderTime').value || 0,
        price: document.getElementById('orderPrice').value || 0,
        priority: document.getElementById('orderPriority').value,
        notes: document.getElementById('orderNotes').value || '',
        status: 'pending',
        photos: [],  // ✅ Initialisé explicitement
        dateCreated: new Date().toISOString(),
        dateFinished: null,
        dateDelivered: null
      };
      TLI.Data.orders.push(order);
      TLI.Data.save();
      TLI.Firebase.push();
      this.closeModal('newOrderModal');
      this.showToast('Commande creee !');
      this.renderStats();
      this.renderOrders();
      document.getElementById('orderName').value = '';
      document.getElementById('orderMaterial').value = '';
      document.getElementById('orderWeight').value = '';
      document.getElementById('orderTime').value = '';
      document.getElementById('orderPrice').value = '';
      document.getElementById('orderNotes').value = '';
    } catch(e) { this.showToast('Erreur: ' + e.message, 'error'); }
  },

  updateOrderStatus: function() {
    var order = TLI.Data.getOrder(TLI.Data.currentOrderId);
    if (!order) return;
    var oldStatus = order.status;
    order.status = document.getElementById('detailStatus').value;
    var now = new Date().toISOString();
    if (oldStatus !== 'finished' && order.status === 'finished') {
      order.dateFinished = now;
      this.updateMachineHours(order);
      if (order.service === 'print') this.showQualityOverlay(order.id, order.name);
    }
    if (oldStatus !== 'delivered' && order.status === 'delivered') {
      order.dateDelivered = now;
      if (!order.dateFinished) order.dateFinished = now;
      this.updateMachineHours(order);
    }
    TLI.Data.save();
    TLI.Firebase.push();
    this.showToast('Statut mis a jour');
    this.renderOrders();
    this.renderStats();
    this.renderMachines();
  },

  updateMachineHours: function(order) {
    if (order.machineId && order.time) {
      var machine = TLI.Data.getMachine(order.machineId);
      if (machine) {
        machine.totalHours = (machine.totalHours || 0) + parseFloat(order.time);
        TLI.Data.save();
      }
    }
  },

  deleteOrder: function() {
    if (!confirm('Supprimer cette commande ?')) return;
    TLI.Data.orders = TLI.Data.orders.filter(function(o) { return o.id !== TLI.Data.currentOrderId; });
    TLI.Data.save();
    TLI.Firebase.push();
    this.closeModal('orderDetailModal');
    this.showToast('Supprime', 'warning');
    this.renderOrders();
    this.renderStats();
    this.renderMachines();
  },

  saveClient: function() {
    try {
      var client = {
        id: TLI.Utils.generateId(),
        name: document.getElementById('clientName').value || 'Sans nom',
        company: document.getElementById('clientCompany').value || '',
        role: document.getElementById('clientRole').value || '',
        phone: document.getElementById('clientPhone').value || '',
        email: document.getElementById('clientEmail').value || '',
        address: document.getElementById('clientAddress').value || '',
        notes: document.getElementById('clientNotes').value || ''
      };
      TLI.Data.clients.push(client);
      TLI.Data.save();
      TLI.Firebase.push();
      this.closeModal('newClientModal');
      this.showToast('Client ajoute !');
      this.renderStats();
      this.renderClients();
      document.getElementById('clientName').value = '';
      document.getElementById('clientCompany').value = '';
      document.getElementById('clientRole').value = '';
      document.getElementById('clientPhone').value = '';
      document.getElementById('clientEmail').value = '';
      document.getElementById('clientAddress').value = '';
      document.getElementById('clientNotes').value = '';
    } catch(e) { this.showToast('Erreur: ' + e.message, 'error'); }
  },

  updateClient: function() {
    var client = TLI.Data.getClient(TLI.Data.currentClientId);
    if (!client) return;
    client.name = document.getElementById('editClientName').value || client.name;
    client.company = document.getElementById('editClientCompany').value || '';
    client.role = document.getElementById('editClientRole').value || '';
    client.phone = document.getElementById('editClientPhone').value || '';
    client.email = document.getElementById('editClientEmail').value || '';
    client.address = document.getElementById('editClientAddress').value || '';
    client.notes = document.getElementById('editClientNotes').value || '';
    TLI.Data.orders.forEach(function(o) { if (o.clientId === TLI.Data.currentClientId) o.clientName = client.name; });
    TLI.Data.save();
    TLI.Firebase.push();
    this.closeModal('editClientModal');
    this.showToast('Client mis a jour !');
    this.renderClients();
    this.renderOrders();
    this.renderStats();
  },

  deleteClient: function() {
    if (!confirm('Supprimer ce client ?')) return;
    var orderCount = TLI.Data.orders.filter(function(o) { return o.clientId === TLI.Data.currentClientId; }).length;
    if (orderCount > 0) { this.showToast('Impossible : ' + orderCount + ' commande(s) liee(s)', 'error'); return; }
    TLI.Data.clients = TLI.Data.clients.filter(function(c) { return c.id !== TLI.Data.currentClientId; });
    TLI.Data.save();
    TLI.Firebase.push();
    this.closeModal('clientDetailModal');
    this.showToast('Client supprime', 'warning');
    this.renderStats();
    this.renderClients();
    this.renderOrders();
  },

  saveModel: function() {
    try {
      TLI.Data.models.push({
        id: TLI.Utils.generateId(),
        name: document.getElementById('modelName').value || 'Sans nom',
        category: document.getElementById('modelCategory').value,
        type: document.getElementById('modelType').value,
        time: document.getElementById('modelTime').value || 0,
        weight: document.getElementById('modelWeight').value || 0,
        price: document.getElementById('modelPrice').value || 0,
        description: document.getElementById('modelDesc').value || ''
      });
      TLI.Data.save();
      TLI.Firebase.push();
      this.closeModal('newModelModal');
      this.showToast('Modele ajoute !');
      this.renderCatalog();
    } catch(e) { this.showToast('Erreur: ' + e.message, 'error'); }
  },

  updateModel: function() {
    var m = TLI.Data.models.find(function(x) { return x.id === TLI.Data.currentModelId; });
    if (!m) return;
    m.name = document.getElementById('editModelName').value || m.name;
    m.category = document.getElementById('editModelCategory').value;
    m.type = document.getElementById('editModelType').value;
    m.time = document.getElementById('editModelTime').value || 0;
    m.weight = document.getElementById('editModelWeight').value || 0;
    m.price = document.getElementById('editModelPrice').value || 0;
    m.description = document.getElementById('editModelDesc').value || '';
    TLI.Data.save();
    TLI.Firebase.push();
    this.closeModal('editModelModal');
    this.showToast('Modele mis a jour !');
    this.renderCatalog();
  },

  deleteModel: function() {
    if (!confirm('Supprimer ce modele ?')) return;
    TLI.Data.models = TLI.Data.models.filter(function(m) { return m.id !== TLI.Data.currentModelId; });
    TLI.Data.save();
    TLI.Firebase.push();
    this.closeModal('editModelModal');
    this.showToast('Modele supprime', 'warning');
    this.renderCatalog();
  },

  saveStock: function() {
    try {
      TLI.Data.stock.push({
        id: TLI.Utils.generateId(),
        type: document.getElementById('stockType').value,
        name: document.getElementById('stockName').value || 'Sans nom',
        qty: parseFloat(document.getElementById('stockQty').value) || 0,
        unit: document.getElementById('stockUnit').value,
        alert: parseFloat(document.getElementById('stockAlert').value) || 1,
        supplier: document.getElementById('stockSupplier').value || ''
      });
      TLI.Data.save();
      TLI.Firebase.push();
      this.closeModal('newStockModal');
      this.showToast('Stock ajoute !');
      this.renderStock();
    } catch(e) { this.showToast('Erreur: ' + e.message, 'error'); }
  },

  updateStock: function() {
    var item = TLI.Data.stock.find(function(x) { return x.id === TLI.Data.currentStockId; });
    if (!item) return;
    item.type = document.getElementById('editStockType').value;
    item.name = document.getElementById('editStockName').value || item.name;
    item.qty = parseFloat(document.getElementById('editStockQty').value) || 0;
    item.unit = document.getElementById('editStockUnit').value;
    item.alert = parseFloat(document.getElementById('editStockAlert').value) || 1;
    item.supplier = document.getElementById('editStockSupplier').value || '';
    TLI.Data.save();
    TLI.Firebase.push();
    this.closeModal('editStockModal');
    this.showToast('Stock mis a jour !');
    this.renderStock();
  },

  deleteStock: function() {
    if (!confirm('Supprimer cet article ?')) return;
    TLI.Data.stock = TLI.Data.stock.filter(function(s) { return s.id !== TLI.Data.currentStockId; });
    TLI.Data.save();
    TLI.Firebase.push();
    this.closeModal('editStockModal');
    this.showToast('Stock supprime', 'warning');
    this.renderStock();
  },

  saveEvent: function() {
    try {
      var title = document.getElementById('planTitle').value.trim();
      var date = document.getElementById('planDate').value;
      if (!title || !date) { this.showToast('Titre et date obligatoires', 'warning'); return; }
      var eventData = {
        title: title,
        type: document.getElementById('planType').value,
        date: date,
        startTime: document.getElementById('planStartTime').value,
        endTime: document.getElementById('planEndTime').value,
        assignee: document.getElementById('planAssignee').value,
        priority: document.getElementById('planPriority').value,
        notes: document.getElementById('planNotes').value || '',
        reminder: document.getElementById('planReminder').checked,
        reminderMinutes: document.getElementById('planReminder').checked ? (parseInt(document.getElementById('planReminderMinutes').value) || 30) : null
      };
      if (eventData.type === 'rdv') {
        TLI.Data.pendingEventData = eventData;
        this.openModal('rdvClientModal');
        return;
      }
      this.createEvent(eventData);
    } catch(e) { this.showToast('Erreur: ' + e.message, 'error'); }
  },

  createEvent: function(eventData) {
    TLI.Data.planningEvents.push({
      id: TLI.Utils.generateId(),
      title: eventData.title,
      type: eventData.type,
      date: eventData.date,
      startTime: eventData.startTime,
      endTime: eventData.endTime,
      assignee: eventData.assignee,
      priority: eventData.priority,
      notes: eventData.notes,
      clientId: eventData.clientId || null,
      clientName: eventData.clientName || null,
      reminder: eventData.reminder || false,
      reminderMinutes: eventData.reminderMinutes || null
    });
    TLI.Data.save();
    TLI.Firebase.push();
    this.closeModal('planningModal');
    this.closeModal('rdvClientModal');
    this.showToast('Evenement ajoute !');
    this.renderPlanning();
    document.getElementById('planTitle').value = '';
    document.getElementById('planNotes').value = '';
    TLI.Data.pendingEventData = null;
  },

  openPlanningModal: function() {
    var pd = document.getElementById('planDate');
    if (TLI.Data.planningSelectedDayStr && pd) {
      pd.value = TLI.Data.planningSelectedDayStr;
    } else if (pd && !pd.value) {
      var now = new Date();
      pd.value = now.getFullYear() + '-' + String(now.getMonth()+1).padStart(2,'0') + '-' + String(now.getDate()).padStart(2,'0');
    }
    this.openModal('planningModal');
  },

  showRdvClientList: function() {
    var div = document.getElementById('rdvClientList');
    div.style.display = 'block';
    document.getElementById('btnRdvExisting').style.display = 'none';
    document.getElementById('btnRdvNew').style.display = 'none';
    document.getElementById('btnRdvSkip').style.display = 'none';
    div.innerHTML = '<div style="margin-bottom:10px;font-size:.85rem;color:#888">Selectionne un client :</div>';
    if (TLI.Data.clients.length === 0) {
      div.innerHTML += '<div style="color:#888;padding:10px">Aucun client</div>';
    } else {
      TLI.Data.clients.forEach(function(c) {
        var row = document.createElement('div');
        row.className = 'client-card'; row.style.marginBottom = '8px';
        row.innerHTML = '<div class="client-name">' + TLI.Utils.escapeHtml(c.name) + '</div><div class="client-info" style="font-size:.75rem">' + (c.company ? TLI.Utils.escapeHtml(c.company) + ' • ' : '') + (c.phone ? TLI.Utils.escapeHtml(c.phone) : '') + '</div>';
        row.addEventListener('click', function() {
          TLI.Data.pendingEventData.clientId = c.id;
          TLI.Data.pendingEventData.clientName = c.name;
          TLI.UI.createEvent(TLI.Data.pendingEventData);
        });
        div.appendChild(row);
      });
    }
    var backBtn = document.createElement('button');
    backBtn.className = 'btn btn-secondary'; backBtn.style.marginTop = '10px';
    backBtn.textContent = '◀ Retour';
    backBtn.addEventListener('click', function() {
      div.style.display = 'none';
      document.getElementById('btnRdvExisting').style.display = 'flex';
      document.getElementById('btnRdvNew').style.display = 'flex';
      document.getElementById('btnRdvSkip').style.display = 'flex';
    });
    div.appendChild(backBtn);
  },

  newRdvClient: function() {
    this.closeModal('rdvClientModal');
    this.openModal('newClientModal');
  },

  skipRdvClient: function() {
    TLI.Data.pendingEventData.clientId = null;
    TLI.Data.pendingEventData.clientName = null;
    this.createEvent(TLI.Data.pendingEventData);
  },

  openEditEvent: function(id) {
    TLI.Data.currentEventId = id;
    var e = TLI.Data.planningEvents.find(function(x) { return x.id === id; });
    if (!e) return;
    document.getElementById('editPlanTitle').value = e.title || '';
    document.getElementById('editPlanType').value = e.type || 'printing';
    document.getElementById('editPlanDate').value = e.date || '';
    document.getElementById('editPlanStartTime').value = e.startTime || '09:00';
    document.getElementById('editPlanEndTime').value = e.endTime || '12:00';
    document.getElementById('editPlanAssignee').value = e.assignee || 'florian';
    document.getElementById('editPlanPriority').value = e.priority || 'medium';
    document.getElementById('editPlanNotes').value = e.notes || '';
    document.getElementById('editPlanReminder').checked = e.reminder || false;
    document.getElementById('editPlanReminderMinutesGroup').style.display = (e.reminder || false) ? 'block' : 'none';
    document.getElementById('editPlanReminderMinutes').value = e.reminderMinutes || 30;
    this.openModal('editPlanningModal');
  },

  updateEvent: function() {
    var e = TLI.Data.planningEvents.find(function(x) { return x.id === TLI.Data.currentEventId; });
    if (!e) return;
    e.title = document.getElementById('editPlanTitle').value || e.title;
    e.type = document.getElementById('editPlanType').value;
    e.date = document.getElementById('editPlanDate').value;
    e.startTime = document.getElementById('editPlanStartTime').value;
    e.endTime = document.getElementById('editPlanEndTime').value;
    e.assignee = document.getElementById('editPlanAssignee').value;
    e.priority = document.getElementById('editPlanPriority').value;
    e.notes = document.getElementById('editPlanNotes').value || '';
    TLI.Data.save();
    TLI.Firebase.push();
    this.closeModal('editPlanningModal');
    this.showToast('Evenement mis a jour !');
    this.renderPlanning();
  },

  deleteEvent: function() {
    if (!confirm('Supprimer cet evenement ?')) return;
    TLI.Data.planningEvents = TLI.Data.planningEvents.filter(function(e) { return e.id !== TLI.Data.currentEventId; });
    TLI.Data.save();
    TLI.Firebase.push();
    this.closeModal('editPlanningModal');
    this.showToast('Evenement supprime', 'warning');
    this.renderPlanning();
  },

  deleteEventDirect: function(id) {
    if (!confirm('Supprimer cet evenement ?')) return;
    TLI.Data.planningEvents = TLI.Data.planningEvents.filter(function(e) { return e.id !== id; });
    TLI.Data.save();
    TLI.Firebase.push();
    this.showToast('Evenement supprime', 'warning');
    this.renderPlanning();
  },

  changePlanningMonth: function(delta) {
    TLI.Data.planningCurrentDate.setMonth(TLI.Data.planningCurrentDate.getMonth() + delta);
    TLI.Data.planningSelectedDay = null;
    TLI.Data.planningSelectedDayStr = null;
    this.renderPlanning();
  },

  saveNewMachine: function() {
    var name = document.getElementById('newMachineName').value.trim();
    var type = document.getElementById('newMachineType').value;
    if (!name) { this.showToast('Nom obligatoire', 'warning'); return; }
    var maxId = 0;
    TLI.Data.machines.forEach(function(m) { if (m.id > maxId) maxId = m.id; });
    TLI.Data.machines.push({id: maxId + 1, name: name, type: type, totalHours: 0, maintenance: []});
    TLI.Data.save();
    TLI.Firebase.push();
    this.closeModal('addMachineModal');
    this.showToast('Machine ajoute !');
    document.getElementById('newMachineName').value = '';
    this.renderMachines();
    this.updateMachineSelects();
  },

  updateMachineInfo: function() {
    var machine = TLI.Data.getMachine(TLI.Data.currentMachineId);
    if (!machine) return;
    machine.name = document.getElementById('editMachineInfoName').value || machine.name;
    machine.type = document.getElementById('editMachineInfoType').value;
    TLI.Data.save();
    TLI.Firebase.push();
    this.closeModal('editMachineInfoModal');
    this.showToast('Machine mise a jour !');
    this.renderMachines();
    this.updateMachineSelects();
  },

  deleteMachineInfo: function() {
    if (!confirm('Supprimer cette machine ?')) return;
    var inUse = TLI.Data.orders.some(function(o) { return o.machineId === TLI.Data.currentMachineId && o.status === 'printing'; }) ||
                TLI.Data.activeTimers.some(function(t) { return t.machineId === TLI.Data.currentMachineId && !t.finished; });
    if (inUse) { this.showToast('Impossible : machine en cours', 'error'); return; }
    TLI.Data.machines = TLI.Data.machines.filter(function(m) { return m.id !== TLI.Data.currentMachineId; });
    TLI.Data.save();
    TLI.Firebase.push();
    this.closeModal('editMachineInfoModal');
    this.closeModal('machineDetailModal');
    this.showToast('Machine supprimee', 'warning');
    this.renderMachines();
    this.updateMachineSelects();
  },

  openMachineDetail: function(id) {
    TLI.Data.currentMachineId = id;
    var machine = TLI.Data.getMachine(id);
    if (!machine) return;
    document.getElementById('machineDetailTitle').textContent = machine.name;
    var busy = TLI.Data.isMachineBusy(machine.id);
    var statusText = busy ? '🔴 Indisponible (en cours)' : '🟢 Disponible';
    var hours = machine.totalHours || 0;
    document.getElementById('machineDetailContent').innerHTML = 
      '<div style="margin-bottom:12px"><div style="font-size:.8rem;color:#888">Statut</div><div style="font-weight:700">' + statusText + '</div></div>' +
      '<div style="margin-bottom:12px"><div style="font-size:.8rem;color:#888">Type</div><div>' + (machine.type === 'fdm' ? 'FDM' : 'Resine') + '</div></div>' +
      '<div style="margin-bottom:12px"><div style="font-size:.8rem;color:#888">Heures cumulees</div><div style="font-size:1.4rem;font-weight:800;color:var(--primary)">' + hours.toFixed(1) + 'h</div></div>' +
      '<div class="btn-row"><button class="btn btn-secondary" id="btnEditMachineInfo" style="flex:1">✏️ Modifier</button></div>';
    document.getElementById('btnEditMachineInfo').addEventListener('click', function() {
      document.getElementById('editMachineInfoName').value = machine.name || '';
      document.getElementById('editMachineInfoType').value = machine.type || 'fdm';
      TLI.UI.openModal('editMachineInfoModal');
    });
    this.renderMachineMaintenance(machine);
    this.openModal('machineDetailModal');
  },

  renderMachineMaintenance: function(machine) {
    var div = document.getElementById('machineMaintList');
    if (!div) return;
    div.innerHTML = '';
    if (!machine.maintenance || machine.maintenance.length === 0) { div.innerHTML = '<div style="color:#888;font-size:.85rem">Aucun entretien</div>'; return; }
    var sorted = machine.maintenance.slice().sort(function(a, b) { return new Date(b.date) - new Date(a.date); });
    var typeLabels = {cleaning: 'Nettoyage', nozzle: 'Changement buse', belt: 'Tension courroies', bed: 'Nivellement plateau', firmware: 'Mise a jour', filter: 'Filtre', other: 'Autre'};
    sorted.forEach(function(m) {
      var item = document.createElement('div');
      item.className = 'maintenance-item';
      item.innerHTML = '<div class="maintenance-item-header"><span class="maintenance-item-title">' + (typeLabels[m.type] || m.type) + '</span><span class="maintenance-item-date">' + TLI.Utils.formatDate(m.date) + '</span></div>' + (m.hours ? '<div style="font-size:.75rem;color:#888">A ' + m.hours + 'h</div>' : '') + (m.notes ? '<div class="maintenance-item-notes">' + TLI.Utils.escapeHtml(m.notes) + '</div>' : '');
      div.appendChild(item);
    });
  },

  saveMaintenance: function() {
    var machine = TLI.Data.getMachine(TLI.Data.currentMachineId);
    if (!machine) return;
    if (!machine.maintenance) machine.maintenance = [];
    machine.maintenance.push({
      id: TLI.Utils.generateId(),
      type: document.getElementById('maintType').value,
      date: document.getElementById('maintDate').value,
      hours: document.getElementById('maintHours').value || '',
      notes: document.getElementById('maintNotes').value || ''
    });
    TLI.Data.save();
    TLI.Firebase.push();
    this.showToast('Entretien ajoute !');
    document.getElementById('maintHours').value = '';
    document.getElementById('maintNotes').value = '';
    this.renderMachineMaintenance(machine);
    this.renderMachines();
  },

  setMaintDate: function() {
    var md = document.getElementById('maintDate');
    if (md && !md.value) {
      var now = new Date();
      md.value = now.getFullYear() + '-' + String(now.getMonth()+1).padStart(2,'0') + '-' + String(now.getDate()).padStart(2,'0');
    }
  },

  setPlanningDate: function() {
    var pd = document.getElementById('planDate');
    if (TLI.Data.planningSelectedDayStr && pd) {
      pd.value = TLI.Data.planningSelectedDayStr;
    } else if (pd && !pd.value) {
      var now = new Date();
      pd.value = now.getFullYear() + '-' + String(now.getMonth()+1).padStart(2,'0') + '-' + String(now.getDate()).padStart(2,'0');
    }
  },

  updateClientSelect: function() {
    var sel = document.getElementById('orderClient');
    if (!sel) return;
    sel.innerHTML = TLI.Data.clients.map(function(c) { return '<option value="' + c.id + '">' + TLI.Utils.escapeHtml(c.name) + '</option>'; }).join('');
  },

  updateMachineSelects: function() {
    var ids = ['timerMachine', 'orderMachine'];
    ids.forEach(function(id) {
      var sel = document.getElementById(id);
      if (!sel) return;
      sel.innerHTML = TLI.Data.machines.map(function(m) { return '<option value="' + m.id + '">' + TLI.Utils.escapeHtml(m.name) + '</option>'; }).join('');
    });
  },

  toggleOrderFields: function() {
    var service = document.getElementById('orderService').value;
    var printGroup = document.getElementById('printTypeGroup');
    var machineGroup = document.getElementById('machineGroup');
    if (printGroup) printGroup.style.display = service === 'print' ? 'block' : 'none';
    if (machineGroup) machineGroup.style.display = service === 'print' ? 'block' : 'none';
  },

  // --- QUALITY ---
  showQualityOverlay: function(orderId, orderName) {
    TLI.Data.qualityOrderId = orderId;
    document.getElementById('qualityOrderName').textContent = orderName || 'Commande';
    if (!TLI.Data.qualityResults[orderId]) {
      TLI.Data.qualityResults[orderId] = TLI.Data.checklist.map(function(c) { return {id: c.id, text: c.text, checked: false}; });
    }
    this.renderQualityChecklist();
    this.updateQualityProgress();
    document.getElementById('qualityOverlay').classList.add('active');
  },

  renderQualityChecklist: function() {
    var div = document.getElementById('qualityChecklist');
    if (!div || !TLI.Data.qualityOrderId || !TLI.Data.qualityResults[TLI.Data.qualityOrderId]) return;
    div.innerHTML = '';
    TLI.Data.qualityResults[TLI.Data.qualityOrderId].forEach(function(item, idx) {
      var row = document.createElement('div');
      row.className = 'checklist-item';
      row.innerHTML = '<input type="checkbox" id="quality_' + idx + '" ' + (item.checked ? 'checked' : '') + '><label for="quality_' + idx + '">' + TLI.Utils.escapeHtml(item.text) + '</label>';
      row.querySelector('input').addEventListener('change', function() { TLI.UI.toggleQualityCheck(idx); });
      div.appendChild(row);
    });
  },

  toggleQualityCheck: function(idx) {
    if (!TLI.Data.qualityResults[TLI.Data.qualityOrderId]) return;
    TLI.Data.qualityResults[TLI.Data.qualityOrderId][idx].checked = !TLI.Data.qualityResults[TLI.Data.qualityOrderId][idx].checked;
    TLI.Data.save();
    this.updateQualityProgress();
    this.renderQualityChecklist();
  },

  updateQualityProgress: function() {
    if (!TLI.Data.qualityResults[TLI.Data.qualityOrderId]) return;
    var checked = TLI.Data.qualityResults[TLI.Data.qualityOrderId].filter(function(i) { return i.checked; }).length;
    var total = TLI.Data.qualityResults[TLI.Data.qualityOrderId].length;
    var pct = total > 0 ? Math.round((checked / total) * 100) : 0;
    document.getElementById('qualityProgress').style.width = pct + '%';
    document.getElementById('qualityPercent').textContent = pct + '% complete';
    document.getElementById('qualityValidateBtn').disabled = pct < 100;
  },

  // --- CONFIG ---
  saveRates: function() {
    TLI.Data.rates.modeling = parseFloat(document.getElementById('rateModeling').value) || 35;
    TLI.Data.rates.design = parseFloat(document.getElementById('rateDesign').value) || 45;
    TLI.Data.rates.fdm = parseFloat(document.getElementById('rateFdm').value) || 2;
    TLI.Data.rates.resin = parseFloat(document.getElementById('rateResin').value) || 3;
    TLI.Data.rates.postProd = parseFloat(document.getElementById('ratePostProd').value) || 15;
    TLI.Data.rates.filamentKg = parseFloat(document.getElementById('priceFilament').value) || 25;
    TLI.Data.rates.resinKg = parseFloat(document.getElementById('priceResinKg').value) || 60;
    TLI.Data.saveRates();
    this.showToast('Tarifs sauvegardes !');
    TLI.Calc.update();
  },

  saveConfig: function() {
    var el = document.getElementById('apiUrl');
    localStorage.setItem('tli15_apiUrl', el ? (el.value || '').trim() : '');
    this.showToast('Config sauvegardee');
  },

  testConnection: function() {
    if (!TLI.Data.isOnline || !TLI.Data.currentUserId) { this.showToast('Firebase non connecte', 'error'); return; }
    this.showToast('Connexion Firebase OK !', 'success');
  },

  exportData: function() {
    var blob = new Blob([JSON.stringify({
      data: { orders: TLI.Data.orders, clients: TLI.Data.clients, models: TLI.Data.models, stock: TLI.Data.stock, planningEvents: TLI.Data.planningEvents, machines: TLI.Data.machines, qualityResults: TLI.Data.qualityResults, generalPhotos: TLI.Data.generalPhotos },
      timers: { active: TLI.Data.activeTimers, finished: TLI.Data.finishedTimers },
      rates: TLI.Data.rates,
      exportDate: new Date().toISOString()
    }, null, 2)], {type: 'application/json'});
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'TLI_backup_' + new Date().toISOString().slice(0, 10) + '.json';
    a.click();
    URL.revokeObjectURL(url);
    this.showToast('Export reussi !');
  },

  importData: function(input) {
    var file = input.files[0];
    if (!file) return;
    var reader = new FileReader();
    var self = this;
    reader.onload = function(e) {
      try {
        var imported = JSON.parse(e.target.result);
        if (imported.data) {
          if (imported.data.orders) TLI.Data.orders = imported.data.orders;
          if (imported.data.clients) TLI.Data.clients = imported.data.clients;
          if (imported.data.models) TLI.Data.models = imported.data.models;
          if (imported.data.stock) TLI.Data.stock = imported.data.stock;
          if (imported.data.planningEvents) TLI.Data.planningEvents = imported.data.planningEvents;
          if (imported.data.machines) TLI.Data.machines = imported.data.machines;
          if (imported.data.qualityResults) TLI.Data.qualityResults = imported.data.qualityResults;
          if (imported.data.generalPhotos) TLI.Data.generalPhotos = imported.data.generalPhotos;
        }
        if (imported.timers) { TLI.Data.activeTimers = imported.timers.active || []; TLI.Data.finishedTimers = imported.timers.finished || []; }
        if (imported.rates) TLI.Data.rates = imported.rates;
        TLI.Data.save(); TLI.Data.saveTimers(); TLI.Data.saveRates();
        self.renderAll(); TLI.Calc.update();
        self.showToast('Import reussi !', 'success');
      } catch(err) { self.showToast('Erreur import', 'error'); }
    };
    reader.readAsText(file);
    input.value = '';
  },

  clearAll: function() {
    if (!confirm('Tout supprimer ? Irreversible.')) return;
    TLI.Data.orders = [];
    TLI.Data.clients = [{id: 1, name: 'Client Test', company: '', role: '', phone: '', email: ''}];
    TLI.Data.models = [];
    TLI.Data.stock = [];
    TLI.Data.planningEvents = [];
    TLI.Data.qualityResults = {};
    TLI.Data.generalPhotos = [];
    TLI.Data.machines = [
      {id: 1, name: 'Elegoo Saturn 4 Ultra', type: 'resin', totalHours: 0, maintenance: []},
      {id: 2, name: 'Bambulab P2S #1', type: 'fdm', totalHours: 0, maintenance: []},
      {id: 3, name: 'Bambulab P2S #2', type: 'fdm', totalHours: 0, maintenance: []},
      {id: 4, name: 'Bambulab H2C', type: 'fdm', totalHours: 0, maintenance: []}
    ];
    TLI.Data.activeTimers = [];
    TLI.Data.finishedTimers = [];
    TLI.Data.save(); TLI.Data.saveTimers();
    this.showToast('Tout efface');
    this.renderAll();
  }
};

// ============================================================
// MODULE: Calculator
// ============================================================
TLI.Calc = {
  update: function() {
    var service = document.getElementById('calcService').value;
    var type = document.getElementById('calcType').value;
    var weight = parseFloat(document.getElementById('calcWeight').value) || 0;
    var printHours = parseFloat(document.getElementById('calcPrintHours').value) || 0;
    var modelingHours = parseFloat(document.getElementById('calcModelingHours').value) || 0;
    var designHours = parseFloat(document.getElementById('calcDesignHours').value) || 0;
    var postProdHours = parseFloat(document.getElementById('calcPostProdHours').value) || 0;
    var qty = parseInt(document.getElementById('calcQty').value) || 1;

    TLI.Data.rates.modeling = parseFloat(document.getElementById('rateModeling').value) || 35;
    TLI.Data.rates.design = parseFloat(document.getElementById('rateDesign').value) || 45;
    TLI.Data.rates.fdm = parseFloat(document.getElementById('rateFdm').value) || 2;
    TLI.Data.rates.resin = parseFloat(document.getElementById('rateResin').value) || 3;
    TLI.Data.rates.postProd = parseFloat(document.getElementById('ratePostProd').value) || 15;
    TLI.Data.rates.filamentKg = parseFloat(document.getElementById('priceFilament').value) || 25;
    TLI.Data.rates.resinKg = parseFloat(document.getElementById('priceResinKg').value) || 60;

    var materialCost = 0;
    var printRate = type === 'fdm' ? TLI.Data.rates.fdm : TLI.Data.rates.resin;
    var matPrice = type === 'fdm' ? TLI.Data.rates.filamentKg : TLI.Data.rates.resinKg;
    materialCost = (weight / 1000) * matPrice;

    var total = 0;
    if (service === 'print') total = (materialCost + (printHours * printRate) + (postProdHours * TLI.Data.rates.postProd)) * qty;
    else if (service === 'modeling') total = (modelingHours * TLI.Data.rates.modeling) * qty;
    else if (service === 'design') total = (designHours * TLI.Data.rates.design) * qty;

    document.getElementById('calcTotal').textContent = total.toFixed(2) + '€';
  }
};

// ============================================================
// MODULE: Timer
// ============================================================
TLI.Timer = {
  start: function() {
    var name = document.getElementById('timerName').value.trim();
    var machineId = parseInt(document.getElementById('timerMachine').value);
    var hours = parseFloat(document.getElementById('timerHours').value) || 0;
    var minutes = parseFloat(document.getElementById('timerMinutes').value) || 0;
    if (!name || !machineId) { TLI.UI.showToast('Remplis tous les champs', 'warning'); return; }
    var machine = TLI.Data.getMachine(machineId);
    if (!machine) return;
    if (TLI.Data.isMachineBusy(machineId)) { TLI.UI.showToast('Machine deja en cours', 'warning'); return; }
    var duration = (hours * 60 + minutes) * 60 * 1000;
    TLI.Data.activeTimers.push({
      id: TLI.Utils.generateId(), name: name, machineId: machineId, machineName: machine.name,
      duration: duration, endTime: Date.now() + duration, startTime: Date.now(), finished: false
    });
    TLI.Data.saveTimers();
    TLI.Firebase.pushTimers();
    TLI.UI.showToast('Timer demarre !');
    document.getElementById('timerName').value = '';
    TLI.UI.renderTimers();
    TLI.UI.renderMachines();
    TLI.UI.showSection('timer');
  },

  stop: function(id) {
    if (!confirm('Arreter ce timer ?')) return;
    for (var i = 0; i < TLI.Data.activeTimers.length; i++) {
      if (TLI.Data.activeTimers[i].id === id) {
        TLI.Data.activeTimers[i].finished = true;
        TLI.Data.activeTimers[i].endTime = Date.now();
        TLI.Data.finishedTimers.push(TLI.Data.activeTimers[i]);
        TLI.Data.saveTimers();
        TLI.Firebase.pushTimers();
        TLI.UI.showToast('Timer arrete', 'warning');
        TLI.UI.renderTimers();
        TLI.UI.renderMachines();
        return;
      }
    }
  },

  deleteFinished: function(id) {
    if (!confirm('Supprimer ce timer ?')) return;
    TLI.Data.finishedTimers = TLI.Data.finishedTimers.filter(function(t) { return t.id !== id; });
    TLI.Data.saveTimers();
    TLI.Firebase.pushTimers();
    TLI.UI.showToast('Timer supprime', 'warning');
    TLI.UI.renderTimers();
  },

  loop: function() {
    var self = this;
    setInterval(function() {
      var changed = false;
      for (var i = 0; i < TLI.Data.activeTimers.length; i++) {
        var t = TLI.Data.activeTimers[i];
        if (!t.finished && Date.now() >= t.endTime) {
          t.finished = true;
          TLI.Data.finishedTimers.push(t);
          changed = true;
          TLI.UI.showToast('Impression terminee: ' + t.name, 'success');
          if (document.getElementById('notifSound').checked) self.playSound();
          if (document.getElementById('notifVibrate').checked && navigator.vibrate) navigator.vibrate([200, 100, 200, 100, 200]);
          TLI.Notifs.send('⏰ Timer termine', 'Impression "' + t.name + '" terminee !');
        }
      }
      TLI.Data.activeTimers = TLI.Data.activeTimers.filter(function(t) { return !t.finished; });
      if (changed) { TLI.Data.saveTimers(); TLI.Firebase.pushTimers(); TLI.UI.renderTimers(); TLI.UI.renderStats(); TLI.UI.renderMachines(); }

      for (var i = 0; i < TLI.Data.activeTimers.length; i++) {
        var t = TLI.Data.activeTimers[i];
        var remaining = Math.max(0, t.endTime - Date.now());
        var pct = t.duration > 0 ? Math.min(100, ((t.duration - remaining) / t.duration) * 100) : 100;
        var elText = document.getElementById('timer_' + t.id);
        var elBar = document.getElementById('timerBar_' + t.id);
        if (elText) elText.textContent = TLI.Utils.formatTimer(remaining);
        if (elBar) elBar.style.width = pct + '%';
      }
    }, 1000);
  },

  playSound: function() {
    try {
      var ctx = new (window.AudioContext || window.webkitAudioContext)();
      [600, 800, 1000].forEach(function(freq, i) {
        setTimeout(function() {
          var osc = ctx.createOscillator();
          var gain = ctx.createGain();
          osc.connect(gain); gain.connect(ctx.destination);
          osc.frequency.value = freq; osc.type = 'sine';
          gain.gain.setValueAtTime(0.3, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
          osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.4);
        }, i * 150);
      });
    } catch(e) {}
  }
};

// ============================================================
// MODULE: App (Orchestration)
// ============================================================
TLI.App = {
  init: function() {
    console.log('[TLI.App] Initializing v15...');
    TLI.Data.load();
    TLI.UI.init();
    TLI.Photos.init();
    TLI.Timer.loop();

    // Reminder loop
    setInterval(function() { TLI.Notifs.checkReminders(); }, 30000);

    // SW reload hook
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', function(event) {
        if (event.data && event.data.type === 'SW_RELOAD') {
          console.log('[TLI.App] Reload forced by SW v' + event.data.version);
          window.location.reload();
        }
      });
    }

    // Load rates into inputs
    document.getElementById('rateModeling').value = TLI.Data.rates.modeling;
    document.getElementById('rateDesign').value = TLI.Data.rates.design;
    document.getElementById('rateFdm').value = TLI.Data.rates.fdm;
    document.getElementById('rateResin').value = TLI.Data.rates.resin;
    document.getElementById('ratePostProd').value = TLI.Data.rates.postProd;
    document.getElementById('priceFilament').value = TLI.Data.rates.filamentKg;
    document.getElementById('priceResinKg').value = TLI.Data.rates.resinKg;

    console.log('[TLI.App] Initialized successfully');
  }
};

// ============================================================
// DEMARRAGE
// ============================================================
document.addEventListener('DOMContentLoaded', function() {
  TLI.App.init();
});
