# Test VCDS Reports for Errorlytic

This directory contains 5 realistic VCDS (VAG-COM Diagnostic System) diagnostic reports for testing the Errorlytic platform's analysis features.

## Reports Overview

### 1. VW Golf VII - Multiple Issues (Moderate Severity)
**File:** `vw-golf-multiple-issues.txt`
- **VIN:** WVWZZZ1KZDW123456
- **Mileage:** 87,650 km
- **Engine:** 2.0 TDI
- **Total Faults:** 10 across multiple systems
- **Severity:** Medium
- **Issues:**
  - Engine: Glow plug, coolant sensor, turbo valve, MAF sensor, intake air temp
  - Transmission: Solenoid EPC, fluid pressure sensor
  - ABS: Hydraulic pump motor malfunction
- **Use Case:** Testing multi-system diagnostics with mixed severity

---

### 2. Audi A4 B9 - Critical Engine Issues (High Severity)
**File:** `audi-a4-engine-critical.txt`
- **VIN:** WAUZZZ8K8DA234567
- **Mileage:** 142,350 km
- **Engine:** 2.0 TFSI quattro
- **Total Faults:** 9
- **Severity:** Critical (MIL ON)
- **Issues:**
  - Multiple confirmed engine faults with MIL ON
  - Engine speed sensor signal implausible
  - Camshaft position sensor - no signal
  - Fuel pressure sensor too low
  - Ignition coil failures (cylinders 1 & 3)
  - High pressure fuel pump mechanical malfunction
  - Supply voltage too low
- **Use Case:** Testing critical engine diagnostics requiring immediate attention

---

### 3. Skoda Octavia III - Minor Issues (Low Severity)
**File:** `skoda-octavia-minor-issues.txt`
- **VIN:** TMBJJ7NE5J2345678
- **Mileage:** 45,230 km
- **Engine:** 1.6 TDI
- **Total Faults:** 3
- **Severity:** Low
- **Issues:**
  - Intake air temperature sensor signal too high (intermittent)
  - Engine coolant over temperature warning (intermittent)
  - Instrument cluster CAN bus missing message
- **Use Case:** Testing low-severity intermittent issues

---

### 4. Seat Leon III - Critical Multi-System Failures (Extreme Severity)
**File:** `seat-leon-critical-issues.txt`
- **VIN:** VSSZZZ5FZHB456789
- **Mileage:** 112,890 km
- **Engine:** 1.4 TSI ACT
- **Total Faults:** 20 across all major systems
- **Severity:** Extreme Critical (MIL ON)
- **Issues:**
  - Engine: Random misfires, cylinder-specific misfires, ignition coil failures
  - Transmission: Mechatronic sensor, gear ratio issues, clutch adaptation limits
  - ABS: Pump motor malfunction, ESP internal malfunction
  - Airbag: Driver airbag igniter resistance too high (SAFETY CRITICAL)
  - Fuel system: Pressure sensor, metering control too lean
  - Multiple confirmed faults with MIL ON
- **Use Case:** Testing worst-case scenario with safety-critical issues

---

### 5. VW Passat B8 - Transmission Focus (High Severity)
**File:** `vw-passat-transmission-issues.txt`
- **VIN:** WVWZZZ3CZHE567890
- **Mileage:** 95,470 km
- **Engine:** 2.0 TDI 4Motion
- **Total Faults:** 10 (mostly transmission)
- **Severity:** High
- **Issues:**
  - Transmission: Mechatronic position sensor implausible
  - Multiple gear ratio incorrect (gears 2, 4, 5)
  - Both clutches at adaptation limit
  - Transmission fluid pressure sensor range/performance
  - Solenoid EPC open circuit
  - Transmission fluid temperature sensor implausible
  - Engine: Minor glow plug issue
- **Use Case:** Testing transmission-specific diagnostics and DSG issues

---

## Testing Scenarios

### Scenario 1: Upload and Analysis
Upload any of these reports through the Errorlytic upload feature to test:
- VCDS file parsing
- Error code extraction
- AI analysis generation
- Severity classification
- Health score calculation

### Scenario 2: Multi-Vehicle Fleet Management
Upload all 5 reports to test:
- Fleet overview dashboard
- Most common issues across vehicles
- Critical issue alerts
- Health score distribution

### Scenario 3: Report Generation
Use these reports to test:
- Diagnostic summary generation
- PDF report creation
- Quotation generation
- Customer-facing report formatting

### Scenario 4: Severity Classification
- **Low:** Skoda Octavia (3 intermittent issues)
- **Medium:** VW Golf (10 mixed issues)
- **High:** Audi A4 (9 critical engine), VW Passat (9 transmission)
- **Critical:** Seat Leon (20 issues including safety-critical airbag)

---

## Vehicle Details Summary

| Vehicle | Year Range | Engine | Issues | MIL Status | Priority |
|---------|-----------|--------|--------|------------|----------|
| VW Golf VII | 2013-2020 | 2.0 TDI | 10 | OFF | Medium |
| Audi A4 B9 | 2016-2023 | 2.0 TFSI | 9 | ON | Critical |
| Skoda Octavia III | 2013-2020 | 1.6 TDI | 3 | OFF | Low |
| Seat Leon III | 2013-2020 | 1.4 TSI ACT | 20 | ON | Critical |
| VW Passat B8 | 2015-2023 | 2.0 TDI 4Motion | 10 | OFF | High |

---

## Notes

- All reports follow authentic VCDS format and structure
- VINs are fictional but follow correct VAG format
- Fault codes are real P-codes, B-codes, and manufacturer-specific codes
- Freeze frame data includes realistic values
- Reports vary from 4KB to 7.4KB in size
- All timestamps and mileage are realistic for the vehicle ages

---

## How to Use

1. **Upload via UI:** Use the Errorlytic upload modal to upload these .txt files
2. **API Testing:** Use the backend `/analysis/upload` endpoint with these files
3. **Bulk Upload:** Test batch processing by uploading multiple reports
4. **Parser Testing:** Verify the VCDS parser correctly extracts all fault codes

---

**Created:** January 3, 2026
**Purpose:** Testing and development of Errorlytic diagnostic platform
**Format:** VCDS Version 22.3.0.0 compatible
