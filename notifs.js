// ============================================================
// TLI v16 - MODULE: Data
// Gestion des donnees locales (localStorage) et sync serveur
// ============================================================
var TLI = window.TLI || {};

TLI.Data = {
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
  activeTimers: [],
  finishedTimers: [],
  rates: {
    modeling: 35, design: 45, fdm: 2, resin: 3,
    postProd: 15, filamentKg: 25, resinKg: 60
  },
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
  currentUserId: null,
  currentUserEmail: null,
  isOnline: false,
  syncInProgress: false,
  checkedReminders: {},
  qualityOrderId: null,
  tempQualityPhoto: null,
  callNumber: "",

  offlineMode: false,

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
    // Pousser vers le serveur pour toutes les donnees modifiees
    if (typeof TLI !== 'undefined' && TLI.Server) {
      TLI.Server.push('orders');
      TLI.Server.push('clients');
      TLI.Server.push('models');
      TLI.Server.push('stock');
      TLI.Server.push('planning');
      TLI.Server.push('machines');
      TLI.Server.push('photos');
    }
  },

  /**
   * Sauvegarde locale ET pousse toutes les donnees vers le serveur.
   * @param {Array} types - Types de donnees a synchroniser (optionnel)
   */
  triggerSync: function(types) {
    this.save();
    if (typeof TLI !== 'undefined' && TLI.Server) {
      types = types || ['orders', 'clients', 'models', 'stock', 'planning', 'machines', 'photos', 'rates'];
      types.forEach(function(t) { TLI.Server.push(t); });
    }
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
    if (!order) return false;
    if (!order.photos) order.photos = [];
    order.photos.push(photoData);
    this.save();
    return true;
  },

  addGeneralPhoto: function(photoData) {
    this.generalPhotos.push({
      id: TLI.Utils.generateId(),
      src: photoData,
      date: new Date().toISOString()
    });
    this.save();
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
