import { useState, useMemo } from 'react';
import { Target, Flame, ArrowLeft, Star, Clock, CheckCircle } from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Badge from '../../components/ui/Badge';
import EmptyState from '../../components/ui/EmptyState';
import SkeletonLoader from '../../components/ui/SkeletonLoader';
import { useToast } from '../../context/ToastContext';
import useDrills from '../../hooks/useDrills';

const CATEGORIES = ['Shooting', 'Ball Handling', 'Passing', 'Defense', 'Conditioning', 'Agility', 'Custom'];
const CATEGORY_OPTIONS = CATEGORIES.map(c => ({ value: c, label: c }));
const BADGE_MAP = { Shooting: 'elite', 'Ball Handling': 'intermediate', Defense: 'beginner', default: 'default' };
const font = (f) => ({ fontFamily: f === 'heading' ? "'Barlow Condensed', sans-serif" : "'DM Sans', sans-serif" });

function Stars({ value, interactive, onChange }) {
  return (
    <span className="inline-flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star
          key={i}
          className="w-5 h-5"
          style={{
            color: 'var(--accent-primary)',
            fill: i <= value ? 'var(--accent-primary)' : 'none',
            cursor: interactive ? 'pointer' : 'default',
          }}
          onClick={interactive ? () => onChange(i) : undefined}
        />
      ))}
    </span>
  );
}

const emptyForm = () => ({
  session_date: new Date().toISOString().split('T')[0],
  drill_name: '', category: '', duration_minutes: '', reps: '', sets: '',
  rating: 0, notes: '', is_custom_drill: false,
});

