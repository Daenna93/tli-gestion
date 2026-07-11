// ============================================================
// TLI v16 - MODULE: Server
// Communication WebSocket avec le serveur prive
// ============================================================
var TLI = window.TLI || {};

TLI.Server = {
  socket: null,
  serverUrl: 'http://192.168.1.153:3000',
  reconnectAttempts: 0,
  maxReconnectAttempts: 10,
  isConnected: false,

  init: function() {
    console.log('[TLI.Server] Initialisation...');
    if (typeof io === 'undefined') {
      console.warn('[TLI.Server] Socket.io non charge, mode offline');
      TLI.UI.updateSyncStatus('offline');
      return;
    }
    this.connect();
  },

  isAuthenticated: function() {
    return this.isConnected && this.socket && this.socket.authenticated;
  },

  connect: function() {
    var self = this;
    try {
      this.socket = io(this.serverUrl, {
        transports: ['websocket', 'polling'],
        timeout: 20000,
        reconnection: true,
        reconnectionAttempts: this.maxReconnectAttempts,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000
      });

      this.socket.on('connect', function() {
        console.log('[TLI.Server] Connecte ! ID :', self.socket.id);
        self.isConnected = true;
        self.reconnectAttempts = 0;
        TLI.UI.updateSyncStatus('synced');
        // Si on etait en mode offline, forcer la deconnexion immediatement
        if (TLI.Data.offlineMode) {
          console.log('[TLI.Server] Deconnexion forcee (mode offline)');
          self.socket.disconnect();
          self.isConnected = false;
          TLI.UI.updateSyncStatus('offline');
          return;
        }
        // Ne pas spammer le toast si reconnexion rapide
        var now = Date.now();
        if (!self.lastConnectToast || (now - self.lastConnectToast > 10000)) {
          TLI.UI.showToast('Connecte au serveur', 'success');
          self.lastConnectToast = now;
        }
        // Ne pas auto-auth ici, attendre que l'utilisateur se connecte manuellement
        // Demander les donnees prospects au serveur
        TLI.Server.requestProspects();
      });

      this.socket.on('init-data', function(data) {
        console.log('[TLI.Server] Donnees initiales recues');
        // Sauvegarder les photos locales avant fusion
        var localPhotos = {};
        TLI.Data.orders.forEach(function(o) { if (o.photos && o.photos.length) localPhotos[o.id] = o.photos; });
        var localGeneralPhotos = TLI.Data.generalPhotos.slice();

        TLI.Data.orders = data.orders || [];
        TLI.Data.clients = data.clients || TLI.Data.clients;
        TLI.Data.models = data.models || [];
        TLI.Data.stock = data.stock || [];
        TLI.Data.planningEvents = data.planningEvents || [];
        if (data.machines && data.machines.length > 0) TLI.Data.machines = data.machines;
        TLI.Data.generalPhotos = data.generalPhotos || [];
        TLI.Data.qualityResults = data.qualityResults || {};
        if (data.rates) TLI.Data.rates = data.rates;

        // Fusion : restaurer les photos locales si le serveur n'en a pas
        TLI.Data.orders.forEach(function(o) {
          if (localPhotos[o.id] && (!o.photos || o.photos.length === 0)) {
            o.photos = localPhotos[o.id];
          }
        });
        // Fusion photos generales
        var existingIds = new Set(TLI.Data.generalPhotos.map(function(p) { return p.id; }));
        localGeneralPhotos.forEach(function(p) {
          if (!existingIds.has(p.id)) TLI.Data.generalPhotos.push(p);
        });

        // Fusion des donnees prospects si presentes
        if (data.prospects) {
          console.log('[TLI.Server] Fusion prospects depuis init-data');
          TLI.Prospection.setProspectsState(data.prospects);
        }

        TLI.Data.save();
        TLI.UI.renderAll();
        TLI.Calc.update();
      });

      this.socket.on('auth-ok', function(data) {
        console.log('[TLI.Server] Authentification OK :', data.email);
        self.socket.authenticated = true;
        TLI.Data.currentUserEmail = data.email;
        TLI.UI.updateAuthDisplay();
        TLI.UI.closeModal('authModal');
        TLI.UI.showToast('Authentifie : ' + data.email, 'success');
      });

      this.socket.on('auth-error', function(msg) {
        console.error('[TLI.Server] Auth error :', msg);
        var errorDiv = document.getElementById('authError');
        if (errorDiv) {
          errorDiv.textContent = msg;
          errorDiv.style.display = 'block';
        }
        TLI.UI.showToast('Auth : ' + msg, 'error');
      });

      this.socket.on('new-photo', function(payload) {
        console.log('[TLI.Server] Nouvelle photo recue');
        if (payload.targetType === 'gallery') {
          TLI.Data.generalPhotos.push({
            id: payload.id || TLI.Utils.generateId(),
            src: payload.photoData,
            date: payload.date || new Date().toISOString()
          });
          TLI.Data.save();
          TLI.UI.renderPhotos();
        } else if (payload.targetType === 'order' && payload.targetId) {
          var order = TLI.Data.getOrder(payload.targetId);
          if (order) {
            if (!order.photos) order.photos = [];
            order.photos.push(payload.photoData);
            TLI.Data.save();
            if (TLI.Data.currentOrderId === payload.targetId) {
              TLI.UI.renderOrderPhotos(payload.targetId);
            }
          }
        }
        TLI.UI.showToast('Photo synchronisee', 'success');
      });

      this.socket.on('prospects-data', function(data) {
        console.log('[TLI.Server] Donnees prospects recues');
        TLI.Prospection.setProspectsState(data);
        TLI.Data.save();
      });

      this.socket.on('data-update', function(payload) {
        if (TLI.Data.offlineMode) {
          console.log('[TLI.Server] Ignore (mode offline) :', payload.type);
          return;
        }
        console.log('[TLI.Server] Mise a jour recue :', payload.type);
        if (payload.type === 'orders') {
          // Fusion : conserver les photos locales si le serveur n'en a pas
          var localPhotos = {};
          TLI.Data.orders.forEach(function(o) { if (o.photos && o.photos.length) localPhotos[o.id] = o.photos; });
          TLI.Data.orders = payload.data;
          TLI.Data.orders.forEach(function(o) {
            if (localPhotos[o.id] && (!o.photos || o.photos.length === 0)) o.photos = localPhotos[o.id];
          });
          TLI.UI.renderOrders(); TLI.UI.renderStats();
        }
        if (payload.type === 'clients') { TLI.Data.clients = payload.data; TLI.UI.renderClients(); }
        if (payload.type === 'models') { TLI.Data.models = payload.data; TLI.UI.renderCatalog(); }
        if (payload.type === 'stock') { TLI.Data.stock = payload.data; TLI.UI.renderStock(); }
        if (payload.type === 'planning') { TLI.Data.planningEvents = payload.data; TLI.UI.renderPlanning(); }
        if (payload.type === 'machines') { TLI.Data.machines = payload.data; TLI.UI.renderMachines(); }
        if (payload.type === 'photos') {
          // Fusion : conserver les photos locales absentes du serveur
          var localPhotoIds = new Set(TLI.Data.generalPhotos.map(function(p) { return p.id; }));
          var serverPhotos = payload.data || [];
          serverPhotos.forEach(function(p) {
            if (!localPhotoIds.has(p.id)) {
              TLI.Data.generalPhotos.push(p);
              localPhotoIds.add(p.id);
            }
          });
          TLI.UI.renderPhotos();
        }
        if (payload.type === 'quality') { TLI.Data.qualityResults = payload.data; }
        if (payload.type === 'rates') { TLI.Data.rates = payload.data; TLI.Calc.update(); }
        TLI.Data.save();
        if (payload.userId !== (TLI.Data.currentUserEmail || 'unknown')) {
          TLI.UI.showToast('Synchro : ' + (payload.userName || 'Utilisateur') + ' a modifie ' + payload.type, 'success');
        }
      });

      this.socket.on('disconnect', function(reason) {
        console.log('[TLI.Server] Deconnecte :', reason);
        self.isConnected = false;
        TLI.UI.updateSyncStatus('offline');
      });

      this.socket.on('connect_error', function(err) {
        console.error('[TLI.Server] Erreur connexion :', err.message);
        self.reconnectAttempts++;
        TLI.UI.updateSyncStatus('error');
      });
    } catch(e) {
      console.error('[TLI.Server] Exception connexion:', e);
      TLI.UI.updateSyncStatus('offline');
    }
  },

  push: function(type) {
    if (TLI.Data.offlineMode) {
      TLI.Data.save();
      return;
    }
    if (!this.socket || !this.isConnected) {
      TLI.Data.save();
      return;
    }
    var data;
    if (type === 'orders') data = TLI.Data.orders;
    if (type === 'clients') data = TLI.Data.clients;
    if (type === 'models') data = TLI.Data.models;
    if (type === 'stock') data = TLI.Data.stock;
    if (type === 'planning') data = TLI.Data.planningEvents;
    if (type === 'machines') data = TLI.Data.machines;
    if (type === 'photos') data = TLI.Data.generalPhotos;
    if (type === 'quality') data = TLI.Data.qualityResults;
    if (type === 'rates') data = TLI.Data.rates;
    if (type === 'timers') data = { active: TLI.Data.activeTimers, finished: TLI.Data.finishedTimers };
    this.socket.emit('update', { type: type, data: data, userId: TLI.Data.currentUserEmail || 'unknown' });
  },

  uploadPhoto: function(photoData, targetType, targetId) {
    if (TLI.Data.offlineMode) {
      TLI.Data.save();
      return;
    }
    if (!this.socket || !this.isConnected) {
      TLI.Data.save();
      return;
    }
    this.socket.emit('upload-photo', {
      photoData: photoData,
      targetType: targetType || 'gallery',
      targetId: targetId || null,
      userId: TLI.Data.currentUserEmail || 'unknown'
    });
  },

  pushTimers: function() { this.push('timers'); },

  goOffline: function() {
    TLI.Data.offlineMode = true;
    if (this.socket) {
      this.socket.disconnect();
      this.isConnected = false;
    }
    TLI.UI.updateSyncStatus('offline');
    TLI.UI.closeModal('authModal');
    TLI.UI.showToast('Mode hors-ligne active', 'warning');
    console.log('[TLI.Server] Mode hors-ligne');
  },

  disconnect: function() {
    if (this.socket) {
      this.socket.disconnect();
      this.isConnected = false;
    }
  },

  sync: function() {
    if (!this.isConnected) {
      if (!TLI.Data.currentUserEmail) {
        TLI.UI.showToast('Connexion requise', 'warning');
        TLI.UI.openModal('authModal');
        return;
      }
      TLI.UI.showToast('Hors-ligne', 'warning');
      if (this.socket) this.socket.connect();
      return;
    }
    if (TLI.Data.offlineMode) {
      TLI.UI.showToast('Mode hors-ligne actif', 'warning');
      return;
    }
    TLI.UI.showToast('Synchronisation...', 'success');
    this.push('orders'); this.push('clients'); this.push('stock');
    this.push('planning'); this.push('machines'); this.push('photos');
    // Pousser aussi les prospects
    this.pushProspects();
    TLI.UI.showToast('Synchronise !', 'success');
  },

  login: function() {
    var email = document.getElementById('authEmail').value.trim();
    var password = document.getElementById('authPassword').value;
    var errorDiv = document.getElementById('authError');
    if (!email || !password) { errorDiv.textContent = 'Email et mot de passe requis'; errorDiv.style.display = 'block'; return; }
    errorDiv.style.display = 'none';
    TLI.Data.currentUserId = email; TLI.Data.currentUserEmail = email;
    TLI.Data.offlineMode = false;
    if (this.socket && this.socket.connected) {
      this.socket.emit('auth', { name: email, email: email, password: password });
    } else {
      TLI.UI.showToast('Hors ligne - connexion locale', 'warning');
      TLI.UI.closeModal('authModal');
      TLI.UI.updateAuthDisplay();
    }
  },

  register: function() {
    var email = document.getElementById('authEmail').value.trim();
    var password = document.getElementById('authPassword').value;
    var errorDiv = document.getElementById('authError');
    if (!email || !password) { errorDiv.textContent = 'Champs requis'; errorDiv.style.display = 'block'; return; }
    if (password.length < 6) { errorDiv.textContent = '6 caracteres minimum'; errorDiv.style.display = 'block'; return; }
    errorDiv.style.display = 'none';
    TLI.Data.currentUserId = email; TLI.Data.currentUserEmail = email;
    TLI.Data.offlineMode = false;
    if (this.socket && this.socket.connected) {
      this.socket.emit('register', { name: email, email: email, password: password });
    } else {
      TLI.UI.showToast('Hors ligne - creation locale', 'warning');
      TLI.UI.closeModal('authModal');
      TLI.UI.updateAuthDisplay();
    }
  },

  logout: function() {
    if (confirm('Se deconnecter ?')) {
      TLI.Data.currentUserId = null; TLI.Data.currentUserEmail = null;
      TLI.Data.offlineMode = true;
      if (this.socket) this.socket.disconnect();
      TLI.UI.updateAuthDisplay();
      TLI.UI.showToast('Deconnecte', 'warning');
      setTimeout(function() { window.location.reload(); }, 1000);
    }
  },

  pushProspects: function() {
    if (TLI.Data.offlineMode || !this.socket || !this.isConnected) return;
    var state = TLI.Prospection.getProspectsState();
    this.socket.emit('update-prospects', state);
    console.log('[TLI.Server] pushProspects envoye');
  },

  requestProspects: function() {
    if (!this.socket || !this.isConnected) return;
    this.socket.emit('request-prospects');
  }
};
