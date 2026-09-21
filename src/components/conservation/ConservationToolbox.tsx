import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import type { ConservationState } from '../../engine/conservationState';
import { ConservationStep, CONSERVATION_DRAG_ITEMS } from '../../engine/conservationState';

interface ConservationToolboxProps {
  state: ConservationState;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

import { useLanguage } from '../../i18n/LanguageContext';

type ToolItem = {
  id: string;
  icon: string;
  labelKey: string;
  defaultLabel: string;
  descKey: string;
  defaultDesc: string;
  hazard?: string;
  enabledAt: ConservationStep[];
  hiddenWhen: (state: ConservationState) => boolean;
};

const toolItems: ToolItem[] = [
  {
    id: CONSERVATION_DRAG_ITEMS.FLASK,
    icon: '⚗️',
    labelKey: 'apparatus.flask',
    defaultLabel: 'Conical Flask',
    descKey: 'desc.flask',
    defaultDesc: '100 mL Borosilicate',
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
    labelKey: 'apparatus.na2so4Bottle',
    defaultLabel: 'Na₂SO₄ Solution',
    descKey: 'desc.na2so4',
    defaultDesc: '5% w/v, 10 mL',
    enabledAt: [ConservationStep.SETUP_FLASK],
    hiddenWhen: (s) => s.na2so4Poured,
  },
  {
    id: CONSERVATION_DRAG_ITEMS.IGNITION_TUBE,
    icon: '🧫',
    labelKey: 'apparatus.ignitionTube',
    defaultLabel: 'Ignition Tube',
    descKey: 'desc.ignitionTube',
    defaultDesc: '10×75 mm Borosilicate with thread',
    enabledAt: [ConservationStep.PLACE_TUBE_ON_STAND],
    hiddenWhen: (s) => s.tubePlacedOnStand || s.tubeSuspended,
  },
  {
    id: CONSERVATION_DRAG_ITEMS.BACL2_BOTTLE,
    icon: '🧴',
    labelKey: 'apparatus.bacl2Bottle',
    defaultLabel: 'BaCl₂ Solution',
    descKey: 'desc.bacl2',
    defaultDesc: '5% w/v, 10 mL',
    hazard: '⚠️ Toxic',
    enabledAt: [ConservationStep.FILL_TUBE],
    hiddenWhen: (s) => s.tubeFilled,
  },
  {
    id: CONSERVATION_DRAG_ITEMS.RUBBER_CORK,
    icon: '🔌',
    labelKey: 'apparatus.rubberCork',
    defaultLabel: 'Rubber Cork',
    descKey: 'desc.rubberCork',
    defaultDesc: 'Airtight solid cork',
    enabledAt: [ConservationStep.SEAL_FLASK],
    hiddenWhen: (s) => s.flaskSealed,
  },
  {
    id: CONSERVATION_DRAG_ITEMS.MEASURING_CYLINDER,
    icon: '📏',
    labelKey: 'apparatus.measuringCylinder',
    defaultLabel: 'Measuring Cylinder',
    descKey: 'desc.measuringCylinder',
    defaultDesc: '10 mL graduated',
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
  const { t, language } = useLanguage();
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: item.id,
    disabled: !isEnabled,
  });

  if (isHidden) return null;

  const localizedLabel = t(item.labelKey, item.defaultLabel);
  const localizedDesc = language === 'hi'
    ? (item.id === CONSERVATION_DRAG_ITEMS.IGNITION_TUBE ? '10×75 mm धागे सहित' :
       item.id === CONSERVATION_DRAG_ITEMS.RUBBER_CORK ? 'वायुरोधी ठोस कॉर्क' :
       item.id === CONSERVATION_DRAG_ITEMS.MEASURING_CYLINDER ? '10 mL अंशांकित' : item.defaultDesc)
    : language === 'mr'
      ? (item.id === CONSERVATION_DRAG_ITEMS.IGNITION_TUBE ? '10×75 mm दोऱ्यासह' :
         item.id === CONSERVATION_DRAG_ITEMS.RUBBER_CORK ? 'हवाबंद रबरी बुच' :
         item.id === CONSERVATION_DRAG_ITEMS.MEASURING_CYLINDER ? '10 mL अंशांकित' : item.defaultDesc)
      : item.defaultDesc;

  const localizedHazard = item.hazard
    ? (language === 'hi' ? '⚠️ विषैला' : language === 'mr' ? '⚠️ विषारी' : item.hazard)
    : undefined;

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
            {localizedLabel}
          </div>
          <div
            style={{
              fontSize: '0.6rem',
              color: 'var(--text-muted)',
              lineHeight: 1.3,
            }}
          >
            {localizedDesc}
          </div>
          {localizedHazard && (
            <div
              style={{
                fontSize: '0.55rem',
                color: '#dc2626',
                fontWeight: 600,
                marginTop: 2,
              }}
            >
              {localizedHazard}
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
  const { t } = useLanguage();
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
            {t('lab.toolbox', 'Apparatus')}
          </span>
        )}
        <button
          onClick={onToggleCollapse}
          title={isCollapsed ? t('common.expand', 'Expand') : t('common.collapse', 'Collapse')}
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
          {t('conservation.safetyReminder', '⚠️ Safety: BaCl₂ is toxic. Handle with care. Ensure flask is sealed before mixing.')}
        </div>
      )}
    </div>
  );
};

export default ConservationToolbox;
