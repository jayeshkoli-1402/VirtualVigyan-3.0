import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import type { TitrationState } from '../engine/titrationState';
import { Step, DRAG_ITEMS, isTitrationAnimating } from '../engine/titrationState';
import { useLanguage } from '../i18n/LanguageContext';

interface ToolboxProps {
  state: TitrationState;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

type ToolItem = {
  id: string;
  labelKey: string;
  defaultLabel: string;
  icon: string;
  activeInSteps: Step[];
  placedKey?: keyof TitrationState;
};

const TOOLS: ToolItem[] = [
  {
    id: DRAG_ITEMS.RETORT_STAND,
    labelKey: 'apparatus.retortStand',
    defaultLabel: 'Retort Stand',
    icon: '🏗️',
    activeInSteps: [Step.SETUP_STAND],
    placedKey: 'standPlaced',
  },
  {
    id: DRAG_ITEMS.FLASK,
    labelKey: 'apparatus.flask',
    defaultLabel: '250 mL Conical Flask',
    icon: '⚗️',
    activeInSteps: [Step.SETUP_STAND],
    placedKey: 'flaskPlaced',
  },
  {
    id: DRAG_ITEMS.BURETTE,
    labelKey: 'apparatus.burette',
    defaultLabel: '50 mL Burette',
    icon: '🧪',
    activeInSteps: [Step.SETUP_STAND],
    placedKey: 'buretteMounted',
  },
  {
    id: DRAG_ITEMS.HCL_BOTTLE,
    labelKey: 'apparatus.hclBottle',
    defaultLabel: 'HCl Stock (0.1 M)',
    icon: '🧴',
    activeInSteps: [Step.SETUP_STAND, Step.MEASURE_ACID],
    placedKey: 'hclPlaced',
  },
  {
    id: DRAG_ITEMS.PIPETTE,
    labelKey: 'apparatus.pipette',
    defaultLabel: '25 mL Volumetric Pipette',
    icon: '💉',
    activeInSteps: [Step.MEASURE_ACID],
  },
  {
    id: DRAG_ITEMS.NAOH_BOTTLE,
    labelKey: 'apparatus.naohBottle',
    defaultLabel: '0.100 M NaOH Reagent',
    icon: '🫧',
    activeInSteps: [Step.FILL_BURETTE],
  },
  {
    id: DRAG_ITEMS.INDICATOR,
    labelKey: 'apparatus.indicator',
    defaultLabel: 'Phenolphthalein Indicator',
    icon: '💧',
    activeInSteps: [Step.ADD_INDICATOR],
  },
];

const Toolbox: React.FC<ToolboxProps> = ({ state, isCollapsed = false, onToggleCollapse }) => {
  const { t } = useLanguage();
  return (
    <div
      id="toolbox-panel"
      style={{
        padding: isCollapsed ? '12px 6px' : '14px 12px',
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        height: '100%',
        overflowY: 'auto',
        alignItems: isCollapsed ? 'center' : 'stretch',
        transition: 'padding 0.2s ease',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: isCollapsed ? 'center' : 'space-between',
          marginBottom: 4,
          borderBottom: '1px solid var(--border)',
          paddingBottom: 8,
        }}
      >
        {!isCollapsed && (
          <h2
            style={{
              fontSize: '0.6875rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: 'var(--text-muted)',
            }}
          >
            {t('lab.toolbox', 'Apparatus')}
          </h2>
        )}
        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            title={isCollapsed ? t('common.expand', 'Expand') : t('common.collapse', 'Collapse')}
            style={{
              all: 'unset',
              cursor: 'pointer',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-sm)',
              padding: '3px 6px',
              fontSize: '0.625rem',
              color: 'var(--text-muted)',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              transition: 'all 0.15s ease',
            }}
          >
            {isCollapsed ? '→' : `← ${t('common.hide', 'Hide')}`}
          </button>
        )}
      </div>

      {/* Tool Cards */}
      {(() => {
        const isAnimating = isTitrationAnimating(state);
        return TOOLS.map((tool) => {
          const isPlaced = tool.placedKey ? (state[tool.placedKey] as boolean) : false;
          let isActive = !isAnimating && tool.activeInSteps.includes(state.step) && !isPlaced;

          // Burette can be mounted once stand is placed
          if (tool.id === DRAG_ITEMS.BURETTE && state.step === Step.SETUP_STAND) {
            isActive = !isAnimating && state.standPlaced && !state.buretteMounted;
          }

          // Pipette only active once HCl bottle is placed on the bench
          if (tool.id === DRAG_ITEMS.PIPETTE && state.step === Step.MEASURE_ACID) {
            isActive = !isAnimating && state.hclPlaced && !state.acidMeasured;
          }

          // NaOH bottle active in FILL_BURETTE until burette is filled
          if (tool.id === DRAG_ITEMS.NAOH_BOTTLE && state.step === Step.FILL_BURETTE) {
            isActive = !isAnimating && !state.buretteFilled;
          }

          // Indicator bottle active in ADD_INDICATOR until added
          if (tool.id === DRAG_ITEMS.INDICATOR && state.step === Step.ADD_INDICATOR) {
            isActive = !isAnimating && !state.hasIndicator;
          }

          const isPipetteUsed = tool.id === DRAG_ITEMS.PIPETTE && state.acidMeasured;
          const isHclUsed = tool.id === DRAG_ITEMS.HCL_BOTTLE && state.acidMeasured;
          const isNaohUsed = tool.id === DRAG_ITEMS.NAOH_BOTTLE && state.buretteFilled;
          const isIndicatorUsed = tool.id === DRAG_ITEMS.INDICATOR && state.hasIndicator;
          const isUsed = isPlaced || isPipetteUsed || isHclUsed || isNaohUsed || isIndicatorUsed;

          return (
            <DraggableToolCard
              key={tool.id}
              tool={tool}
              isActive={isActive}
              isUsed={isUsed}
              disabled={!isActive}
              isCollapsed={isCollapsed}
            />
          );
        });
      })()}
    </div>
  );
};

