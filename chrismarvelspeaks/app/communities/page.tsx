import type { Metadata } from 'next'
import CommunitiesNav from './CommunitiesNav'

export const metadata: Metadata = {
  title: 'Digital Communities — Accountability, Sales & Leadership Mentor',
  description:
    'Chris Marvel is the accountability, sales psychology, and leadership mentor that digital community founders bring in to transform their members. Book Chris for your community.',
  openGraph: {
    title: 'Digital Communities | Chris Marvel — Accountability, Sales & Leadership Mentor',
    description:
      'You built the community. Chris Marvel makes your members move. The #1 accountability, sales, and leadership mentor for digital brand communities.',
    url: 'https://www.chrismarvelspeaks.com/communities',
    type: 'website',
  },
  alternates: {
    canonical: 'https://www.chrismarvelspeaks.com/communities',
  },
}

const css = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --navy:       #1b2a4a;
    --navy-deep:  #111d35;
    --navy-light: #243656;
    --gold:       #c9a84c;
    --gold-light: #d4ba6a;
    --white:      #fff;
    --off-white:  #f5f5f5;
    --gray-100:   #f0f0f0;
    --gray-200:   #e5e5e5;
    --gray-600:   #6b7280;
    --gray-800:   #374151;
    --text-dark:  #1f2937;
    --gold-dim:   rgba(201,168,76,0.12);
    --nav-bg:     rgba(17,29,53,0.97);

    --font-heading: 'Montserrat', sans-serif;
    --font-display: 'Bebas Neue', sans-serif;
    --font-body:    'Inter', sans-serif;
  }

  html { scroll-behavior: smooth; }

  body {
    font-family: var(--font-body);
    background: var(--navy-deep);
    color: var(--white);
    line-height: 1.6;
    overflow-x: hidden;
  }

  .cross-pattern {
    background-color: var(--navy-deep);
    background-image:
      radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px),
      radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px);
    background-size: 32px 32px, 16px 16px;
    background-position: 0 0, 8px 8px;
  }

  .stripe-overlay::after {
    content: '';
    position: absolute;
    top: 0; right: 0;
    width: 40%;
    height: 100%;
    background-image: repeating-linear-gradient(
      62deg,
      transparent, transparent 26px,
      rgba(201,168,76,0.06) 26px,
      rgba(201,168,76,0.06) 28px
    );
    pointer-events: none;
  }

  .cm-nav {
    position: fixed;
    top: 0; left: 0; right: 0;
    z-index: 200;
    background: var(--nav-bg);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid rgba(201,168,76,0.18);
    height: 68px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 48px;
  }
  .cm-nav-brand {
    font-family: var(--font-heading);
    font-weight: 900;
    font-size: 1.05rem;
    letter-spacing: 0.1em;
    color: var(--white);
    text-decoration: none;
    text-transform: uppercase;
  }
  .cm-nav-brand span { color: var(--gold); }
  .cm-nav-links { display: flex; gap: 32px; list-style: none; }
  .cm-nav-links a {
    font-family: var(--font-heading);
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.72);
    text-decoration: none;
    transition: color 0.2s;
  }
  .cm-nav-links a:hover, .cm-nav-links a.active { color: var(--gold); }
  .cm-nav-cta {
    font-family: var(--font-heading);
    font-size: 0.72rem;
    font-weight: 800;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    background: var(--gold);
    color: var(--navy-deep);
    padding: 10px 22px;
    text-decoration: none;
    transition: background 0.2s;
    border-radius: 2px;
  }
  .cm-nav-cta:hover { background: var(--gold-light); }

  .cm-hero {
    margin-top: 68px;
    min-height: 100vh;
    background-color: var(--navy-deep);
    background-image:
      radial-gradient(circle, rgba(255,255,255,0.055) 1px, transparent 1px),
      radial-gradient(circle, rgba(255,255,255,0.025) 1px, transparent 1px);
    background-size: 32px 32px, 16px 16px;
    background-position: 0 0, 8px 8px;
    position: relative;
    overflow: hidden;
    display: flex;
    align-items: center;
  }
  .cm-hero::before {
    content: '';
    position: absolute;
    top: 0; right: 36%;
    width: 2px;
    height: 100%;
    background: linear-gradient(to bottom, transparent, var(--gold) 25%, var(--gold) 75%, transparent);
    opacity: 0.35;
  }
  .cm-hero::after {
    content: '';
    position: absolute;
    top: 0; right: 0;
    width: 36%;
    height: 100%;
    background-image: repeating-linear-gradient(
      62deg,
      transparent, transparent 26px,
      rgba(201,168,76,0.07) 26px,
      rgba(201,168,76,0.07) 28px
    );
    pointer-events: none;
  }

  .cm-hero-inner {
    position: relative;
    z-index: 2;
    max-width: 1200px;
    margin: 0 auto;
    padding: 100px 48px;
    width: 100%;
    display: grid;
    grid-template-columns: 1.1fr 1fr;
    gap: 48px;
    align-items: center;
  }

  .cm-hero-cycle {
    font-family: var(--font-display);
    font-size: 1.1rem;
    letter-spacing: 0.35em;
    color: var(--gold);
    margin-bottom: 24px;
    height: 1.6em;
    overflow: hidden;
  }
  .cm-hero-cycle-inner {
    display: flex;
    flex-direction: column;
    animation: cmCycleUp 7s infinite;
  }
  .cm-hero-cycle-inner span { display: block; line-height: 1.6; }
  @keyframes cmCycleUp {
    0%,28%  { transform: translateY(0); }
    33%,61% { transform: translateY(-1.6em); }
    66%,94% { transform: translateY(-3.2em); }
    99%,100%{ transform: translateY(0); }
  }

  .cm-hero-title {
    font-family: var(--font-display);
    font-size: clamp(4.5rem, 8vw, 7.5rem);
    line-height: 0.92;
    letter-spacing: 0.02em;
    color: var(--white);
  }
  .cm-hero-title-gold {
    font-family: var(--font-display);
    font-size: clamp(4.5rem, 8vw, 7.5rem);
    line-height: 0.92;
    letter-spacing: 0.02em;
    color: var(--gold);
    margin-bottom: 30px;
  }
  .cm-hero-desc {
    font-size: 1rem;
    color: rgba(255,255,255,0.62);
    line-height: 1.8;
    max-width: 460px;
    margin-bottom: 40px;
  }

  .cm-btn-gold {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    font-family: var(--font-heading);
    font-size: 0.76rem;
    font-weight: 800;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    background: var(--gold);
    color: var(--navy-deep);
    padding: 15px 30px;
    text-decoration: none;
    border-radius: 2px;
    transition: all 0.2s;
  }
  .cm-btn-gold::after { content: '→'; font-size: 0.95rem; }
  .cm-btn-gold:hover { background: var(--gold-light); transform: translateX(3px); }

  .cm-btn-outline {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    font-family: var(--font-heading);
    font-size: 0.76rem;
    font-weight: 800;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    border: 1.5px solid rgba(201,168,76,0.4);
    color: var(--gold);
    padding: 14px 30px;
    text-decoration: none;
    margin-left: 12px;
    border-radius: 2px;
    transition: all 0.2s;
  }
  .cm-btn-outline:hover { border-color: var(--gold); background: var(--gold-dim); }

  .cm-hero-stats {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 3px;
  }
  .cm-stat-box {
    background: var(--navy);
    border: 1px solid rgba(201,168,76,0.15);
    padding: 34px 26px;
    position: relative;
  }
  .cm-stat-box::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: var(--gold);
    opacity: 0.7;
  }
  .cm-stat-num {
    font-family: var(--font-display);
    font-size: 3.5rem;
    color: var(--gold);
    line-height: 1;
    margin-bottom: 6px;
  }
  .cm-stat-lbl {
    font-family: var(--font-heading);
    font-size: 0.66rem;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.42);
  }

  .cm-marquee-bar {
    background: var(--gold);
    padding: 18px 0;
    overflow: hidden;
    white-space: nowrap;
  }
  .cm-marquee-track {
    display: inline-flex;
    gap: 60px;
    animation: cmMarquee 24s linear infinite;
  }
  .cm-marquee-item {
    font-family: var(--font-display);
    font-size: 1.2rem;
    letter-spacing: 0.22em;
    color: var(--navy-deep);
    flex-shrink: 0;
  }
  .cm-marquee-item::after { content: '  ◆  '; opacity: 0.4; }
  @keyframes cmMarquee {
    0%   { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }

  .cm-section { padding: 108px 48px; }
  .cm-container { max-width: 1200px; margin: 0 auto; }

  .cm-eyebrow {
    font-family: var(--font-heading);
    font-size: 0.68rem;
    font-weight: 800;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 18px;
  }
  .cm-display-title {
    font-family: var(--font-display);
    font-size: clamp(3rem, 5vw, 5rem);
    line-height: 0.95;
    letter-spacing: 0.02em;
  }
  .cm-body-text {
    font-size: 1rem;
    color: rgba(255,255,255,0.6);
    line-height: 1.8;
  }

  .cm-pillars-section {
    background-color: var(--navy);
    background-image: radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px);
    background-size: 32px 32px;
  }
  .cm-pillars-header {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 64px;
    align-items: end;
    margin-bottom: 64px;
  }
  .cm-pillars-grid {
    display: grid;
    grid-template-columns: repeat(4,1fr);
    gap: 3px;
  }
  .cm-pillar {
    background: var(--navy-deep);
    border: 1px solid rgba(201,168,76,0.1);
    padding: 40px 26px;
    position: relative;
    transition: background 0.25s;
  }
  .cm-pillar::after {
    content: '';
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 2px;
    background: var(--gold);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.3s;
  }
  .cm-pillar:hover { background: var(--navy-light); }
  .cm-pillar:hover::after { transform: scaleX(1); }
  .cm-pillar-icon { font-size: 2rem; margin-bottom: 18px; display: block; }
  .cm-pillar-name {
    font-family: var(--font-display);
    font-size: 1.65rem;
    letter-spacing: 0.03em;
    color: var(--white);
    margin-bottom: 12px;
    line-height: 1;
  }
  .cm-pillar-desc { font-size: 0.86rem; color: rgba(255,255,255,0.48); line-height: 1.7; }

  .cm-statement-divider {
    background: var(--navy-deep);
    padding: 72px 48px;
    text-align: center;
    border-top: 1px solid rgba(201,168,76,0.12);
    border-bottom: 1px solid rgba(201,168,76,0.12);
  }
  .cm-statement-divider p {
    font-family: var(--font-display);
    font-size: clamp(1.8rem, 4.5vw, 4rem);
    letter-spacing: 0.06em;
    color: rgba(255,255,255,0.1);
    line-height: 1.2;
  }
  .cm-statement-divider p span { color: var(--gold); }

  .cm-video-section {
    background: var(--navy);
    position: relative;
    overflow: hidden;
  }
  .cm-video-section::after {
    content: '';
    position: absolute;
    top: 0; right: 0;
    width: 32%;
    height: 100%;
    background-image: repeating-linear-gradient(
      62deg, transparent, transparent 26px,
      rgba(201,168,76,0.055) 26px,
      rgba(201,168,76,0.055) 28px
    );
    pointer-events: none;
  }
  .cm-video-layout {
    display: grid;
    grid-template-columns: 1.3fr 1fr;
    gap: 70px;
    align-items: center;
  }
  .cm-video-wrap {
    position: relative;
    width: 100%;
    padding-bottom: 56.25%;
    background: var(--navy-deep);
    border: 1px solid rgba(201,168,76,0.2);
  }
  .cm-video-wrap::before {
    content: '';
    position: absolute;
    inset: -5px;
    border: 1px solid rgba(201,168,76,0.15);
    pointer-events: none;
  }
  .cm-video-wrap iframe {
    position: absolute;
    inset: 0; width: 100%; height: 100%;
    border: none;
  }
  .cm-video-headline {
    font-family: var(--font-display);
    font-size: clamp(2.5rem, 3.5vw, 3.8rem);
    line-height: 1;
    letter-spacing: 0.02em;
    margin-bottom: 8px;
  }
  .cm-video-headline .gold { color: var(--gold); }
  .cm-video-sub {
    font-size: 0.9rem;
    color: rgba(255,255,255,0.52);
    margin-bottom: 36px;
    line-height: 1.75;
  }
  .cm-insight {
    display: flex;
    gap: 16px;
    align-items: flex-start;
    margin-bottom: 16px;
    padding: 16px 20px;
    border-left: 2px solid var(--gold);
    background: rgba(27,42,74,0.6);
    transition: background 0.2s;
  }
  .cm-insight:hover { background: rgba(36,54,86,0.8); }
  .cm-insight-num {
    font-family: var(--font-display);
    font-size: 1.3rem;
    color: rgba(201,168,76,0.35);
    flex-shrink: 0;
    line-height: 1;
  }
  .cm-insight-text { font-size: 0.88rem; color: rgba(255,255,255,0.75); line-height: 1.6; }
  .cm-insight-text strong { color: var(--white); }

  .cm-quote-section {
    background: var(--gold);
    padding: 88px 48px;
    text-align: center;
  }
  .cm-quote-mark {
    font-family: var(--font-display);
    font-size: 7rem;
    line-height: 0.6;
    color: rgba(0,0,0,0.12);
    margin-bottom: 20px;
  }
  .cm-quote-text {
    font-family: var(--font-display);
    font-size: clamp(1.8rem, 4vw, 3.5rem);
    letter-spacing: 0.04em;
    color: var(--navy-deep);
    line-height: 1.1;
    max-width: 880px;
    margin: 0 auto 24px;
  }
  .cm-quote-attr {
    font-family: var(--font-heading);
    font-size: 0.72rem;
    font-weight: 800;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: rgba(17,29,53,0.5);
  }

  .cm-communities-section {
    background-color: var(--navy-deep);
    background-image: radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px);
    background-size: 32px 32px;
  }
  .cm-communities-header {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 64px;
    align-items: end;
    margin-bottom: 60px;
  }
  .cm-community-grid {
    display: grid;
    grid-template-columns: repeat(3,1fr);
    gap: 3px;
  }
  .cm-comm-tile {
    background: var(--navy);
    border: 1px solid rgba(201,168,76,0.1);
    padding: 38px 30px;
    position: relative;
    overflow: hidden;
    transition: background 0.25s;
  }
  .cm-comm-tile::before {
    content: '';
    position: absolute;
    top: 0; left: 0;
    width: 2px; height: 0;
    background: var(--gold);
    transition: height 0.35s;
  }
  .cm-comm-tile:hover { background: var(--navy-light); }
  .cm-comm-tile:hover::before { height: 100%; }
  .cm-comm-type {
    font-family: var(--font-heading);
    font-size: 0.64rem;
    font-weight: 800;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 10px;
  }
  .cm-comm-name {
    font-family: var(--font-display);
    font-size: 1.65rem;
    letter-spacing: 0.02em;
    color: var(--white);
    margin-bottom: 12px;
    line-height: 1.05;
  }
  .cm-comm-desc { font-size: 0.85rem; color: rgba(255,255,255,0.46); line-height: 1.7; }
  .cm-comm-tile.next {
    background: rgba(201,168,76,0.03);
    border-color: rgba(201,168,76,0.18);
  }
  .cm-comm-tile.next .cm-comm-name { color: rgba(255,255,255,0.3); }
  .cm-comm-tile.next .cm-comm-desc { color: rgba(255,255,255,0.22); }

  .cm-statement-strip {
    background: var(--navy);
    border-top: 1px solid rgba(201,168,76,0.1);
    border-bottom: 1px solid rgba(201,168,76,0.1);
    padding: 68px 48px;
    text-align: center;
  }
  .cm-statement-strip h2 {
    font-family: var(--font-display);
    font-size: clamp(2rem, 5vw, 4.5rem);
    letter-spacing: 0.05em;
    color: rgba(255,255,255,0.1);
    line-height: 1.1;
  }
  .cm-statement-strip h2 em { color: var(--gold); font-style: normal; }

  .cm-checklist-section {
    background: var(--navy-deep);
    position: relative;
    overflow: hidden;
  }
  .cm-checklist-section::before {
    content: '';
    position: absolute;
    top: 0; left: 0;
    width: 38%; height: 100%;
    background-image: repeating-linear-gradient(
      62deg, transparent, transparent 26px,
      rgba(201,168,76,0.04) 26px,
      rgba(201,168,76,0.04) 28px
    );
    pointer-events: none;
  }
  .cm-checklist-layout {
    display: grid;
    grid-template-columns: 1fr 1.1fr;
    gap: 80px;
    align-items: start;
    position: relative;
    z-index: 2;
  }
  .cm-big-pull-quote {
    border-left: 3px solid var(--gold);
    padding: 22px 26px;
    margin-top: 40px;
    background: rgba(201,168,76,0.05);
  }
  .cm-big-pull-quote p {
    font-family: var(--font-display);
    font-size: 1.55rem;
    line-height: 1.2;
    letter-spacing: 0.03em;
    color: var(--white);
    margin-bottom: 10px;
  }
  .cm-big-pull-quote cite {
    font-family: var(--font-heading);
    font-size: 0.68rem;
    font-weight: 700;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--gold);
    font-style: normal;
  }
  .cm-check-item {
    display: flex;
    align-items: flex-start;
    gap: 20px;
    padding: 24px 26px;
    border: 1px solid rgba(201,168,76,0.1);
    background: var(--navy);
    margin-bottom: 3px;
    transition: border-color 0.2s, background 0.2s;
  }
  .cm-check-item:hover { border-color: rgba(201,168,76,0.3); background: var(--navy-light); }
  .cm-check-item:hover .cm-check-num { color: var(--gold); }
  .cm-check-num {
    font-family: var(--font-display);
    font-size: 1.9rem;
    color: rgba(201,168,76,0.2);
    line-height: 1;
    flex-shrink: 0;
    min-width: 34px;
    transition: color 0.2s;
  }
  .cm-check-text {
    font-family: var(--font-heading);
    font-size: 0.9rem;
    font-weight: 600;
    color: rgba(255,255,255,0.8);
    line-height: 1.55;
  }
  .cm-check-text strong { color: var(--white); }

  .cm-testimonials-section {
    background-color: var(--navy);
    background-image: radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px);
    background-size: 32px 32px;
  }
  .cm-test-header { margin-bottom: 56px; }

  .cm-test-grid {
    display: grid;
    grid-template-columns: 1.8fr 1fr 1fr;
    gap: 3px;
    margin-bottom: 3px;
  }
  .cm-test-grid-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 3px;
  }
  .cm-test-card {
    background: var(--navy-deep);
    border: 1px solid rgba(201,168,76,0.1);
    padding: 38px 30px;
    transition: background 0.22s;
  }
  .cm-test-card:hover { background: var(--navy-light); }
  .cm-test-card.lead {
    background: var(--navy-light);
    border: 1px solid rgba(201,168,76,0.25);
    border-left: 3px solid var(--gold);
  }
  .cm-test-card.lead:hover { background: #2d4269; }

  .cm-stars { display: flex; gap: 3px; margin-bottom: 18px; }
  .cm-star { color: var(--gold); font-size: 0.85rem; }

  .cm-test-quote {
    font-size: 0.95rem;
    line-height: 1.78;
    color: rgba(255,255,255,0.7);
    font-style: italic;
    margin-bottom: 26px;
  }
  .cm-test-card.lead .cm-test-quote {
    color: rgba(255,255,255,0.85);
    font-size: 1rem;
  }
  .cm-test-author { display: flex; align-items: center; gap: 14px; }
  .cm-test-avatar {
    width: 44px; height: 44px;
    background: rgba(201,168,76,0.15);
    color: var(--gold);
    font-family: var(--font-display);
    font-size: 1.1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    border-radius: 2px;
  }
  .cm-test-name {
    font-family: var(--font-heading);
    font-weight: 800;
    font-size: 0.87rem;
    color: var(--white);
  }
  .cm-test-ctx {
    font-size: 0.74rem;
    color: rgba(255,255,255,0.38);
    margin-top: 3px;
  }

  .cm-cta-section {
    background-color: var(--navy-deep);
    background-image:
      radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px),
      radial-gradient(circle at center, rgba(201,168,76,0.05) 0%, transparent 65%);
    background-size: 32px 32px, 100% 100%;
    position: relative;
    overflow: hidden;
    padding: 128px 48px;
    text-align: center;
  }
  .cm-cta-section::after {
    content: '';
    position: absolute;
    inset: 0;
    background-image: repeating-linear-gradient(
      62deg, transparent, transparent 26px,
      rgba(201,168,76,0.04) 26px,
      rgba(201,168,76,0.04) 28px
    );
    pointer-events: none;
  }
  .cm-cta-inner { position: relative; z-index: 2; }
  .cm-cta-overline {
    font-family: var(--font-heading);
    font-size: 0.67rem;
    font-weight: 800;
    letter-spacing: 0.32em;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 20px;
  }
  .cm-cta-title {
    font-family: var(--font-display);
    font-size: clamp(3.5rem, 8vw, 6.5rem);
    letter-spacing: 0.02em;
    line-height: 0.95;
    color: var(--white);
    max-width: 800px;
    margin: 0 auto 14px;
  }
  .cm-cta-title .gold { color: var(--gold); }
  .cm-cta-sub {
    font-size: 1rem;
    color: rgba(255,255,255,0.5);
    max-width: 480px;
    margin: 0 auto 48px;
    line-height: 1.75;
  }
  .cm-cta-btns {
    display: flex;
    justify-content: center;
    gap: 12px;
    flex-wrap: wrap;
  }

  .cm-footer {
    background: var(--navy-deep);
    border-top: 1px solid rgba(201,168,76,0.12);
    padding: 26px 48px;
    text-align: center;
    font-family: var(--font-heading);
    font-size: 0.74rem;
    color: rgba(255,255,255,0.25);
  }
  .cm-footer a { color: var(--gold); text-decoration: none; }

  .cm-nav-right {
    display: flex;
    align-items: center;
    gap: 16px;
  }
  .cm-mobile-toggle {
    display: none;
    flex-direction: column;
    gap: 5px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px;
  }
  .cm-mobile-toggle span {
    display: block;
    width: 22px;
    height: 2px;
    background: var(--white);
    transition: all 0.25s;
    transform-origin: center;
  }
  .cm-mobile-toggle span.open:nth-child(1) { transform: translateY(7px) rotate(45deg); }
  .cm-mobile-toggle span.open:nth-child(2) { opacity: 0; }
  .cm-mobile-toggle span.open:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

  @media (max-width: 960px) {
    .cm-section { padding: 80px 24px; }
    .cm-nav { padding: 0 24px; }
    .cm-mobile-toggle { display: flex; }
    .cm-nav-links {
      display: none;
      position: absolute;
      top: 68px; left: 0; right: 0;
      background: var(--navy-deep);
      border-bottom: 1px solid rgba(201,168,76,0.18);
      flex-direction: column;
      padding: 20px 24px;
      gap: 0;
    }
    .cm-nav-links.cm-nav-open { display: flex; }
    .cm-nav-links li { border-bottom: 1px solid rgba(255,255,255,0.06); }
    .cm-nav-links a { display: block; padding: 14px 0; font-size: 0.82rem; }
    .cm-hero-inner { grid-template-columns: 1fr; padding: 80px 24px; }
    .cm-hero-stats { grid-template-columns: 1fr 1fr; margin-top: 44px; }
    .cm-pillars-header { grid-template-columns: 1fr; gap: 24px; }
    .cm-pillars-grid { grid-template-columns: 1fr 1fr; }
    .cm-video-layout { grid-template-columns: 1fr; gap: 44px; }
    .cm-communities-header { grid-template-columns: 1fr; gap: 24px; }
    .cm-community-grid { grid-template-columns: 1fr 1fr; }
    .cm-checklist-layout { grid-template-columns: 1fr; }
    .cm-test-grid { grid-template-columns: 1fr; }
    .cm-test-grid-2 { grid-template-columns: 1fr; }
  }
  @media (max-width: 580px) {
    .cm-hero-title, .cm-hero-title-gold { font-size: 4.5rem; }
    .cm-pillars-grid { grid-template-columns: 1fr; }
    .cm-community-grid { grid-template-columns: 1fr; }
  }
