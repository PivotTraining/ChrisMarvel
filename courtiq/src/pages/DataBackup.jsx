import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Download, Upload, AlertTriangle, Check } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../contexts/ToastContext'
import PageShell from '../components/ui/PageShell'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'

const TABLES = ['games', 'drill_sessions', 'shot_logs', 'journal_entries', 'goals', 'workout_templates']

export default function DataBackup() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const toast = useToast()
  const [exporting, setExporting] = useState(false)
  const [importing, setImporting] = useState(false)
  const [importResult, setImportResult] = useState(null)

  async function handleExport() {
    if (!user) return
    setExporting(true)

    const backup = { version: 1, exported_at: new Date().toISOString(), user_id: user.id, data: {} }

    for (const table of TABLES) {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .eq('user_id', user.id)

      if (!error) {
        backup.data[table] = data || []
      }
    }

    const json = JSON.stringify(backup, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `courtiq-backup-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)

    setExporting(false)
    toast('Backup exported!')
  }

  async function handleImport(e) {
    const file = e.target.files?.[0]
    if (!file || !user) return

    setImporting(true)
    setImportResult(null)

    try {
      const text = await file.text()
      const backup = JSON.parse(text)

      if (!backup.version || !backup.data) {
        throw new Error('Invalid backup file format')
      }

      const results = {}
      let totalImported = 0

      for (const table of TABLES) {
        const rows = backup.data[table]
        if (!rows || rows.length === 0) {
          results[table] = 0
          continue
        }

        // Strip IDs and reassign user_id for clean import
        const cleaned = rows.map(row => {
          const { id, user_id, created_at, updated_at, ...rest } = row
          return { ...rest, user_id: user.id }
        })

        const { error } = await supabase.from(table).insert(cleaned)

        if (!error) {
          results[table] = cleaned.length
          totalImported += cleaned.length
        } else {
          results[table] = `Error: ${error.message}`
        }
      }

      setImportResult(results)
      toast(`Imported ${totalImported} records!`)
    } catch (err) {
      toast(err.message || 'Failed to import backup', 'error')
    }

    setImporting(false)
    e.target.value = ''
  }

  return (
    <PageShell>
      <div className="flex flex-col gap-8">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-xl bg-bg-card border border-border flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-text-primary">Data Backup</h1>
            <p className="text-xs text-text-muted">Export or import your CourtIQ data.</p>
          </div>
        </div>

        {/* Export */}
        <Card className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue/10 border border-blue-border flex items-center justify-center shrink-0">
              <Download size={18} className="text-blue" />
            </div>
            <div>
              <p className="text-sm font-semibold text-text-primary">Export Data</p>
              <p className="text-xs text-text-muted">Download all your data as a JSON file.</p>
            </div>
          </div>
          <div className="bg-bg-section rounded-lg px-3 py-2 text-[10px] text-text-muted">
            Includes: games, drills, shots, journal entries, goals, and workout templates.
          </div>
          <Button fullWidth onClick={handleExport} disabled={exporting}>
            <Download size={16} />
            {exporting ? 'Exporting...' : 'Export All Data'}
          </Button>
        </Card>

        {/* Import */}
        <Card className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0">
              <Upload size={18} className="text-gold" />
            </div>
            <div>
              <p className="text-sm font-semibold text-text-primary">Import Data</p>
              <p className="text-xs text-text-muted">Restore from a CourtIQ backup file.</p>
            </div>
          </div>
          <div className="bg-danger/5 border border-danger/10 rounded-lg px-3 py-2 text-[10px] text-danger flex items-start gap-2">
            <AlertTriangle size={12} className="shrink-0 mt-0.5" />
            <span>Import adds records to your existing data. It does not overwrite or delete existing entries.</span>
          </div>
          <label className="block">
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              disabled={importing}
              className="hidden"
            />
            <div className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border-2 border-dashed border-border text-sm font-medium text-text-secondary cursor-pointer hover:border-blue-border hover:text-blue transition-colors">
              <Upload size={16} />
              {importing ? 'Importing...' : 'Choose Backup File'}
            </div>
          </label>

          {/* Import results */}
          {importResult && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-text-muted uppercase">Import Results</p>
              {Object.entries(importResult).map(([table, count]) => (
                <div key={table} className="flex items-center justify-between text-xs">
                  <span className="text-text-secondary">{table.replace(/_/g, ' ')}</span>
                  <span className={typeof count === 'number' ? 'text-success font-medium' : 'text-danger'}>
                    {typeof count === 'number' ? (
                      <span className="flex items-center gap-1"><Check size={12} /> {count} records</span>
                    ) : count}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </PageShell>
  )
}
