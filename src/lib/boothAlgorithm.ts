export interface BoothStep {
  step: number;
  multiplier: string;
  multiplicand: string;
  accumulator: string;
  operation: string;
  qPrev: string;
  explanation: string;
}

function signExtend(binary: string, bits: number): string {
  const sign = binary[0];
  return sign.repeat(bits - binary.length) + binary;
}

function twosComplement(binary: string): string {
  let inverted = binary.split("").map(b => (b === "0" ? "1" : "0")).join("");
  let carry = 1;
  let result = "";
  
  for (let i = inverted.length - 1; i >= 0; i--) {
    const sum = parseInt(inverted[i]) + carry;
    result = (sum % 2) + result;
    carry = Math.floor(sum / 2);
  }
  
  return result;
}

function addBinary(a: string, b: string): string {
  let result = "";
  let carry = 0;
  
  for (let i = a.length - 1; i >= 0; i--) {
    const sum = parseInt(a[i]) + parseInt(b[i]) + carry;
    result = (sum % 2) + result;
    carry = Math.floor(sum / 2);
  }
  
  return result;
}

function arithmeticShiftRight(acc: string, q: string, qPrev: string): { acc: string; q: string; qPrev: string } {
  const newQPrev = q[q.length - 1];
  const newQ = acc[acc.length - 1] + q.slice(0, -1);
  const newAcc = acc[0] + acc.slice(0, -1);
  
  return {
    acc: newAcc,
    q: newQ,
    qPrev: newQPrev,
  };
}

export function boothMultiplication(multiplicand: string, multiplier: string): BoothStep[] {
  // Remove any spaces and validate
  multiplicand = multiplicand.replace(/\s/g, "");
  multiplier = multiplier.replace(/\s/g, "");
  
  if (!/^[01]+$/.test(multiplicand) || !/^[01]+$/.test(multiplier)) {
    throw new Error("Invalid binary number");
  }

  const n = Math.max(multiplicand.length, multiplier.length);
  
  // Sign extend both numbers
  let M = signExtend(multiplicand, n);
  let Q = signExtend(multiplier, n);
  let A = "0".repeat(n);
  let qPrev = "0";
  
  const steps: BoothStep[] = [];
  const negM = twosComplement(M);

  // Initial step
  steps.push({
    step: 0,
    multiplier: Q + qPrev,
    multiplicand: M,
    accumulator: A,
    operation: "Initialize",
    qPrev: qPrev,
    explanation: `Initialize: A=${A}, Q=${Q}, Q₋₁=${qPrev}, M=${M}, -M=${negM}`,
  });

  // Booth algorithm iterations
  for (let i = 1; i <= n; i++) {
    const q0 = Q[Q.length - 1];
    let operation = "";
    let explanation = "";

    // Check Q0 and Q-1
    if (q0 === "1" && qPrev === "0") {
      // Subtract M (add -M)
      A = addBinary(A, negM);
      operation = "A = A - M";
      explanation = `Q₀Q₋₁ = 10: Subtract M (add -M=${negM}). A=${A}`;
    } else if (q0 === "0" && qPrev === "1") {
      // Add M
      A = addBinary(A, M);
      operation = "A = A + M";
      explanation = `Q₀Q₋₁ = 01: Add M. A=${A}`;
    } else {
      operation = "No operation";
      explanation = `Q₀Q₋₁ = ${q0}${qPrev}: No arithmetic operation needed`;
    }

    // Arithmetic shift right
    const shifted = arithmeticShiftRight(A, Q, qPrev);
    A = shifted.acc;
    Q = shifted.q;
    qPrev = shifted.qPrev;
    
    explanation += `. Then arithmetic shift right: A=${A}, Q=${Q}, Q₋₁=${qPrev}`;

    steps.push({
      step: i,
      multiplier: Q + qPrev,
      multiplicand: M,
      accumulator: A,
      operation: operation + " → ASR",
      qPrev: qPrev,
      explanation: explanation,
    });
  }

  return steps;
}

export function binaryToDecimal(binary: string): number {
  // Check if negative (two's complement)
  if (binary[0] === "1") {
    // Convert back from two's complement
    const positive = twosComplement(binary);
    return -parseInt(positive, 2);
  }
  return parseInt(binary, 2);
}