// ── Draggable Tool Card ──
const DraggableToolCard: React.FC<{
  tool: ToolItem;
  isActive: boolean;
  isUsed: boolean;
  disabled: boolean;
  isCollapsed: boolean;
}> = ({ tool, isActive, isUsed, disabled, isCollapsed }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: tool.id,
    disabled,
  });

  const style: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: isCollapsed ? 'center' : 'flex-start',
    gap: isCollapsed ? 0 : 10,
    padding: isCollapsed ? '8px 4px' : '8px 10px',
    borderRadius: 'var(--radius-md)',
    cursor: disabled ? 'default' : 'grab',
    transition: 'all 0.15s ease',
    border: isDragging
      ? '1.5px dashed var(--accent)'
      : isActive
      ? '1px solid var(--accent)'
      : isUsed
        ? '1px solid var(--accent-green)'
        : '1px solid var(--border)',
    background: isDragging
      ? 'var(--accent-subtle)'
      : isActive
      ? 'var(--accent-subtle)'
      : isUsed
        ? 'rgba(5, 150, 105, 0.06)'
        : 'var(--bg-card)',
    boxShadow: isDragging ? 'var(--shadow-sm)' : isActive ? 'var(--shadow-xs)' : 'none',
    opacity: isDragging ? 0.6 : isUsed ? 0.55 : disabled ? 0.4 : 1,
    touchAction: 'none',
    userSelect: 'none',
    width: isCollapsed ? '38px' : '100%',
  };

  const { t } = useLanguage();
  const label = t(tool.labelKey, tool.defaultLabel);

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      title={`${label}${isUsed ? ` (${t('common.placed', 'Placed')})` : ''}`}
    >
      <span style={{ fontSize: isCollapsed ? 20 : 18 }}>{tool.icon}</span>
      {!isCollapsed && (
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: '0.8125rem',
              fontWeight: 600,
              color: isActive ? 'var(--accent)' : 'var(--text-primary)',
            }}
          >
            {label}
          </div>
          {isUsed && (
            <div style={{ fontSize: '0.6875rem', color: 'var(--accent-green)', fontWeight: 500 }}>
              ✓ {t('common.placed', 'Placed')}
            </div>
          )}
        </div>
      )}
      {isActive && !isUsed && !isCollapsed && (
        <div
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: 'var(--accent)',
          }}
        />
      )}
    </div>
  );
};

export default Toolbox;
