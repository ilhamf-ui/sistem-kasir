<div
  className="input-base"
  style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 8px 0 16px',
    height: 52
  }}
>
  <span style={{ fontSize: 16, fontWeight: 600 }}>
    {shiftNumber}
  </span>

  <div style={{ display: 'flex', flexDirection: 'column' }}>
    <button
      type="button"
      onClick={() => setShiftNumber(shiftNumber + 1)}
      style={{
        border: 'none',
        background: 'transparent',
        color: 'white',
        cursor: 'pointer',
        fontSize: 12,
        padding: 0,
        lineHeight: 1
      }}
    >
      ▲
    </button>

    <button
      type="button"
      onClick={() => setShiftNumber(Math.max(1, shiftNumber - 1))}
      style={{
        border: 'none',
        background: 'transparent',
        color: 'white',
        cursor: 'pointer',
        fontSize: 12,
        padding: 0,
        lineHeight: 1
      }}
    >
      ▼
    </button>
  </div>
</div>