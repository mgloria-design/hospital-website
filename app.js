(function () {
  var menu = document.getElementById('menu'), nav = document.getElementById('nav');
  if (menu && nav) {
    menu.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      menu.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  var form = document.getElementById('appt');
  if (!form) return;
  var result = document.getElementById('result'), date = document.getElementById('f-date');
  var t = new Date(), p = function (n) { return String(n).padStart(2, '0'); };
  date.min = t.getFullYear() + '-' + p(t.getMonth() + 1) + '-' + p(t.getDate());

  function esc(s) {
    return s.replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; });
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }
    var f = new FormData(form);
    var name = f.get('name').trim(), phone = f.get('phone').trim(), dept = f.get('dept'), reason = (f.get('reason') || '').trim();
    var d = new Date(f.get('date') + 'T00:00:00');
    var nice = d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    var text = 'Appointment request, Innova Hospital\nName: ' + name + '\nPhone: ' + phone + '\nService: ' + dept + '\nPreferred date: ' + nice + (reason ? '\nReason: ' + reason : '');
    result.innerHTML = '<h3>Request ready, ' + esc(name.split(' ')[0]) + '</h3>' +
      '<dl><dt>Service</dt><dd>' + esc(dept) + '</dd><dt>Date</dt><dd>' + esc(nice) + '</dd><dt>Phone</dt><dd>' + esc(phone) + '</dd></dl>' +
      '<p class="note">This form does not send your request yet. Call +254 713 187 220 or visit reception to confirm your slot. We are open 24 hours.</p>' +
      '<button class="btn outline" type="button" id="copy">Copy request details</button>';
    result.hidden = false;
    result.focus();
    document.getElementById('copy').addEventListener('click', function (ev) {
      var b = ev.currentTarget;
      function done() { b.textContent = 'Copied'; }
      function fallback() {
        var ta = document.createElement('textarea');
        ta.value = text; document.body.appendChild(ta); ta.select();
        try { document.execCommand('copy'); done(); } catch (x) { b.textContent = 'Select the details and copy them'; }
        document.body.removeChild(ta);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) { navigator.clipboard.writeText(text).then(done, fallback); } else { fallback(); }
    });
  });
})();
