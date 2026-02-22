import { describe, it, expect } from "vitest";
import { formatCurrency, formatMonths, formatDate } from "./format";

describe("formatCurrency", () => {
  it("formats with two decimal places (en-US)", () => {
    expect(formatCurrency(1234.5, "en-US")).toBe("1,234.50");
  });

  it("formats large numbers with commas (en-US)", () => {
    expect(formatCurrency(150945.79, "en-US")).toBe("150,945.79");
  });

  it("formats with German locale", () => {
    const result = formatCurrency(1234.5, "de-DE");
    // German uses . for thousands and , for decimal
    expect(result).toMatch(/1\.234,50/);
  });

  it("formats zero", () => {
    expect(formatCurrency(0, "en-US")).toBe("0.00");
  });

  it("respects decimal places parameter", () => {
    expect(formatCurrency(1234.567, "en-US", 0)).toBe("1,235");
    expect(formatCurrency(1234.567, "en-US", 1)).toBe("1,234.6");
  });
});

describe("formatMonths", () => {
  it("formats years and months (en)", () => {
    expect(formatMonths(120, "en")).toBe("10 Years");
  });

  it("formats with remaining months (en)", () => {
    expect(formatMonths(125, "en")).toBe("10 Years 5 Months");
  });

  it("formats months only (en)", () => {
    expect(formatMonths(6, "en")).toBe("6 Months");
  });

  it("handles infinity (en)", () => {
    expect(formatMonths(Infinity, "en")).toBe("Never");
  });

  it("formats in German", () => {
    expect(formatMonths(120, "de")).toBe("10 Jahre");
    expect(formatMonths(125, "de")).toBe("10 Jahre 5 Monate");
    expect(formatMonths(Infinity, "de")).toBe("Nie");
  });
});

describe("formatDate", () => {
  it("formats date correctly (en-US)", () => {
    const date = new Date(2026, 1, 1);
    expect(formatDate(date, "en-US")).toBe("February 2026");
  });

  it("formats date correctly (de-DE)", () => {
    const date = new Date(2026, 1, 1);
    expect(formatDate(date, "de-DE")).toBe("Februar 2026");
  });
});
