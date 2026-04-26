const generateBlueprintHTML = (campaign) => {
  const bp = campaign.blueprint;
  const date = new Date(campaign.created_at).toLocaleDateString('en-IN', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${bp.campaign_name} — Optimeta Blueprint</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Segoe UI', sans-serif; background: #0A0A0F; color: #fff; padding: 40px; }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; padding-bottom: 24px; border-bottom: 1px solid rgba(123,47,190,0.3); }
    .logo { font-size: 24px; font-weight: 800; background: linear-gradient(135deg, #7B2FBE, #C026D3); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .meta { font-size: 12px; color: #A0A0C0; }
    h1 { font-size: 32px; font-weight: 800; margin-bottom: 8px; }
    h2 { font-size: 18px; font-weight: 700; color: #C026D3; margin: 32px 0 16px; padding: 8px 16px; background: rgba(123,47,190,0.1); border-left: 3px solid #7B2FBE; border-radius: 4px; }
    h3 { font-size: 14px; font-weight: 600; color: #A0A0C0; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.05em; }
    p { font-size: 14px; color: #D0D0E0; line-height: 1.7; margin-bottom: 12px; }
    .card { background: rgba(123,47,190,0.08); border: 1px solid rgba(123,47,190,0.2); border-radius: 12px; padding: 20px; margin-bottom: 16px; }
    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; }
    .badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 600; margin: 4px; }
    .badge-cold { background: rgba(59,130,246,0.2); color: #60a5fa; }
    .badge-warm { background: rgba(245,158,11,0.2); color: #fbbf24; }
    .badge-hot { background: rgba(239,68,68,0.2); color: #f87171; }
    .badge-pain { background: rgba(239,68,68,0.15); color: #fca5a5; }
    .badge-desire { background: rgba(168,85,247,0.15); color: #c4b5fd; }
    .badge-trust { background: rgba(34,197,94,0.15); color: #86efac; }
    .badge-curiosity { background: rgba(234,179,8,0.15); color: #fde047; }
    .badge-social_proof { background: rgba(20,184,166,0.15); color: #5eead4; }
    .tag { display: inline-block; padding: 3px 10px; background: rgba(123,47,190,0.15); border: 1px solid rgba(123,47,190,0.3); border-radius: 20px; font-size: 12px; color: #C0A0F0; margin: 3px; }
    .copy-card { background: rgba(15,15,26,0.8); border: 1px solid rgba(123,47,190,0.25); border-radius: 12px; padding: 20px; margin-bottom: 16px; }
    .headline { font-size: 20px; font-weight: 700; color: #fff; margin-bottom: 8px; }
    .primary-text { font-size: 13px; color: #C0C0D0; line-height: 1.6; margin-bottom: 12px; }
    .checklist-item { display: flex; align-items: flex-start; gap: 10px; margin-bottom: 8px; }
    .check { color: #7B2FBE; font-size: 16px; }
    .metric-card { text-align: center; padding: 20px; background: rgba(123,47,190,0.08); border: 1px solid rgba(123,47,190,0.2); border-radius: 12px; }
    .metric-value { font-size: 28px; font-weight: 800; color: #C026D3; }
    .metric-label { font-size: 12px; color: #A0A0C0; margin-top: 4px; }
    .do-dont { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .do-list { background: rgba(34,197,94,0.05); border: 1px solid rgba(34,197,94,0.2); border-radius: 8px; padding: 16px; }
    .dont-list { background: rgba(239,68,68,0.05); border: 1px solid rgba(239,68,68,0.2); border-radius: 8px; padding: 16px; }
    .do-list li, .dont-list li { font-size: 13px; margin-bottom: 6px; list-style: none; padding-left: 20px; position: relative; }
    .do-list li::before { content: '✓'; position: absolute; left: 0; color: #22c55e; }
    .dont-list li::before { content: '✗'; position: absolute; left: 0; color: #ef4444; }
    .footer { margin-top: 40px; padding-top: 24px; border-top: 1px solid rgba(123,47,190,0.3); text-align: center; font-size: 12px; color: #505070; }
    @media print { body { background: #0A0A0F !important; -webkit-print-color-adjust: exact; } }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">OPTIMETA</div>
    <div class="meta">Generated on ${date} · optimeta.in</div>
  </div>

  <h1>${bp.campaign_name}</h1>

  <h2>Executive Summary</h2>
  <div class="card"><p>${bp.executive_summary}</p></div>

  <h2>Campaign Objective</h2>
  <div class="card">
    <h3>Recommended: ${bp.campaign_objective?.recommended}</h3>
    <p>${bp.campaign_objective?.reason}</p>
  </div>

  <h2>Funnel Strategy</h2>
  <div class="card grid-2">
    <div><h3>Stage</h3><p>${bp.funnel_strategy?.stage}</p></div>
    <div><h3>Cold/Warm Split</h3><p>${bp.funnel_strategy?.cold_warm_split}</p></div>
    <div style="grid-column: 1/-1"><h3>Approach</h3><p>${bp.funnel_strategy?.approach}</p></div>
  </div>

  <h2>Budget Strategy</h2>
  <div class="card">
    <h3>Recommended Daily Budget</h3>
    <p style="font-size:24px;font-weight:700;color:#C026D3">₹${bp.budget_strategy?.recommended_daily_budget_inr}</p>
    <div class="grid-3" style="margin-top:16px">
      <div class="metric-card"><div class="metric-value">${bp.budget_strategy?.split?.awareness}</div><div class="metric-label">Awareness</div></div>
      <div class="metric-card"><div class="metric-value">${bp.budget_strategy?.split?.consideration}</div><div class="metric-label">Consideration</div></div>
      <div class="metric-card"><div class="metric-value">${bp.budget_strategy?.split?.conversion}</div><div class="metric-label">Conversion</div></div>
    </div>
    <h3 style="margin-top:16px">Scaling Logic</h3>
    <p>${bp.budget_strategy?.scaling_logic}</p>
  </div>

  <h2>Audience Targeting</h2>
  <div class="card">
    <div class="grid-2">
      <div><h3>Age Range</h3><p>${bp.targeting?.primary_audience?.age_range}</p></div>
      <div><h3>Gender</h3><p>${bp.targeting?.primary_audience?.gender}</p></div>
    </div>
    <h3>Locations</h3>
    <div>${(bp.targeting?.primary_audience?.locations || []).map(l => `<span class="tag">${l}</span>`).join('')}</div>
    <h3 style="margin-top:12px">Interests</h3>
    <div>${(bp.targeting?.primary_audience?.interests || []).map(i => `<span class="tag">${i}</span>`).join('')}</div>
    <h3 style="margin-top:12px">Behaviors</h3>
    <div>${(bp.targeting?.primary_audience?.behaviors || []).map(b => `<span class="tag">${b}</span>`).join('')}</div>
    <h3 style="margin-top:16px">Lookalike Strategy</h3><p>${bp.targeting?.lookalike_strategy}</p>
    <h3>Retargeting Strategy</h3><p>${bp.targeting?.retargeting_strategy}</p>
    <h3>Exclusions</h3>
    <div>${(bp.targeting?.audience_exclusions || []).map(e => `<span class="tag">${e}</span>`).join('')}</div>
  </div>

  <h2>Ad Sets</h2>
  ${(bp.ad_sets || []).map(set => `
  <div class="card">
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px">
      <strong style="font-size:16px">${set.ad_set_name}</strong>
      <span class="badge badge-${set.audience_type}">${set.audience_type?.toUpperCase()}</span>
      <span class="badge" style="background:rgba(123,47,190,0.15);color:#c4b5fd">${set.budget_allocation}</span>
    </div>
    <h3>Objective</h3><p>${set.objective}</p>
    <h3>Targeting Focus</h3><p>${set.targeting_focus}</p>
  </div>`).join('')}

  <h2>Ad Angles</h2>
  ${(bp.ad_angles || []).map(angle => `
  <div class="card">
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px">
      <span class="badge badge-${angle.angle_type}">${angle.angle_type?.toUpperCase()}</span>
      <strong style="font-size:15px">${angle.angle_name}</strong>
    </div>
    <h3>Core Message</h3><p>${angle.core_message}</p>
    <h3>Why It Works</h3><p>${angle.why_it_works}</p>
  </div>`).join('')}

  <h2>Ad Copies</h2>
  ${(bp.ad_copies || []).map(copy => `
  <div class="copy-card">
    <div style="display:flex;gap:8px;margin-bottom:12px">
      <span class="badge" style="background:rgba(123,47,190,0.15);color:#c4b5fd">${copy.placement}</span>
      <span class="badge" style="background:rgba(192,38,211,0.1);color:#e879f9">${copy.angle}</span>
    </div>
    <div class="headline">${copy.headline}</div>
    <p style="color:#A0A0C0;font-size:13px;margin-bottom:8px">${copy.sub_headline}</p>
    <div class="primary-text">${copy.primary_text}</div>
    <span class="badge" style="background:rgba(34,197,94,0.15);color:#86efac">CTA: ${copy.cta}</span>
  </div>`).join('')}

  <h2>Creative Direction</h2>
  <div class="card">
    <div class="grid-2">
      <div><h3>Visual Style</h3><p>${bp.creative_direction?.visual_style}</p></div>
      <div><h3>Color Palette</h3><p>${bp.creative_direction?.color_palette}</p></div>
    </div>
    <h3 style="margin-top:12px">Content Formats</h3>
    <div>${(bp.creative_direction?.content_formats || []).map(f => `<span class="tag">${f}</span>`).join('')}</div>
    <h3 style="margin-top:16px">Hooks</h3>
    ${(bp.creative_direction?.hooks || []).map((h, i) => `<p style="padding:8px 0;border-bottom:1px solid rgba(123,47,190,0.1)">${i + 1}. ${h}</p>`).join('')}
    <div class="do-dont" style="margin-top:16px">
      <div class="do-list"><h3 style="color:#22c55e;margin-bottom:12px">DO</h3><ul>${(bp.creative_direction?.do || []).map(d => `<li>${d}</li>`).join('')}</ul></div>
      <div class="dont-list"><h3 style="color:#ef4444;margin-bottom:12px">DON'T</h3><ul>${(bp.creative_direction?.dont || []).map(d => `<li>${d}</li>`).join('')}</ul></div>
    </div>
  </div>

  <h2>Launch Checklist</h2>
  <div class="card">
    ${(bp.launch_checklist || []).map((item, i) => `
    <div class="checklist-item">
      <span class="check">☐</span>
      <p style="margin:0">${item}</p>
    </div>`).join('')}
  </div>

  <h2>Performance Benchmarks</h2>
  <div class="grid-3">
    <div class="metric-card"><div class="metric-value">${bp.performance_benchmarks?.expected_ctr}</div><div class="metric-label">Expected CTR</div></div>
    <div class="metric-card"><div class="metric-value">₹${bp.performance_benchmarks?.expected_cpc_inr}</div><div class="metric-label">Expected CPC</div></div>
    <div class="metric-card"><div class="metric-value">₹${bp.performance_benchmarks?.expected_cpm_inr}</div><div class="metric-label">Expected CPM</div></div>
  </div>
  <div class="metric-card" style="margin-top:16px">
    <div class="metric-value">${bp.performance_benchmarks?.roas_target}</div>
    <div class="metric-label">ROAS Target</div>
  </div>

  <div class="footer">Generated by Optimeta · India's AI Meta Ad Campaign Architect · optimeta.in</div>
</body>
</html>`;
};

module.exports = { generateBlueprintHTML };
