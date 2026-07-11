// ============================================================
// TLI v16 - MODULE: Photos
// Gestion des photos (commandes, galerie, qualite)
// ============================================================
var TLI = window.TLI || {};

TLI.Photos = {
  pendingTarget: null,

  init: function() {
    var input = document.getElementById('cameraInput');
    if (input) {
      input.addEventListener('change', function() {
        TLI.Photos.handleFile(this);
      });
    }
    var qInput = document.getElementById('qualityCameraInput');
    if (qInput) {
      qInput.addEventListener('change', function() {
        TLI.Photos.handleQualityFile(this);
      });
    }
    console.log("[TLI.Photos] Initialized");
  },

  prepareForOrder: function(orderId) {
    this.pendingTarget = { type: 'order', id: orderId };
    var input = document.getElementById('cameraInput');
    if (input) { input.value = ''; input.click(); }
  },

  prepareForGallery: function() {
    this.pendingTarget = { type: 'gallery' };
    var input = document.getElementById('cameraInput');
    if (input) { input.value = ''; input.click(); }
  },

  prepareForQuality: function(orderId) {
    this.pendingTarget = { type: 'quality', id: orderId };
    var input = document.getElementById('qualityCameraInput');
    if (input) { input.value = ''; input.click(); }
  },

  handleFile: function(input) {
    var file = input.files[0];
    if (!file) return;
    var target = this.pendingTarget;
    this.pendingTarget = null;
    var reader = new FileReader();
    reader.onload = function(e) {
      var rawPhoto = e.target.result;
      TLI.UI.showToast("Compression photo...", "success");
      // Redimensionner a 800px max, qualite 0.7
      TLI.Utils.resizeImage(rawPhoto, 800, 800, 0.7, function(photoData) {
        if (target && target.type === 'order' && target.id) {
          if (TLI.Data.addPhotoToOrder(target.id, photoData)) {
            TLI.UI.renderOrderPhotos(target.id);
            TLI.UI.showToast("Photo ajoutee a la commande", "success");
            TLI.Server.uploadPhoto(photoData, 'order', target.id);
          } else {
            TLI.UI.showToast("Erreur: commande introuvable", "error");
          }
        } else {
          TLI.Data.addGeneralPhoto(photoData);
          TLI.UI.renderPhotos();
          TLI.UI.showToast("Photo ajoutee a la galerie", "success");
          TLI.Server.uploadPhoto(photoData, 'gallery');
        }
        // Sync centralisee : local + serveur
        TLI.Data.triggerSync();
      });
    };
    reader.onerror = function() {
      TLI.UI.showToast("Erreur lecture photo", "error");
    };
    reader.readAsDataURL(file);
    input.value = "";
  },

  deletePhoto: function(index) {
    if (!confirm('Supprimer cette photo ?')) return;
    var photo = TLI.Data.generalPhotos[index];
    TLI.Data.generalPhotos.splice(index, 1);
    TLI.Data.save();
    TLI.UI.renderPhotos();
    TLI.UI.showToast('Photo supprimee', 'success');
    // Supprimer aussi du serveur si connecte
    if (!TLI.Data.offlineMode && TLI.Server.isConnected && photo && photo.id) {
      TLI.Server.push('photos');
    }
  },

  handleQualityFile: function(input) {
    var file = input.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function(e) {
      var rawPhoto = e.target.result;
      TLI.Utils.resizeImage(rawPhoto, 800, 800, 0.7, function(photoData) {
        TLI.Data.tempQualityPhoto = photoData;
        var preview = document.getElementById("qualityPhotoPreview");
        if (preview) {
          preview.innerHTML = '<div class="photo-item"><img src="' + TLI.Data.tempQualityPhoto + '" alt="Photo qualite"></div>';
          preview.style.display = "grid";
        }
        TLI.UI.showToast("Photo qualite prise", "success");
      });
    };
    reader.onerror = function() {
      TLI.UI.showToast("Erreur photo qualite", "error");
    };
    reader.readAsDataURL(file);
    input.value = "";
  },

  validateQuality: function() {
    var orderId = TLI.Data.qualityOrderId;
    if (TLI.Data.tempQualityPhoto && orderId) {
      TLI.Data.addPhotoToOrder(orderId, TLI.Data.tempQualityPhoto);
      TLI.UI.renderOrderPhotos(orderId);
      TLI.Data.tempQualityPhoto = null;
    }
    document.getElementById("qualityOverlay").classList.remove("active");
    TLI.UI.showToast("Qualite validee !", "success");
    TLI.Data.triggerSync(['orders']);
  },

  skipQuality: function() {
    TLI.Data.tempQualityPhoto = null;
    document.getElementById("qualityOverlay").classList.remove("active");
    TLI.UI.showToast("Cloture sans validation", "warning");
  }
};
