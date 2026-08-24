import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import type { TitrationState } from '../engine/titrationState';
import { Step, DRAG_ITEMS } from '../engine/titrationState';

interface ToolboxProps {
  state: TitrationState;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

type ToolItem = {
  id: string;
  label: string;
  icon: string;
  activeInSteps: Step[];
  placedKey?: keyof TitrationState;
};

const TOOLS: ToolItem[] = [
  {
    id: DRAG_ITEMS.BURETTE,
    label: 'Burette',
    icon: '🧪',
    activeInSteps: [Step.SETUP_STAND],
    placedKey: 'buretteMounted',
  },
  {
    id: DRAG_ITEMS.FLASK,
    label: 'Conical Flask',
    icon: '⚗️',
    activeInSteps: [Step.SETUP_STAND],
    placedKey: 'flaskPlaced',
  },
  {
    id: DRAG_ITEMS.HCL_BOTTLE,
    label: 'HCl Stock',
    icon: '🧴',
    activeInSteps: [Step.MEASURE_ACID],
    placedKey: 'hclPlaced',
  },
  {
    id: DRAG_ITEMS.PIPETTE,
    label: 'Pipette',
    icon: '💉',
    activeInSteps: [Step.MEASURE_ACID],
  },
  {
    id: DRAG_ITEMS.NAOH_BOTTLE,
    label: 'NaOH Reagent',
    icon: '🫧',
    activeInSteps: [Step.FILL_BURETTE],
  },
  {
    id: DRAG_ITEMS.INDICATOR,
    label: 'Phenolphthalein',
    icon: '💧',
    activeInSteps: [Step.ADD_INDICATOR],
  },
];

const Toolbox: React.FC<ToolboxProps> = ({ state, isCollapsed = false, onToggleCollapse }) => {
  return (
    <div
      id="toolbox-panel"
      style={{
        padding: isCollapsed ? '12px 6px' : '16px 12px',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        height: '100%',
        overflowY: 'auto',
        alignItems: isCollapsed ? 'center' : 'stretch',
        transition: 'padding 0.2s ease',
      }}
    >
      {/* Header with Collapse/Expand Toggle Button */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: isCollapsed ? 'center' : 'space-between',
          marginBottom: 4,
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: 8,
        }}
      >
        {!isCollapsed && (
          <h2
            style={{
              fontSize: '0.72rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'var(--text-muted)',
            }}
          >
            Apparatus
          </h2>
        )}
        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            title={isCollapsed ? 'Expand Toolbox' : 'Collapse Toolbox'}
            style={{
              background: '#f1f5f9',
              border: '1px solid #cbd5e1',
              borderRadius: 4,
              padding: '3px 6px',
              fontSize: '0.65rem',
              color: '#334155',
              cursor: 'pointer',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            {isCollapsed ? '▶' : '◀ Collapse'}
          </button>
        )}
      </div>

      {/* Tool Cards */}
      {TOOLS.map((tool) => {
        const isPlaced = tool.placedKey ? (state[tool.placedKey] as boolean) : false;
        let isActive = tool.activeInSteps.includes(state.step) && !isPlaced;

        // Pipette only active once HCl bottle is placed on the bench
        if (tool.id === DRAG_ITEMS.PIPETTE && state.step === Step.MEASURE_ACID) {
          isActive = state.hclPlaced && !state.acidMeasured;
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
      })}
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
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: tool.id,
    disabled,
  });

  const style: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: isCollapsed ? 'center' : 'flex-start',
    gap: isCollapsed ? 0 : 10,
    padding: isCollapsed ? '10px 4px' : '10px 12px',
    borderRadius: 'var(--radius-md)',
    cursor: disabled ? 'default' : 'grab',
    transition: 'all 0.15s ease',
    border: isActive
      ? '1px solid #bfdbfe'
      : isUsed
        ? '1px solid #bbf7d0'
        : '1px solid var(--border-subtle)',
    background: isActive
      ? '#eff6ff'
      : isUsed
        ? '#f0fdf4'
        : '#ffffff',
    boxShadow: isActive ? '0 1px 3px rgba(37, 99, 235, 0.1)' : 'var(--shadow-card)',
    opacity: isDragging ? 0.3 : isUsed ? 0.6 : disabled ? 0.5 : 1,
    transform: CSS.Translate.toString(transform),
    touchAction: 'none',
    userSelect: 'none',
    width: isCollapsed ? '40px' : '100%',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      title={`${tool.label}${isUsed ? ' (Placed)' : isActive ? ' (Ready)' : ''}`}
    >
      <span style={{ fontSize: isCollapsed ? 22 : 20 }}>{tool.icon}</span>
      {!isCollapsed && (
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: '0.8rem',
              fontWeight: 600,
              color: isActive ? '#1d4ed8' : 'var(--text-primary)',
            }}
          >
            {tool.label}
          </div>
          {isUsed && (
            <div style={{ fontSize: '0.65rem', color: '#16a34a', fontWeight: 500 }}>
              ✓ Placed
            </div>
          )}
        </div>
      )}
      {isActive && !isUsed && !isCollapsed && (
        <div
          style={{
            width: 7,
            height: 7,
            borderRadius: '50%',
            background: '#2563eb',
          }}
        />
      )}
    </div>
  );
};

export default Toolbox;