export default function Drills() {
  const { drills, loading, addDrill, updateDrill, deleteDrill, loadMore, hasMore, categoryStats, recentStreak } = useDrills();
  const { showToast } = useToast();
  const [view, setView] = useState('list'); // list | form | result
  const [filter, setFilter] = useState('All');
  const [form, setForm] = useState(emptyForm());
  const [errors, setErrors] = useState({});
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);

  const filtered = useMemo(() => {
    if (filter === 'All') return drills;
    return drills.filter(d => d.category === filter);
  }, [drills, filter]);

  const activeStats = useMemo(() =>
    Object.entries(categoryStats).filter(([, v]) => v.count > 0), [categoryStats]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.drill_name.trim()) e.drill_name = 'Required';
    if (!form.category) e.category = 'Required';
    const dur = Number(form.duration_minutes);
    if (!dur || dur < 1 || dur > 300) e.duration_minutes = '1-300 minutes';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const openNew = () => { setForm(emptyForm()); setEditId(null); setErrors({}); setView('form'); };
  const openEdit = (d) => {
    setForm({ ...d, duration_minutes: String(d.duration_minutes), reps: d.reps ? String(d.reps) : '', sets: d.sets ? String(d.sets) : '' });
    setEditId(d.id); setErrors({}); setView('form');
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      const payload = {
        ...form,
        duration_minutes: Number(form.duration_minutes),
        reps: form.reps ? Number(form.reps) : null,
        sets: form.sets ? Number(form.sets) : null,
        rating: form.rating || null,
      };
      if (editId) {
        const res = await updateDrill(editId, payload);
        if (res) { showToast('Drill updated', 'success'); setView('list'); }
        else showToast('Failed to update', 'error');
      } else {
        const res = await addDrill(payload);
        if (res) { setLastSaved(res); showToast('Drill logged', 'success'); setView('result'); }
        else showToast('Failed to save', 'error');
      }
    } catch { showToast('Something went wrong', 'error'); }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!editId) return;
    setSaving(true);
    const ok = await deleteDrill(editId);
    if (ok) { showToast('Drill deleted', 'success'); setView('list'); }
    else showToast('Failed to delete', 'error');
    setSaving(false);
  };

  const feedbackLine = (min) => {
    if (min < 15) return 'Quick session — consistency matters!';
    if (min <= 30) return 'Solid work!';
    if (min <= 60) return 'Great commitment to your craft';
    return 'Elite-level dedication';
  };

  // --- RESULT VIEW ---
  if (view === 'result' && lastSaved) {
    return (
      <PageWrapper>
        <div className="flex flex-col items-center gap-6 py-8">
          <CheckCircle className="w-12 h-12" style={{ color: 'var(--success)' }} />
          <Card padding="lg" glass>
            <div className="flex flex-col items-center gap-3 text-center">
              <h2 className="text-2xl font-bold" style={{ ...font('heading'), color: 'var(--text-primary)' }}>{lastSaved.drill_name}</h2>
              <Badge variant={BADGE_MAP[lastSaved.category] || 'default'}>{lastSaved.category}</Badge>
              <div className="flex items-center gap-2" style={{ color: 'var(--text-secondary)', ...font('body') }}>
                <Clock className="w-4 h-4" /> {lastSaved.duration_minutes} min
              </div>
              {lastSaved.rating > 0 && <Stars value={lastSaved.rating} />}
              <p className="text-sm mt-2" style={{ color: 'var(--accent-primary)', ...font('body') }}>{feedbackLine(lastSaved.duration_minutes)}</p>
            </div>
          </Card>
          <Button variant="primary" onClick={() => setView('list')}>Done</Button>
        </div>
      </PageWrapper>
    );
  }

  // --- FORM VIEW ---
  if (view === 'form') {
    return (
      <PageWrapper>
        <div className="flex flex-col gap-5">
          <button onClick={() => setView('list')} className="flex items-center gap-1 text-sm" style={{ color: 'var(--text-secondary)', ...font('body'), background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <h1 className="text-2xl font-bold" style={{ ...font('heading'), color: 'var(--text-primary)' }}>{editId ? 'Edit Drill' : 'Log Drill'}</h1>
          <Input label="Date" type="date" value={form.session_date} onChange={e => set('session_date', e.target.value)} />
          <Input label="Drill Name" placeholder="e.g. Free Throws" value={form.drill_name} onChange={e => set('drill_name', e.target.value)} error={errors.drill_name} />
          <Select label="Category" options={CATEGORY_OPTIONS} value={form.category} onChange={e => set('category', e.target.value)} placeholder="Select category" error={errors.category} />
          <Input label="Duration (min)" type="number" placeholder="1-300" value={form.duration_minutes} onChange={e => set('duration_minutes', e.target.value)} error={errors.duration_minutes} />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Reps" type="number" placeholder="Optional" value={form.reps} onChange={e => set('reps', e.target.value)} />
            <Input label="Sets" type="number" placeholder="Optional" value={form.sets} onChange={e => set('sets', e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)', ...font('body') }}>Rating</span>
            <Stars value={form.rating} interactive onChange={v => set('rating', v)} />
          </div>
          <label className="flex items-center gap-2 cursor-pointer" style={{ ...font('body'), color: 'var(--text-secondary)' }}>
            <span
              className="w-5 h-5 rounded flex items-center justify-center text-xs font-bold"
              style={{ border: '1px solid var(--border-subtle)', background: form.is_custom_drill ? 'var(--accent-primary)' : 'transparent', color: '#fff' }}
              onClick={() => set('is_custom_drill', !form.is_custom_drill)}
            >{form.is_custom_drill ? '✓' : ''}</span>
            <span className="text-sm" onClick={() => set('is_custom_drill', !form.is_custom_drill)}>Custom drill</span>
          </label>
          <Input label="Notes" placeholder="Optional notes..." value={form.notes} onChange={e => set('notes', e.target.value)} />
          <Button variant="primary" fullWidth loading={saving} onClick={handleSave}>{editId ? 'Update Drill' : 'Save Drill'}</Button>
          {editId && <Button variant="ghost" fullWidth loading={saving} onClick={handleDelete} style={{ color: 'var(--danger)' }}>Delete Drill</Button>}
        </div>
      </PageWrapper>
    );
  }

  // --- LIST VIEW ---
  return (
    <PageWrapper>
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold" style={{ ...font('heading'), color: 'var(--text-primary)' }}>Drill Tracker</h1>
          <Button variant="primary" onClick={openNew}>Log Drill</Button>
        </div>

        {recentStreak > 0 && (
          <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--accent-primary)', ...font('heading'), fontWeight: 600 }}>
            <Flame className="w-5 h-5" /> {recentStreak} day drill streak
          </div>
        )}

        {activeStats.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {activeStats.map(([cat, v]) => (
              <span key={cat} className="px-2.5 py-1 rounded-full text-xs font-medium"
                style={{ background: 'var(--bg-surface)', color: 'var(--text-secondary)', border: '1px solid var(--border-subtle)', ...font('body') }}>
                {cat} <strong style={{ color: 'var(--text-primary)', ...font('heading') }}>{v.count}</strong>
              </span>
            ))}
          </div>
        )}

        <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
          {['All', ...CATEGORIES].map(c => (
            <button key={c} onClick={() => setFilter(c)}
              className="px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors"
              style={{
                background: filter === c ? 'var(--accent-primary)' : 'var(--bg-surface)',
                color: filter === c ? '#fff' : 'var(--text-secondary)',
                border: filter === c ? 'none' : '1px solid var(--border-subtle)',
                cursor: 'pointer', ...font('body'),
              }}>
              {c}
            </button>
          ))}
        </div>

        {loading && !drills.length ? (
          <SkeletonLoader variant="card" count={3} />
        ) : filtered.length === 0 ? (
          <EmptyState icon={Target} title="No Drills Logged" description="Start building your skills" actionLabel="Log Your First Drill" onAction={openNew} />
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map(d => (
              <Card key={d.id} padding="md" hover onClick={() => openEdit(d)}>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm" style={{ color: 'var(--text-muted)', ...font('body') }}>{d.session_date}</span>
                    <Badge variant={BADGE_MAP[d.category] || 'default'}>{d.category}</Badge>
                  </div>
                  <span className="text-base font-bold" style={{ color: 'var(--text-primary)', ...font('heading') }}>{d.drill_name}</span>
                  <div className="flex items-center gap-4 flex-wrap">
                    <span className="flex items-center gap-1 text-sm" style={{ color: 'var(--text-secondary)', ...font('body') }}>
                      <Clock className="w-3.5 h-3.5" /> {d.duration_minutes} min
                    </span>
                    {d.reps && d.sets && (
                      <span className="text-sm" style={{ color: 'var(--text-secondary)', ...font('body') }}>{d.reps} x {d.sets}</span>
                    )}
                    {d.rating > 0 && <Stars value={d.rating} />}
                  </div>
                </div>
              </Card>
            ))}
            {hasMore && (
              <Button variant="ghost" fullWidth onClick={loadMore} loading={loading}>Load More</Button>
            )}
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
