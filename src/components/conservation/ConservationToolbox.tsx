import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import type { ConservationState } from '../../engine/conservationState';
import { ConservationStep, CONSERVATION_DRAG_ITEMS } from '../../engine/conservationState';
import { useLanguage } from '../../i18n/LanguageContext';

interface ConservationToolboxProps {
  state: ConservationState;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

type ToolItem = {
  id: string;
  icon: string;
  labelKey: string;
  defaultLabel: string;
  enabledAt: ConservationStep[];
  isUsed: (state: ConservationState) => boolean;
};

const toolItems: ToolItem[] = [
  {
    id: CONSERVATION_DRAG_ITEMS.FLASK,
    icon: '⚗️',
    labelKey: 'conservation.itemConicalFlask',
    defaultLabel: 'Conical Flask',
    enabledAt: [
      ConservationStep.SETUP_FLASK,
      ConservationStep.WEIGH_INITIAL,
      ConservationStep.MIX_REACTANTS,
      ConservationStep.OBSERVE,
      ConservationStep.WEIGH_FINAL,
    ],
    isUsed: (s) => s.flaskPlaced,
  },
  {
    id: CONSERVATION_DRAG_ITEMS.NA2SO4_BOTTLE,
    icon: '🧴',
    labelKey: 'conservation.itemNa2so4',
    defaultLabel: 'Na₂SO₄ Solution',
    enabledAt: [ConservationStep.SETUP_FLASK],
    isUsed: (s) => s.na2so4Poured,
  },
  {
    id: CONSERVATION_DRAG_ITEMS.IGNITION_TUBE,
    icon: '🧫',
    labelKey: 'conservation.itemIgnitionTube',
    defaultLabel: 'Ignition Tube',
    enabledAt: [ConservationStep.PLACE_TUBE_ON_STAND],
    isUsed: (s) => s.tubePlacedOnStand || s.tubeSuspended,
  },
  {
    id: CONSERVATION_DRAG_ITEMS.BACL2_BOTTLE,
    icon: '🧴',
    labelKey: 'conservation.itemBacl2',
    defaultLabel: 'BaCl₂ Solution',
    enabledAt: [ConservationStep.FILL_TUBE],
    isUsed: (s) => s.tubeFilled,
  },
  {
    id: CONSERVATION_DRAG_ITEMS.RUBBER_CORK,
    icon: '🔌',
    labelKey: 'conservation.itemRubberCork',
    defaultLabel: 'Rubber Cork',
    enabledAt: [ConservationStep.SEAL_FLASK],
    isUsed: (s) => s.flaskSealed,
  },
  {
    id: CONSERVATION_DRAG_ITEMS.MEASURING_CYLINDER,
    icon: '📏',
    labelKey: 'conservation.itemMeasuringCylinder',
    defaultLabel: 'Measuring Cylinder',
    enabledAt: [ConservationStep.SETUP_FLASK],
    isUsed: (s) => s.na2so4Poured,
  },
];

const DraggableItem: React.FC<{
  item: ToolItem;
  isEnabled: boolean;
  isUsed: boolean;
  isCollapsed: boolean;
}> = ({ item, isEnabled, isUsed, isCollapsed }) => {
  const { t } = useLanguage();
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: item.id,
    disabled: !isEnabled || isUsed,
  });

  const localizedLabel = t(item.labelKey, item.defaultLabel);

  return (
    <div
      ref={setNodeRef}
      {...(!isUsed ? listeners : {})}
      {...(!isUsed ? attributes : {})}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: isCollapsed ? 0 : 8,
        padding: isCollapsed ? '6px' : '8px 10px',
        borderRadius: 'var(--radius-md)',
        border: `1px solid ${isDragging ? 'var(--accent)' : 'var(--border)'}`,
        background: isUsed ? 'var(--bg-secondary)' : 'var(--bg-card)',
        opacity: isUsed ? 0.45 : !isEnabled ? 0.55 : 1,
        cursor: isUsed ? 'not-allowed' : isEnabled ? 'grab' : 'not-allowed',
        transition: 'all 0.15s ease',
        fontSize: isCollapsed ? '1rem' : '0.8125rem',
        fontWeight: 500,
        color: isUsed ? 'var(--text-muted)' : 'var(--text-primary)',
        justifyContent: isCollapsed ? 'center' : 'flex-start',
        userSelect: 'none',
        touchAction: isUsed ? 'auto' : 'none',
        boxShadow: isUsed ? 'none' : '0 1px 2px rgba(0, 0, 0, 0.03)',
      }}
    >
      <span style={{ fontSize: '1rem', flexShrink: 0 }}>{item.icon}</span>
      {!isCollapsed && (
        <span
          style={{
            fontSize: '0.8125rem',
            fontWeight: 500,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {localizedLabel}
        </span>
      )}
      {isUsed && !isCollapsed && (
        <span
          style={{
            marginLeft: 'auto',
            fontSize: '0.6875rem',
            fontWeight: 700,
            color: '#059669',
          }}
        >
          ✓
        </span>
      )}
    </div>
  );
};

const ConservationToolbox: React.FC<ConservationToolboxProps> = ({
  state,
  isCollapsed,
  onToggleCollapse,
}) => {
  const { t } = useLanguage();

  return (
    <div style={{ padding: isCollapsed ? '8px 4px' : '12px', height: '100%', overflow: 'auto' }}>
      {/* Header matching GenericToolbox / Reference UI */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: isCollapsed ? 8 : 12,
        }}
      >
        {!isCollapsed && (
          <h2
            style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              color: 'var(--text-secondary)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              margin: 0,
            }}
          >
            {t('apparatus.title', 'Apparatus')}
          </h2>
        )}
        <button
          onClick={onToggleCollapse}
          style={{
            all: 'unset',
            cursor: 'pointer',
            fontSize: '0.625rem',
            color: 'var(--text-muted)',
            padding: '3px 6px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border)',
            background: 'var(--bg-secondary)',
            transition: 'all 0.15s ease',
          }}
        >
          {isCollapsed ? '→' : '←'}
        </button>
      </div>

      {/* Apparatus cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {toolItems.map((item) => {
          const isEnabled = item.enabledAt.includes(state.step);
          const isUsed = item.isUsed(state);
          return (
            <DraggableItem
              key={item.id}
              item={item}
              isEnabled={isEnabled}
              isUsed={isUsed}
              isCollapsed={isCollapsed}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ConservationToolbox;
