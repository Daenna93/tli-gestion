// ============================================================
// TLI v16 - MODULE: Calc
// Calculateur de devis
// ============================================================
var TLI = window.TLI || {};

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

    var r = TLI.Data.rates;
    var total = 0;

    if (service === 'print') {
      var printRate = type === 'fdm' ? r.fdm : r.resin;
      var materialPrice = type === 'fdm' ? (r.filamentKg / 1000) * weight : (r.resinKg / 1000) * weight;
      total = (printHours * printRate + materialPrice) * qty;
    } else if (service === 'modeling') {
      total = (modelingHours * r.modeling) * qty;
    } else if (service === 'design') {
      total = (designHours * r.design) * qty;
    }

    total += postProdHours * r.postProd * qty;

    var el = document.getElementById('calcTotal');
    if (el) el.textContent = total.toFixed(2) + '\u20ac';
  }
};
