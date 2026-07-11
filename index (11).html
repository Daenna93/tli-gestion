// ============================================================
// TLI v16 — Module UI (Rendu interface)
// ============================================================
var TLI = window.TLI || {};

TLI.UI = {
  init: function() {
    this.bindNavTabs();
    this.bindModals();
    this.bindOrders();
    this.bindClients();
    this.bindCatalog();
    this.bindStock();
    this.bindPlanning();
    this.bindTimer();
    this.bindMachines();
    this.bindCalculator();
    this.bindSettings();
    this.bindDashboard();
    this.bindQuality();
    this.bindCall();
    this.bindPhotos();
    this.renderAll();
    this.updateAuthDisplay();
    TLI.Notifs.requestPermission();
    console.log("[TLI.UI] Initialized");
  },

  renderAll: function() {
    this.renderStats();
    this.renderOrders();
    this.renderClients();
    this.renderCatalog();
    this.renderStock();
    this.renderPlanning();
    this.renderMachines();
    this.renderPhotos();
    this.updateMachineSelects();
    this.updateClientSelects();
    this.renderTimers();
    this.renderStockAlerts();
  },

  toggleAccordion: function(id) {
    var acc = document.querySelector('[data-accordion="' + id + '"]');
    if (acc) acc.classList.toggle('open');
  },

  toggleDropdown: function(btn) {
    var menu = btn.nextElementSibling;
    if (!menu) return;
    var isVisible = menu.style.display === 'block';
    document.querySelectorAll('.dropdown-menu').forEach(function(m) { m.style.display = 'none'; });
    if (!isVisible) menu.style.display = 'block';
  },

  showToast: function(msg, type) {
    var t = document.getElementById('toast');
    if (!t) return;
    t.textContent = msg;
    t.className = 'toast show toast-' + (type || 'success');
    setTimeout(function() { t.classList.remove('show'); }, 3000);
  },

  openModal: function(id) {
    var m = document.getElementById(id);
    if (m) m.classList.add('active');
  },

  closeModal: function(id) {
    var m = document.getElementById(id);
    if (m) m.classList.remove('active');
  },

  // Nouvelle méthode v16 — fermer TOUTES les popups
  closeAllPopups: function() {
    document.querySelectorAll('.modal-overlay, .quality-overlay, .call-overlay, .photo-overlay').forEach(function(el) {
      el.classList.remove('active');
    });
    // Fermer aussi les popups Leaflet
    if (TLI.Prospection.map) {
      TLI.Prospection.map.closePopup();
    }
  },

  updateSyncStatus: function(status) {
    var icon = document.getElementById('syncIcon');
    var text = document.getElementById('syncText');
    if (!icon || !text) return;
    if (status === 'synced') { icon.textContent = '✅'; text.textContent = 'Sync'; }
    else if (status === 'offline') { icon.textContent = '⚠️'; text.textContent = 'Hors ligne'; }
    else if (status === 'error') { icon.textContent = '❌'; text.textContent = 'Erreur'; }
    else { icon.textContent = '🔄'; text.textContent = 'Sync'; }
  },

  updateAuthDisplay: function() {
    var info = document.getElementById('authInfo');
    if (info) {
      info.textContent = TLI.Data.currentUserEmail ? 'Connecté : ' + TLI.Data.currentUserEmail : 'Non connecté';
    }
  },

  // ---------- NAVIGATION ----------
  bindNavTabs: function() {
    var tabs = document.querySelectorAll('.nav-tab');
    tabs.forEach(function(tab) {
      tab.addEventListener('click', function() {
        var section = this.dataset.section;
        document.querySelectorAll('.nav-tab').forEach(function(t) { t.classList.remove('active'); });
        document.querySelectorAll('.section').forEach(function(s) { s.classList.remove('active'); });
        this.classList.add('active');
        var sec = document.getElementById(section);
        if (sec) sec.classList.add('active');
        if (section === 'planning') TLI.UI.renderPlanning();
        if (section === 'photos') TLI.UI.renderPhotos();
        if (section === 'timer') TLI.UI.renderTimers();
        if (section === 'machines') TLI.UI.renderMachines();
        if (section === 'prospection') TLI.Prospection.initMap();
      });
    });
  },

  // ---------- MODALS ----------
  bindModals: function() {
    document.querySelectorAll('.modal-close').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var id = this.dataset.close;
        if (id) TLI.UI.closeModal(id);
      });
    });
    document.querySelectorAll('.modal-overlay').forEach(function(overlay) {
      overlay.addEventListener('click', function(e) {
        if (e.target === this) this.classList.remove('active');
      });
    });
  },

  // ---------- DASHBOARD ----------
  bindDashboard: function() {
    document.getElementById('btnNewOrderDash').addEventListener('click', function() {
      TLI.UI.openModal('newOrderModal');
    });
    document.getElementById('btnNewClientDash').addEventListener('click', function() {
      TLI.UI.openModal('newClientModal');
    });
    document.getElementById('btnTimerDash').addEventListener('click', function() {
      document.querySelector('.nav-tab[data-section="timer"]').click();
    });
    document.getElementById('btnSync').addEventListener('click', function() {
      TLI.Server.sync();
    });
  },

  renderStats: function() {
    var total = TLI.Data.orders.length;
    var pending = 0, printing = 0, finished = 0, delivered = 0;
    TLI.Data.orders.forEach(function(o) {
      if (o.status === 'pending') pending++;
      else if (o.status === 'printing') printing++;
      else if (o.status === 'finished') finished++;
      else if (o.status === 'delivered') delivered++;
    });
    var html = '<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:10px">';
    html += '<div class="ca-card"><div class="ca-amount">' + total + '</div><div class="ca-label">Total</div></div>';
    html += '<div class="ca-card"><div class="ca-amount" style="color:var(--warning)">' + pending + '</div><div class="ca-label">A faire</div></div>';
    html += '<div class="ca-card"><div class="ca-amount" style="color:var(--primary)">' + printing + '</div><div class="ca-label">En cours</div></div>';
    html += '<div class="ca-card"><div class="ca-amount" style="color:var(--success)">' + finished + '</div><div class="ca-label">Terminees</div></div>';
    html += '</div>';
    var el = document.getElementById('statsDisplay');
    if (el) el.innerHTML = html;

    var now = new Date();
    var monthTotal = 0, yearTotal = 0;
    TLI.Data.orders.forEach(function(o) {
      if (o.status === 'delivered' && o.price) {
        var d = new Date(o.createdAt || o.id);
        if (d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()) monthTotal += parseFloat(o.price);
        if (d.getFullYear() === now.getFullYear()) yearTotal += parseFloat(o.price);
      }
    });
    var cm = document.getElementById('caMonth');
    var cy = document.getElementById('caYear');
    if (cm) cm.textContent = monthTotal.toFixed(2) + '€';
    if (cy) cy.textContent = yearTotal.toFixed(2) + '€';

    var activeCard = document.getElementById('activeTimersCard');
    var activeList = document.getElementById('activeTimersList');
    if (activeCard && activeList) {
      var active = TLI.Data.activeTimers.filter(function(t) { return !t.finished; });
      if (active.length > 0) {
        activeCard.style.display = 'block';
        activeList.innerHTML = active.map(function(t) {
          return '<div class="timer-card"><div class="timer-name">' + TLI.Utils.escapeHtml(t.name) + '</div><div class="timer-info">' + TLI.Utils.escapeHtml(t.machineName) + '</div><div class="timer-remaining">' + TLI.Utils.formatTimer(t.endTime - Date.now()) + '</div></div>';
        }).join('');
      } else {
        activeCard.style.display = 'none';
      }
    }
  },

  renderStockAlerts: function() {
    var el = document.getElementById('stockAlerts');
    if (!el) return;
    var alerts = TLI.Data.stock.filter(function(s) { return parseFloat(s.qty) <= parseFloat(s.alert || 0); });
    if (alerts.length === 0) { el.innerHTML = '<div class="empty-state"><div class="icon">✅</div><div>Aucune alerte</div></div>'; return; }
    el.innerHTML = alerts.map(function(s) {
      return '<div class="checklist-item" style="cursor:default"><span style="color:var(--danger)">⚠️</span><label>' + TLI.Utils.escapeHtml(s.name) + ' (' + s.qty + ' ' + s.unit + ')</label></div>';
    }).join('');
  },

  // ---------- ORDERS ----------
  bindOrders: function() {
    document.getElementById('btnNewOrder').addEventListener('click', function() {
      TLI.UI.updateClientSelects();
      TLI.UI.updateMachineSelects();
      document.getElementById('orderName').value = '';
      document.getElementById('orderMaterial').value = '';
      document.getElementById('orderWeight').value = '';
      document.getElementById('orderTime').value = '';
      document.getElementById('orderPrice').value = '';
      document.getElementById('orderNotes').value = '';
      TLI.UI.openModal('newOrderModal');
    });
    document.getElementById('btnSaveOrder').addEventListener('click', function() {
      var clientId = parseInt(document.getElementById('orderClient').value);
      var name = document.getElementById('orderName').value.trim();
      var service = document.getElementById('orderService').value;
      var type = document.getElementById('orderType').value;
      var machineId = parseInt(document.getElementById('orderMachine').value) || null;
      var material = document.getElementById('orderMaterial').value.trim();
      var weight = parseFloat(document.getElementById('orderWeight').value) || 0;
      var time = parseFloat(document.getElementById('orderTime').value) || 0;
      var price = parseFloat(document.getElementById('orderPrice').value) || 0;
      var priority = document.getElementById('orderPriority').value;
      var notes = document.getElementById('orderNotes').value.trim();
      if (!name) { TLI.UI.showToast('Nom du projet requis', 'error'); return; }
      var order = {
        id: TLI.Utils.generateId(),
        clientId: clientId,
        name: name,
        service: service,
        type: type,
        machineId: machineId,
        material: material,
        weight: weight,
        time: time,
        price: price,
        priority: priority,
        notes: notes,
        status: 'pending',
        createdAt: new Date().toISOString(),
        photos: []
      };
      TLI.Data.orders.push(order);
      TLI.Data.save();
      TLI.UI.closeModal('newOrderModal');
      TLI.UI.renderOrders();
      TLI.UI.renderStats();
      TLI.UI.showToast('Commande créée !', 'success');
      TLI.Server.push('orders');
    });
    document.getElementById('orderService').addEventListener('change', function() {
      var isPrint = this.value === 'print';
      document.getElementById('printTypeGroup').style.display = isPrint ? 'block' : 'none';
      document.getElementById('machineGroup').style.display = isPrint ? 'block' : 'none';
    });
    document.getElementById('btnDeleteOrder').addEventListener('click', function() {
      if (!TLI.Data.currentOrderId) return;
      if (!confirm('Supprimer cette commande ?')) return;
      TLI.Data.orders = TLI.Data.orders.filter(function(o) { return o.id !== TLI.Data.currentOrderId; });
      TLI.Data.save();
      TLI.Server.push('orders');
      TLI.UI.closeModal('orderDetailModal');
      TLI.UI.renderOrders();
      TLI.UI.renderStats();
      TLI.UI.showToast('Commande supprimée', 'warning');
    });
    document.getElementById('detailStatus').addEventListener('change', function() {
      var order = TLI.Data.getOrder(TLI.Data.currentOrderId);
      if (!order) return;
      var newStatus = this.value;
      if (newStatus === 'finished' && order.status !== 'finished') {
        TLI.Data.qualityOrderId = order.id;
        document.getElementById('qualityOrderName').textContent = order.name;
        TLI.UI.renderQualityChecklist();
        TLI.UI.openModal('qualityOverlay');
      }
      order.status = newStatus;
      TLI.Data.save();
      TLI.Server.push('orders');
      TLI.UI.renderOrders();
      TLI.UI.renderStats();
    });
    document.querySelectorAll('.order-tab').forEach(function(tab) {
      tab.addEventListener('click', function() {
        document.querySelectorAll('.order-tab').forEach(function(t) { t.classList.remove('active'); });
        this.classList.add('active');
        TLI.Data.currentOrderFilter = this.dataset.filter;
        TLI.UI.renderOrders();
      });
    });
  },

  renderOrders: function() {
    var el = document.getElementById('ordersList');
    if (!el) return;
    var filter = TLI.Data.currentOrderFilter;
    var filtered = TLI.Data.orders.filter(function(o) {
      if (filter === 'all') return true;
      return o.status === filter;
    });
    if (filtered.length === 0) {
      el.innerHTML = '<div class="empty-state"><div class="icon">📦</div><div>Aucune commande</div></div>';
      return;
    }
    el.innerHTML = filtered.map(function(o) {
      var client = TLI.Data.getClient(o.clientId);
      var clientName = client ? client.name : 'Client inconnu';
      var badgeClass = 'badge-' + (o.status || 'pending');
      var statusText = {pending:'A faire', printing:'En cours', finished:'Terminee', delivered:'Livree'}[o.status] || o.status;
      return '<div class="order-item" onclick="TLI.UI.showOrderDetail(' + o.id + ')">' +
        '<div class="order-item-header"><div class="order-item-title">' + TLI.Utils.escapeHtml(o.name) + '</div><div class="badge ' + badgeClass + '">' + statusText + '</div></div>' +
        '<div class="order-item-meta"><span>👤 ' + TLI.Utils.escapeHtml(clientName) + '</span><span>💰 ' + (o.price || 0) + '€</span><span>⚖️ ' + (o.weight || 0) + 'g</span></div>' +
        '</div>';
    }).join('');
  },

  showOrderDetail: function(id) {
    // v16: fermer toutes les popups d'abord pour éviter les overlays empilés
    TLI.UI.closeAllPopups();
    var order = TLI.Data.getOrder(id);
    if (!order) return;
    TLI.Data.currentOrderId = id;
    var client = TLI.Data.getClient(order.clientId);
    var machine = TLI.Data.getMachine(order.machineId);
    var html = '';
    html += '<div class="form-group"><label class="form-label">Client</label><div class="form-input" style="background:var(--glass)">' + TLI.Utils.escapeHtml(client ? client.name : 'Inconnu') + '</div></div>';
    html += '<div class="form-group"><label class="form-label">Projet</label><div class="form-input" style="background:var(--glass)">' + TLI.Utils.escapeHtml(order.name) + '</div></div>';
    html += '<div class="form-group"><label class="form-label">Type</label><div class="form-input" style="background:var(--glass)">' + (order.service || 'print') + ' / ' + (order.type || 'fdm') + '</div></div>';
    if (machine) html += '<div class="form-group"><label class="form-label">Machine</label><div class="form-input" style="background:var(--glass)">' + TLI.Utils.escapeHtml(machine.name) + '</div></div>';
    html += '<div class="form-group"><label class="form-label">Materiau</label><div class="form-input" style="background:var(--glass)">' + TLI.Utils.escapeHtml(order.material || '-') + '</div></div>';
    html += '<div class="form-group"><label class="form-label">Poids</label><div class="form-input" style="background:var(--glass)">' + (order.weight || 0) + 'g</div></div>';
    html += '<div class="form-group"><label class="form-label">Temps</label><div class="form-input" style="background:var(--glass)">' + (order.time || 0) + 'h</div></div>';
    html += '<div class="form-group"><label class="form-label">Prix</label><div class="form-input" style="background:var(--glass)">' + (order.price || 0) + '€</div></div>';
    html += '<div class="form-group"><label class="form-label">Notes</label><div class="form-textarea" style="background:var(--glass);min-height:auto">' + TLI.Utils.escapeHtml(order.notes || '-') + '</div></div>';
    document.getElementById('orderDetailContent').innerHTML = html;
    document.getElementById('detailStatus').value = order.status || 'pending';
    this.renderOrderPhotos(id);
    this.openModal('orderDetailModal');
  },

  renderOrderPhotos: function(orderId) {
    var order = TLI.Data.getOrder(orderId);
    var el = document.getElementById('detailPhotos');
    if (!el) return;
    if (!order || !order.photos || order.photos.length === 0) {
      el.innerHTML = '<div style="color:#666;font-size:.8rem;text-align:center;padding:10px">Aucune photo</div>';
      return;
    }
    el.innerHTML = order.photos.map(function(p, idx) {
      return '<div class="photo-item" onclick="TLI.UI.showPhotoOverlay(' + orderId + ',' + idx + ')"><img src="' + p + '" alt="Photo"><button class="photo-delete" onclick="event.stopPropagation();TLI.UI.deleteOrderPhoto(' + orderId + ',' + idx + ')">×</button></div>';
    }).join('');
  },

  deleteOrderPhoto: function(orderId, idx) {
    TLI.Data.deletePhotoFromOrder(orderId, idx);
    TLI.UI.renderOrderPhotos(orderId);
    TLI.Server.push('orders');
  },

  showPhotoOverlay: function(orderId, idx) {
    var order = TLI.Data.getOrder(orderId);
    if (!order || !order.photos || !order.photos[idx]) return;
    document.getElementById('photoOverlayImg').src = order.photos[idx];
    document.getElementById('photoOverlay').classList.add('active');
  },


  // ---------- CLIENTS ----------
  bindClients: function() {
    document.getElementById('btnNewClient').addEventListener('click', function() {
      document.getElementById('clientName').value = '';
      document.getElementById('clientCompany').value = '';
      document.getElementById('clientRole').value = '';
      document.getElementById('clientPhone').value = '';
      document.getElementById('clientEmail').value = '';
      document.getElementById('clientAddress').value = '';
      document.getElementById('clientNotes').value = '';
      TLI.UI.openModal('newClientModal');
    });
    document.getElementById('btnSaveClient').addEventListener('click', function() {
      var name = document.getElementById('clientName').value.trim();
      if (!name) { TLI.UI.showToast('Nom requis', 'error'); return; }
      var client = {
        id: TLI.Utils.generateId(),
        name: name,
        company: document.getElementById('clientCompany').value.trim(),
        role: document.getElementById('clientRole').value.trim(),
        phone: document.getElementById('clientPhone').value.trim(),
        email: document.getElementById('clientEmail').value.trim(),
        address: document.getElementById('clientAddress').value.trim(),
        notes: document.getElementById('clientNotes').value.trim()
      };
      TLI.Data.clients.push(client);
      TLI.Data.save();
      TLI.Server.push('clients');
      TLI.UI.closeModal('newClientModal');
      TLI.UI.renderClients();
      TLI.UI.updateClientSelects();
      TLI.UI.showToast('Client ajouté !', 'success');
    });
    document.getElementById('clientSearch').addEventListener('input', function() {
      TLI.UI.renderClients(this.value);
    });
    document.getElementById('btnUpdateClient').addEventListener('click', function() {
      var client = TLI.Data.getClient(TLI.Data.currentClientId);
      if (!client) return;
      client.name = document.getElementById('editClientName').value.trim();
      client.company = document.getElementById('editClientCompany').value.trim();
      client.role = document.getElementById('editClientRole').value.trim();
      client.phone = document.getElementById('editClientPhone').value.trim();
      client.email = document.getElementById('editClientEmail').value.trim();
      client.address = document.getElementById('editClientAddress').value.trim();
      client.notes = document.getElementById('editClientNotes').value.trim();
      TLI.Data.save();
      TLI.Server.push('clients');
      TLI.UI.closeModal('editClientModal');
      TLI.UI.renderClients();
      TLI.UI.updateClientSelects();
      TLI.UI.showToast('Client modifié', 'success');
    });
    document.getElementById('btnDeleteClient').addEventListener('click', function() {
      if (!TLI.Data.currentClientId) return;
      if (!confirm('Supprimer ce client ?')) return;
      TLI.Data.clients = TLI.Data.clients.filter(function(c) { return c.id !== TLI.Data.currentClientId; });
      TLI.Data.save();
      TLI.Server.push('clients');
      TLI.UI.closeModal('clientDetailModal');
      TLI.UI.renderClients();
      TLI.UI.updateClientSelects();
      TLI.UI.showToast('Client supprimé', 'warning');
    });
    document.getElementById('btnCallClient').addEventListener('click', function() {
      var client = TLI.Data.getClient(TLI.Data.currentClientId);
      if (!client || !client.phone) { TLI.UI.showToast('Pas de numéro', 'error'); return; }
      TLI.Data.callNumber = TLI.Utils.cleanPhone(client.phone);
      document.getElementById('callClientName').textContent = client.name;
      document.getElementById('callNumber').textContent = client.phone;
      TLI.UI.openModal('callOverlay');
    });
    document.getElementById('btnEditClient').addEventListener('click', function() {
      var client = TLI.Data.getClient(TLI.Data.currentClientId);
      if (!client) return;
      document.getElementById('editClientName').value = client.name || '';
      document.getElementById('editClientCompany').value = client.company || '';
      document.getElementById('editClientRole').value = client.role || '';
      document.getElementById('editClientPhone').value = client.phone || '';
      document.getElementById('editClientEmail').value = client.email || '';
      document.getElementById('editClientAddress').value = client.address || '';
      document.getElementById('editClientNotes').value = client.notes || '';
      TLI.UI.closeModal('clientDetailModal');
      TLI.UI.openModal('editClientModal');
    });
    document.getElementById('btnCancelCall').addEventListener('click', function() {
      TLI.UI.closeModal('callOverlay');
    });
    document.getElementById('btnConfirmCall').addEventListener('click', function() {
      window.location.href = 'tel:' + TLI.Data.callNumber;
      TLI.UI.closeModal('callOverlay');
    });
  },

  renderClients: function(search) {
    var el = document.getElementById('clientsList');
    if (!el) return;
    search = (search || '').toLowerCase();
    var filtered = TLI.Data.clients.filter(function(c) {
      if (!search) return true;
      return (c.name || '').toLowerCase().indexOf(search) !== -1 || (c.company || '').toLowerCase().indexOf(search) !== -1;
    });
    if (filtered.length === 0) {
      el.innerHTML = '<div class="empty-state"><div class="icon">👥</div><div>Aucun client</div></div>';
      return;
    }
    el.innerHTML = filtered.map(function(c) {
      var orderCount = TLI.Data.orders.filter(function(o) { return o.clientId === c.id; }).length;
      return '<div class="client-card" onclick="TLI.UI.showClientDetail(' + c.id + ')">' +
        '<div class="client-name">' + TLI.Utils.escapeHtml(c.name) + (c.company ? ' <span style="color:#888;font-size:.8rem">(' + TLI.Utils.escapeHtml(c.company) + ')</span>' : '') + '</div>' +
        '<div class="client-info">' + (c.phone ? '📞 ' + TLI.Utils.escapeHtml(c.phone) : '') + (c.email ? ' ✉️ ' + TLI.Utils.escapeHtml(c.email) : '') + '</div>' +
        '<div class="client-orders">' + orderCount + ' commande(s)</div>' +
        '</div>';
    }).join('');
  },

  showClientDetail: function(id) {
    // v16: fermer toutes les popups d'abord pour éviter les overlays empilés
    TLI.UI.closeAllPopups();
    var client = TLI.Data.getClient(id);
    if (!client) return;
    TLI.Data.currentClientId = id;
    var html = '';
    html += '<div class="form-group"><label class="form-label">Nom</label><div class="form-input" style="background:var(--glass)">' + TLI.Utils.escapeHtml(client.name) + '</div></div>';
    if (client.company) html += '<div class="form-group"><label class="form-label">Entreprise</label><div class="form-input" style="background:var(--glass)">' + TLI.Utils.escapeHtml(client.company) + '</div></div>';
    if (client.role) html += '<div class="form-group"><label class="form-label">Fonction</label><div class="form-input" style="background:var(--glass)">' + TLI.Utils.escapeHtml(client.role) + '</div></div>';
    if (client.phone) html += '<div class="form-group"><label class="form-label">Téléphone</label><div class="form-input" style="background:var(--glass)">' + TLI.Utils.escapeHtml(client.phone) + '</div></div>';
    if (client.email) html += '<div class="form-group"><label class="form-label">Email</label><div class="form-input" style="background:var(--glass)">' + TLI.Utils.escapeHtml(client.email) + '</div></div>';
    if (client.address) html += '<div class="form-group"><label class="form-label">Adresse</label><div class="form-textarea" style="background:var(--glass);min-height:auto">' + TLI.Utils.escapeHtml(client.address) + '</div></div>';
    if (client.notes) html += '<div class="form-group"><label class="form-label">Notes</label><div class="form-textarea" style="background:var(--glass);min-height:auto">' + TLI.Utils.escapeHtml(client.notes) + '</div></div>';
    var orders = TLI.Data.orders.filter(function(o) { return o.clientId === id; });
    if (orders.length > 0) {
      html += '<div class="card-title" style="margin-top:14px">📦 Commandes</div>';
      // v16: utiliser closeAllPopups() avant de naviguer vers le détail commande
      html += orders.map(function(o) {
        return '<div class="client-order-row" onclick="TLI.UI.closeAllPopups();TLI.UI.showOrderDetail(' + o.id + ');">' + TLI.Utils.escapeHtml(o.name) + ' <span class="badge badge-' + o.status + '">' + o.status + '</span></div>';
      }).join('');
    }
    document.getElementById('clientDetailContent').innerHTML = html;
    document.getElementById('clientDetailTitle').textContent = client.name;
    this.openModal('clientDetailModal');
  },

  updateClientSelects: function() {
    var sel = document.getElementById('orderClient');
    if (!sel) return;
    sel.innerHTML = TLI.Data.clients.map(function(c) {
      return '<option value="' + c.id + '">' + TLI.Utils.escapeHtml(c.name) + '</option>';
    }).join('');
  },

  // ---------- CATALOG ----------
  bindCatalog: function() {
    document.getElementById('btnNewModel').addEventListener('click', function() {
      document.getElementById('modelName').value = '';
      document.getElementById('modelTime').value = '';
      document.getElementById('modelWeight').value = '';
      document.getElementById('modelPrice').value = '';
      document.getElementById('modelDesc').value = '';
      TLI.UI.openModal('newModelModal');
    });
    document.getElementById('btnSaveModel').addEventListener('click', function() {
      var name = document.getElementById('modelName').value.trim();
      if (!name) { TLI.UI.showToast('Nom requis', 'error'); return; }
      TLI.Data.models.push({
        id: TLI.Utils.generateId(),
        name: name,
        category: document.getElementById('modelCategory').value,
        type: document.getElementById('modelType').value,
        time: parseFloat(document.getElementById('modelTime').value) || 0,
        weight: parseFloat(document.getElementById('modelWeight').value) || 0,
        price: parseFloat(document.getElementById('modelPrice').value) || 0,
        description: document.getElementById('modelDesc').value.trim()
      });
      TLI.Data.save();
      TLI.Server.push('models');
      TLI.UI.closeModal('newModelModal');
      TLI.UI.renderCatalog();
      TLI.UI.showToast('Modèle ajouté', 'success');
    });
    document.getElementById('catalogSearch').addEventListener('input', function() {
      TLI.UI.renderCatalog(this.value);
    });
    document.getElementById('btnUpdateModel').addEventListener('click', function() {
      var m = TLI.Data.models.find(function(x) { return x.id === TLI.Data.currentModelId; });
      if (!m) return;
      m.name = document.getElementById('editModelName').value.trim();
      m.category = document.getElementById('editModelCategory').value;
      m.type = document.getElementById('editModelType').value;
      m.time = parseFloat(document.getElementById('editModelTime').value) || 0;
      m.weight = parseFloat(document.getElementById('editModelWeight').value) || 0;
      m.price = parseFloat(document.getElementById('editModelPrice').value) || 0;
      m.description = document.getElementById('editModelDesc').value.trim();
      TLI.Data.save();
      TLI.Server.push('models');
      TLI.UI.closeModal('editModelModal');
      TLI.UI.renderCatalog();
      TLI.UI.showToast('Modèle modifié', 'success');
    });
    document.getElementById('btnDeleteModel').addEventListener('click', function() {
      if (!confirm('Supprimer ce modèle ?')) return;
      TLI.Data.models = TLI.Data.models.filter(function(x) { return x.id !== TLI.Data.currentModelId; });
      TLI.Data.save();
      TLI.Server.push('models');
      TLI.UI.closeModal('editModelModal');
      TLI.UI.renderCatalog();
      TLI.UI.showToast('Modèle supprimé', 'warning');
    });
  },

  renderCatalog: function(search) {
    var el = document.getElementById('catalogList');
    if (!el) return;
    search = (search || '').toLowerCase();
    var filtered = TLI.Data.models.filter(function(m) {
      if (!search) return true;
      return (m.name || '').toLowerCase().indexOf(search) !== -1;
    });
    if (filtered.length === 0) {
      el.innerHTML = '<div class="empty-state"><div class="icon">🎨</div><div>Aucun modèle</div></div>';
      return;
    }
    el.innerHTML = filtered.map(function(m) {
      return '<div class="client-card" onclick="TLI.UI.showModelDetail(' + m.id + ')">' +
        '<div class="client-name">' + TLI.Utils.escapeHtml(m.name) + '</div>' +
        '<div class="client-info">' + (m.category || 'Autre') + ' | ' + (m.type || 'fdm') + ' | ' + (m.time || 0) + 'h | ' + (m.price || 0) + '€</div>' +
        '</div>';
    }).join('');
  },

  showModelDetail: function(id) {
    var m = TLI.Data.models.find(function(x) { return x.id === id; });
    if (!m) return;
    TLI.Data.currentModelId = id;
    document.getElementById('editModelName').value = m.name || '';
    document.getElementById('editModelCategory').value = m.category || 'other';
    document.getElementById('editModelType').value = m.type || 'fdm';
    document.getElementById('editModelTime').value = m.time || 0;
    document.getElementById('editModelWeight').value = m.weight || 0;
    document.getElementById('editModelPrice').value = m.price || 0;
    document.getElementById('editModelDesc').value = m.description || '';
    this.openModal('editModelModal');
  },

  // ---------- STOCK ----------
  bindStock: function() {
    document.getElementById('btnNewStock').addEventListener('click', function() {
      document.getElementById('stockName').value = '';
      document.getElementById('stockQty').value = '';
      document.getElementById('stockSupplier').value = '';
      TLI.UI.openModal('newStockModal');
    });
    document.getElementById('btnSaveStock').addEventListener('click', function() {
      var name = document.getElementById('stockName').value.trim();
      if (!name) { TLI.UI.showToast('Nom requis', 'error'); return; }
      TLI.Data.stock.push({
        id: TLI.Utils.generateId(),
        type: document.getElementById('stockType').value,
        name: name,
        qty: parseFloat(document.getElementById('stockQty').value) || 0,
        unit: document.getElementById('stockUnit').value,
        alert: parseFloat(document.getElementById('stockAlert').value) || 0,
        supplier: document.getElementById('stockSupplier').value.trim()
      });
      TLI.Data.save();
      TLI.Server.push('stock');
      TLI.UI.closeModal('newStockModal');
      TLI.UI.renderStock();
      TLI.UI.renderStockAlerts();
      TLI.UI.showToast('Stock ajouté', 'success');
    });
    document.getElementById('stockSearch').addEventListener('input', function() {
      TLI.UI.renderStock(this.value);
    });
    document.getElementById('btnUpdateStock').addEventListener('click', function() {
      var s = TLI.Data.stock.find(function(x) { return x.id === TLI.Data.currentStockId; });
      if (!s) return;
      s.type = document.getElementById('editStockType').value;
      s.name = document.getElementById('editStockName').value.trim();
      s.qty = parseFloat(document.getElementById('editStockQty').value) || 0;
      s.unit = document.getElementById('editStockUnit').value;
      s.alert = parseFloat(document.getElementById('editStockAlert').value) || 0;
      s.supplier = document.getElementById('editStockSupplier').value.trim();
      TLI.Data.save();
      TLI.Server.push('stock');
      TLI.UI.closeModal('editStockModal');
      TLI.UI.renderStock();
      TLI.UI.renderStockAlerts();
      TLI.UI.showToast('Stock modifié', 'success');
    });
    document.getElementById('btnDeleteStock').addEventListener('click', function() {
      if (!confirm('Supprimer cet article ?')) return;
      TLI.Data.stock = TLI.Data.stock.filter(function(x) { return x.id !== TLI.Data.currentStockId; });
      TLI.Data.save();
      TLI.Server.push('stock');
      TLI.UI.closeModal('editStockModal');
      TLI.UI.renderStock();
      TLI.UI.renderStockAlerts();
      TLI.UI.showToast('Stock supprimé', 'warning');
    });
  },

  renderStock: function(search) {
    var el = document.getElementById('stockList');
    if (!el) return;
    search = (search || '').toLowerCase();
    var filtered = TLI.Data.stock.filter(function(s) {
      if (!search) return true;
      return (s.name || '').toLowerCase().indexOf(search) !== -1;
    });
    if (filtered.length === 0) {
      el.innerHTML = '<div class="empty-state"><div class="icon">📋</div><div>Aucun article</div></div>';
      return;
    }
    el.innerHTML = filtered.map(function(s) {
      var isLow = parseFloat(s.qty) <= parseFloat(s.alert || 0);
      return '<div class="client-card" onclick="TLI.UI.showStockDetail(' + s.id + ')">' +
        '<div class="client-name">' + TLI.Utils.escapeHtml(s.name) + ' <span class="badge ' + (isLow ? 'badge-high' : 'badge-low') + '">' + s.qty + ' ' + s.unit + '</span></div>' +
        '<div class="client-info">' + (s.type || 'Autre') + (s.supplier ? ' | ' + TLI.Utils.escapeHtml(s.supplier) : '') + '</div>' +
        '</div>';
    }).join('');
  },

  showStockDetail: function(id) {
    var s = TLI.Data.stock.find(function(x) { return x.id === id; });
    if (!s) return;
    TLI.Data.currentStockId = id;
    document.getElementById('editStockType').value = s.type || 'other';
    document.getElementById('editStockName').value = s.name || '';
    document.getElementById('editStockQty').value = s.qty || 0;
    document.getElementById('editStockUnit').value = s.unit || 'pcs';
    document.getElementById('editStockAlert').value = s.alert || 0;
    document.getElementById('editStockSupplier').value = s.supplier || '';
    this.openModal('editStockModal');
  },


  // ---------- PLANNING ----------
  bindPlanning: function() {
    document.getElementById('btnNewEvent').addEventListener('click', function() {
      document.getElementById('planTitle').value = '';
      document.getElementById('planDate').value = TLI.Utils.toISODate(new Date());
      document.getElementById('planStartTime').value = '09:00';
      document.getElementById('planEndTime').value = '12:00';
      document.getElementById('planNotes').value = '';
      document.getElementById('planReminder').checked = false;
      document.getElementById('planReminderMinutesGroup').style.display = 'none';
      TLI.UI.openModal('planningModal');
    });
    document.getElementById('planReminder').addEventListener('change', function() {
      document.getElementById('planReminderMinutesGroup').style.display = this.checked ? 'block' : 'none';
    });
    document.getElementById('editPlanReminder').addEventListener('change', function() {
      document.getElementById('editPlanReminderMinutesGroup').style.display = this.checked ? 'block' : 'none';
    });
    document.getElementById('btnSaveEvent').addEventListener('click', function() {
      var title = document.getElementById('planTitle').value.trim();
      if (!title) { TLI.UI.showToast('Titre requis', 'error'); return; }
      var event = {
        id: TLI.Utils.generateId(),
        title: title,
        type: document.getElementById('planType').value,
        date: document.getElementById('planDate').value,
        startTime: document.getElementById('planStartTime').value,
        endTime: document.getElementById('planEndTime').value,
        assignee: document.getElementById('planAssignee').value,
        priority: document.getElementById('planPriority').value,
        notes: document.getElementById('planNotes').value.trim(),
        reminder: document.getElementById('planReminder').checked,
        reminderMinutes: document.getElementById('planReminder').checked ? parseInt(document.getElementById('planReminderMinutes').value) || 30 : null
      };
      TLI.Data.planningEvents.push(event);
      TLI.Data.save();
      TLI.Server.push('planning');
      TLI.UI.closeModal('planningModal');
      TLI.UI.renderPlanning();
      TLI.UI.showToast('Événement ajouté', 'success');
    });
    document.getElementById('btnUpdateEvent').addEventListener('click', function() {
      var e = TLI.Data.planningEvents.find(function(x) { return x.id === TLI.Data.currentEventId; });
      if (!e) return;
      e.title = document.getElementById('editPlanTitle').value.trim();
      e.type = document.getElementById('editPlanType').value;
      e.date = document.getElementById('editPlanDate').value;
      e.startTime = document.getElementById('editPlanStartTime').value;
      e.endTime = document.getElementById('editPlanEndTime').value;
      e.assignee = document.getElementById('editPlanAssignee').value;
      e.priority = document.getElementById('editPlanPriority').value;
      e.notes = document.getElementById('editPlanNotes').value.trim();
      e.reminder = document.getElementById('editPlanReminder').checked;
      e.reminderMinutes = document.getElementById('editPlanReminder').checked ? parseInt(document.getElementById('editPlanReminderMinutes').value) || 30 : null;
      TLI.Data.save();
      TLI.Server.push('planning');
      TLI.UI.closeModal('editPlanningModal');
      TLI.UI.renderPlanning();
      TLI.UI.showToast('Événement modifié', 'success');
    });
    document.getElementById('btnDeleteEvent').addEventListener('click', function() {
      if (!confirm('Supprimer cet événement ?')) return;
      TLI.Data.planningEvents = TLI.Data.planningEvents.filter(function(x) { return x.id !== TLI.Data.currentEventId; });
      TLI.Data.save();
      TLI.Server.push('planning');
      TLI.UI.closeModal('editPlanningModal');
      TLI.UI.renderPlanning();
      TLI.UI.showToast('Événement supprimé', 'warning');
    });
    document.getElementById('btnPlanPrev').addEventListener('click', function() {
      TLI.Data.planningCurrentDate.setMonth(TLI.Data.planningCurrentDate.getMonth() - 1);
      TLI.UI.renderPlanning();
    });
    document.getElementById('btnPlanNext').addEventListener('click', function() {
      TLI.Data.planningCurrentDate.setMonth(TLI.Data.planningCurrentDate.getMonth() + 1);
      TLI.UI.renderPlanning();
    });
    document.getElementById('btnShowAllEvents').addEventListener('click', function() {
      TLI.Data.planningSelectedDay = null;
      TLI.Data.planningSelectedDayStr = null;
      TLI.UI.renderPlanning();
    });
  },

  renderPlanning: function() {
    var cal = document.getElementById('planningCalendar');
    var label = document.getElementById('planningMonthLabel');
    var list = document.getElementById('planningEventsList');
    var dayLabel = document.getElementById('planSelectedDayLabel');
    if (!cal || !label) return;

    var d = TLI.Data.planningCurrentDate;
    var year = d.getFullYear(), month = d.getMonth();
    label.textContent = d.toLocaleDateString('fr-FR', {month:'long', year:'numeric'});

    var firstDay = new Date(year, month, 1).getDay();
    if (firstDay === 0) firstDay = 7;
    var daysInMonth = new Date(year, month + 1, 0).getDate();
    var today = TLI.Utils.toISODate(new Date());

    var html = '';
    var dayNames = ['Lun','Mar','Mer','Jeu','Ven','Sam','Dim'];
    dayNames.forEach(function(n) { html += '<div class="planning-day-header">' + n + '</div>'; });
    for (var i = 1; i < firstDay; i++) html += '<div></div>';
    for (var day = 1; day <= daysInMonth; day++) {
      var dateStr = year + '-' + String(month+1).padStart(2,'0') + '-' + String(day).padStart(2,'0');
      var isToday = dateStr === today;
      var isSelected = TLI.Data.planningSelectedDayStr === dateStr;
      var dayEvents = TLI.Data.planningEvents.filter(function(e) { return e.date === dateStr; });
      var dots = dayEvents.map(function(e) {
        var color = {printing:'var(--primary)', modeling:'var(--accent)', design:'var(--secondary)', maintenance:'var(--warning)', rdv:'var(--success)', logistics:'#888', other:'#666'}[e.type] || 'var(--primary)';
        return '<span class="planning-event-dot" style="background:' + color + '"></span>';
      }).join('');
      html += '<div class="planning-day ' + (isToday ? 'today' : '') + ' ' + (isSelected ? 'selected' : '') + '" onclick="TLI.UI.selectPlanningDay(' + day + ')">' +
        '<div class="planning-day-number">' + day + '</div>' + dots + '</div>';
    }
    cal.innerHTML = html;

    var eventsToShow = TLI.Data.planningSelectedDayStr
      ? TLI.Data.planningEvents.filter(function(e) { return e.date === TLI.Data.planningSelectedDayStr; })
      : TLI.Data.planningEvents;
    if (dayLabel) dayLabel.textContent = TLI.Data.planningSelectedDayStr ? 'Le ' + TLI.Utils.formatDate(TLI.Data.planningSelectedDayStr) : 'Tous les événements';
    if (list) {
      if (eventsToShow.length === 0) {
        list.innerHTML = '<div class="empty-state"><div class="icon">📅</div><div>Aucun événement</div></div>';
      } else {
        eventsToShow.sort(function(a,b) { return (a.date + 'T' + a.startTime).localeCompare(b.date + 'T' + b.startTime); });
        list.innerHTML = eventsToShow.map(function(e) {
          var color = {printing:'var(--primary)', modeling:'var(--accent)', design:'var(--secondary)', maintenance:'var(--warning)', rdv:'var(--success)', logistics:'#888', other:'#666'}[e.type] || 'var(--primary)';
          return '<div class="event-item" style="border-left-color:' + color + '" onclick="TLI.UI.showEventDetail(' + e.id + ')">' +
            '<div class="event-item-header"><div class="event-item-title">' + TLI.Utils.escapeHtml(e.title) + '</div><span class="badge badge-' + (e.priority || 'medium') + '">' + (e.priority || 'medium') + '</span></div>' +
            '<div class="event-item-meta"><span>📅 ' + TLI.Utils.formatDate(e.date) + '</span><span>🕐 ' + (e.startTime || '') + ' - ' + (e.endTime || '') + '</span><span>👤 ' + (e.assignee || '') + '</span></div>' +
            '</div>';
        }).join('');
      }
    }
  },

  selectPlanningDay: function(day) {
    var d = TLI.Data.planningCurrentDate;
    var dateStr = d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(day).padStart(2,'0');
    TLI.Data.planningSelectedDay = day;
    TLI.Data.planningSelectedDayStr = dateStr;
    this.renderPlanning();
  },

  showEventDetail: function(id) {
    var e = TLI.Data.planningEvents.find(function(x) { return x.id === id; });
    if (!e) return;
    TLI.Data.currentEventId = id;
    document.getElementById('editPlanTitle').value = e.title || '';
    document.getElementById('editPlanType').value = e.type || 'other';
    document.getElementById('editPlanDate').value = e.date || '';
    document.getElementById('editPlanStartTime').value = e.startTime || '09:00';
    document.getElementById('editPlanEndTime').value = e.endTime || '12:00';
    document.getElementById('editPlanAssignee').value = e.assignee || 'florian';
    document.getElementById('editPlanPriority').value = e.priority || 'medium';
    document.getElementById('editPlanNotes').value = e.notes || '';
    document.getElementById('editPlanReminder').checked = !!e.reminder;
    document.getElementById('editPlanReminderMinutesGroup').style.display = e.reminder ? 'block' : 'none';
    document.getElementById('editPlanReminderMinutes').value = e.reminderMinutes || 30;
    this.openModal('editPlanningModal');
  },

  // ---------- TIMER ----------
  bindTimer: function() {
    document.getElementById('btnStartTimer').addEventListener('click', function() {
      var name = document.getElementById('timerName').value.trim();
      var machineId = parseInt(document.getElementById('timerMachine').value);
      var hours = parseFloat(document.getElementById('timerHours').value) || 0;
      var minutes = parseInt(document.getElementById('timerMinutes').value) || 0;
      if (!name) { TLI.UI.showToast('Nom requis', 'error'); return; }
      var totalMs = (hours * 3600 + minutes * 60) * 1000;
      if (totalMs <= 0) { TLI.UI.showToast('Durée invalide', 'error'); return; }
      var machine = TLI.Data.getMachine(machineId);
      var timer = {
        id: TLI.Utils.generateId(),
        name: name,
        machineId: machineId,
        machineName: machine ? machine.name : 'Inconnue',
        duration: totalMs,
        startTime: Date.now(),
        endTime: Date.now() + totalMs,
        finished: false
      };
      TLI.Data.activeTimers.push(timer);
      TLI.Data.saveTimers();
      TLI.UI.renderTimers();
      TLI.UI.renderStats();
      TLI.UI.showToast('Timer démarré !', 'success');
      TLI.Server.pushTimers();
    });
  },

  renderTimers: function() {
    var activeEl = document.getElementById('timerList');
    var finishedEl = document.getElementById('finishedTimerList');
    var activeSec = document.getElementById('activeTimersSection');
    var finishedSec = document.getElementById('finishedTimersSection');
    if (!activeEl || !finishedEl) return;

    var active = TLI.Data.activeTimers.filter(function(t) { return !t.finished; });
    var finished = TLI.Data.activeTimers.filter(function(t) { return t.finished; }).concat(TLI.Data.finishedTimers || []);

    if (activeSec) activeSec.style.display = active.length > 0 ? 'block' : 'none';
    if (finishedSec) finishedSec.style.display = finished.length > 0 ? 'block' : 'none';

    activeEl.innerHTML = active.map(function(t) {
      var remaining = t.endTime - Date.now();
      var pct = Math.max(0, Math.min(100, 100 - (remaining / t.duration) * 100));
      return '<div class="timer-card" id="timer-' + t.id + '">' +
        '<div class="timer-name">' + TLI.Utils.escapeHtml(t.name) + '</div>' +
        '<div class="timer-info">' + TLI.Utils.escapeHtml(t.machineName) + '</div>' +
        '<div class="timer-remaining" id="timer-rem-' + t.id + '">' + TLI.Utils.formatTimer(remaining) + '</div>' +
        '<div class="progress-bar"><div class="progress-fill" id="timer-bar-' + t.id + '" style="width:' + pct + '%"></div></div>' +
        '<button class="btn btn-danger btn-sm" style="margin-top:8px" onclick="TLI.UI.stopTimer(' + t.id + ')">🛑 Arrêter</button>' +
        '</div>';
    }).join('');

    finishedEl.innerHTML = finished.slice(-10).map(function(t) {
      return '<div class="timer-card finished"><div class="timer-name">' + TLI.Utils.escapeHtml(t.name) + '</div><div class="timer-info">' + TLI.Utils.escapeHtml(t.machineName) + ' — Terminé</div></div>';
    }).join('');
  },

  stopTimer: function(id) {
    var timer = TLI.Data.activeTimers.find(function(t) { return t.id === id; });
    if (!timer) return;
    timer.finished = true;
    TLI.Data.finishedTimers.push(timer);
    TLI.Data.activeTimers = TLI.Data.activeTimers.filter(function(t) { return t.id !== id; });
    TLI.Data.saveTimers();
    TLI.UI.renderTimers();
    TLI.UI.renderStats();
    TLI.UI.showToast('Timer arrêté', 'warning');
    TLI.Server.pushTimers();
  },

  // ---------- MACHINES ----------
  bindMachines: function() {
    document.getElementById('btnAddMachine').addEventListener('click', function() {
      document.getElementById('newMachineName').value = '';
      TLI.UI.openModal('addMachineModal');
    });
    document.getElementById('btnSaveNewMachine').addEventListener('click', function() {
      var name = document.getElementById('newMachineName').value.trim();
      if (!name) { TLI.UI.showToast('Nom requis', 'error'); return; }
      TLI.Data.machines.push({
        id: TLI.Utils.generateId(),
        name: name,
        type: document.getElementById('newMachineType').value,
        totalHours: 0,
        maintenance: []
      });
      TLI.Data.save();
      TLI.Server.push('machines');
      TLI.UI.closeModal('addMachineModal');
      TLI.UI.renderMachines();
      TLI.UI.updateMachineSelects();
      TLI.UI.showToast('Machine ajoutée', 'success');
    });
    document.getElementById('btnSaveMaint').addEventListener('click', function() {
      var machine = TLI.Data.getMachine(TLI.Data.currentMachineId);
      if (!machine) return;
      machine.maintenance.push({
        id: TLI.Utils.generateId(),
        type: document.getElementById('maintType').value,
        date: document.getElementById('maintDate').value,
        hours: parseFloat(document.getElementById('maintHours').value) || 0,
        notes: document.getElementById('maintNotes').value.trim()
      });
      TLI.Data.save();
      TLI.Server.push('machines');
      TLI.UI.renderMachineDetail(TLI.Data.currentMachineId);
      TLI.UI.renderMachines();
      TLI.UI.showToast('Entretien enregistré', 'success');
    });
    document.getElementById('btnUpdateMachineInfo').addEventListener('click', function() {
      var m = TLI.Data.getMachine(TLI.Data.currentMachineId);
      if (!m) return;
      m.name = document.getElementById('editMachineInfoName').value.trim();
      m.type = document.getElementById('editMachineInfoType').value;
      TLI.Data.save();
      TLI.Server.push('machines');
      TLI.UI.closeModal('editMachineInfoModal');
      TLI.UI.renderMachines();
      TLI.UI.updateMachineSelects();
      TLI.UI.showToast('Machine modifiée', 'success');
    });
    document.getElementById('btnDeleteMachineInfo').addEventListener('click', function() {
      if (!confirm('Supprimer cette machine ?')) return;
      TLI.Data.machines = TLI.Data.machines.filter(function(m) { return m.id !== TLI.Data.currentMachineId; });
      TLI.Data.save();
      TLI.Server.push('machines');
      TLI.UI.closeModal('editMachineInfoModal');
      TLI.UI.closeModal('machineDetailModal');
      TLI.UI.renderMachines();
      TLI.UI.updateMachineSelects();
      TLI.UI.showToast('Machine supprimée', 'warning');
    });
  },

  renderMachines: function() {
    var el = document.getElementById('machinesList');
    if (!el) return;
    if (TLI.Data.machines.length === 0) {
      el.innerHTML = '<div class="empty-state"><div class="icon">🖨️</div><div>Aucune machine</div></div>';
      return;
    }
    el.innerHTML = TLI.Data.machines.map(function(m) {
      var busy = TLI.Data.isMachineBusy(m.id);
      return '<div class="machine-card ' + (busy ? 'busy' : 'available') + '" onclick="TLI.UI.showMachineDetail(' + m.id + ')">' +
        '<div class="machine-name">' + TLI.Utils.escapeHtml(m.name) + '</div>' +
        '<div class="machine-info">' + (m.type || 'fdm').toUpperCase() + ' | ' + (busy ? '🔴 Occupée' : '🟢 Disponible') + '</div>' +
        '<div class="machine-hours">' + (m.totalHours || 0) + 'h total | ' + (m.maintenance ? m.maintenance.length : 0) + ' entretien(s)</div>' +
        '</div>';
    }).join('');
  },

  showMachineDetail: function(id) {
    var m = TLI.Data.getMachine(id);
    if (!m) return;
    TLI.Data.currentMachineId = id;
    this.renderMachineDetail(id);
    this.openModal('machineDetailModal');
  },

  renderMachineDetail: function(id) {
    var m = TLI.Data.getMachine(id);
    if (!m) return;
    document.getElementById('machineDetailTitle').textContent = m.name;
    var html = '<div class="form-group"><label class="form-label">Type</label><div class="form-input" style="background:var(--glass)">' + (m.type || 'fdm').toUpperCase() + '</div></div>';
    html += '<div class="form-group"><label class="form-label">Heures totales</label><div class="form-input" style="background:var(--glass)">' + (m.totalHours || 0) + 'h</div></div>';
    document.getElementById('machineDetailContent').innerHTML = html;
    var maintList = document.getElementById('machineMaintList');
    if (maintList) {
      if (!m.maintenance || m.maintenance.length === 0) {
        maintList.innerHTML = '<div style="color:#666;font-size:.8rem">Aucun entretien</div>';
      } else {
        maintList.innerHTML = m.maintenance.slice().reverse().map(function(mt) {
          return '<div class="maintenance-item"><div class="maintenance-item-header"><div class="maintenance-item-title">' + (mt.type || 'Autre') + '</div><div class="maintenance-item-date">' + TLI.Utils.formatDate(mt.date) + '</div></div><div class="maintenance-item-notes">' + (mt.hours ? mt.hours + 'h | ' : '') + TLI.Utils.escapeHtml(mt.notes || '') + '</div></div>';
        }).join('');
      }
    }
    document.getElementById('maintDate').value = TLI.Utils.toISODate(new Date());
  },

  updateMachineSelects: function() {
    var timerSel = document.getElementById('timerMachine');
    var orderSel = document.getElementById('orderMachine');
    var opts = TLI.Data.machines.map(function(m) {
      return '<option value="' + m.id + '">' + TLI.Utils.escapeHtml(m.name) + '</option>';
    }).join('');
    if (timerSel) timerSel.innerHTML = opts;
    if (orderSel) orderSel.innerHTML = opts;
  },

  // ---------- CALCULATOR ----------
  bindCalculator: function() {
    var inputs = ['calcService','calcType','calcWeight','calcPrintHours','calcModelingHours','calcDesignHours','calcPostProdHours','calcQty'];
    inputs.forEach(function(id) {
      var el = document.getElementById(id);
      if (el) el.addEventListener('input', function() { TLI.Calc.update(); });
    });
    document.getElementById('btnSaveRates').addEventListener('click', function() {
      TLI.Data.rates.modeling = parseFloat(document.getElementById('rateModeling').value) || 35;
      TLI.Data.rates.design = parseFloat(document.getElementById('rateDesign').value) || 45;
      TLI.Data.rates.fdm = parseFloat(document.getElementById('rateFdm').value) || 2;
      TLI.Data.rates.resin = parseFloat(document.getElementById('rateResin').value) || 3;
      TLI.Data.rates.postProd = parseFloat(document.getElementById('ratePostProd').value) || 15;
      TLI.Data.rates.filamentKg = parseFloat(document.getElementById('priceFilament').value) || 25;
      TLI.Data.rates.resinKg = parseFloat(document.getElementById('priceResinKg').value) || 60;
      TLI.Data.saveRates();
      TLI.Calc.update();
      TLI.UI.showToast('Tarifs sauvegardés', 'success');
      TLI.Server.push('rates');
    });
  },


  // ---------- SETTINGS ----------
  bindSettings: function() {
    document.getElementById('btnSaveConfig').addEventListener('click', function() {
      var url = document.getElementById('apiUrl').value.trim();
      if (url) localStorage.setItem('tli15_apiUrl', url);
      TLI.UI.showToast('Config sauvegardée', 'success');
    });
    document.getElementById('btnTestConn').addEventListener('click', function() {
      TLI.UI.showToast('Test de connexion...', 'success');
      TLI.Server.sync();
    });
    document.getElementById('btnExport').addEventListener('click', function() {
      var data = JSON.stringify({
        orders: TLI.Data.orders, clients: TLI.Data.clients, models: TLI.Data.models,
        stock: TLI.Data.stock, planningEvents: TLI.Data.planningEvents,
        machines: TLI.Data.machines, qualityResults: TLI.Data.qualityResults,
        generalPhotos: TLI.Data.generalPhotos, rates: TLI.Data.rates
      });
      var blob = new Blob([data], {type: 'application/json'});
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'tli_backup_' + new Date().toISOString().slice(0,10) + '.json';
      a.click();
      TLI.UI.showToast('Export réussi', 'success');
    });
    document.getElementById('btnImportTrigger').addEventListener('click', function() {
      document.getElementById('importFile').click();
    });
    document.getElementById('importFile').addEventListener('change', function(e) {
      var file = e.target.files[0];
      if (!file) return;
      var reader = new FileReader();
      reader.onload = function(ev) {
        try {
          var data = JSON.parse(ev.target.result);
          if (data.orders) TLI.Data.orders = data.orders;
          if (data.clients) TLI.Data.clients = data.clients;
          if (data.models) TLI.Data.models = data.models;
          if (data.stock) TLI.Data.stock = data.stock;
          if (data.planningEvents) TLI.Data.planningEvents = data.planningEvents;
          if (data.machines) TLI.Data.machines = data.machines;
          if (data.qualityResults) TLI.Data.qualityResults = data.qualityResults;
          if (data.generalPhotos) TLI.Data.generalPhotos = data.generalPhotos;
          if (data.rates) TLI.Data.rates = data.rates;
          TLI.Data.save();
          TLI.UI.renderAll();
          TLI.Calc.update();
          TLI.UI.showToast('Import réussi', 'success');
        } catch(err) { TLI.UI.showToast('Fichier invalide', 'error'); }
      };
      reader.readAsText(file);
      this.value = '';
    });
    document.getElementById('btnLogout').addEventListener('click', function() {
      TLI.Server.logout();
    });
    // v16: handler btnInstallPWA corrigé
    document.getElementById('btnInstallPWA').addEventListener('click', function() {
      if (!TLI.App.deferredPrompt) {
        TLI.UI.showToast('Installation non disponible. Utilisez le menu de votre navigateur.', 'warning');
        return;
      }
      TLI.App.deferredPrompt.prompt();
      TLI.App.deferredPrompt.userChoice.then(function(choice) {
        if (choice.outcome === 'accepted') {
          TLI.UI.showToast('Installation en cours...', 'success');
        } else {
          TLI.UI.showToast('Installation annulée', 'warning');
        }
        TLI.App.deferredPrompt = null;
        document.getElementById('btnInstallPWA').style.display = 'none';
      });
    });
    document.getElementById('btnClearAll').addEventListener('click', function() {
      if (!confirm('TOUT effacer ? C\'est irréversible !')) return;
      TLI.Data.orders = []; TLI.Data.clients = []; TLI.Data.models = [];
      TLI.Data.stock = []; TLI.Data.planningEvents = [];
      TLI.Data.generalPhotos = []; TLI.Data.qualityResults = {};
      TLI.Data.save();
      TLI.UI.renderAll();
      TLI.UI.showToast('Tout effacé', 'warning');
      TLI.Server.push('orders'); TLI.Server.push('clients'); TLI.Server.push('stock');
      TLI.Server.push('planning'); TLI.Server.push('machines'); TLI.Server.push('photos');
    });
  },

  // ---------- PHOTOS ----------
  bindPhotos: function() {
    document.getElementById('btnClosePhoto').addEventListener('click', function() {
      document.getElementById('photoOverlay').classList.remove('active');
    });
    document.getElementById('btnCloseGalleryPhoto').addEventListener('click', function() {
      document.getElementById('galleryPhotoOverlay').classList.remove('active');
    });
  },

  renderPhotos: function() {
    var el = document.getElementById('photosGallery');
    if (!el) return;
    if (TLI.Data.generalPhotos.length === 0) {
      el.innerHTML = '<div class="empty-state"><div class="icon">📷</div><div>Aucune photo</div></div>';
      return;
    }
    var total = TLI.Data.generalPhotos.length;
    el.innerHTML = TLI.Data.generalPhotos.slice().reverse().map(function(p, idx) {
      var realIdx = total - 1 - idx;
      return '<div class="photo-item" style="position:relative" onclick="TLI.UI.showGalleryPhoto(' + idx + ')">' +
        '<img src="' + p.src + '" alt="Photo">' +
        '<button class="photo-delete" onclick="event.stopPropagation();TLI.Photos.deletePhoto(' + realIdx + ')" title="Supprimer">×</button>' +
      '</div>';
    }).join('');
  },

  showGalleryPhoto: function(idx) {
    var photos = TLI.Data.generalPhotos.slice().reverse();
    if (!photos[idx]) return;
    document.getElementById('galleryPhotoOverlayImg').src = photos[idx].src;
    document.getElementById('galleryPhotoInfo').textContent = TLI.Utils.formatDateTime(photos[idx].date);
    document.getElementById('galleryPhotoOverlay').classList.add('active');
  },

  // ---------- CALL ----------
  bindCall: function() {
    // Les event listeners d'appel sont déjà dans bindClients
  },

  // ---------- QUALITY ----------
  bindQuality: function() {
    document.getElementById('qualityValidateBtn').addEventListener('click', function() {
      TLI.Photos.validateQuality();
    });
    document.getElementById('btnSkipQuality').addEventListener('click', function() {
      TLI.Photos.skipQuality();
    });
  },

  renderQualityChecklist: function() {
    var el = document.getElementById('qualityChecklist');
    if (!el) return;
    TLI.Data.checklist.forEach(function(item) { item.checked = false; });
    el.innerHTML = TLI.Data.checklist.map(function(item, idx) {
      return '<div class="checklist-item" onclick="TLI.UI.toggleQualityCheck(' + idx + ')"><input type="checkbox" id="qc-' + idx + '" ' + (item.checked ? 'checked' : '') + ' onclick="event.stopPropagation();TLI.UI.toggleQualityCheck(' + idx + ')"><label for="qc-' + idx + '">' + TLI.Utils.escapeHtml(item.text) + '</label></div>';
    }).join('');
    this.updateQualityProgress();
  },

  toggleQualityCheck: function(idx) {
    TLI.Data.checklist[idx].checked = !TLI.Data.checklist[idx].checked;
    var cb = document.getElementById('qc-' + idx);
    if (cb) cb.checked = TLI.Data.checklist[idx].checked;
    this.updateQualityProgress();
  },

  updateQualityProgress: function() {
    var total = TLI.Data.checklist.length;
    var checked = TLI.Data.checklist.filter(function(i) { return i.checked; }).length;
    var pct = Math.round((checked / total) * 100);
    var bar = document.getElementById('qualityProgress');
    var txt = document.getElementById('qualityPercent');
    var btn = document.getElementById('qualityValidateBtn');
    if (bar) bar.style.width = pct + '%';
    if (txt) txt.textContent = pct + '% complete';
    if (btn) btn.disabled = pct < 100;
  }
};
