import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase, BYPASS_AUTH } from '../lib/supabase';
import { localToday } from '../utils/dateUtils';

const STORAGE_KEY = 'courtiq_drills';
const PAGE_SIZE = 10;
const CATEGORIES = ['Shooting', 'Ball Handling', 'Passing', 'Defense', 'Conditioning', 'Agility', 'Custom'];

function loadLocal() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch { return []; }
}

function saveLocal(data) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch {}
}

function sortByDate(arr) {
  return [...arr].sort((a, b) => new Date(b.session_date) - new Date(a.session_date));
}

export default function useDrills() {
  const [allDrills, setAllDrills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const fetchDrills = useCallback(async (pageNum = 1) => {
    setLoading(true);
    try {
      if (BYPASS_AUTH) {
        const all = sortByDate(loadLocal());
        const sliced = all.slice(0, pageNum * PAGE_SIZE);
        setAllDrills(sliced);
        setHasMore(sliced.length < all.length);
        setPage(pageNum);
      } else {
        const from = (pageNum - 1) * PAGE_SIZE;
        const to = from + PAGE_SIZE - 1;
        const { data, error } = await supabase
          .from('drill_sessions')
          .select('*')
          .order('session_date', { ascending: false })
          .range(from, to);
        if (error) throw error;
        if (pageNum === 1) {
          setAllDrills(data || []);
        } else {
          setAllDrills(prev => [...prev, ...(data || [])]);
        }
        setHasMore((data || []).length === PAGE_SIZE);
        setPage(pageNum);
      }
    } catch {} finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchDrills(1); }, [fetchDrills]);

  const loadMore = useCallback(() => {
    if (hasMore) fetchDrills(page + 1);
  }, [hasMore, page, fetchDrills]);

  const addDrill = useCallback(async (data) => {
    try {
      if (BYPASS_AUTH) {
        const drill = {
          id: crypto.randomUUID(),
          user_id: 'local',
          session_date: data.session_date || localToday(),
          drill_name: data.drill_name,
          category: data.category,
          duration_minutes: Number(data.duration_minutes) || 0,
          reps: data.reps ? Number(data.reps) : null,
          sets: data.sets ? Number(data.sets) : null,
          rating: data.rating ? Number(data.rating) : null,
          notes: data.notes || '',
          is_custom_drill: Boolean(data.is_custom_drill),
          created_at: new Date().toISOString(),
        };
        const all = loadLocal();
        all.push(drill);
        saveLocal(all);
        setAllDrills(sortByDate(all).slice(0, (page) * PAGE_SIZE));
        return drill;
      } else {
        const { data: row, error } = await supabase
          .from('drill_sessions')
          .insert([data])
          .select()
          .single();
        if (error) throw error;
        await fetchDrills(1);
        return row;
      }
    } catch { return null; }
  }, [page, fetchDrills]);

  const updateDrill = useCallback(async (id, updates) => {
    try {
      if (BYPASS_AUTH) {
        const all = loadLocal().map(d => d.id === id ? { ...d, ...updates } : d);
        saveLocal(all);
        setAllDrills(sortByDate(all).slice(0, page * PAGE_SIZE));
        return all.find(d => d.id === id);
      } else {
        const { data: row, error } = await supabase
          .from('drill_sessions')
          .update(updates)
          .eq('id', id)
          .select()
          .single();
        if (error) throw error;
        await fetchDrills(1);
        return row;
      }
    } catch { return null; }
  }, [page, fetchDrills]);

  const deleteDrill = useCallback(async (id) => {
    try {
      if (BYPASS_AUTH) {
        const all = loadLocal().filter(d => d.id !== id);
        saveLocal(all);
        setAllDrills(sortByDate(all).slice(0, page * PAGE_SIZE));
        return true;
      } else {
        const { error } = await supabase
          .from('drill_sessions')
          .delete()
          .eq('id', id);
        if (error) throw error;
        await fetchDrills(1);
        return true;
      }
    } catch { return false; }
  }, [page, fetchDrills]);

  const categoryStats = useMemo(() => {
    const source = BYPASS_AUTH ? loadLocal() : allDrills;
    const stats = {};
    CATEGORIES.forEach(c => { stats[c] = { count: 0, totalMinutes: 0 }; });
    source.forEach(d => {
      if (stats[d.category]) {
        stats[d.category].count += 1;
        stats[d.category].totalMinutes += Number(d.duration_minutes) || 0;
      }
    });
    return stats;
  }, [allDrills]);

  const recentStreak = useMemo(() => {
    const source = BYPASS_AUTH ? loadLocal() : allDrills;
    if (!source.length) return 0;
    const dateSet = new Set(source.map(d => d.session_date));
    let streak = 0;
    const today = new Date();
    for (let i = 0; i < 365; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      if (dateSet.has(key)) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  }, [allDrills]);

  return {
    drills: allDrills,
    loading,
    addDrill,
    updateDrill,
    deleteDrill,
    fetchDrills,
    loadMore,
    hasMore,
    page,
    categoryStats,
    recentStreak,
  };
}
