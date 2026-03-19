import { useState } from 'react';
import { LogOut, User, Save, X, Pencil } from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const positionOptions = [
  { value: 'PG', label: 'Point Guard (PG)' },
  { value: 'SG', label: 'Shooting Guard (SG)' },
  { value: 'SF', label: 'Small Forward (SF)' },
  { value: 'PF', label: 'Power Forward (PF)' },
  { value: 'C', label: 'Center (C)' },
];

const skillLevelOptions = [
  { value: 'Beginner', label: 'Beginner' },
  { value: 'Intermediate', label: 'Intermediate' },
  { value: 'Advanced', label: 'Advanced' },
];

function ProfileField({ label, value }) {
  return (
    <div className="flex items-center justify-between border-b border-border-subtle py-2 last:border-0">
      <span className="font-body text-sm text-text-muted">{label}</span>
      <span className="font-body text-sm font-medium text-text-primary">
        {value || '--'}
      </span>
    </div>
  );
}

export default function Settings() {
  const { user, profile, signOut, updateProfile, demoMode } = useAuth();
  const { showToast } = useToast();

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    full_name: profile?.full_name || '',
    position: profile?.position || '',
    skill_level: profile?.skill_level || '',
  });

  function handleEdit() {
    setForm({
      full_name: profile?.full_name || '',
      position: profile?.position || '',
      skill_level: profile?.skill_level || '',
    });
    setEditing(true);
  }

  function handleCancel() {
    setEditing(false);
  }

  async function handleSave() {
    if (demoMode) { showToast('Demo mode — changes not saved', 'info'); return; }
    setSaving(true);
    try {
      await updateProfile(form);
      showToast('Profile updated successfully', 'success');
      setEditing(false);
    } catch (err) {
      showToast(err?.message || 'Failed to update profile', 'error');
    } finally {
      setSaving(false);
    }
  }

  return (
    <PageWrapper>
      <div className="mx-auto max-w-2xl space-y-6">
        {/* Header */}
        <div>
          <h1 className="font-display text-3xl font-bold text-text-primary">
            Settings
          </h1>
          <p className="mt-1 font-body text-text-secondary">
            Manage your profile and account preferences
          </p>
        </div>

        {/* Profile Section */}
        <Card glass padding="lg">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-accent-primary" />
              <h2 className="font-display text-xl font-semibold text-text-primary">
                Profile
              </h2>
            </div>
            {!editing && (
              <Button variant="ghost" onClick={handleEdit} className="gap-1.5">
                <Pencil className="h-4 w-4" />
                Edit Profile
              </Button>
            )}
          </div>

          {editing ? (
            <div className="space-y-4">
              <Input
                label="Full Name"
                value={form.full_name}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, full_name: e.target.value }))
                }
              />
              <Select
                label="Position"
                options={positionOptions}
                placeholder="Select position"
                value={form.position}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, position: e.target.value }))
                }
              />
              <Select
                label="Skill Level"
                options={skillLevelOptions}
                placeholder="Select skill level"
                value={form.skill_level}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, skill_level: e.target.value }))
                }
              />
              <div className="flex gap-3 pt-2">
                <Button
                  variant="primary"
                  onClick={handleSave}
                  loading={saving}
                  disabled={saving}
                  className="gap-1.5"
                >
                  <Save className="h-4 w-4" />
                  Save Changes
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  disabled={saving}
                  className="gap-1.5"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <ProfileField label="Name" value={profile?.full_name} />
              <ProfileField label="Position" value={profile?.position} />
              <ProfileField label="Skill Level" value={profile?.skill_level} />
            </div>
          )}
        </Card>

        {/* Account Section */}
        <Card glass padding="lg">
          <div className="mb-4 flex items-center gap-2">
            <h2 className="font-display text-xl font-semibold text-text-primary">
              Account
            </h2>
          </div>
          <ProfileField label="Email" value={user?.email} />
        </Card>

        {/* Sign Out */}
        <Button
          variant="outline"
          fullWidth
          onClick={signOut}
          className="gap-2 border-border-subtle text-danger hover:bg-bg-surface-hover"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </PageWrapper>
  );
}
