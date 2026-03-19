import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import { Target, TrendingUp, BarChart3, ChevronLeft, ChevronRight } from 'lucide-react';

const POSITIONS = [
  { value: 'PG', label: 'Point Guard (PG)' },
  { value: 'SG', label: 'Shooting Guard (SG)' },
  { value: 'SF', label: 'Small Forward (SF)' },
  { value: 'PF', label: 'Power Forward (PF)' },
  { value: 'C', label: 'Center (C)' },
];

const SKILL_LEVELS = [
  { value: 'Beginner', label: 'Beginner' },
  { value: 'Intermediate', label: 'Intermediate' },
  { value: 'Advanced', label: 'Advanced' },
];

const FEATURE_CARDS = [
  {
    icon: Target,
    title: 'Track Your Shots',
    description:
      'Log every shot from the court and see where you perform best. Heatmaps and percentages give you a clear picture of your game.',
  },
  {
    icon: TrendingUp,
    title: 'Build Your Skills',
    description:
      'Follow personalized drills and training plans designed around your position and skill level. Get better every day.',
  },
  {
    icon: BarChart3,
    title: 'Measure Your Progress',
    description:
      'Track stats over time with detailed analytics. See your improvement week over week and set goals to keep pushing forward.',
  },
];

function ProgressDots({ total, current }) {
  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`
            h-2 rounded-full transition-all duration-300
            ${i === current ? 'w-6 bg-accent-primary' : 'w-2 bg-white/20'}
          `}
        />
      ))}
    </div>
  );
}

function StepProfile({ fullName, setFullName, position, setPosition, skillLevel, setSkillLevel, errors }) {
  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="font-display font-bold text-xl text-text-primary">
          Tell us about yourself
        </h2>
        <p className="text-text-muted text-sm mt-1 font-body">
          Help us personalize your experience
        </p>
      </div>

      <Input
        label="Full Name"
        type="text"
        placeholder="Your full name"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        error={errors.fullName}
      />

      <Select
        label="Position"
        options={POSITIONS}
        placeholder="Select your position"
        value={position}
        onChange={(e) => setPosition(e.target.value)}
        error={errors.position}
      />

      <Select
        label="Skill Level"
        options={SKILL_LEVELS}
        placeholder="Select your skill level"
        value={skillLevel}
        onChange={(e) => setSkillLevel(e.target.value)}
        error={errors.skillLevel}
      />
    </div>
  );
}

function StepFeatureTour({ activeCard, setActiveCard }) {
  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="font-display font-bold text-xl text-text-primary">
          What you can do
        </h2>
        <p className="text-text-muted text-sm mt-1 font-body">
          Swipe through to learn more
        </p>
      </div>

      <div className="relative overflow-hidden">
        <div
          className="flex transition-transform duration-300 ease-out"
          style={{ transform: `translateX(-${activeCard * 100}%)` }}
        >
          {FEATURE_CARDS.map((card, i) => {
            const Icon = card.icon;
            return (
              <div key={i} className="w-full flex-shrink-0 px-1">
                <div className="bg-bg-surface border border-border-subtle rounded-xl p-6 text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent-primary/15 mb-4">
                    <Icon className="h-6 w-6 text-accent-primary" />
                  </div>
                  <h3 className="font-display font-semibold text-lg text-text-primary mb-2">
                    {card.title}
                  </h3>
                  <p className="text-text-secondary text-sm font-body leading-relaxed">
                    {card.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Card navigation */}
      <div className="flex items-center justify-center gap-4 pt-2">
        <button
          type="button"
          onClick={() => setActiveCard((prev) => Math.max(0, prev - 1))}
          disabled={activeCard === 0}
          className="p-2 rounded-full hover:bg-bg-surface-hover text-text-secondary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="flex gap-1.5">
          {FEATURE_CARDS.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActiveCard(i)}
              className={`
                h-2 rounded-full transition-all duration-300
                ${i === activeCard ? 'w-6 bg-accent-primary' : 'w-2 bg-white/20 hover:bg-white/30'}
              `}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => setActiveCard((prev) => Math.min(FEATURE_CARDS.length - 1, prev + 1))}
          disabled={activeCard === FEATURE_CARDS.length - 1}
          className="p-2 rounded-full hover:bg-bg-surface-hover text-text-secondary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}

function StepComplete() {
  return (
    <div className="text-center py-6">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent-primary/15 mb-6">
        <span className="text-3xl">&#127936;</span>
      </div>
      <h2 className="font-display font-bold text-2xl text-text-primary mb-2">
        You&apos;re All Set!
      </h2>
      <p className="text-text-secondary text-sm font-body leading-relaxed max-w-xs mx-auto">
        Your profile is ready. Start tracking your game, building skills, and
        watching your progress soar.
      </p>
    </div>
  );
}

export default function Onboarding() {
  const navigate = useNavigate();
  const { updateProfile } = useAuth();

  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

  // Step 1 state
  const [fullName, setFullName] = useState('');
  const [position, setPosition] = useState('');
  const [skillLevel, setSkillLevel] = useState('');
  const [errors, setErrors] = useState({});

  // Step 2 state
  const [activeCard, setActiveCard] = useState(0);

  const TOTAL_STEPS = 3;

  const validateStep1 = () => {
    const newErrors = {};
    if (!fullName.trim()) newErrors.fullName = 'Full name is required.';
    if (!position) newErrors.position = 'Please select a position.';
    if (!skillLevel) newErrors.skillLevel = 'Please select a skill level.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 0 && !validateStep1()) return;
    setStep((prev) => Math.min(TOTAL_STEPS - 1, prev + 1));
  };

  const handleBack = () => {
    setStep((prev) => Math.max(0, prev - 1));
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      await updateProfile({
        full_name: fullName.trim(),
        position,
        skill_level: skillLevel,
        onboarding_completed: true,
      });
      navigate('/', { replace: true });
    } catch (err) {
      console.error('Failed to complete onboarding:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-primary px-4 py-8">
      <div className="w-full max-w-sm">
        {/* Glassmorphism card */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl">
          {/* Step content with crossfade */}
          <div className="transition-opacity duration-200">
            {step === 0 && (
              <StepProfile
                fullName={fullName}
                setFullName={setFullName}
                position={position}
                setPosition={setPosition}
                skillLevel={skillLevel}
                setSkillLevel={setSkillLevel}
                errors={errors}
              />
            )}
            {step === 1 && (
              <StepFeatureTour
                activeCard={activeCard}
                setActiveCard={setActiveCard}
              />
            )}
            {step === 2 && <StepComplete />}
          </div>

          {/* Navigation buttons */}
          <div className="flex items-center gap-3 mt-6">
            {step > 0 && (
              <Button variant="ghost" onClick={handleBack} className="flex-1">
                Back
              </Button>
            )}

            {step < TOTAL_STEPS - 1 ? (
              <Button onClick={handleNext} fullWidth={step === 0} className={step > 0 ? 'flex-1' : ''}>
                Next
              </Button>
            ) : (
              <Button
                onClick={handleComplete}
                fullWidth={step === 0}
                loading={loading}
                disabled={loading}
                className={step > 0 ? 'flex-1' : ''}
              >
                Let&apos;s Go
              </Button>
            )}
          </div>

          {/* Progress dots */}
          <ProgressDots total={TOTAL_STEPS} current={step} />
        </div>
      </div>
    </div>
  );
}
