export function exportToCSV(data, filename, columns) {
  if (!data || data.length === 0) return

  const headers = columns.map((c) => c.label)
  const rows = data.map((row) =>
    columns.map((c) => {
      const val = c.accessor ? c.accessor(row) : row[c.key]
      if (val === null || val === undefined) return ''
      const str = String(val)
      return str.includes(',') || str.includes('"') || str.includes('\n')
        ? `"${str.replace(/"/g, '""')}"`
        : str
    })
  )

  const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  downloadBlob(blob, `${filename}.csv`)
}

export const GAME_COLUMNS = [
  { key: 'game_date', label: 'Date' },
  { key: 'opponent', label: 'Opponent' },
  { key: 'result', label: 'Result' },
  { key: 'points', label: 'PTS' },
  { key: 'rebounds', label: 'REB' },
  { key: 'assists', label: 'AST' },
  { key: 'steals', label: 'STL' },
  { key: 'blocks', label: 'BLK' },
  { key: 'turnovers', label: 'TO' },
  { key: 'fouls', label: 'PF' },
  { key: 'field_goals_made', label: 'FGM' },
  { key: 'field_goals_attempted', label: 'FGA' },
  { label: 'FG%', accessor: (g) => g.field_goals_attempted ? ((g.field_goals_made / g.field_goals_attempted) * 100).toFixed(1) : '' },
  { key: 'three_pointers_made', label: '3PM' },
  { key: 'three_pointers_attempted', label: '3PA' },
  { key: 'free_throws_made', label: 'FTM' },
  { key: 'free_throws_attempted', label: 'FTA' },
  { key: 'minutes_played', label: 'MIN' },
  { key: 'game_type', label: 'Type' },
]

export const DRILL_COLUMNS = [
  { key: 'session_date', label: 'Date', accessor: (d) => d.session_date || d.created_at?.slice(0, 10) || '' },
  { key: 'category', label: 'Category' },
  { key: 'drill_name', label: 'Drill' },
  { key: 'duration_minutes', label: 'Duration (min)' },
  { key: 'reps', label: 'Reps' },
  { key: 'sets', label: 'Sets' },
  { key: 'rating', label: 'Rating' },
  { key: 'notes', label: 'Notes' },
]

export const JOURNAL_COLUMNS = [
  { key: 'entry_date', label: 'Date' },
  { key: 'mood', label: 'Mood' },
  { key: 'energy_level', label: 'Energy' },
  { key: 'confidence_level', label: 'Confidence' },
  { key: 'focus_level', label: 'Focus' },
  { key: 'stress_level', label: 'Stress' },
  { key: 'sleep_hours', label: 'Sleep (hrs)' },
  { key: 'goals_text', label: 'Goals' },
  { key: 'gratitude_text', label: 'Gratitude' },
  { key: 'reflection_text', label: 'Reflection' },
]

export function exportGamesCSV(games) {
  exportToCSV(games, `courtiq-games-${new Date().toISOString().slice(0, 10)}`, GAME_COLUMNS)
}

export function exportDrillsCSV(drills) {
  exportToCSV(drills, `courtiq-drills-${new Date().toISOString().slice(0, 10)}`, DRILL_COLUMNS)
}

export function exportJournalCSV(journal) {
  exportToCSV(journal, `courtiq-journal-${new Date().toISOString().slice(0, 10)}`, JOURNAL_COLUMNS)
}

export function generateStatSheetHTML(profile, seasonAverages, games) {
  const totalGames = games.length
  const wins = games.filter((g) => g.result === 'W').length
  const record = `${wins}-${totalGames - wins}`

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>CourtIQ Stat Sheet — ${profile?.display_name || 'Player'}</title>
<style>
  body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #1a1a1a; max-width: 800px; margin: 0 auto; padding: 40px 24px; }
  h1 { font-size: 28px; margin-bottom: 4px; }
  .subtitle { color: #666; font-size: 14px; margin-bottom: 32px; }
  .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 32px; }
  .stat-card { background: #f8f8f8; border-radius: 12px; padding: 16px; text-align: center; }
  .stat-value { font-size: 32px; font-weight: 800; color: #F97316; }
  .stat-label { font-size: 12px; color: #888; text-transform: uppercase; letter-spacing: 1px; margin-top: 4px; }
  table { width: 100%; border-collapse: collapse; font-size: 13px; }
  th { background: #f0f0f0; padding: 8px 6px; text-align: left; font-weight: 600; border-bottom: 2px solid #ddd; }
  td { padding: 8px 6px; border-bottom: 1px solid #eee; }
  tr:nth-child(even) { background: #fafafa; }
  .footer { margin-top: 32px; text-align: center; color: #aaa; font-size: 11px; }
</style>
</head>
<body>
  <h1>${profile?.display_name || 'Player'}</h1>
  <p class="subtitle">${profile?.position || ''} · ${profile?.skill_level || ''} · ${totalGames} Games · ${record}</p>

  <h2>Season Averages</h2>
  <div class="stats-grid">
    <div class="stat-card"><div class="stat-value">${seasonAverages.ppg || '0.0'}</div><div class="stat-label">PPG</div></div>
    <div class="stat-card"><div class="stat-value">${seasonAverages.rpg || '0.0'}</div><div class="stat-label">RPG</div></div>
    <div class="stat-card"><div class="stat-value">${seasonAverages.apg || '0.0'}</div><div class="stat-label">APG</div></div>
    <div class="stat-card"><div class="stat-value">${seasonAverages.fgPct || '0.0'}%</div><div class="stat-label">FG%</div></div>
    <div class="stat-card"><div class="stat-value">${seasonAverages.threePct || '0.0'}%</div><div class="stat-label">3P%</div></div>
    <div class="stat-card"><div class="stat-value">${seasonAverages.ftPct || '0.0'}%</div><div class="stat-label">FT%</div></div>
  </div>

  <h2>Game Log</h2>
  <table>
    <thead><tr><th>Date</th><th>Opp</th><th>W/L</th><th>PTS</th><th>REB</th><th>AST</th><th>STL</th><th>BLK</th><th>TO</th><th>FG%</th></tr></thead>
    <tbody>
      ${games.slice(0, 20).map((g) => {
        const fgPct = g.field_goals_attempted ? ((g.field_goals_made / g.field_goals_attempted) * 100).toFixed(1) : '-'
        return `<tr><td>${g.game_date || ''}</td><td>${g.opponent || '-'}</td><td>${g.result || '-'}</td><td>${g.points || 0}</td><td>${g.rebounds || 0}</td><td>${g.assists || 0}</td><td>${g.steals || 0}</td><td>${g.blocks || 0}</td><td>${g.turnovers || 0}</td><td>${fgPct}</td></tr>`
      }).join('')}
    </tbody>
  </table>

  <p class="footer">Generated by CourtIQ · ${new Date().toLocaleDateString()}</p>
</body>
</html>`
}

export function exportStatSheetPDF(profile, seasonAverages, games) {
  const html = generateStatSheetHTML(profile, seasonAverages, games)
  const printWindow = window.open('', '_blank')
  if (!printWindow) return
  printWindow.document.write(html)
  printWindow.document.close()
  printWindow.focus()
  setTimeout(() => printWindow.print(), 500)
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
