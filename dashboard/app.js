// AIEP Dashboard — renders live data from data/dashboard.json.
(function () {
  'use strict';

  const el = (tag, cls, html) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html !== undefined) n.innerHTML = html;
    return n;
  };
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));

  function card(title, spanClass) {
    const c = el('section', `card ${spanClass || ''}`);
    if (title) c.appendChild(el('h2', null, esc(title)));
    return c;
  }

  function kv(parent, k, v) {
    const row = el('div', 'kv');
    row.appendChild(el('span', 'k', esc(k)));
    row.appendChild(el('span', 'v', v));
    parent.appendChild(row);
  }

  function levelBars(parent, dist) {
    const max = Math.max(1, ...Object.values(dist));
    ['L1', 'L2', 'L3', 'L4'].forEach((lvl) => {
      const bar = el('div', 'bar');
      bar.appendChild(el('span', 'name', lvl));
      const track = el('div', 'track');
      const fill = el('div', `fill ${lvl}`);
      fill.style.width = `${(dist[lvl] / max) * 100}%`;
      track.appendChild(fill);
      bar.appendChild(track);
      bar.appendChild(el('span', 'val', String(dist[lvl])));
      parent.appendChild(bar);
    });
  }

  function badge(status) {
    const map = { PASS: 'ok', CHANGES_REQUESTED: 'warn', 'not-reviewed': 'warn' };
    return `<span class="badge ${map[status] || 'warn'}">${esc(status)}</span>`;
  }

  function render(d) {
    const app = document.getElementById('app');
    app.innerHTML = '';

    document.getElementById('brand-sub').textContent =
      `${d.platform.displayName} · Scope ${d.platform.scopeLock} · Arch ${d.platform.architectureFreeze}`;
    document.getElementById('pill-version').textContent = `v${d.platform.version}`;
    document.getElementById('pill-branch').textContent = `${d.git.branch}${d.git.commit ? ' @ ' + d.git.commit : ''}`;
    document.getElementById('pill-generated').textContent = new Date(d.generatedAt).toLocaleString();

    // 1 — Platform Overview
    const c1 = card('Platform Overview', 'span-4');
    kv(c1, 'Platform', esc(d.platform.name));
    kv(c1, 'Version', esc(d.platform.version));
    kv(c1, 'Git branch', esc(d.git.branch));
    kv(c1, 'Commit', esc(d.git.commit || '(none)'));
    kv(c1, 'Work Orders', String(d.workOrders.summary.total));
    app.appendChild(c1);

    // 2 — Architecture Status
    const c2 = card('Architecture Status', 'span-4');
    kv(c2, 'Architecture Freeze', esc(d.architecture.freeze));
    kv(c2, 'Scope Lock', esc(d.architecture.scopeLock));
    d.architecture.deliverables.forEach((x) =>
      kv(c2, x.name, `<span class="badge ${x.present ? 'ok' : 'bad'}">${x.present ? 'present' : 'missing'}</span>`)
    );
    app.appendChild(c2);

    // 3 — Release Readiness
    const c3 = card('Release Readiness', 'span-4');
    const rr = d.releaseReadiness;
    const sr = el('div', 'stat-row');
    sr.innerHTML =
      `<div class="stat"><div class="num" style="color:var(--green)">${rr.gatesPassed}</div><div class="lbl">Gates passed</div></div>` +
      `<div class="stat"><div class="num" style="color:var(--red)">${rr.gatesFailed}</div><div class="lbl">Failed</div></div>` +
      `<div class="stat"><div class="num" style="color:var(--amber)">${rr.gatesWarned}</div><div class="lbl">Warnings</div></div>`;
    c3.appendChild(sr);
    c3.appendChild(el('div', 'kv', `<span class="k">Overall</span><span class="v"><span class="badge ${rr.ok ? 'ok' : 'bad'}">${rr.ok ? 'READY' : 'NOT READY'}</span></span>`));
    app.appendChild(c3);

    // 4 — Review Level Distribution
    const c4 = card('Review Level Distribution', 'span-4');
    levelBars(c4, d.reviewLevelDistribution);
    app.appendChild(c4);

    // 5 — Sprint Status
    const c5 = card('Sprint Status', 'span-8');
    if (d.sprints.length) {
      const t = el('table');
      t.innerHTML = '<thead><tr><th>Sprint</th><th>Goal</th><th>Status</th></tr></thead>';
      const tb = el('tbody');
      d.sprints.forEach((s) => {
        const tr = el('tr');
        tr.innerHTML = `<td><b>${esc(s.name)}</b><br><span style="color:var(--text-muted)">${esc(s.id)}</span></td><td>${esc(s.goal)}</td><td><span class="badge ${s.status === 'done' ? 'ok' : 'warn'}">${esc(s.status)}</span></td>`;
        tb.appendChild(tr);
      });
      t.appendChild(tb);
      c5.appendChild(t);
    } else c5.appendChild(el('p', null, 'No sprints found.'));
    app.appendChild(c5);

    // 6 — AI Reviewer Status
    const c6 = card('AI Reviewer Status', 'span-6');
    d.reviewers.forEach((r) => {
      const item = el('div', 'list-item');
      item.innerHTML = `<span><span class="dot ${r.ok ? 'ok' : 'bad'}"></span>${esc(r.name)}</span><span style="color:var(--text-muted)">${esc(r.detail)}</span>`;
      c6.appendChild(item);
    });
    app.appendChild(c6);

    // 7 — System Health / Runtime Status
    const c7 = card('System Health / Runtime Status', 'span-6');
    d.systemHealth.forEach((h) => {
      const item = el('div', 'list-item');
      item.innerHTML = `<span><span class="dot ${h.ok ? 'ok' : 'bad'}"></span>${esc(h.name)}</span><span style="color:var(--text-muted)">${esc(h.detail)}</span>`;
      c7.appendChild(item);
    });
    app.appendChild(c7);

    // 8 — Review Findings
    const c8 = card('Review Findings', 'span-6');
    const sg = el('div', 'sev-grid');
    ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFO'].forEach((s) => {
      sg.appendChild(el('div', `sev ${s}`, `<div class="n">${d.findings.counts[s] || 0}</div><div class="s">${s}</div>`));
    });
    c8.appendChild(sg);
    app.appendChild(c8);

    // 9 — Knowledge Assets
    const c9 = card('Knowledge Assets', 'span-6');
    const ka = d.knowledgeAssets;
    const sr2 = el('div', 'stat-row');
    sr2.style.flexWrap = 'wrap';
    Object.entries(ka).forEach(([k, v]) => {
      sr2.appendChild(el('div', 'stat', `<div class="num">${v}</div><div class="lbl">${esc(k)}</div>`));
    });
    c9.appendChild(sr2);
    app.appendChild(c9);

    // 10 — Work Order Status (full width table)
    const c10 = card('Work Order Status', 'span-12');
    const t = el('table');
    t.innerHTML = '<thead><tr><th>ID</th><th>Title</th><th>Phase</th><th>Level</th><th>Status</th><th>Review</th></tr></thead>';
    const tb = el('tbody');
    d.workOrders.rows.forEach((w) => {
      const tr = el('tr');
      tr.innerHTML =
        `<td><b>${esc(w.id)}</b></td><td>${esc(w.title)}</td><td>${esc(w.phase)}</td>` +
        `<td><span class="badge ${esc(w.reviewLevel)}">${esc(w.reviewLevel)}</span></td>` +
        `<td>${esc(w.status)}</td><td>${badge(w.verdict)}</td>`;
      tb.appendChild(tr);
    });
    t.appendChild(tb);
    c10.appendChild(t);
    app.appendChild(c10);
  }

  fetch('data/dashboard.json', { cache: 'no-store' })
    .then((r) => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return r.json();
    })
    .then(render)
    .catch((err) => {
      document.getElementById('app').innerHTML =
        `<div class="loading">Could not load data/dashboard.json (${esc(err.message)}).<br>Run <code>aiep dashboard --build</code> first.</div>`;
    });
})();
