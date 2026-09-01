import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import type { ConservationState } from '../../engine/conservationState';
import { ConservationStep, CONSERVATION_DRAG_ITEMS } from '../../engine/conservationState';

interface ConservationToolboxProps {
  state: ConservationState;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

type ToolItem = {
  id: string;
  icon: string;
  label: string;
  description: string;
  hazard?: string;
  enabledAt: ConservationStep[];
  hiddenWhen: (state: ConservationState) => boolean;
};

const toolItems: ToolItem[] = [
  {
    id: CONSERVATION_DRAG_ITEMS.FLASK,
    icon: '⚗️',
    label: 'Conical Flask',
    description: '100 mL Borosilicate',
    enabledAt: [
      ConservationStep.SETUP_FLASK,
      ConservationStep.WEIGH_INITIAL,
      ConservationStep.MIX_REACTANTS,
      ConservationStep.OBSERVE,
      ConservationStep.WEIGH_FINAL,
    ],
    hiddenWhen: (s) => s.flaskPlaced,
  },
  {
    id: CONSERVATION_DRAG_ITEMS.NA2SO4_BOTTLE,
    icon: '🧴',
    label: 'Na₂SO₄ Solution',
    description: '5% w/v, 10 mL',
    enabledAt: [ConservationStep.SETUP_FLASK],
    hiddenWhen: (s) => s.na2so4Poured,
  },
  {
    id: CONSERVATION_DRAG_ITEMS.IGNITION_TUBE,
    icon: '🧫',
    label: 'Ignition Tube',
    description: '10×75 mm Borosilicate with thread',
    enabledAt: [ConservationStep.PLACE_TUBE_ON_STAND],
    hiddenWhen: (s) => s.tubePlacedOnStand || s.tubeSuspended,
  },
  {
    id: CONSERVATION_DRAG_ITEMS.BACL2_BOTTLE,
    icon: '🧴',
    label: 'BaCl₂ Solution',
    description: '5% w/v, 10 mL',
    hazard: '⚠️ Toxic',
    enabledAt: [ConservationStep.FILL_TUBE],
    hiddenWhen: (s) => s.tubeFilled,
  },
  {
    id: CONSERVATION_DRAG_ITEMS.RUBBER_CORK,
    icon: '🔌',
    label: 'Rubber Cork',
    description: 'Airtight solid cork',
    enabledAt: [ConservationStep.SEAL_FLASK],
    hiddenWhen: (s) => s.flaskSealed,
  },
  {
    id: CONSERVATION_DRAG_ITEMS.MEASURING_CYLINDER,
    icon: '📏',
    label: 'Measuring Cylinder',
    description: '10 mL graduated',
    enabledAt: [ConservationStep.SETUP_FLASK],
    hiddenWhen: () => false,
  },
];

const DraggableItem: React.FC<{
  item: ToolItem;
  isEnabled: boolean;
  isHidden: boolean;
  isCollapsed: boolean;
}> = ({ item, isEnabled, isHidden, isCollapsed }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: item.id,
    disabled: !isEnabled,
  });

  if (isHidden) return null;

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{
        display: 'flex',
        alignItems: isCollapsed ? 'center' : 'flex-start',
        justifyContent: isCollapsed ? 'center' : 'flex-start',
        gap: 8,
        padding: isCollapsed ? '8px 4px' : '8px 10px',
        borderRadius: 8,
        cursor: isEnabled ? 'grab' : 'not-allowed',
        opacity: isDragging ? 0.4 : isEnabled ? 1 : 0.4,
        background: isEnabled ? 'rgba(59, 130, 246, 0.04)' : 'transparent',
        border: isEnabled ? '1px solid rgba(59, 130, 246, 0.15)' : '1px solid transparent',
        transition: 'all 0.15s ease',
        userSelect: 'none',
        touchAction: 'none',
      }}
    >
      <span style={{ fontSize: isCollapsed ? 16 : 18, flexShrink: 0 }}>{item.icon}</span>
      {!isCollapsed && (
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: '0.72rem',
              fontWeight: 600,
              color: isEnabled ? 'var(--text-primary)' : 'var(--text-muted)',
              lineHeight: 1.3,
            }}
          >
            {item.label}
          </div>
          <div
            style={{
              fontSize: '0.6rem',
              color: 'var(--text-muted)',
              lineHeight: 1.3,
            }}
          >
            {item.description}
          </div>
          {item.hazard && (
            <div
              style={{
                fontSize: '0.55rem',
                color: '#dc2626',
                fontWeight: 600,
                marginTop: 2,
              }}
            >
              {item.hazard}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const ConservationToolbox: React.FC<ConservationToolboxProps> = ({
  state,
  isCollapsed,
  onToggleCollapse,
}) => {
  return (
    <div style={{ padding: isCollapsed ? '8px 4px' : '10px', height: '100%', overflow: 'auto' }}>
      {/* Collapse toggle */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: isCollapsed ? 'center' : 'space-between',
          marginBottom: 8,
          padding: '4px 0',
        }}
      >
        {!isCollapsed && (
          <span
            style={{
              fontSize: '0.68rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: 'var(--text-muted)',
            }}
          >
            Apparatus
          </span>
        )}
        <button
          onClick={onToggleCollapse}
          style={{
            all: 'unset',
            cursor: 'pointer',
            fontSize: '0.7rem',
            color: 'var(--text-muted)',
            padding: '2px 4px',
            borderRadius: 4,
          }}
        >
          {isCollapsed ? '→' : '←'}
        </button>
      </div>

      {/* Items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {toolItems.map((item) => {
          const isEnabled = item.enabledAt.includes(state.step);
          const isHidden = item.hiddenWhen(state);
          return (
            <DraggableItem
              key={item.id}
              item={item}
              isEnabled={isEnabled}
              isHidden={isHidden}
              isCollapsed={isCollapsed}
            />
          );
        })}
      </div>

      {/* Safety reminder */}
      {!isCollapsed && (
        <div
          style={{
            marginTop: 16,
            padding: '8px 10px',
            background: 'rgba(254, 202, 202, 0.15)',
            border: '1px solid rgba(220, 38, 38, 0.15)',
            borderRadius: 8,
            fontSize: '0.6rem',
            color: '#991b1b',
            lineHeight: 1.4,
          }}
        >
          <strong>⚠️ Safety:</strong> BaCl₂ is toxic. Handle with care. Ensure flask is sealed before mixing.
        </div>
      )}
    </div>
  );
};

export default ConservationToolbox;
