import React from 'react';

interface QRCodeViewProps {
  data: string;
  size?: number;
  className?: string;
}

export const QRCodeView: React.FC<QRCodeViewProps> = ({ data, size = 140, className = '' }) => {
  // Deterministic pseudo-matrix based on data string for realistic crisp QR code visual
  const generateGrid = (input: string) => {
    const gridSize = 21; // standard version 1 QR size
    const grid: boolean[][] = Array.from({ length: gridSize }, () => Array(gridSize).fill(false));

    // Finder patterns (top-left, top-right, bottom-left)
    const placeFinder = (startX: number, startY: number) => {
      for (let r = 0; r < 7; r++) {
        for (let c = 0; c < 7; c++) {
          if (
            r === 0 || r === 6 || c === 0 || c === 6 ||
            (r >= 2 && r <= 4 && c >= 2 && c <= 4)
          ) {
            grid[startY + r][startX + c] = true;
          }
        }
      }
    };

    placeFinder(0, 0);
    placeFinder(gridSize - 7, 0);
    placeFinder(0, gridSize - 7);

    // Timing patterns
    for (let i = 8; i < gridSize - 8; i++) {
      grid[6][i] = i % 2 === 0;
      grid[i][6] = i % 2 === 0;
    }

    // Fill data bits deterministically with hash of string
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      hash = (hash * 31 + input.charCodeAt(i)) & 0xffffffff;
    }

    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        // Skip finders
        if (
          (r < 8 && c < 8) ||
          (r < 8 && c >= gridSize - 8) ||
          (r >= gridSize - 8 && c < 8) ||
          (r === 6 || c === 6)
        ) {
          continue;
        }
        // Center area leave clear for DIU badge
        if (r >= 8 && r <= 12 && c >= 8 && c <= 12) {
          continue;
        }

        const seed = (r * 37 + c * 17 + hash) % 100;
        grid[r][c] = seed > 48;
      }
    }

    return grid;
  };

  const grid = generateGrid(data);
  const cellSize = size / 21;

  return (
    <div className={`relative inline-block bg-white p-2 rounded-xl border border-slate-200 shadow-sm ${className}`}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="rounded-lg">
        {grid.map((row, r) =>
          row.map((active, c) =>
            active ? (
              <rect
                key={`${r}-${c}`}
                x={c * cellSize}
                y={r * cellSize}
                width={cellSize}
                height={cellSize}
                fill="#0f172a"
                rx={cellSize > 5 ? 1 : 0}
              />
            ) : null
          )
        )}
      </svg>
      {/* Center DIU Badge */}
      <div
        className="absolute inset-0 m-auto flex items-center justify-center bg-blue-600 text-white font-extrabold rounded-md shadow-md border-2 border-white pointer-events-none"
        style={{ width: size * 0.28, height: size * 0.28, fontSize: `${size * 0.085}px` }}
      >
        DIU
      </div>
    </div>
  );
};