`

export default function CommunitiesPage() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />

      {/* NAV */}
      <CommunitiesNav />

      {/* HERO */}
      <section className="cm-hero">
        <div className="cm-hero-inner">
          <div>
            <p className="cm-eyebrow">Accountability · Sales Psychology · Leadership · Digital Brand Mentorship</p>
            <div className="cm-hero-cycle">
              <div className="cm-hero-cycle-inner">
                <span>RAISE YOUR PRICE. OWN YOUR ROOM.</span>
                <span>ACCOUNTABILITY BEATS MOTIVATION.</span>
                <span>LEAD. DON&apos;T CONVINCE.</span>
                <span>RAISE YOUR PRICE. OWN YOUR ROOM.</span>
              </div>
            </div>
            <div className="cm-hero-title">STOP HIRING</div>
            <div className="cm-hero-title-gold">SPEAKERS.<br />BOOK A MENTOR.</div>
            <p className="cm-hero-desc">Motivational speakers give your members a feeling. Chris Marvel gives them a framework. He&apos;s the accountability coach, sales psychology mentor, and leadership trainer that the top digital brand communities bring in when they&apos;re serious about results — not just retention.</p>
            <div>
              <a href="#communities" className="cm-btn-gold">See Where He&apos;s Been</a>
              <a href="#testimonials" className="cm-btn-outline">Hear from Members</a>
            </div>
          </div>

          <div className="cm-hero-stats">
            <div className="cm-stat-box">
              <div className="cm-stat-num">10+</div>
              <div className="cm-stat-lbl">Years Mentoring Builders</div>
            </div>
            <div className="cm-stat-box">
              <div className="cm-stat-num">100s</div>
              <div className="cm-stat-lbl">Live Community Sessions</div>
            </div>
            <div className="cm-stat-box">
              <div className="cm-stat-num">1000s</div>
              <div className="cm-stat-lbl">Members Who Executed</div>
            </div>
            <div className="cm-stat-box">
              <div className="cm-stat-num">0</div>
              <div className="cm-stat-lbl">Fluff. Zero.</div>
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="cm-marquee-bar">
        <div className="cm-marquee-track">
          <span className="cm-marquee-item">ACCOUNTABILITY MENTOR FOR DIGITAL BRANDS.</span>
          <span className="cm-marquee-item">PRICE DICTATES TRUST.</span>
          <span className="cm-marquee-item">YOUR MEMBERS DON&apos;T NEED MORE CONTENT.</span>
          <span className="cm-marquee-item">LEAD. DON&apos;T CONVINCE.</span>
          <span className="cm-marquee-item">EXECUTION &gt; INFORMATION.</span>
          <span className="cm-marquee-item">RAISE THE STANDARD. RAISE THE PRICE.</span>
          <span className="cm-marquee-item">ACCOUNTABILITY MENTOR FOR DIGITAL BRANDS.</span>
          <span className="cm-marquee-item">PRICE DICTATES TRUST.</span>
          <span className="cm-marquee-item">YOUR MEMBERS DON&apos;T NEED MORE CONTENT.</span>
          <span className="cm-marquee-item">LEAD. DON&apos;T CONVINCE.</span>
          <span className="cm-marquee-item">EXECUTION &gt; INFORMATION.</span>
          <span className="cm-marquee-item">RAISE THE STANDARD. RAISE THE PRICE.</span>
        </div>
      </div>

      {/* PILLARS */}
      <section className="cm-pillars-section cm-section">
        <div className="cm-container">
          <div className="cm-pillars-header">
            <div>
              <p className="cm-eyebrow">What He Delivers. Every Single Session.</p>
              <h2 className="cm-display-title">FOUR OUTPUTS.<br />ZERO FLUFF.</h2>
            </div>
            <p className="cm-body-text">Most community content gives your members information. Chris gives them execution. He doesn&apos;t just show up and talk — he installs the accountability structures, sales frameworks, and leadership standards that make your community members actually do the work after they log off.</p>
          </div>
          <div className="cm-pillars-grid">
            <div className="cm-pillar">
              <span className="cm-pillar-icon">🎯</span>
              <div className="cm-pillar-name">ACCOUNTABILITY</div>
              <p className="cm-pillar-desc">Your members know what to do. They&apos;re just not doing it. Chris builds the daily non-negotiables, commitment structures, and standards that close the gap between knowing and executing — permanently.</p>
            </div>
            <div className="cm-pillar">
              <span className="cm-pillar-icon">👑</span>
              <div className="cm-pillar-name">LEADERSHIP</div>
              <p className="cm-pillar-desc">You can&apos;t lead a brand you wouldn&apos;t follow. Chris trains your members to lead themselves first — under pressure, without external validation, with the clarity of someone who has decided to be serious about their business.</p>
            </div>
            <div className="cm-pillar">
              <span className="cm-pillar-icon">💰</span>
              <div className="cm-pillar-name">SALES PSYCHOLOGY</div>
              <p className="cm-pillar-desc">Your members are undercharging, over-explaining, and losing deals they should be closing. Chris reprograms the belief system underneath the sales conversation — so they stop asking for permission to be paid what they&apos;re worth.</p>
            </div>
            <div className="cm-pillar">
              <span className="cm-pillar-icon">🔥</span>
              <div className="cm-pillar-name">BRAND MENTORSHIP</div>
              <p className="cm-pillar-desc">The reason your community members stall isn&apos;t strategy — it&apos;s identity. Chris is the mentor who tells them the truth about who they&apos;re being, challenges them to think at the level of the brand they say they want, and makes it impossible to stay small.</p>
            </div>
          </div>
        </div>
      </section>

      {/* DIVIDER */}
      <div className="cm-statement-divider">
        <p>YOUR MEMBERS DON&apos;T HAVE AN <span>INFORMATION</span> PROBLEM.<br />THEY HAVE AN EXECUTION PROBLEM.</p>
      </div>

      {/* VIDEO */}
      <section className="cm-video-section cm-section" id="video">
        <div className="cm-container">
          <div className="cm-video-layout">
            <div className="cm-video-wrap">
              <iframe
                src="https://www.youtube.com/embed/6-6axrq_3ko?rel=0&modestbranding=1"
                title="Rich People Don't Panic - They Do This Instead | PIVOT Training and Development"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
            <div>
              <p className="cm-eyebrow">Watch the Mentorship — Live in a Real Digital Community</p>
              <h2 className="cm-video-headline">THE SESSION<br />YOUR MEMBERS<br /><span className="gold">WON&apos;T STOP QUOTING.</span></h2>
              <p className="cm-video-sub">53 minutes. No slides, no fluff, no warm-up act. This is Chris Marvel inside a real digital community — delivering the accountability frameworks, sales psychology, and leadership mentorship that actually change how people build their brand.</p>
              <div className="cm-insight">
                <div className="cm-insight-num">01</div>
                <div className="cm-insight-text"><strong>Accountability that actually sticks</strong> — the daily disciplines that keep your members showing up long after the hype of joining dies down.</div>
              </div>
              <div className="cm-insight">
                <div className="cm-insight-num">02</div>
                <div className="cm-insight-text"><strong>Why your price is your credibility</strong> — raising your rate isn&apos;t arrogance. It&apos;s authority. Chris breaks down the sales psychology behind why your community members keep undercharging.</div>
              </div>
              <div className="cm-insight">
                <div className="cm-insight-num">03</div>
                <div className="cm-insight-text"><strong>Lead. Don&apos;t convince.</strong> — Your members are chasing clients who aren&apos;t coming. Chris teaches them to lead their market with certainty, not chase it with desperation.</div>
              </div>
              <div className="cm-insight">
                <div className="cm-insight-num">04</div>
                <div className="cm-insight-text"><strong>Income before the scroll</strong> — generate revenue activity before you open social media. The one discipline that separates builders from browsers.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BIG QUOTE */}
      <div className="cm-quote-section">
        <div className="cm-quote-mark">&ldquo;</div>
        <p className="cm-quote-text">Your members don&apos;t have a knowledge problem. They have a courage problem. And the cure for that isn&apos;t more content — it&apos;s accountability.</p>
        <p className="cm-quote-attr">— Chris Marvel · Live Digital Community Session</p>
      </div>

      {/* COMMUNITIES */}
      <section className="cm-communities-section cm-section" id="communities">
        <div className="cm-container">
          <div className="cm-communities-header">
            <div>
              <p className="cm-eyebrow">The Communities That Called. The Members That Transformed.</p>
              <h2 className="cm-display-title">THE BEST<br />FOUNDERS DON&apos;T<br /><span style={{ color: 'var(--gold)' }}>DO IT ALONE.</span></h2>
            </div>
            <p className="cm-body-text">The founders behind these digital communities are building real businesses — finance, credit, entrepreneurship, wealth. They brought Chris in because they understood something most community builders miss: your members already have access to information. What they need is someone to hold them to a higher standard. Chris is that person.</p>
          </div>
          <div className="cm-community-grid">
            <div className="cm-comm-tile">
              <div className="cm-comm-type">Finance &amp; Wealth</div>
              <div className="cm-comm-name">EARN YOUR LEISURE</div>
              <p className="cm-comm-desc">One of the most recognized finance and entrepreneurship communities in the culture. Chris has taken the stage multiple times delivering accountability and leadership content.</p>
            </div>
            <div className="cm-comm-tile">
              <div className="cm-comm-type">Credit &amp; Financial Literacy</div>
              <div className="cm-comm-name">SMITTY THE GOAT</div>
              <p className="cm-comm-desc">A high-engagement credit education community where Chris brought motivational and sales psychology coaching to members building their financial foundation.</p>
            </div>
            <div className="cm-comm-tile">
              <div className="cm-comm-type">Entrepreneurship</div>
              <div className="cm-comm-name">BOBBY RICHARDSON</div>
              <p className="cm-comm-desc">Chris partnered with Bobby Richardson to bring leadership and performance coaching to a driven audience focused on business growth and execution.</p>
            </div>
            <div className="cm-comm-tile">
              <div className="cm-comm-type">Business &amp; Wealth</div>
              <div className="cm-comm-name">ANNETTA POWELL</div>
              <p className="cm-comm-desc">A community built around wealth strategy and entrepreneurship. Chris delivered high-impact sessions on mindset, pricing confidence, and bold action.</p>
            </div>
            <div className="cm-comm-tile">
              <div className="cm-comm-type">Mindset &amp; Mental Health</div>
              <div className="cm-comm-name">THE SHIFT SOCIETY</div>
              <p className="cm-comm-desc">Chris&apos;s own community through PIVOT Training &amp; Development — where professionals do the real inner work needed to perform at their peak.</p>
            </div>
            <div className="cm-comm-tile next">
              <div className="cm-comm-type" style={{ color: 'rgba(201,168,76,0.4)' }}>Your Community</div>
              <div className="cm-comm-name">COULD BE NEXT.</div>
              <p className="cm-comm-desc">Virtual accountability sessions, guest speaker slots, monthly residencies — customized to your culture and your goals.</p>
            </div>
          </div>
        </div>
      </section>

      {/* STATEMENT STRIP */}
      <div className="cm-statement-strip">
        <h2>THE COMMUNITIES THAT <em>WIN</em> DON&apos;T HAVE<br />THE BEST CONTENT. THEY HAVE THE <em>HIGHEST STANDARD.</em></h2>
      </div>

      {/* 6-POINT CHECKLIST */}
      <section className="cm-checklist-section cm-section">
        <div className="cm-container">
          <div className="cm-checklist-layout">
            <div>
              <p className="cm-eyebrow">The Framework Chris Delivers Live — Members Say They Can&apos;t Write Fast Enough</p>
              <h2 className="cm-display-title">THE 6-POINT<br /><span style={{ color: 'var(--gold)' }}>DOMINANCE<br />CHECKLIST.</span></h2>
              <p className="cm-body-text" style={{ marginTop: '22px' }}>Most sales training teaches tactics. This teaches identity. Before every sales conversation, your members should be able to answer these six questions — and if they can&apos;t, that&apos;s exactly why they&apos;re losing deals they should be closing.</p>
              <div className="cm-big-pull-quote">
                <p>&ldquo;DOUBLE YOUR PRICE. PRICE DICTATES TRUST. HIGHER PRICE SHOWS AUTHORITY.&rdquo;</p>
                <cite>— Chris Marvel · Accountability Call</cite>
              </div>
            </div>
            <div>
              <div className="cm-check-item">
                <div className="cm-check-num">01</div>
                <div className="cm-check-text">Have I clearly framed the <strong>transformation</strong> I offer — not just the service?</div>
              </div>
              <div className="cm-check-item">
                <div className="cm-check-num">02</div>
                <div className="cm-check-text">Do I have my <strong>power statements</strong> ready to deliver with conviction?</div>
              </div>
              <div className="cm-check-item">
                <div className="cm-check-num">03</div>
                <div className="cm-check-text">Am I ready to handle <strong>3 common objections</strong> with calm — not anxiety?</div>
              </div>
              <div className="cm-check-item">
                <div className="cm-check-num">04</div>
                <div className="cm-check-text">Can I stay <strong>unbothered in the face of hesitation</strong> and let silence work?</div>
              </div>
              <div className="cm-check-item">
                <div className="cm-check-num">05 ✦</div>
                <div className="cm-check-text">Am I committed to <strong>leading</strong> this conversation — not convincing my way through it?</div>
              </div>
              <div className="cm-check-item">
                <div className="cm-check-num">06</div>
                <div className="cm-check-text">Do I <strong>BELIEVE</strong> I am worth the price I am charging?</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="cm-testimonials-section cm-section" id="testimonials">
        <div className="cm-container">
          <div className="cm-test-header">
            <p className="cm-eyebrow">Real Members. Real Reactions. Right After the Session.</p>
            <h2 className="cm-display-title">WHAT HAPPENS<br /><span style={{ color: 'var(--gold)' }}>AFTER HE LEAVES.</span></h2>
            <p className="cm-body-text" style={{ marginTop: '16px', maxWidth: '520px' }}>These aren&apos;t testimonials collected weeks later. These are the messages members posted the moment the session ended — because they didn&apos;t want to forget what they just heard.</p>
          </div>

          <div className="cm-test-grid">
            <div className="cm-test-card lead">
              <div className="cm-stars">
                <span className="cm-star">★</span><span className="cm-star">★</span><span className="cm-star">★</span><span className="cm-star">★</span><span className="cm-star">★</span>
              </div>
              <p className="cm-test-quote">&ldquo;The morning call with Chris was exactly what I needed! It was more than just motivational — it was a perspective pivot. Chris has a way of breaking down limiting beliefs and replacing them with clarity, confidence, and action. I left the call feeling empowered, knowing the only thing standing between me and my goals is my mindset. Grateful for this push forward and ready to start my day with action!!!&rdquo;</p>
              <div className="cm-test-author">
                <div className="cm-test-avatar">JW</div>
                <div>
                  <div className="cm-test-name">Jessica Washington</div>
                  <div className="cm-test-ctx">Morning Accountability Call</div>
                </div>
              </div>
            </div>
            <div className="cm-test-card">
              <div className="cm-stars">
                <span className="cm-star">★</span><span className="cm-star">★</span><span className="cm-star">★</span><span className="cm-star">★</span><span className="cm-star">★</span>
              </div>
              <p className="cm-test-quote">&ldquo;Man, hopefully it&apos;s recorded cause it was POWERFUL! Folks here could use this message to level up and grow INSTANTLY. Nothing but gems obtained.&rdquo;</p>
              <div className="cm-test-author">
                <div className="cm-test-avatar">DM</div>
                <div>
                  <div className="cm-test-name">Donta Maddox</div>
                  <div className="cm-test-ctx">Accountability Call Session</div>
                </div>
              </div>
            </div>
            <div className="cm-test-card">
              <div className="cm-stars">
                <span className="cm-star">★</span><span className="cm-star">★</span><span className="cm-star">★</span><span className="cm-star">★</span><span className="cm-star">★</span>
              </div>
              <p className="cm-test-quote">&ldquo;Chris gonna start your day off right 💪&rdquo;</p>
              <div className="cm-test-author">
                <div className="cm-test-avatar">JJ</div>
                <div>
                  <div className="cm-test-name">Javaughn Johnson</div>
                  <div className="cm-test-ctx">Community Member</div>
                </div>
              </div>
            </div>
          </div>

          <div className="cm-test-grid-2">
            <div className="cm-test-card">
              <div className="cm-stars">
                <span className="cm-star">★</span><span className="cm-star">★</span><span className="cm-star">★</span><span className="cm-star">★</span><span className="cm-star">★</span>
              </div>
              <p className="cm-test-quote">&ldquo;Accountability call with Chris — always learning. Key takeaways: What I offer delivers transformation, not just information. Don&apos;t be afraid to price to your value. Double your price. Price dictates trust. Higher price shows authority.&rdquo;</p>
              <div className="cm-test-author">
                <div className="cm-test-avatar">JS</div>
                <div>
                  <div className="cm-test-name">Jordon S.</div>
                  <div className="cm-test-ctx">Multiple Sessions · 6-Point Checklist Notes</div>
                </div>
              </div>
            </div>
            <div className="cm-test-card">
              <div className="cm-stars">
                <span className="cm-star">★</span><span className="cm-star">★</span><span className="cm-star">★</span><span className="cm-star">★</span><span className="cm-star">★</span>
              </div>
              <p className="cm-test-quote">&ldquo;I&apos;m tryna find that recording — I can&apos;t write that fast. Chris is always dropping gems. The 6-Point Dominance Checklist alone was worth the whole session.&rdquo;</p>
              <div className="cm-test-author">
                <div className="cm-test-avatar">JS</div>
                <div>
                  <div className="cm-test-name">Jordon S.</div>
                  <div className="cm-test-ctx">Session Follow-up Comment</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cm-cta-section">
        <div className="cm-cta-inner">
          <p className="cm-cta-overline">Your Members Are Ready. The Question Is Whether You Are.</p>
          <h2 className="cm-cta-title">BRING THE<br /><span className="gold">MENTOR IN.</span></h2>
          <p className="cm-cta-sub">One session with Chris Marvel will do more for your community&apos;s retention, execution, and results than a month of content drops. Virtual accountability sessions, guest appearances, monthly residencies — built around your brand and your people.</p>
          <div className="cm-cta-btns">
            <a href="/#contact" className="cm-btn-gold">Book Chris for Your Community</a>
            <a href="/#reel" className="cm-btn-outline">Watch the Speaker Reel</a>
          </div>
        </div>
      </section>

      <div className="cm-footer">
        © 2026 <a href="/">Chris Marvel Speaks</a> · All rights reserved · Built on Purpose, Not Permission.
      </div>
    </>
  )
}
