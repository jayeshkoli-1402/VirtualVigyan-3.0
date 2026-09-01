import React, { useState } from 'react';

interface DigitalBalanceProps {
  massReading: number | null;
  showReading: boolean;
  isActive: boolean;
}

const DigitalBalance: React.FC<DigitalBalanceProps> = ({ massReading, showReading, isActive }) => {
  const [isOn, setIsOn] = useState(true);
  const [isTared, setIsTared] = useState(false);
  const [pressedBtn, setPressedBtn] = useState<string | null>(null);

  const balanceCenterX = 220;
  const balanceBaseY = 328;
  const balanceWidth = 100;
  const balanceHeight = 62;

  const handleTare = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPressedBtn('tare');
    setIsTared(!isTared);
    setTimeout(() => setPressedBtn(null), 200);
  };

  const handleZero = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPressedBtn('zero');
    setIsTared(false);
    setTimeout(() => setPressedBtn(null), 200);
  };

  const handlePower = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPressedBtn('power');
    setIsOn(!isOn);
    setTimeout(() => setPressedBtn(null), 200);
  };

  // Displayed value logic
  const displayVal = !isOn
    ? ''
    : isTared
      ? '0.00'
      : showReading && massReading !== null
        ? massReading.toFixed(2)
        : '0.00';

  return (
    <g id="analytical-digital-balance">
      <defs>
        {/* Stainless steel weighing pan gradient */}
        <linearGradient id="balancePanGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#94a3b8" />
          <stop offset="20%" stopColor="#f1f5f9" />
          <stop offset="50%" stopColor="#cbd5e1" />
          <stop offset="80%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#64748b" />
        </linearGradient>

        {/* Balance chassis gradient */}
        <linearGradient id="balanceBodyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#e2e8f0" />
        </linearGradient>
      </defs>

      {/* Leveling rubber feet resting on wooden table at y = 390 */}
      <rect x={balanceCenterX - balanceWidth / 2 + 8} y={balanceBaseY + balanceHeight - 2} width={10} height={4} rx={2} fill="#334155" />
      <rect x={balanceCenterX + balanceWidth / 2 - 18} y={balanceBaseY + balanceHeight - 2} width={10} height={4} rx={2} fill="#334155" />

      {/* Main Balance Chassis */}
      <rect
        x={balanceCenterX - balanceWidth / 2}
        y={balanceBaseY + 12}
        width={balanceWidth}
        height={balanceHeight - 12}
        rx={6}
        fill="url(#balanceBodyGrad)"
        stroke="#94a3b8"
        strokeWidth={1}
      />

      {/* Central Pan Pillar Mount */}
      <rect
        x={balanceCenterX - 7}
        y={balanceBaseY + 4}
        width={14}
        height={10}
        fill="#64748b"
        stroke="#475569"
        strokeWidth={0.8}
        rx={1}
      />

      {/* Stainless Steel Circular Weighing Pan (Top Plate at y = 332) */}
      <ellipse
        cx={balanceCenterX}
        cy={balanceBaseY + 4}
        rx={38}
        ry={7}
        fill="url(#balancePanGrad)"
        stroke={isActive ? '#2563eb' : '#64748b'}
        strokeWidth={isActive ? 1.5 : 1}
      />

      {/* Pan Inner concentric ring */}
      <ellipse
        cx={balanceCenterX}
        cy={balanceBaseY + 4}
        rx={28}
        ry={4.5}
        fill="none"
        stroke="rgba(255, 255, 255, 0.6)"
        strokeWidth={0.8}
      />

      {/* LCD Display Bezel Frame */}
      <rect
        x={balanceCenterX - 36}
        y={balanceBaseY + 22}
        width={72}
        height={26}
        rx={4}
        fill="#0f172a"
        stroke="#334155"
        strokeWidth={1}
      />

      {/* LCD Backlight Panel */}
      <rect
        x={balanceCenterX - 34}
        y={balanceBaseY + 24}
        width={68}
        height={22}
        rx={2}
        fill={isOn ? '#020617' : '#000000'}
      />

      {/* Mass Value & Status Readout (Clean separated layout, zero collision) */}
      {isOn && (
        <g id="lcd-readout-group">
          {/* Top Status Bar: Dot + Status Text (y = 29.5) */}
          <circle
            cx={balanceCenterX - 28}
            cy={balanceBaseY + 29}
            r={1.8}
            fill={showReading && massReading !== null ? '#22c55e' : 'rgba(34, 197, 94, 0.4)'}
          />
          <text
            x={balanceCenterX - 23}
            y={balanceBaseY + 30.5}
            fill={isTared ? '#38bdf8' : 'rgba(255, 255, 255, 0.5)'}
            fontSize="3.5"
            fontFamily="var(--font-sans)"
            fontWeight={600}
          >
            {isTared ? 'TARED' : 'STABLE'}
          </text>

          {/* Main Numeric Digits (Right aligned at y = 41) */}
          <text
            x={balanceCenterX + 17}
            y={balanceBaseY + 41.5}
            textAnchor="end"
            fill={showReading && massReading !== null && !isTared ? '#22c55e' : isTared ? '#38bdf8' : '#22c55e'}
            fontSize="9.5"
            fontFamily="var(--font-mono)"
            fontWeight={800}
            letterSpacing="0.04em"
          >
            {displayVal}
          </text>

          {/* Unit label "g" */}
          <text
            x={balanceCenterX + 20}
            y={balanceBaseY + 41}
            textAnchor="start"
            fill="#22c55e"
            fontSize="5.5"
            fontFamily="var(--font-mono)"
            fontWeight={700}
          >
            g
          </text>
        </g>
      )}

      {/* Balance Brand / Model Header */}
      <text
        x={balanceCenterX}
        y={balanceBaseY + 19}
        textAnchor="middle"
        fill="#64748b"
        fontSize="4"
        fontFamily="var(--font-sans)"
        fontWeight={700}
        letterSpacing="0.08em"
      >
        ELECTRONIC BALANCE (0.01 g)
      </text>

      {/* Interactive Membrane Keys via foreignObject */}
      <foreignObject
        x={balanceCenterX - 38}
        y={balanceBaseY + 50}
        width={76}
        height={16}
      >
        <div style={{ display: 'flex', gap: 3, width: '100%', height: '100%' }}>
          {/* TARE */}
          <button
            id="btn-balance-tare"
            onClick={handleTare}
            title="Tare Balance (zero out current mass)"
            style={{
              flex: 1,
              background: pressedBtn === 'tare' ? '#94a3b8' : isTared ? '#bae6fd' : '#f1f5f9',
              border: '1px solid #cbd5e1',
              borderRadius: 3,
              fontSize: '5.5px',
              fontFamily: 'var(--font-sans)',
              fontWeight: 700,
              color: isTared ? '#0369a1' : '#334155',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 0,
              userSelect: 'none',
              transition: 'all 0.1s ease',
            }}
          >
            TARE
          </button>

          {/* ZERO */}
          <button
            id="btn-balance-zero"
            onClick={handleZero}
            title="Reset Zero"
            style={{
              flex: 1,
              background: pressedBtn === 'zero' ? '#94a3b8' : '#f1f5f9',
              border: '1px solid #cbd5e1',
              borderRadius: 3,
              fontSize: '5.5px',
              fontFamily: 'var(--font-sans)',
              fontWeight: 700,
              color: '#334155',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 0,
              userSelect: 'none',
              transition: 'all 0.1s ease',
            }}
          >
            ZERO
          </button>

          {/* ON/OFF */}
          <button
            id="btn-balance-power"
            onClick={handlePower}
            title="Power On / Off"
            style={{
              flex: 1,
              background: pressedBtn === 'power' ? '#bfdbfe' : isOn ? '#dbeafe' : '#fee2e2',
              border: `1px solid ${isOn ? '#bfdbfe' : '#fecaca'}`,
              borderRadius: 3,
              fontSize: '5px',
              fontFamily: 'var(--font-sans)',
              fontWeight: 700,
              color: isOn ? '#1d4ed8' : '#dc2626',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 0,
              userSelect: 'none',
              transition: 'all 0.1s ease',
            }}
          >
            {isOn ? 'ON' : 'OFF'}
          </button>
        </div>
      </foreignObject>
    </g>
  );
};

export default DigitalBalance;
