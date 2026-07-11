// ============================================================
// TLI v16 — Module Prospection (Carte + Liste + Gestion)
// ============================================================
var TLI = window.TLI || {};

TLI.Prospection = {
  map: null,
  clusterGroup: null,
  originMarker: null,
  allMarkers: [],
  filteredData: [],
  toSolicit: null,
  mapInitialized: false,
  colors: { A:'#00d4ff', B:'#ffaa00', C:'#a0aec0', sol:'#ff6b6b' },
  sortBy: 'dist',
  sortAsc: true,
  currentDetailId: null,
  prospectStatus: {},
  prospectHistory: {},
  lastContact: {},
  prospectClientLinks: {},

  STATUS_LABELS: {
    '': '—',
    'a_contacter': '📞 À contacter',
    'relance': '🔄 En relance',
    'contacte': '✅ Contacté',
    'client': '🤝 Client',
    'perdu': '❌ Perdu'
  },

  init: function() {
    this.toSolicit = new Set(JSON.parse(localStorage.getItem('tli_prospects_sol')||'[]'));
    this.prospectStatus = JSON.parse(localStorage.getItem('tli_prospect_status')||'{}');
    this.prospectHistory = JSON.parse(localStorage.getItem('tli_prospect_history')||'{}');
    this.lastContact = JSON.parse(localStorage.getItem('tli_prospect_lastcontact')||'{}');
    this.prospectClientLinks = JSON.parse(localStorage.getItem('tli_prospect_clientlinks')||'{}');
    this._customProspects = JSON.parse(localStorage.getItem('tli_prospects_custom')||'[]');
    if (this._customProspects.length > 0 && typeof PROSPECTS_DATA !== 'undefined') {
      var existingIds = new Set(PROSPECTS_DATA.map(function(p) { return p.id; }));
      this._customProspects.forEach(function(p) {
        if (!existingIds.has(p.id)) { PROSPECTS_DATA.push(p); existingIds.add(p.id); }
      });
    }

    var sel = document.getElementById('prospectSecteur');
    if (sel && typeof PROSPECTS_DATA !== 'undefined') {
      var secteurs = [];
      var seen = {};
      PROSPECTS_DATA.forEach(function(p) {
        if (p.secteur && !seen[p.secteur]) { seen[p.secteur] = true; secteurs.push(p.secteur); }
      });
      secteurs.sort();
      secteurs.forEach(function(s) {
        var o = document.createElement('option'); o.value = s; o.textContent = s; sel.appendChild(o);
      });
    }

    if (typeof PROSPECTS_DATA !== 'undefined') {
      var self = this;
      PROSPECTS_DATA.forEach(function(p) {
        var col = self.toSolicit.has(p.id) ? self.colors.sol : (self.colors[p.notation] || self.colors.C);
        var m = L.circleMarker([p.lat, p.lng], {
          radius: p.notation === 'A' ? 8 : 6,
          fillColor: col, color: '#fff', weight: 2, opacity: 1, fillOpacity: 0.9
        });
        m._notation = p.notation;
        m._id = p.id;
        m.bindPopup(self.makePopup(p));
        m.bindTooltip(p.nom, { permanent: false, direction: 'top', className: 'permanent-tooltip', offset: [0, -10] });
        m.on('click', function() { self.highlightItem(p.id); });
        self.allMarkers.push({ id: p.id, marker: m, data: p });
      });
    }

    // Bind modals
    document.getElementById('btnSaveProspectDetail').addEventListener('click', function() { TLI.Prospection.saveDetail(); });
    document.getElementById('btnDeleteProspect').addEventListener('click', function() { TLI.Prospection.deleteProspect(); });
    document.getElementById('btnSaveNewProspect').addEventListener('click', function() { TLI.Prospection.saveNewProspect(); });

    // Point de départ
    var btnUsePos = document.getElementById('btnUseMyPos');
    if (btnUsePos) btnUsePos.addEventListener('click', function() { TLI.Prospection.useMyPosition(); });
    var btnSetOrigin = document.getElementById('btnSetOrigin');
    if (btnSetOrigin) btnSetOrigin.addEventListener('click', function() { TLI.Prospection.geocodeOrigin(); });
    var originInput = document.getElementById('prospectOrigin');
    if (originInput && this.origin) {
      originInput.value = this.origin.label || '';
      var status = document.getElementById('originStatus');
      if (status) status.textContent = '✅ ' + (this.origin.label || 'Point de départ');
    }

    this.applyFilters();
    this.updateSolCount();
    // Charger depuis le serveur si connecté
    if (TLI.Server.isConnected) {
      TLI.Server.requestProspects();
    }
  },

  // v16: nouvelle méthode — naviguer depuis popup carte vers client
  gotoClient: function(clientId) {
    // Fermer le popup de la carte
    if (this.map) this.map.closePopup();
    // Fermer tous les modals
    TLI.UI.closeAllPopups();
    // Switcher vers l'onglet clients
    document.querySelectorAll('.nav-tab').forEach(function(t) { t.classList.remove('active'); });
    document.querySelectorAll('.section').forEach(function(s) { s.classList.remove('active'); });
    var clientTab = document.querySelector('.nav-tab[data-section="clients"]');
    var clientSection = document.getElementById('clients');
    if (clientTab) clientTab.classList.add('active');
    if (clientSection) clientSection.classList.add('active');
    // Afficher le détail client
    setTimeout(function() {
      TLI.UI.showClientDetail(clientId);
    }, 100);
  },

  initMap: function() {
    if (this.mapInitialized) {
      setTimeout(function() { if(TLI.Prospection.map) TLI.Prospection.map.invalidateSize(); }, 100);
      return;
    }
    this.map = L.map('prospectMap').setView([47.3, -1.5], 9);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OSM', maxZoom: 19
    }).addTo(this.map);

    var self = this;
    this.clusterGroup = L.markerClusterGroup({
      chunkedLoading: true, spiderfyOnMaxZoom: true,
      iconCreateFunction: function(cluster) {
        var count = cluster.getChildCount();
        var col = self.colors.B;
        var childs = cluster.getAllChildMarkers();
        if (childs.some(function(m) { return m._notation === 'A'; })) col = self.colors.A;
        else if (childs.some(function(m) { return m._notation === 'B'; })) col = self.colors.B;
        return L.divIcon({
          html: '<div style="background:' + col + ';width:40px;height:40px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#000;font-weight:800;font-size:.85rem;border:3px solid #fff;box-shadow:0 2px 10px rgba(0,0,0,0.4);">' + count + '</div>',
          className: 'marker-cluster', iconSize: [40, 40]
        });
      }
    });
    this.map.addLayer(this.clusterGroup);
    this.mapInitialized = true;

    // Recréer tous les markers avec tooltip et bonne taille
    this.allMarkers.forEach(function(am) {
      am.marker.setRadius(am.data.notation === 'A' ? 18 : 14);
      am.marker.setStyle({ weight: 3 });
      am.marker.bindTooltip(am.data.nom, { permanent: false, direction: 'top', className: 'permanent-tooltip', offset: [0, -10] });
    });

    this.updateOriginMarker();
    this.applyFilters();
  },

  getColor: function(p) {
    return this.toSolicit.has(p.id) ? this.colors.sol : (this.colors[p.notation] || this.colors.C);
  },

  // v16: makePopup avec boutons gotoClient() pour les clients liés
  makePopup: function(p) {
    var self = TLI.Prospection;
    var sol = self.toSolicit.has(p.id) ? '<span class="badge sol">★ À solliciter</span>' : '';
    var notes = p.notes ? '<p>📝 ' + p.notes + '</p>' : '';
    var status = self.prospectStatus[p.id] ? '<p>📌 ' + self.STATUS_LABELS[self.prospectStatus[p.id]] + '</p>' : '';
    var last = self.lastContact[p.id] ? '<p>📅 Dernier contact: ' + TLI.Utils.formatDate(self.lastContact[p.id]) + '</p>' : '';

    // Clients liés — v16: boutons qui appellent gotoClient()
    var links = self.prospectClientLinks[p.id] || [];
    var clientsHtml = '';
    if (links.length > 0) {
      clientsHtml = '<div style="margin-top:8px"><b>👤 Clients liés:</b></div>';
      links.forEach(function(cid) {
        var c = TLI.Data.getClient(cid);
        if (c) {
          clientsHtml += '<div style="display:inline-flex;align-items:center;gap:4px;margin:4px 4px 0 0;background:var(--glass);border:1px solid var(--glass-border);border-radius:8px;padding:4px 10px;font-size:.75rem">' +
            '<button class="btn btn-sm" style="width:auto;padding:2px 6px;margin-top:0;font-size:.75rem;background:transparent;border:none;color:var(--primary)" onclick="TLI.Prospection.gotoClient(' + cid + ');">' + TLI.Utils.escapeHtml(c.name) + '</button>' +
            '<span style="cursor:pointer;color:var(--secondary);font-weight:800;margin-left:4px" onclick="event.stopPropagation();TLI.Prospection.unlinkClientFromPopup(' + p.id + ',' + cid + ');" title="Délier">❌</span>' +
          '</div>';
        }
      });
    }

    return '<div class="popup-prospect">' +
      '<h3>' + p.nom + '</h3>' +
      '<p>📍 ' + p.adresse + ', ' + p.cp + ' ' + p.ville + '</p>' +
      '<p>🏭 ' + p.secteur + ' • NAF ' + p.naf + '</p>' +
      '<p>👥 ' + p.effectif + ' salariés • ' + p.categorie + '</p>' +
      '<p>📏 ' + (self.origin ? self.distanceFromOrigin(p.lat, p.lng).toFixed(1) + ' km (dep. origine)' : p.distance.toFixed(1) + ' km de Nantes') + '</p>' +
      notes + status + last + clientsHtml +
      '<div style="margin-top:8px">' +
        '<span class="badge ' + p.notation + '">' + p.notation + '</span>' + sol +
      '</div>' +
      '<div style="margin-top:10px;border-radius:8px;overflow:hidden;border:1px solid rgba(255,255,255,.1)">' +
        '<iframe width="100%" height="150" style="border:0;display:block" ' +
        'src="https://www.google.com/maps/embed?pb=!4v' + Date.now() + '!6m8!1m7!1sCAoSLEFGMVFpcE8!2m2!1d' + p.lat + '!2d' + p.lng + '!3f0!4f0!5f0.7820865974627469" ' +
        'allowfullscreen loading="lazy"></iframe>' +
      '</div>' +
      '<div style="display:flex;gap:6px;margin-top:10px">' +
        '<button class="btn btn-primary" style="flex:1;margin-top:0;padding:6px 10px;font-size:.75rem" onclick="TLI.Prospection.toggleSol(' + p.id + '); setTimeout(function(){ var m=TLI.Prospection.allMarkers.find(function(x){return x.id===' + p.id + ';}); if(m) m.marker.setPopupContent(TLI.Prospection.makePopup(m.data)); }, 50);">' +
          (self.toSolicit.has(p.id) ? 'Retirer ★' : '⭐ À solliciter') +
        '</button>' +
        '<button class="btn btn-secondary" style="flex:1;margin-top:0;padding:6px 10px;font-size:.75rem" onclick="TLI.Prospection.showDetailModal(' + p.id + ')">✏️ Modifier</button>' +
      '</div>' +
    '</div>';
  },

  setSort: function(by) {
    this.sortBy = by;
    document.querySelectorAll('#prospection .sort-btn').forEach(function(b) { b.classList.remove('active'); });
    document.getElementById('sort-' + by).classList.add('active');
    this.applyFilters();
  },

  sortData: function(data) {
    var self = this;
    data.sort(function(a, b) {
      var cmp = 0;
      if (self.sortBy === 'dist') cmp = a.distance - b.distance;
      else if (self.sortBy === 'eff') cmp = a.effectif - b.effectif;
      else if (self.sortBy === 'note') {
        var order = { A: 0, B: 1, C: 2 };
        cmp = (order[a.notation] || 2) - (order[b.notation] || 2);
      }
      else if (self.sortBy === 'name') cmp = a.nom.localeCompare(b.nom);
      return cmp;
    });
    return data;
  },

  applyFilters: function() {
    if (typeof PROSPECTS_DATA === 'undefined') return;
    var q = (document.getElementById('prospectSearch').value || '').toLowerCase();
    var secteur = document.getElementById('prospectSecteur').value;
    var notation = document.getElementById('prospectNotation').value;
    var distMax = parseInt(document.getElementById('prospectDist').value) || 200;
    var effMin = parseInt(document.getElementById('prospectEff').value) || 0;
    var catPme = document.getElementById('prospectCatPme').checked;
    var catEti = document.getElementById('prospectCatEti').checked;
    var catGe = document.getElementById('prospectCatGe').checked;
    var onlyNotes = document.getElementById('prospectOnlyNotes').checked;

    var cats = [];
    if (catPme) cats.push('PME'); if (catEti) cats.push('ETI'); if (catGe) cats.push('GE');

    var self = this;
    this.filteredData = PROSPECTS_DATA.filter(function(p) {
      if (q && !p.nom.toLowerCase().includes(q) && !p.secteur.toLowerCase().includes(q) && !p.naf.toLowerCase().includes(q) && !p.ville.toLowerCase().includes(q)) return false;
      if (secteur && p.secteur !== secteur) return false;
      if (notation && p.notation !== notation) return false;
      var dist = self.origin ? self.distanceFromOrigin(p.lat, p.lng) : p.distance;
      if (dist === null) dist = p.distance || 0;
      if (dist > distMax) return false;
      if (p.effectif < effMin) return false;
      if (cats.length && !cats.includes(p.categorie)) return false;
      if (onlyNotes && !p.notes) return false;
      return true;
    });

    this.filteredData = this.sortData(this.filteredData.slice());

    if (this.clusterGroup) {
      this.clusterGroup.clearLayers();
      var visibleIds = new Set(self.filteredData.map(function(p) { return p.id; }));
      self.allMarkers.forEach(function(am) {
        if (visibleIds.has(am.id)) self.clusterGroup.addLayer(am.marker);
      });
    }

    var a = this.filteredData.filter(function(p) { return p.notation === 'A'; }).length;
    var b = this.filteredData.filter(function(p) { return p.notation === 'B'; }).length;
    var c = this.filteredData.filter(function(p) { return p.notation === 'C'; }).length;
    var solCount = this.filteredData.filter(function(p) { return self.toSolicit.has(p.id); }).length;
    document.getElementById('statA').textContent = a;
    document.getElementById('statB').textContent = b;
    document.getElementById('statC').textContent = c;
    document.getElementById('statSol').textContent = solCount;
    document.getElementById('prospectCount').textContent = this.filteredData.length + ' résultat' + (this.filteredData.length > 1 ? 's' : '');

    this.renderList(this.filteredData);
  },

  renderList: function(data) {
    var box = document.getElementById('prospectResults');
    if (!box) return;
    if (!data.length) { box.innerHTML = '<div style="padding:30px;text-align:center;color:#666;font-size:.85rem">Aucun résultat</div>'; return; }
    var self = this;
    box.innerHTML = data.slice(0, 250).map(function(p) {
      var badgeClass = self.toSolicit.has(p.id) ? 'sol' : p.notation;
      var badgeText = self.toSolicit.has(p.id) ? '★' : p.notation;
      var statusLabel = self.prospectStatus[p.id] ? '<span style="color:#888;font-size:.7rem">' + self.STATUS_LABELS[self.prospectStatus[p.id]] + '</span>' : '';
      var dist = self.origin ? self.distanceFromOrigin(p.lat, p.lng) : p.distance;
      if (dist === null) dist = p.distance || 0;
      var distLabel = self.origin ? '• ' + dist.toFixed(1) + 'km (dep. origine)' : '• ' + dist.toFixed(0) + 'km';
      return '<div class="res-item" id="prospect-item-' + p.id + '" onclick="TLI.Prospection.flyToProspect(' + p.id + ')">' +
        '<div class="res-check"><input type="checkbox" ' + (self.toSolicit.has(p.id) ? 'checked' : '') + ' onclick="event.stopPropagation();TLI.Prospection.toggleSol(' + p.id + ')"></div>' +
        '<div class="res-body">' +
          '<div class="res-name">' + p.nom + '</div>' +
          '<div class="res-meta">' +
            '<span class="res-badge ' + badgeClass + '">' + badgeText + '</span>' +
            '<span>' + p.secteur + '</span>' +
            '<span>• ' + p.ville + '</span>' +
            '<span>' + distLabel + '</span>' +
            '<span>• ' + p.effectif + 'p</span>' +
            (statusLabel ? '<span>• ' + statusLabel + '</span>' : '') +
          '</div>' +
        '</div>' +
        '<div class="res-actions">' +
          '<button class="res-action-btn" onclick="event.stopPropagation();TLI.Prospection.showDetailModal(' + p.id + ')" title="Détail">✏️</button>' +
        '</div>' +
      '</div>';
    }).join('');
    if (data.length > 250) box.innerHTML += '<div style="padding:12px;text-align:center;color:#666;font-size:.75rem">+ ' + (data.length - 250) + ' résultats masqués — affinez la recherche</div>';
  },

  flyToProspect: function(id) {
    var p = PROSPECTS_DATA.find(function(x) { return x.id === id; });
    if (!p) return;
    if (this.map) this.map.setView([p.lat, p.lng], 15);
    var m = this.allMarkers.find(function(x) { return x.id === id; });
    if (m) { m.marker.openPopup(); this.highlightItem(id); }
    if (window.innerWidth <= 768) document.getElementById('prospectSidebar').classList.add('hidden');
  },

  highlightItem: function(id) {
    document.querySelectorAll('#prospection .res-item').forEach(function(el) { el.classList.remove('active'); });
    var el = document.getElementById('prospect-item-' + id);
    if (el) { el.classList.add('active'); el.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
  },

  toggleSol: function(id) {
    if (this.toSolicit.has(id)) this.toSolicit.delete(id); else this.toSolicit.add(id);
    localStorage.setItem('tli_prospects_sol', JSON.stringify([...this.toSolicit]));
    this.updateSolCount();
    this.applyFilters();
    TLI.Server.pushProspects();
    var m = this.allMarkers.find(function(x) { return x.id === id; });
    if (m) m.marker.setPopupContent(this.makePopup(m.data));
  },

  updateSolCount: function() {
    var count = this.filteredData ? this.filteredData.filter(function(p) { return TLI.Prospection.toSolicit.has(p.id); }).length : 0;
    var el = document.getElementById('statSol');
    if (el) el.textContent = count;
  },

  resetFilters: function() {
    document.getElementById('prospectSearch').value = '';
    document.getElementById('prospectSecteur').value = '';
    document.getElementById('prospectNotation').value = '';
    document.getElementById('prospectDist').value = 200; document.getElementById('prospectValDist').textContent = '200 km';
    document.getElementById('prospectEff').value = 0; document.getElementById('prospectValEff').textContent = '0';
    document.getElementById('prospectCatPme').checked = true;
    document.getElementById('prospectCatEti').checked = true;
    document.getElementById('prospectCatGe').checked = true;
    document.getElementById('prospectOnlyNotes').checked = false;
    this.applyFilters();
  },

  // ─── DÉTAIL & ÉDITION ───
  // v16: showDetailModal avec TOUS les champs éditables
  showDetailModal: function(id) {
    var p = PROSPECTS_DATA.find(function(x) { return x.id === id; });
    if (!p) return;
    this.currentDetailId = id;
    document.getElementById('prospectDetailTitle').textContent = p.nom;

    // v16: grille d'édition avec inputs pour tous les champs
    var html = '<div class="detail-grid">' +
      '<div class="detail-field"><label>Nom</label><input type="text" class="form-input" id="prospectDetailName" value="' + TLI.Utils.escapeHtml(p.nom || '') + '"></div>' +
      '<div class="detail-field"><label>SIRET</label><input type="text" class="form-input" id="prospectDetailSiret" value="' + TLI.Utils.escapeHtml(p.siret || '') + '"></div>' +
      '<div class="detail-field"><label>Secteur</label><input type="text" class="form-input" id="prospectDetailSecteur" value="' + TLI.Utils.escapeHtml(p.secteur || '') + '"></div>' +
      '<div class="detail-field"><label>Effectif</label><input type="number" class="form-input" id="prospectDetailEff" value="' + (p.effectif || 0) + '"></div>' +
      '<div class="detail-field"><label>Catégorie</label><select class="form-select" id="prospectDetailCat"><option value="PME"' + (p.categorie === 'PME' ? ' selected' : '') + '>PME</option><option value="ETI"' + (p.categorie === 'ETI' ? ' selected' : '') + '>ETI</option><option value="GE"' + (p.categorie === 'GE' ? ' selected' : '') + '>GE</option></select></div>' +
      '<div class="detail-field"><label>Notation</label><select class="form-select" id="prospectDetailNotation"><option value="A"' + (p.notation === 'A' ? ' selected' : '') + '>A — Prioritaire</option><option value="B"' + (p.notation === 'B' ? ' selected' : '') + '>B — Secondaire</option><option value="C"' + (p.notation === 'C' ? ' selected' : '') + '>C — Faible potentiel</option></select></div>' +
      '<div class="detail-field"><label>Adresse</label><input type="text" class="form-input" id="prospectDetailAdresse" value="' + TLI.Utils.escapeHtml(p.adresse || '') + '"></div>' +
      '<div class="detail-field"><label>CP</label><input type="text" class="form-input" id="prospectDetailCp" value="' + TLI.Utils.escapeHtml(p.cp || '') + '"></div>' +
      '<div class="detail-field"><label>Ville</label><input type="text" class="form-input" id="prospectDetailVille" value="' + TLI.Utils.escapeHtml(p.ville || '') + '"></div>' +
      '<div class="detail-field"><label>Latitude</label><input type="number" class="form-input" id="prospectDetailLat" value="' + (p.lat || 0) + '" step="any"></div>' +
      '<div class="detail-field"><label>Longitude</label><input type="number" class="form-input" id="prospectDetailLng" value="' + (p.lng || 0) + '" step="any"></div>' +
    '</div>';
    document.getElementById('prospectDetailContent').innerHTML = html;

    document.getElementById('prospectDetailNotes').value = p.notes || '';
    document.getElementById('prospectDetailStatus').value = this.prospectStatus[id] || '';
    document.getElementById('prospectDetailLastContact').value = this.lastContact[id] || '';

    // Historique
    var hist = this.prospectHistory[id] || [];
    var histEl = document.getElementById('prospectDetailHistory');
    if (hist.length === 0) {
      histEl.innerHTML = '<div style="color:#666;font-size:.8rem">Aucun historique</div>';
    } else {
      histEl.innerHTML = '<div class="card-title" style="font-size:.85rem;margin-bottom:6px">📋 Historique</div>' +
        hist.slice(-10).reverse().map(function(h) {
          return '<div class="history-item"><b>' + TLI.Utils.formatDateTime(h.date) + '</b> — ' + h.action + '</div>';
        }).join('');
    }

    // Clients liés
    var links = this.prospectClientLinks[id] || [];
    var clientsDiv = document.getElementById('prospectDetailClients');
    var clientSelect = document.getElementById('prospectDetailClientSelect');

    // Remplir le select
    clientSelect.innerHTML = '<option value="">-- Choisir un client existant --</option>' +
      TLI.Data.clients.map(function(c) {
        return '<option value="' + c.id + '">' + TLI.Utils.escapeHtml(c.name) + (c.company ? ' (' + c.company + ')' : '') + '</option>';
      }).join('');

    // Afficher les clients liés
    if (links.length === 0) {
      clientsDiv.innerHTML = '<div style="color:#666;font-size:.8rem">Aucun client lié</div>';
    } else {
      clientsDiv.innerHTML = links.map(function(cid) {
        var c = TLI.Data.getClient(cid);
        if (!c) return '';
        return '<div style="display:flex;align-items:center;gap:6px;padding:6px 10px;background:var(--glass);border-radius:8px;margin-bottom:4px">' +
          '<span style="flex:1;font-size:.85rem">' + TLI.Utils.escapeHtml(c.name) + '</span>' +
          '<button class="btn btn-sm btn-danger" style="width:auto;padding:4px 8px;font-size:.7rem;margin-top:0" onclick="TLI.Prospection.unlinkClient(' + cid + ')">❌</button>' +
          '</div>';
      }).join('');
    }

    TLI.UI.openModal('prospectDetailModal');
  },

  // v16: saveDetail avec sauvegarde de TOUS les champs modifiés
  saveDetail: function() {
    var id = this.currentDetailId;
    if (!id) return;
    var p = PROSPECTS_DATA.find(function(x) { return x.id === id; });
    if (!p) return;

    var oldValues = {
      nom: p.nom || '', siret: p.siret || '', secteur: p.secteur || '',
      effectif: p.effectif || 0, categorie: p.categorie || '', notation: p.notation || '',
      adresse: p.adresse || '', cp: p.cp || '', ville: p.ville || '',
      lat: p.lat || 0, lng: p.lng || 0, notes: p.notes || ''
    };

    // Mettre à jour tous les champs
    p.nom = document.getElementById('prospectDetailName').value.trim();
    p.siret = document.getElementById('prospectDetailSiret').value.trim();
    p.secteur = document.getElementById('prospectDetailSecteur').value.trim();
    p.effectif = parseInt(document.getElementById('prospectDetailEff').value) || 0;
    p.categorie = document.getElementById('prospectDetailCat').value;
    p.notation = document.getElementById('prospectDetailNotation').value;
    p.adresse = document.getElementById('prospectDetailAdresse').value.trim();
    p.cp = document.getElementById('prospectDetailCp').value.trim();
    p.ville = document.getElementById('prospectDetailVille').value.trim();
    p.lat = parseFloat(document.getElementById('prospectDetailLat').value) || p.lat;
    p.lng = parseFloat(document.getElementById('prospectDetailLng').value) || p.lng;
    p.notes = document.getElementById('prospectDetailNotes').value.trim();

    // Mettre à jour le marker
    var markerData = this.allMarkers.find(function(x) { return x.id === id; });
    if (markerData) {
      markerData.data = p;
      markerData.marker._notation = p.notation;
      markerData.marker.setPopupContent(this.makePopup(p));
    }

    // Reste du saveDetail existant (status, lastContact, history...)
    var oldStatus = this.prospectStatus[id] || '';
    var newStatus = document.getElementById('prospectDetailStatus').value;
    var oldLast = this.lastContact[id] || '';
    var newLast = document.getElementById('prospectDetailLastContact').value;

    this.prospectStatus[id] = newStatus;
    this.lastContact[id] = newLast;

    if (!this.prospectHistory[id]) this.prospectHistory[id] = [];

    // Historique des modifications de champs
    if (oldValues.nom !== p.nom) this.prospectHistory[id].push({ date: new Date().toISOString(), action: 'Nom modifié : ' + p.nom });
    if (oldValues.secteur !== p.secteur) this.prospectHistory[id].push({ date: new Date().toISOString(), action: 'Secteur modifié' });
    if (oldValues.effectif !== p.effectif) this.prospectHistory[id].push({ date: new Date().toISOString(), action: 'Effectif modifié : ' + p.effectif });
    if (oldValues.notation !== p.notation) this.prospectHistory[id].push({ date: new Date().toISOString(), action: 'Notation modifiée : ' + p.notation });
    if (oldValues.adresse !== p.adresse) this.prospectHistory[id].push({ date: new Date().toISOString(), action: 'Adresse modifiée' });
    if (oldValues.notes !== p.notes) this.prospectHistory[id].push({ date: new Date().toISOString(), action: 'Notes modifiées' });
    if (oldStatus !== newStatus && newStatus) this.prospectHistory[id].push({ date: new Date().toISOString(), action: 'Statut changé: ' + this.STATUS_LABELS[newStatus] });
    if (oldLast !== newLast && newLast) this.prospectHistory[id].push({ date: new Date().toISOString(), action: 'Contact: ' + TLI.Utils.formatDate(newLast) });

    // Sauvegarder les custom prospects si c'est un prospect custom
    var customIdx = this._customProspects.findIndex(function(x) { return x.id === id; });
    if (customIdx >= 0) {
      this._customProspects[customIdx] = p;
      localStorage.setItem('tli_prospects_custom', JSON.stringify(this._customProspects));
    }

    localStorage.setItem('tli_prospect_status', JSON.stringify(this.prospectStatus));
    localStorage.setItem('tli_prospect_history', JSON.stringify(this.prospectHistory));
    localStorage.setItem('tli_prospect_lastcontact', JSON.stringify(this.lastContact));
    localStorage.setItem('tli_prospect_clientlinks', JSON.stringify(this.prospectClientLinks));
    TLI.Server.pushProspects();

    TLI.UI.closeModal('prospectDetailModal');
    TLI.UI.showToast('Prospect mis à jour', 'success');
    this.applyFilters();
  },

  linkClient: function() {
    var cid = parseInt(document.getElementById('prospectDetailClientSelect').value);
    if (!cid) { TLI.UI.showToast('Sélectionnez un client', 'warning'); return; }
    var id = this.currentDetailId;
    if (!this.prospectClientLinks[id]) this.prospectClientLinks[id] = [];
    if (this.prospectClientLinks[id].indexOf(cid) === -1) {
      this.prospectClientLinks[id].push(cid);
      localStorage.setItem('tli_prospect_clientlinks', JSON.stringify(this.prospectClientLinks));
      TLI.Server.pushProspects();
      TLI.UI.showToast('Client lié', 'success');
      this.showDetailModal(id);
      this.applyFilters();
    } else {
      TLI.UI.showToast('Client déjà lié', 'warning');
    }
  },

  unlinkClient: function(cid) {
    var id = this.currentDetailId;
    if (!this.prospectClientLinks[id]) return;
    this.prospectClientLinks[id] = this.prospectClientLinks[id].filter(function(x) { return x !== cid; });
    localStorage.setItem('tli_prospect_clientlinks', JSON.stringify(this.prospectClientLinks));
    TLI.Server.pushProspects();
    TLI.UI.showToast('Client délié', 'warning');
    this.showDetailModal(id);
    this.applyFilters();
  },

  unlinkClientFromPopup: function(prospectId, cid) {
    if (!this.prospectClientLinks[prospectId]) return;
    this.prospectClientLinks[prospectId] = this.prospectClientLinks[prospectId].filter(function(x) { return x !== cid; });
    localStorage.setItem('tli_prospect_clientlinks', JSON.stringify(this.prospectClientLinks));
    TLI.Server.pushProspects();
    TLI.UI.showToast('Client délié', 'warning');
    // Rafraîchir le popup
    var m = this.allMarkers.find(function(x) { return x.id === prospectId; });
    if (m) { m.marker.setPopupContent(this.makePopup(m.data)); }
    this.applyFilters();
  },

  createClientFromProspect: function() {
    var id = this.currentDetailId;
    var p = PROSPECTS_DATA.find(function(x) { return x.id === id; });
    if (!p) return;
    // Préremplir le modal client
    document.getElementById('clientName').value = p.nom || '';
    document.getElementById('clientCompany').value = p.nom || '';
    document.getElementById('clientAddress').value = (p.adresse || '') + ', ' + (p.cp || '') + ' ' + (p.ville || '');
    document.getElementById('clientNotes').value = p.notes || '';
    TLI.UI.closeModal('prospectDetailModal');
    TLI.UI.openModal('newClientModal');
    // Stocker l'ID prospect pour lier après création
    TLI.Prospection._pendingProspectLink = id;
  },

  deleteProspect: function() {
    var id = this.currentDetailId;
    if (!id) return;
    if (!confirm('Supprimer ce prospect ? Cette action est irréversible.')) return;
    var idx = PROSPECTS_DATA.findIndex(function(x) { return x.id === id; });
    if (idx >= 0) PROSPECTS_DATA.splice(idx, 1);
    this._customProspects = this._customProspects.filter(function(x) { return x.id !== id; });
    localStorage.setItem('tli_prospects_custom', JSON.stringify(this._customProspects));
    this.allMarkers = this.allMarkers.filter(function(x) { return x.id !== id; });
    delete this.prospectStatus[id];
    delete this.prospectHistory[id];
    delete this.lastContact[id];
    this.toSolicit.delete(id);
    localStorage.setItem('tli_prospects_sol', JSON.stringify([...this.toSolicit]));
    localStorage.setItem('tli_prospect_status', JSON.stringify(this.prospectStatus));
    localStorage.setItem('tli_prospect_history', JSON.stringify(this.prospectHistory));
    localStorage.setItem('tli_prospect_lastcontact', JSON.stringify(this.lastContact));
    TLI.UI.closeModal('prospectDetailModal');
    TLI.UI.showToast('Prospect supprimé', 'warning');
    TLI.Server.pushProspects();
    this.applyFilters();
  },

  // ─── AJOUT ───
  showAddModal: function() {
    document.getElementById('prospectAddName').value = '';
    document.getElementById('prospectAddSiret').value = '';
    document.getElementById('prospectAddSecteur').value = '';
    document.getElementById('prospectAddAdresse').value = '';
    document.getElementById('prospectAddCp').value = '';
    document.getElementById('prospectAddVille').value = '';
    document.getElementById('prospectAddLat').value = '';
    document.getElementById('prospectAddLng').value = '';
    document.getElementById('prospectAddEff').value = 10;
    document.getElementById('prospectAddCat').value = 'PME';
    document.getElementById('prospectAddNotation').value = 'B';
    document.getElementById('prospectAddNotes').value = '';
    TLI.UI.openModal('prospectAddModal');
  },

  saveNewProspect: function() {
    var name = document.getElementById('prospectAddName').value.trim();
    if (!name) { TLI.UI.showToast('Nom de l\'entreprise requis', 'error'); return; }
    var lat = parseFloat(document.getElementById('prospectAddLat').value);
    var lng = parseFloat(document.getElementById('prospectAddLng').value);
    if (isNaN(lat) || isNaN(lng)) { TLI.UI.showToast('Coordonnées GPS requises', 'error'); return; }

    var newId = Date.now() + Math.floor(Math.random() * 1000);
    var p = {
      id: newId,
      nom: name,
      siret: document.getElementById('prospectAddSiret').value.trim(),
      naf: '',
      activite_naf: '',
      effectif: parseInt(document.getElementById('prospectAddEff').value) || 10,
      categorie: document.getElementById('prospectAddCat').value,
      adresse: document.getElementById('prospectAddAdresse').value.trim(),
      cp: document.getElementById('prospectAddCp').value.trim(),
      ville: document.getElementById('prospectAddVille').value.trim(),
      lat: lat,
      lng: lng,
      distance: 0,
      secteur: document.getElementById('prospectAddSecteur').value.trim() || 'Autre',
      notation: document.getElementById('prospectAddNotation').value,
      notes: document.getElementById('prospectAddNotes').value.trim()
    };

    PROSPECTS_DATA.push(p);
    this._customProspects.push(p);
    localStorage.setItem('tli_prospects_custom', JSON.stringify(this._customProspects));

    // Créer le marker avec tooltip
    var col = this.colors[p.notation] || this.colors.C;
    var m = L.circleMarker([p.lat, p.lng], {
      radius: p.notation === 'A' ? 18 : 14,
      fillColor: col, color: '#fff', weight: 3, opacity: 1, fillOpacity: 0.9
    });
    m._notation = p.notation;
    m._id = p.id;
    m.bindPopup(this.makePopup(p));
    m.bindTooltip(p.nom, { permanent: false, direction: 'top', className: 'permanent-tooltip', offset: [0, -10] });
    m.on('click', function() { TLI.Prospection.highlightItem(p.id); });
    this.allMarkers.push({ id: p.id, marker: m, data: p });

    // Ajouter au cluster si visible
    if (this.clusterGroup) {
      this.clusterGroup.addLayer(m);
    }

    TLI.UI.closeModal('prospectAddModal');
    TLI.UI.showToast('Prospect ajouté et sauvegardé', 'success');
    TLI.Server.pushProspects();
    this.applyFilters();
  },


  // ─── IMPORT CSV ───
  // v16: nouvelle méthode importCSV
  importCSV: function() {
    var input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv';
    input.onchange = function(e) {
      var file = e.target.files[0];
      if (!file) return;
      var reader = new FileReader();
      reader.onload = function(ev) {
        try {
          var lines = ev.target.result.split('\n').filter(function(l) { return l.trim(); });
          if (lines.length < 2) { TLI.UI.showToast('CSV vide ou invalide', 'error'); return; }
          var headers = lines[0].split(';').map(function(h) { return h.trim().replace(/^"|"$/g, ''); });
          var count = 0;
          for (var i = 1; i < lines.length; i++) {
            var cols = lines[i].split(';').map(function(c) { return c.trim().replace(/^"|"$/g, ''); });
            if (cols.length < 3) continue;
            var nom = cols[0];
            var lat = parseFloat(cols[headers.indexOf('Latitude')] || cols[headers.indexOf('lat')]);
            var lng = parseFloat(cols[headers.indexOf('Longitude')] || cols[headers.indexOf('lng')]);
            if (!nom || isNaN(lat) || isNaN(lng)) continue;
            var newId = Date.now() + Math.floor(Math.random() * 1000) + i;
            var p = {
              id: newId, nom: nom,
              siret: cols[headers.indexOf('SIRET')] || '',
              naf: '', effectif: parseInt(cols[headers.indexOf('Effectif')] || 0) || 0,
              categorie: cols[headers.indexOf('Categorie')] || 'PME',
              adresse: cols[headers.indexOf('Adresse')] || '',
              cp: cols[headers.indexOf('CP')] || '',
              ville: cols[headers.indexOf('Ville')] || '',
              lat: lat, lng: lng, distance: 0,
              secteur: cols[headers.indexOf('Secteur')] || 'Autre',
              notation: cols[headers.indexOf('Notation')] || 'B',
              notes: cols[headers.indexOf('Notes')] || ''
            };
            PROSPECTS_DATA.push(p);
            TLI.Prospection._customProspects.push(p);
            var col = TLI.Prospection.colors[p.notation] || TLI.Prospection.colors.C;
            var m = L.circleMarker([p.lat, p.lng], {
              radius: p.notation === 'A' ? 18 : 14,
              fillColor: col, color: '#fff', weight: 3, opacity: 1, fillOpacity: 0.9
            });
            m._notation = p.notation; m._id = p.id;
            m.bindPopup(TLI.Prospection.makePopup(p));
            m.bindTooltip(p.nom, { permanent: false, direction: 'top', className: 'permanent-tooltip', offset: [0, -10] });
            m.on('click', function() { TLI.Prospection.highlightItem(p.id); });
            TLI.Prospection.allMarkers.push({ id: p.id, marker: m, data: p });
            if (TLI.Prospection.clusterGroup) TLI.Prospection.clusterGroup.addLayer(m);
            count++;
          }
          localStorage.setItem('tli_prospects_custom', JSON.stringify(TLI.Prospection._customProspects));
          TLI.Server.pushProspects();
          TLI.Prospection.applyFilters();
          TLI.UI.showToast(count + ' prospect(s) importé(s)', 'success');
        } catch(err) {
          console.error(err);
          TLI.UI.showToast('Erreur import CSV', 'error');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  },

  // ─── EXPORT CSV ───
  exportCSV: function() {
    if (!this.filteredData.length) { TLI.UI.showToast('Aucun résultat à exporter', 'warning'); return; }
    var headers = ['Nom', 'SIRET', 'Secteur', 'Adresse', 'CP', 'Ville', 'Effectif', 'Categorie', 'Notation', 'Distance_km', 'Statut', 'Dernier_contact', 'Notes'];
    var rows = this.filteredData.map(function(p) {
      var status = TLI.Prospection.prospectStatus[p.id] || '';
      var last = TLI.Prospection.lastContact[p.id] || '';
      return [
        '"' + (p.nom || '').replace(/"/g, '""') + '"',
        '"' + (p.siret || '').replace(/"/g, '""') + '"',
        '"' + (p.secteur || '').replace(/"/g, '""') + '"',
        '"' + (p.adresse || '').replace(/"/g, '""') + '"',
        '"' + (p.cp || '') + '"',
        '"' + (p.ville || '').replace(/"/g, '""') + '"',
        p.effectif || 0,
        '"' + (p.categorie || '') + '"',
        '"' + (p.notation || '') + '"',
        (p.distance ? p.distance.toFixed(1) : 0),
        '"' + (status ? TLI.Prospection.STATUS_LABELS[status] : '') + '"',
        '"' + last + '"',
        '"' + (p.notes || '').replace(/"/g, '""').split('\n').join(' ') + '"'
      ].join(';');
    });
    var csv = '\uFEFF' + headers.join(';') + '\n' + rows.join('\n');
    var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'tli_prospects_' + new Date().toISOString().slice(0, 10) + '.csv';
    a.click();
    TLI.UI.showToast(this.filteredData.length + ' prospects exportés', 'success');
  },

  // ─── POINT DE DÉPART ───
  origin: JSON.parse(localStorage.getItem('tli_origin') || 'null'),

  setOrigin: function(lat, lng, label) {
    this.origin = { lat: lat, lng: lng, label: label || 'Point de départ' };
    localStorage.setItem('tli_origin', JSON.stringify(this.origin));
    TLI.Server.pushProspects();
    this.updateOriginMarker();
    this.applyFilters();
    var status = document.getElementById('originStatus');
    if (status) status.textContent = '✅ ' + this.origin.label;
    TLI.UI.showToast('Point de départ mis à jour', 'success');
  },

  updateOriginMarker: function() {
    if (!this.map) return;
    if (this.originMarker) { this.map.removeLayer(this.originMarker); this.originMarker = null; }
    if (!this.origin) return;
    var oLat = parseFloat(this.origin.lat), oLng = parseFloat(this.origin.lng);
    if (isNaN(oLat) || isNaN(oLng)) return;
    var greenIcon = L.divIcon({
      className: 'origin-marker',
      html: '<div style="width:28px;height:28px;background:#00ff88;border-radius:50%;border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;font-size:14px;">📍</div><div style="width:0;height:0;border-left:8px solid transparent;border-right:8px solid transparent;border-top:10px solid #00ff88;margin:-2px auto 0;filter:drop-shadow(0 2px 2px rgba(0,0,0,0.3));"></div>',
      iconSize: [28, 40], iconAnchor: [14, 38]
    });
    this.originMarker = L.marker([oLat, oLng], { icon: greenIcon, zIndexOffset: 1000 }).addTo(this.map);
    this.originMarker.bindPopup('<b>📍 Point de départ</b><br>' + (this.origin.label || 'Origine'));
  },

  useMyPosition: function() {
    var self = this;
    var status = document.getElementById('originStatus');
    if (status) status.textContent = '⏳ Localisation...';
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(pos) {
        self.setOrigin(pos.coords.latitude, pos.coords.longitude, 'Ma position');
        var input = document.getElementById('prospectOrigin');
        if (input) input.value = 'Ma position (' + pos.coords.latitude.toFixed(4) + ', ' + pos.coords.longitude.toFixed(4) + ')';
      }, function() {
        if (status) status.textContent = '❌ Localisation refusée';
        TLI.UI.showToast('Localisation refusée', 'error');
      });
    } else {
      if (status) status.textContent = '❌ Non supportée';
      TLI.UI.showToast('Géolocalisation non supportée', 'error');
    }
  },

  geocodeOrigin: function() {
    var input = document.getElementById('prospectOrigin');
    var status = document.getElementById('originStatus');
    if (!input || !input.value.trim()) return;

    // Vérifier si le champ contient déjà des coordonnées (format "Ma position (lat, lng)")
    var coordMatch = input.value.match(/\(?([-+]?\d+\.\d+),\s*([-+]?\d+\.\d+)\)?/);
    if (coordMatch) {
      var lat = parseFloat(coordMatch[1]);
      var lng = parseFloat(coordMatch[2]);
      this.setOrigin(lat, lng, 'Point personnalisé');
      if (status) status.textContent = '✅ Coordonnées appliquées';
      TLI.UI.showToast('Point de départ mis à jour', 'success');
      return;
    }

    if (status) status.textContent = '⏳ Géocodage...';
    var url = 'https://nominatim.openstreetmap.org/search?format=json&q=' + encodeURIComponent(input.value.trim());
    fetch(url).then(function(r) { return r.json(); }).then(function(data) {
      if (data && data.length > 0) {
        var lat = parseFloat(data[0].lat);
        var lng = parseFloat(data[0].lon);
        TLI.Prospection.setOrigin(lat, lng, data[0].display_name);
        if (status) status.textContent = '✅ ' + data[0].display_name.split(',')[0];
        TLI.UI.showToast('Point de départ mis à jour', 'success');
      } else {
        if (status) status.textContent = '❌ Adresse non trouvée';
        TLI.UI.showToast('Adresse non trouvée', 'error');
      }
    }).catch(function() {
      if (status) status.textContent = '❌ Erreur réseau';
      TLI.UI.showToast('Erreur de géocodage', 'error');
    });
  },

  distanceFromOrigin: function(lat, lng) {
    if (!this.origin) return null;
    var R = 6371;
    var dLat = (lat - this.origin.lat) * Math.PI / 180;
    var dLng = (lng - this.origin.lng) * Math.PI / 180;
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(this.origin.lat * Math.PI/180) * Math.cos(lat * Math.PI/180) * Math.sin(dLng/2) * Math.sin(dLng/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  },

  toggleAnnotation: function() {
    var btn = document.getElementById('btnAnnotation');
    var isActive = btn.classList.contains('active');
    if (isActive) {
      btn.classList.remove('active');
      btn.style.background = '';
      btn.style.color = '';
      document.getElementById('prospectOnlyNotes').checked = false;
    } else {
      btn.classList.add('active');
      btn.style.background = 'var(--primary)';
      btn.style.color = '#000';
      document.getElementById('prospectOnlyNotes').checked = true;
    }
    this.applyFilters();
    TLI.Server.pushProspects();
  },

  toggleSidebar: function() {
    var sb = document.getElementById('prospectSidebar');
    if (sb) sb.classList.toggle('hidden');
    setTimeout(function() { if(TLI.Prospection.map) TLI.Prospection.map.invalidateSize(); }, 310);
  },

  getProspectsState: function() {
    return {
      prospectStatus: this.prospectStatus,
      prospectHistory: this.prospectHistory,
      lastContact: this.lastContact,
      prospectClientLinks: this.prospectClientLinks,
      toSolicit: [...this.toSolicit],
      customProspects: this._customProspects,
      origin: this.origin
    };
  },

  setProspectsState: function(data) {
    if (!data) return;
    if (data.prospectStatus) this.prospectStatus = data.prospectStatus;
    if (data.prospectHistory) this.prospectHistory = data.prospectHistory;
    if (data.lastContact) this.lastContact = data.lastContact;
    if (data.prospectClientLinks) this.prospectClientLinks = data.prospectClientLinks;
    if (data.toSolicit) this.toSolicit = new Set(data.toSolicit);
    if (data.customProspects) {
      this._customProspects = data.customProspects;
      // Fusionner les prospects custom dans PROSPECTS_DATA
      if (typeof PROSPECTS_DATA !== 'undefined') {
        var existingIds = new Set(PROSPECTS_DATA.map(function(p) { return p.id; }));
        data.customProspects.forEach(function(p) {
          if (!existingIds.has(p.id)) { PROSPECTS_DATA.push(p); existingIds.add(p.id); }
        });
      }
    }
    if (data.origin) {
      this.origin = data.origin;
      localStorage.setItem('tli_origin', JSON.stringify(data.origin));
    }
    // Sauvegarder en localStorage comme cache
    localStorage.setItem('tli_prospect_status', JSON.stringify(this.prospectStatus));
    localStorage.setItem('tli_prospect_history', JSON.stringify(this.prospectHistory));
    localStorage.setItem('tli_prospect_lastcontact', JSON.stringify(this.lastContact));
    localStorage.setItem('tli_prospect_clientlinks', JSON.stringify(this.prospectClientLinks));
    localStorage.setItem('tli_prospects_sol', JSON.stringify([...this.toSolicit]));
    localStorage.setItem('tli_prospects_custom', JSON.stringify(this._customProspects));
    this.applyFilters();
    this.updateOriginMarker();
  }
};
