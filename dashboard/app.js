// AIEP Dashboard — hiển thị dữ liệu thật từ data/dashboard.json.
// Dữ liệu gốc giữ nguyên tiếng Anh; nhãn được Việt hóa tại thời điểm render.
(function () {
  'use strict';

  const el = (tag, cls, html) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html !== undefined) n.innerHTML = html;
    return n;
  };
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));

  // Từ điển dịch cho các giá trị dữ liệu (ánh xạ khi render; không đổi dữ liệu gốc).
  const DICT = {
    // Deliverables
    'Core Repository': 'Repository lõi',
    'Documentation System': 'Hệ thống Tài liệu',
    'AI Engineering Library': 'Thư viện AI Engineering',
    'PMO': 'PMO',
    'Dashboard': 'Dashboard',
    // Trạng thái present/missing
    present: 'có', missing: 'thiếu',
    // Trạng thái Work Order / Sprint
    done: 'xong', planned: 'đã lên kế hoạch', backlog: 'backlog',
    'in-progress': 'đang làm', 'in-review': 'đang review', blocked: 'bị chặn',
    unknown: 'chưa rõ',
    // Verdict
    PASS: 'ĐẠT', CHANGES_REQUESTED: 'CẦN SỬA', 'not-reviewed': 'chưa review',
    // Doctor / system health item names
    'git available': 'git khả dụng',
    'inside git work tree': 'trong git work tree',
    'AIEP config loaded': 'Đã nạp AIEP config',
    'Ollama reachable': 'Ollama kết nối được',
    'Gemini CLI': 'Gemini CLI',
    'Codex CLI': 'Codex CLI',
    'Codex guard (L4 only)': 'Codex guard (chỉ L4)',
    // Nhãn tài sản tri thức
    prompts: 'Prompt', skills: 'Skill', mcp: 'MCP', knowledge: 'Kiến thức',
    adrs: 'ADR', sops: 'SOP', templates: 'Template',
  };

  // Dịch một chuỗi dữ liệu: khớp chính xác trong từ điển, hoặc vài phép biến đổi
  // cho chuỗi động (tên model), nếu không thì giữ nguyên.
  const t = (s) => {
    if (s == null) return '';
    if (DICT[s] !== undefined) return DICT[s];
    return String(s)
      .replace(/^DeepSeek model/, 'Model DeepSeek')
      .replace(/^Qwen model/, 'Model Qwen')
      .replace(/\bNOT installed\b/i, 'CHƯA cài')
      .replace(/\binstalled\b/i, 'đã cài')
      .replace(/\bdesign reviewer\b/i, 'reviewer thiết kế')
      .replace(/\bexternal auditor\b/i, 'auditor độc lập')
      .replace(/\benforced\b/i, 'đang thực thi')
      .replace(/\bnot reachable\b/i, 'không kết nối được')
      .replace(/\bfound\b/i, 'phát hiện')
      .replace(/\bmodel\(s\)\b/i, 'model');
  };

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
    return `<span class="badge ${map[status] || 'warn'}">${esc(t(status))}</span>`;
  }

  function render(d) {
    const app = document.getElementById('app');
    app.innerHTML = '';

    document.getElementById('brand-sub').textContent =
      `Nền tảng Kỹ thuật AI · Scope ${d.platform.scopeLock} · Arch ${d.platform.architectureFreeze}`;
    document.getElementById('pill-version').textContent = `v${d.platform.version}`;
    document.getElementById('pill-branch').textContent = `${d.git.branch}${d.git.commit ? ' @ ' + d.git.commit : ''}`;
    document.getElementById('pill-generated').textContent = new Date(d.generatedAt).toLocaleString('vi-VN');

    // 1 — Tổng quan Nền tảng
    const c1 = card('Tổng quan Nền tảng', 'span-4');
    kv(c1, 'Nền tảng', esc(d.platform.name));
    kv(c1, 'Phiên bản', esc(d.platform.version));
    kv(c1, 'Git branch', esc(d.git.branch));
    kv(c1, 'Commit', esc(d.git.commit || '(chưa có)'));
    kv(c1, 'Work Orders', String(d.workOrders.summary.total));
    app.appendChild(c1);

    // 2 — Trạng thái Kiến trúc
    const c2 = card('Trạng thái Kiến trúc', 'span-4');
    kv(c2, 'Architecture Freeze', esc(d.architecture.freeze));
    kv(c2, 'Scope Lock', esc(d.architecture.scopeLock));
    d.architecture.deliverables.forEach((x) =>
      kv(c2, t(x.name), `<span class="badge ${x.present ? 'ok' : 'bad'}">${x.present ? 'có' : 'thiếu'}</span>`)
    );
    app.appendChild(c2);

    // 3 — Sẵn sàng Phát hành
    const c3 = card('Sẵn sàng Phát hành', 'span-4');
    const rr = d.releaseReadiness;
    const sr = el('div', 'stat-row');
    sr.innerHTML =
      `<div class="stat"><div class="num" style="color:var(--green)">${rr.gatesPassed}</div><div class="lbl">Gates đạt</div></div>` +
      `<div class="stat"><div class="num" style="color:var(--red)">${rr.gatesFailed}</div><div class="lbl">Thất bại</div></div>` +
      `<div class="stat"><div class="num" style="color:var(--amber)">${rr.gatesWarned}</div><div class="lbl">Cảnh báo</div></div>`;
    c3.appendChild(sr);
    c3.appendChild(el('div', 'kv', `<span class="k">Tổng thể</span><span class="v"><span class="badge ${rr.ok ? 'ok' : 'bad'}">${rr.ok ? 'SẴN SÀNG' : 'CHƯA SẴN SÀNG'}</span></span>`));
    app.appendChild(c3);

    // 4 — Phân bố Review Level
    const c4 = card('Phân bố Review Level', 'span-4');
    levelBars(c4, d.reviewLevelDistribution);
    app.appendChild(c4);

    // 5 — Trạng thái Sprint
    const c5 = card('Trạng thái Sprint', 'span-8');
    if (d.sprints.length) {
      const tb = el('table');
      tb.innerHTML = '<thead><tr><th>Sprint</th><th>Mục tiêu</th><th>Trạng thái</th></tr></thead>';
      const body = el('tbody');
      d.sprints.forEach((s) => {
        const tr = el('tr');
        tr.innerHTML = `<td><b>${esc(s.name)}</b><br><span style="color:var(--text-muted)">${esc(s.id)}</span></td><td>${esc(s.goal)}</td><td><span class="badge ${s.status === 'done' ? 'ok' : 'warn'}">${esc(t(s.status))}</span></td>`;
        body.appendChild(tr);
      });
      tb.appendChild(body);
      c5.appendChild(tb);
    } else c5.appendChild(el('p', null, 'Không có sprint nào.'));
    app.appendChild(c5);

    // 6 — Trạng thái AI Reviewer
    const c6 = card('Trạng thái AI Reviewer', 'span-6');
    d.reviewers.forEach((r) => {
      const item = el('div', 'list-item');
      item.innerHTML = `<span><span class="dot ${r.ok ? 'ok' : 'bad'}"></span>${esc(t(r.name))}</span><span style="color:var(--text-muted)">${esc(t(r.detail))}</span>`;
      c6.appendChild(item);
    });
    app.appendChild(c6);

    // 7 — Sức khỏe Hệ thống / Runtime
    const c7 = card('Sức khỏe Hệ thống / Runtime', 'span-6');
    d.systemHealth.forEach((h) => {
      const item = el('div', 'list-item');
      item.innerHTML = `<span><span class="dot ${h.ok ? 'ok' : 'bad'}"></span>${esc(t(h.name))}</span><span style="color:var(--text-muted)">${esc(t(h.detail))}</span>`;
      c7.appendChild(item);
    });
    app.appendChild(c7);

    // 8 — Findings Review
    const c8 = card('Findings Review', 'span-6');
    const sg = el('div', 'sev-grid');
    ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFO'].forEach((s) => {
      sg.appendChild(el('div', `sev ${s}`, `<div class="n">${d.findings.counts[s] || 0}</div><div class="s">${s}</div>`));
    });
    c8.appendChild(sg);
    app.appendChild(c8);

    // 9 — Tài sản Tri thức
    const c9 = card('Tài sản Tri thức', 'span-6');
    const sr2 = el('div', 'stat-row');
    sr2.style.flexWrap = 'wrap';
    Object.entries(d.knowledgeAssets).forEach(([k, v]) => {
      sr2.appendChild(el('div', 'stat', `<div class="num">${v}</div><div class="lbl">${esc(t(k))}</div>`));
    });
    c9.appendChild(sr2);
    app.appendChild(c9);

    // 10 — Trạng thái Work Order
    const c10 = card('Trạng thái Work Order', 'span-12');
    const table = el('table');
    table.innerHTML = '<thead><tr><th>ID</th><th>Tiêu đề</th><th>Phase</th><th>Level</th><th>Trạng thái</th><th>Review</th></tr></thead>';
    const tbody = el('tbody');
    d.workOrders.rows.forEach((w) => {
      const tr = el('tr');
      tr.innerHTML =
        `<td><b>${esc(w.id)}</b></td><td>${esc(w.title)}</td><td>${esc(w.phase)}</td>` +
        `<td><span class="badge ${esc(w.reviewLevel)}">${esc(w.reviewLevel)}</span></td>` +
        `<td>${esc(t(w.status))}</td><td>${badge(w.verdict)}</td>`;
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    c10.appendChild(table);
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
        `<div class="loading">Không tải được data/dashboard.json (${esc(err.message)}).<br>Hãy chạy <code>aiep dashboard --build</code> trước.</div>`;
    });
})();
