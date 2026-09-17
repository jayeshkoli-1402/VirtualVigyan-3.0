import React, { useEffect } from 'react';
import './landing.css';

import LandingNavbar from './LandingNavbar';
import HeroSection from './HeroSection';
import TrustBar from './TrustBar';
import HowItWorksSection from './HowItWorksSection';
import ExperimentShowcase from './ExperimentShowcase';
import LabPreview from './LabPreview';
import LearningSection from './LearningSection';
import StudentTeacherSection from './StudentTeacherSection';
import AboutSection from './AboutSection';
import FinalCTA from './FinalCTA';
import LandingFooter from './LandingFooter';

interface LandingPageProps {
  onEnterApp: () => void;
  onOpenLogin: () => void;
  onOpenTeacherPortal?: () => void;
  onStartExperiment: (experimentId?: string) => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({
  onEnterApp,
  onOpenLogin,
  onOpenTeacherPortal,
  onStartExperiment,
  theme,
  onToggleTheme,
}) => {
  // Intersection Observer for scroll-reveal animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -50px 0px' }
    );

    // Observe all reveal elements
    const els = document.querySelectorAll('.ln-reveal');
    els.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // Scroll to top when landing page mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleStart = () => onStartExperiment();
  const handleSelectExp = (id: string) => onStartExperiment(id);

  return (
    <div className="landing-root">
      {/* 1. Navbar */}
      <LandingNavbar
        theme={theme}
        onToggleTheme={onToggleTheme}
        onLogin={onOpenLogin}
        onStartExperiment={handleStart}
      />

      {/* 2. Hero */}
      <HeroSection
        onStartExperiment={handleStart}
        onExploreExperiments={() => {
          document.getElementById('experiments')?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* 3. Key Value Strip */}
      <TrustBar />

      {/* 4. How It Works */}
      <HowItWorksSection />

      {/* 5. Experiment Showcase */}
      <ExperimentShowcase
        onSelectExperiment={handleSelectExp}
        onViewAllExperiments={onEnterApp}
      />

      {/* 6. Lab Preview */}
      <LabPreview onStartExperiment={handleStart} />

      {/* 7. Mistake → Feedback → Retry */}
      <LearningSection />

      {/* 8. Student + Teacher */}
      <StudentTeacherSection
        onStartExperiment={handleStart}
        onOpenTeacherPortal={() => {
          if (onOpenTeacherPortal) onOpenTeacherPortal();
          else onOpenLogin();
        }}
      />

      {/* 9. About & Help */}
      <AboutSection />

      {/* 10. Final CTA */}
      <FinalCTA onStartExperiment={handleStart} />

      {/* 10. Footer */}
      <LandingFooter
        onStartExperiment={handleStart}
        onLogin={onOpenLogin}
      />
    </div>
  );
};

export default LandingPage;
