export const calculatorFAQs: Record<string, Array<{ question: string; answer: string }>> = {
  'wire-size-calculator': [
    {
      question: 'What wire size do I need for a 20 amp circuit?',
      answer: 'For a 20 amp circuit at 120V or 240V, you need 12 AWG copper wire or 10 AWG aluminum wire per NEC Table 310.16. This assumes standard 75°C rated wire in ambient temperatures up to 30°C. For runs over 100 feet, consider upsizing to 10 AWG copper to minimize voltage drop.'
    },
    {
      question: 'How do I calculate voltage drop for wire sizing?',
      answer: 'Voltage drop = (2 × Length × Current × Resistance) ÷ 1000. NEC recommends maximum 3% voltage drop for branch circuits and 5% total. For a 100ft run at 20A using 12 AWG copper: (2 × 100 × 20 × 1.98) ÷ 1000 = 7.92V drop, or 6.6% at 120V. You would need 10 AWG to stay under 3%.'
    },
    {
      question: 'Can I use aluminum wire instead of copper?',
      answer: 'Yes, aluminum wire is safe and cost-effective when properly installed. Use anti-oxidant compound on connections and ensure proper torque. Aluminum requires one size larger than copper (e.g., 10 AWG aluminum for 20A vs 12 AWG copper). Never use aluminum wire smaller than 12 AWG for branch circuits.'
    },
    {
      question: 'What is the difference between THHN and THWN wire?',
      answer: 'THHN is thermoplastic high heat-resistant nylon-coated wire rated for dry locations up to 90°C. THWN is thermoplastic heat and water-resistant nylon-coated wire rated for wet or dry locations up to 75°C wet/90°C dry. Most modern wire is dual-rated THHN/THWN-2, suitable for all locations.'
    },
    {
      question: 'How many amps can 10 gauge wire handle?',
      answer: '10 AWG copper wire is rated for 30 amps at 75°C per NEC Table 310.16. At 60°C it is rated for 30A, and at 90°C for 35A. However, the actual ampacity depends on the temperature rating of the terminations, which is typically 75°C for circuits over 100A and may be 60°C for smaller circuits.'
    }
  ],
  'voltage-drop-calculator': [
    {
      question: 'What is acceptable voltage drop for a circuit?',
      answer: 'NEC recommends maximum 3% voltage drop for branch circuits and 5% combined for feeder plus branch circuits. For a 120V circuit, 3% equals 3.6V drop maximum. For critical loads like motors or sensitive electronics, consider limiting voltage drop to 2% or less for optimal performance.'
    },
    {
      question: 'How does wire length affect voltage drop?',
      answer: 'Voltage drop is directly proportional to wire length. Doubling the distance doubles the voltage drop. For example, 12 AWG copper at 20A has 3.96V drop per 100 feet. At 200 feet, the drop is 7.92V. This is why long runs often require larger wire sizes even if ampacity requirements are met.'
    },
    {
      question: 'Does voltage drop affect power consumption?',
      answer: 'Yes, voltage drop wastes power as heat in the wire. Power loss = Current² × Resistance. For a 20A circuit with 0.2 ohms resistance, power loss = 400 × 0.2 = 80 watts wasted as heat. This increases energy costs and can cause wire heating. Lower resistance (larger wire) reduces losses.'
    },
    {
      question: 'Why is voltage drop worse for 120V than 240V circuits?',
      answer: 'Voltage drop percentage is worse at lower voltages. A 3.6V drop is 3% of 120V but only 1.5% of 240V. Additionally, 240V circuits carry half the current for the same power (P=V×I), which further reduces voltage drop. This is why 240V is preferred for high-power or long-distance applications.'
    },
    {
      question: 'How do I measure actual voltage drop?',
      answer: 'Measure voltage at the panel/source and at the load while the circuit is operating at full current. The difference is your voltage drop. For example, if panel shows 120V and outlet shows 115V under load, you have 5V drop (4.2%). No-load measurements will not show voltage drop as no current flows.'
    }
  ],
  'ampacity-calculator': [
    {
      question: 'What factors affect wire ampacity?',
      answer: 'Wire ampacity is affected by: conductor material (copper vs aluminum), insulation temperature rating (60°C, 75°C, 90°C), ambient temperature (derate if above 30°C), number of current-carrying conductors in a raceway (derate for 4+ conductors), and installation method (free air vs conduit). Always use the most restrictive rating.'
    },
    {
      question: 'How do I derate wire for temperature?',
      answer: 'Use NEC Table 310.15(B)(1) correction factors. For ambient temperatures above 30°C (86°F), multiply base ampacity by the correction factor. Example: 90°C wire at 40°C ambient uses 0.91 factor. 30A base ampacity × 0.91 = 27.3A derated ampacity. Always round down for safety.'
    },
    {
      question: 'What is the 80% rule for continuous loads?',
      answer: 'Conductors must be sized at 125% of continuous loads (loads operating 3+ hours) per NEC 210.19. This means the circuit can only be loaded to 80% of its rating for continuous use. A 20A circuit should carry maximum 16A continuous load. The conductor and overcurrent protection must both meet this requirement.'
    },
    {
      question: 'Can I use 90°C ampacity ratings?',
      answer: 'You can use 90°C ampacity for derating calculations, but final ampacity is limited by the lowest temperature rating in the circuit - typically 75°C at breaker terminals. Use 90°C column for derating math, then ensure final ampacity does not exceed 75°C column value for termination compatibility.'
    },
    {
      question: 'How many wires can I put in a conduit?',
      answer: 'Use NEC Chapter 9 conduit fill tables. Generally, maximum 40% fill for 3+ wires, 31% for 2 wires, 53% for 1 wire. Also apply derating: 80% for 4-6 current-carrying conductors, 70% for 7-9, 50% for 10-20. Neutral and ground wires may not count as current-carrying depending on the load type.'
    }
  ],
  'watts-to-amps-calculator': [
    {
      question: 'How do I convert watts to amps for household circuits?',
      answer: 'For single-phase AC: Amps = Watts ÷ (Volts × Power Factor). For resistive loads (heaters, incandescent lights) use PF=1.0. Example: 1500W heater on 120V = 1500 ÷ 120 = 12.5 amps. For motors use PF=0.8-0.85. A 1500W motor at PF=0.85: 1500 ÷ (120 × 0.85) = 14.7 amps.'
    },
    {
      question: 'What is power factor and why does it matter?',
      answer: 'Power factor (PF) represents how efficiently electrical power is used, ranging from 0 to 1. Resistive loads have PF=1.0 (all power does work). Motors and transformers have PF<1 due to reactive power. Lower PF means higher current for same watts. This affects wire sizing, breaker selection, and utility bills.'
    },
    {
      question: 'How do I calculate three-phase amps from watts?',
      answer: 'For three-phase: Amps = Watts ÷ (Volts × 1.732 × Power Factor). The 1.732 (√3) accounts for three-phase power. Example: 10,000W load at 480V, PF=0.85: 10,000 ÷ (480 × 1.732 × 0.85) = 14.2 amps per phase. Always use line-to-line voltage in this formula.'
    },
    {
      question: 'Why do motors draw more amps than their wattage suggests?',
      answer: 'Motors have power factor typically 0.80-0.85 and efficiency of 85-95%. A 1 HP (746W) motor with PF=0.85 and 90% efficiency actually draws: 746 ÷ (120 × 0.85 × 0.90) = 8.1 amps, not the 6.2 amps that 746W would suggest. Starting current can be 4-8 times higher during motor startup.'
    },
    {
      question: 'How do I size a breaker using watts to amps conversion?',
      answer: 'Convert watts to amps, then size breaker at 125% for continuous loads or 100% for non-continuous loads. Example: 2400W water heater at 240V = 10 amps. As a continuous load: 10 × 1.25 = 12.5A minimum. Use next standard size: 15A breaker with 14 AWG wire (or 12 AWG for long runs).'
    }
  ],
  'amps-to-watts-calculator': [
    {
      question: 'How do I convert amps to watts for different voltage systems?',
      answer: 'Use P = V × I × PF for single-phase AC, P = V × I × √3 × PF for three-phase AC, and P = V × I for DC. Example: 20A at 240V single-phase with PF=0.9: 20 × 240 × 0.9 = 4,320 watts. For three-phase at 480V: 20 × 480 × 1.732 × 0.9 = 14,956 watts total.'
    },
    {
      question: 'What is the difference between watts and volt-amps (VA)?',
      answer: 'Watts measure real power (work performed), while VA measures apparent power (total power supplied). Watts = VA × Power Factor. For resistive loads, watts = VA. For reactive loads like motors, watts < VA. A motor showing 10A at 240V = 2,400VA but only 2,040W at PF=0.85.'
    },
    {
      question: 'How do I calculate power consumption from nameplate amps?',
      answer: 'Multiply nameplate amps by voltage and power factor. For motors, nameplate shows Full Load Amps (FLA) at rated HP output. Input watts = FLA × Voltage × PF ÷ Efficiency. Example: Motor with 10A FLA at 240V, PF=0.85, Eff=0.90: 10 × 240 × 0.85 ÷ 0.90 = 2,267W input power.'
    },
    {
      question: 'Why do I need power factor for AC calculations?',
      answer: 'AC circuits with inductance (motors, transformers) or capacitance cause current and voltage to be out of phase. Power factor accounts for this phase difference. Without it, you overestimate actual power. A 20A motor at 120V might seem to use 2,400W, but at PF=0.8 actually uses only 1,920W.'
    },
    {
      question: 'How do I convert amps to kilowatts?',
      answer: 'First convert to watts, then divide by 1,000. Single-phase: kW = (A × V × PF) ÷ 1,000. Three-phase: kW = (A × V × 1.732 × PF) ÷ 1,000. Example: 50A at 240V single-phase, PF=0.9: (50 × 240 × 0.9) ÷ 1,000 = 10.8kW. This is useful for utility billing and generator sizing.'
    }
  ],
  'ohms-law-calculator': [
    {
      question: 'What is Ohms Law and how do I use it?',
      answer: 'Ohms Law states V = I × R (Voltage = Current × Resistance). Rearranged: I = V ÷ R and R = V ÷ I. Combined with power: P = V × I, P = I² × R, P = V² ÷ R. Example: 12V across 4Ω resistor: I = 12 ÷ 4 = 3A, P = 12 × 3 = 36W. These formulas solve any DC circuit problem.'
    },
    {
      question: 'Does Ohms Law work for AC circuits?',
      answer: 'Basic Ohms Law (V=IR) works for AC circuits with pure resistance. For reactive components (inductors, capacitors), use impedance (Z) instead of resistance: V = I × Z. For AC power, include power factor: P = V × I × PF. AC analysis requires considering phase relationships and reactance.'
    },
    {
      question: 'How do I calculate wire resistance?',
      answer: 'Resistance = (ρ × Length) ÷ Area, where ρ is resistivity. For copper: R = (10.4 × L) ÷ circular mils. Example: 100ft of 12 AWG (6,530 cmils): R = (10.4 × 200ft round trip) ÷ 6,530 = 0.319Ω. Tables provide resistance per 1000ft for each wire gauge at different temperatures.'
    },
    {
      question: 'How does temperature affect resistance?',
      answer: 'Resistance increases with temperature for conductors. R2 = R1[1 + α(T2 - T1)], where α = 0.00393 for copper. A 25°C increase raises copper resistance by 10%. This is why ampacity ratings decrease at higher temperatures and why motors draw more current when hot.'
    },
    {
      question: 'How do I use Ohms Law for LED circuit design?',
      answer: 'LEDs need current limiting resistors. R = (Vsupply - VLED) ÷ ILED. For a 3V LED at 20mA on 12V: R = (12 - 3) ÷ 0.02 = 450Ω. Use next standard value (470Ω). Power rating: P = I² × R = 0.02² × 470 = 0.188W, so 1/4W resistor is adequate. Always verify LED specifications.'
    }
  ],
  'conduit-fill-calculator': [
    {
      question: 'What is the maximum conduit fill percentage?',
      answer: 'Per NEC Chapter 9: 53% for 1 wire, 31% for 2 wires, 40% for 3+ wires. These percentages apply to the cross-sectional area. Example: 3/4" EMT has 0.213 sq.in. area, so maximum 0.0852 sq.in. for 3+ wires. This prevents overheating and allows wire pulling without damage.'
    },
    {
      question: 'How do I calculate conduit size for multiple wire sizes?',
      answer: 'Add the areas of all wires including insulation. Use NEC Chapter 9 Table 5 for wire areas, Table 4 for conduit areas. Example: Three 12 AWG THHN (0.0133 sq.in. each) = 0.0399 sq.in. total. For 40% fill, need conduit with 0.0998 sq.in. minimum. 1/2" EMT (0.122 sq.in.) works.'
    },
    {
      question: 'Do ground wires count for conduit fill?',
      answer: 'Yes, all wires including grounds count for conduit fill calculations. Equipment grounding conductors take the same space as current-carrying conductors. A 12 AWG ground wire has the same 0.0133 sq.in. area as a 12 AWG hot wire. Include all conductors in your calculations.'
    },
    {
      question: 'Can I mix wire types in the same conduit?',
      answer: 'Yes, but use the most restrictive requirements. Different insulation types have different areas - THHN is thinner than XHHW. When mixing, calculate total area for all wires. Also ensure all wires have compatible voltage ratings and temperature ratings for the application.'
    },
    {
      question: 'How many 12 AWG wires fit in 1/2" conduit?',
      answer: 'For 1/2" EMT conduit with 0.122 sq.in. area at 40% fill = 0.0488 sq.in. usable. Each 12 AWG THHN = 0.0133 sq.in. Maximum wires: 0.0488 ÷ 0.0133 = 3.67, round down to 3 wires. But code requires including grounds, so typically 2 current-carrying plus 1 ground, or 3 total 12 AWG THHN in 1/2" EMT.'
    }
  ],
  'ground-wire-calculator': [
    {
      question: 'What size ground wire do I need for a 100 amp circuit?',
      answer: 'Per NEC Table 250.122, a 100A circuit requires 8 AWG copper or 6 AWG aluminum equipment grounding conductor. This applies whether the circuit conductor is copper or aluminum. The ground wire size is based on the overcurrent device rating, not the circuit conductor size.'
    },
    {
      question: 'Can I use a smaller ground wire than the circuit conductors?',
      answer: 'Yes, equipment grounding conductors can be smaller than circuit conductors per Table 250.122. A 20A circuit uses 12 AWG circuit conductors but only requires 12 AWG ground. A 200A feeder might use 3/0 AWG conductors but only needs 6 AWG copper ground. This is safe because grounds only carry fault current briefly.'
    },
    {
      question: 'Do I need to upsize ground wire for voltage drop?',
      answer: 'No, equipment grounding conductors are not upsized for voltage drop. They are sized per Table 250.122 based on overcurrent protection. However, if circuit conductors are upsized for voltage drop, the ground must be proportionally increased per NEC 250.122(B). Example: 12 AWG increased to 10 AWG requires 10 AWG ground.'
    },
    {
      question: 'What is the difference between grounding and grounded conductors?',
      answer: 'Grounding conductor (green/bare) is the equipment ground for safety, carrying fault current to trip breakers. Grounded conductor (white/neutral) is a current-carrying conductor at ground potential, completing the circuit. Never use ground as neutral or neutral as ground - they serve different safety functions.'
    },
    {
      question: 'When do I need an insulated vs bare ground wire?',
      answer: 'Bare copper ground is acceptable in most applications. Insulated (green) ground is required where bare conductor could contact other conductors, in patient care areas, for isolated ground circuits, or where subject to physical damage. Some locations require green insulation for easier identification during maintenance.'
    }
  ],
  'circuit-breaker-calculator': [
    {
      question: 'How do I size a circuit breaker for a motor?',
      answer: 'Size motor breakers at 250% of Full Load Amps per NEC 430. For a motor with 10A FLA: 10 × 2.5 = 25A breaker maximum. Use time-delay breakers to handle starting current. Instantaneous trip breakers may be sized up to 800% (11 times) FLA for Design B motors if needed to avoid nuisance tripping.'
    },
    {
      question: 'What is the 80% breaker rule?',
      answer: 'Standard breakers must not be loaded over 80% continuously (3+ hours). A 20A breaker handles maximum 16A continuous load. For 18A continuous load, you need 18 ÷ 0.8 = 22.5A, so use 25A breaker. 100% rated breakers exist but require compatible panels and are typically used in commercial applications.'
    },
    {
      question: 'Can I replace a 15A breaker with a 20A breaker?',
      answer: 'Only if the wire is 12 AWG or larger and all devices are rated 20A. Never increase breaker size without verifying wire size first. 14 AWG wire is only rated for 15A and will overheat with a 20A breaker. This is a fire hazard and code violation. Always match breaker to wire ampacity.'
    },
    {
      question: 'What is the difference between Type B, C, and D breakers?',
      answer: 'Trip curves indicate instantaneous trip points: Type B trips at 3-5× rated current (residential), Type C at 5-10× (motors, transformers), Type D at 10-20× (high inrush loads). A 20A Type B trips instantly at 60-100A, Type C at 100-200A. Choose based on load characteristics to avoid nuisance tripping.'
    },
    {
      question: 'Do I need AFCI or GFCI breakers?',
      answer: 'AFCI required for bedrooms, living areas, and most 120V 15/20A circuits per NEC 210.12. GFCI required for bathrooms, kitchens, garages, outdoors, basements per 210.8. Some locations need both - use dual-function breakers. GFCI protects against shock, AFCI protects against arc faults/fires.'
    }
  ],
  'three-phase-calculator': [
    {
      question: 'How do I calculate three-phase power?',
      answer: 'Power = Voltage × Current × √3 × Power Factor. For 480V, 30A, PF=0.85: P = 480 × 30 × 1.732 × 0.85 = 21,207 watts. The √3 (1.732) factor accounts for the phase relationship. Use line-to-line voltage and line current. For balanced loads, all three phases carry equal current.'
    },
    {
      question: 'What is the difference between Delta and Wye connections?',
      answer: 'Delta has no neutral, line voltage = phase voltage, line current = √3 × phase current. Common: 240V, 480V. Wye has neutral point, line voltage = √3 × phase voltage, line current = phase current. Common: 208Y/120V, 480Y/277V. Wye allows single-phase loads, Delta typically for motors only.'
    },
    {
      question: 'How do I convert three-phase amps to kW?',
      answer: 'kW = (Volts × Amps × √3 × PF) ÷ 1000. Example: 100A at 480V, PF=0.85: kW = (480 × 100 × 1.732 × 0.85) ÷ 1000 = 70.7kW. For motors, this is input power. Output HP = (kW × 0.746) × efficiency. Remember to use line values, not phase values.'
    },
    {
      question: 'Can I run single-phase loads on three-phase power?',
      answer: 'Yes, connect single-phase loads line-to-line (Delta) or line-to-neutral (Wye). In 208Y/120V system, use 120V L-N for standard loads, 208V L-L for larger loads. Balance loads across phases to prevent voltage imbalance. Severely unbalanced loads can damage three-phase motors on the same system.'
    },
    {
      question: 'What wire size do I need for a 30 HP three-phase motor?',
      answer: '30 HP at 460V typically draws 40A (check nameplate). Per NEC, size wire at 125% FLA: 40 × 1.25 = 50A. Use 6 AWG copper (65A at 75°C) or 4 AWG aluminum. Include voltage drop calculations for long runs. Starter and overload protection sized separately per Article 430.'
    }
  ],
  'motor-circuit': [
    {
      question: 'How do I size conductors for a motor circuit?',
      answer: 'Size conductors at 125% of motor Full Load Amps per NEC 430.22. For 10 HP, 480V motor with 14A FLA: 14 × 1.25 = 17.5A minimum. Use 12 AWG copper (25A at 75°C). For multiple motors, use 125% of largest motor plus 100% of all others. Include voltage drop for long runs.'
    },
    {
      question: 'What size disconnect do I need for a motor?',
      answer: 'Motor disconnect must be at least 115% of FLA per NEC 430.110. For 14A motor: 14 × 1.15 = 16.1A minimum. Use 30A disconnect (standard size). Must be horsepower rated - a 10 HP motor needs 10 HP or greater switch. Disconnect must be within sight of motor or capable of being locked open.'
    },
    {
      question: 'How do I set motor overload protection?',
      answer: 'Set overloads at 115% of motor nameplate FLA for 1.15 service factor motors, 125% for 1.0 SF per NEC 430.32. For 14A motor with 1.15 SF: 14 × 1.15 = 16.1A. Overloads protect motor from overheating during running. Circuit breaker protects against short circuits and ground faults.'
    },
    {
      question: 'Can I use one breaker for multiple motors?',
      answer: 'Yes, per NEC 430.53 for group motor installation. Breaker sized for largest motor × 250% plus sum of other motor FLAs. Example: 10A + 5A + 5A motors: (10 × 2.5) + 5 + 5 = 35A breaker. Each motor still needs individual overload protection. Common in HVAC and machinery applications.'
    },
    {
      question: 'What is the difference between Design B, C, and D motors?',
      answer: 'Design B: Normal starting torque, low slip, general purpose (pumps, fans). Design C: High starting torque, normal slip (compressors, conveyors). Design D: Very high starting torque, high slip (punch presses, cranes). Design letter affects breaker sizing - Design B typically 250%, Design D may need 400% for starting current.'
    }
  ],
  'electrical-load-calculator': [
    {
      question: 'How do I calculate total electrical load for a house?',
      answer: 'Use NEC Article 220 method: 3VA/sq.ft. for general lighting, 1500VA per 20A small appliance circuit (minimum 2), 1500VA for laundry, nameplate ratings for fixed appliances. Apply demand factors: first 3kVA at 100%, next 117kVA at 35%. Example: 2000 sq.ft. home typically needs 100-150A service after calculations.'
    },
    {
      question: 'What is demand factor and how do I apply it?',
      answer: 'Demand factor accounts for non-simultaneous loads. Not all circuits run at full capacity simultaneously. NEC Table 220.42: Lighting first 3kVA at 100%, remainder at 35%. Table 220.55: Ranges 8kW or less at 80%. This prevents oversizing services. 100kVA connected load might only need 40kVA service after demand factors.'
    },
    {
      question: 'Do I need 200 amp or 400 amp service?',
      answer: 'Most modern homes need 200A. Consider 400A for: all-electric homes over 3000 sq.ft., multiple HVAC systems, electric vehicle charging, pools/hot tubs, home workshops. Calculate per NEC 220. 400A typically uses two 200A panels. Cost difference is significant - only upgrade if calculations show need.'
    },
    {
      question: 'How do I add load calculations for an EV charger?',
      answer: 'EV chargers are continuous loads - size at 125%. 40A charger = 50A circuit minimum. For load calculation: 40A × 240V = 9.6kW, apply as 12kW continuous. May push 150A service to need 200A upgrade. Consider load management systems to avoid service upgrade if marginal.'
    },
    {
      question: 'What is the 83% rule for existing services?',
      answer: 'For existing dwelling units, if calculated load exceeds 100A, you can apply 83% factor per NEC 220.83. This recognizes diversity in existing homes. New calculation: general loads at 100% first 10kVA, 40% remainder, plus AC/heat (larger), plus other loads. Often allows additions without service upgrade.'
    }
  ],
  'ev-charger-calculator': [
    {
      question: 'What size wire do I need for a Tesla Wall Connector?',
      answer: 'Tesla Wall Connector at maximum 48A output requires 60A circuit (125% continuous load rule). Use 6 AWG copper or 4 AWG aluminum minimum. For runs over 75 feet, consider 4 AWG copper to minimize voltage drop. Must include ground wire per Table 250.122 - 10 AWG copper ground for 60A circuit.'
    },
    {
      question: 'Can I use aluminum wire for EV charger installation?',
      answer: 'Yes, aluminum is safe and cost-effective for EV chargers. Use AA-8000 series aluminum with anti-oxidant compound. Size one gauge larger than copper. For 50A circuit: 6 AWG copper or 4 AWG aluminum. Many professional installations use aluminum for cost savings on long runs. Ensure proper torque specifications.'
    },
    {
      question: 'What is the difference between Level 1 and Level 2 charging?',
      answer: 'Level 1 uses standard 120V outlet, provides 3-5 miles range per hour charging. Level 2 uses 240V, provides 15-45 miles per hour. Level 2 requires dedicated circuit: minimum 32A (20 mi/hr) up to 80A (45+ mi/hr). Most homes install 50A NEMA 14-50 outlet or hardwired 48-60A charger for flexibility.'
    },
    {
      question: 'Do I need a disconnect for my EV charger?',
      answer: 'Hardwired chargers need a disconnect within sight or circuit breaker capable of being locked off per NEC 625.43. Plug-in chargers (NEMA 14-50) do not require separate disconnect - unplugging serves as disconnect. Some areas require exterior disconnect for emergency responder access.'
    },
    {
      question: 'How much will an EV charger increase my electric bill?',
      answer: 'Average EV drives 12,000 miles/year at 3-4 miles/kWh = 3,000-4,000 kWh annually. At $0.12/kWh = $360-480/year or $30-40/month. Compare to gas: 12,000 miles at 25 MPG = 480 gallons × $3.50 = $1,680/year. EVs save $1,200+ annually. Time-of-use rates can reduce costs 30-50% more.'
    }
  ],
  'hot-tub-calculator': [
    {
      question: 'What size breaker do I need for a hot tub?',
      answer: 'Most hot tubs require 40-60A breaker at 240V. Check nameplate for exact requirements. Common configurations: 50A for most 220-240V spas, 60A for large or high-jet-count models, 30A for smaller 2-person units. Must be GFCI protected per NEC 680.42. Use 2-pole GFCI breaker or GFCI disconnect at equipment.'
    },
    {
      question: 'How far does the disconnect need to be from the hot tub?',
      answer: 'Disconnect must be at least 5 feet from hot tub water edge but within sight, typically maximum 50 feet per NEC 680.41. Mount 4-5 feet high for accessibility but out of reach from water. If closer than 5 feet, it could be reached by someone in water (electrocution hazard). Beyond sight distance reduces emergency response.'
    },
    {
      question: 'Can I use standard wire for hot tub wiring?',
      answer: 'Use THWN-2 rated wire for wet locations. Wire must be in conduit outdoors, buried 18" minimum (6" if in rigid metal conduit). Cannot use NM (Romex) outdoors or in conduit. For 50A circuit: 6 AWG THWN-2 copper or 4 AWG aluminum. Include insulated ground wire, not bare copper in wet locations.'
    },
    {
      question: 'Do I need to bond the hot tub water?',
      answer: 'Yes, NEC 680.26 requires equipotential bonding. Bond all metal within 5 feet of water including rails, ladders, reinforcing steel, metal piping. Use 8 AWG solid copper bonding conductor minimum. This prevents voltage gradients that could cause shock. Critical safety requirement often missed by DIY installations.'
    },
    {
      question: 'What is the typical power consumption of a hot tub?',
      answer: 'Hot tubs use 3-7.5kW for heating, 0.5-2kW for pumps. Monthly cost: $20-50 depending on climate, usage, and efficiency. 5kW heater running 3 hours daily = 450 kWh/month × $0.12 = $54. Covers save 50-70% heating cost. Modern efficient models with good insulation use less. Consider time-of-use electric rates.'
    }
  ],
  'pool-pump-calculator': [
    {
      question: 'What size wire for a 2 HP pool pump?',
      answer: '2 HP, 240V single-phase pump typically draws 10-12A. Size wire at 125% = 15A minimum. Use 12 AWG copper for runs under 100 feet, 10 AWG for longer runs to limit voltage drop. Must include insulated equipment grounding conductor. Install GFCI protection per NEC 680. Use THWN-2 wire for wet locations.'
    },
    {
      question: 'Does a pool pump require GFCI protection?',
      answer: 'Yes, NEC 680.21 requires GFCI protection for all pool pump motors. Use GFCI breaker in panel or GFCI disconnect at equipment. Test monthly - pool chemicals and moisture commonly cause GFCI trips. Nuisance tripping may indicate ground fault developing. Never remove GFCI protection - drowning hazard.'
    },
    {
      question: 'Can I put my pool pump on a timer?',
      answer: 'Yes, use a timer rated for motor loads (2× HP rating minimum). 2 HP pump needs 40A rated timer contacts. Digital timers offer multiple on/off cycles for better filtration efficiency. Run pump 8-12 hours daily in season. Variable speed pumps with built-in timers save 70% on energy costs versus single-speed.'
    },
    {
      question: 'What is the benefit of a variable speed pool pump?',
      answer: 'Variable speed pumps save 70-90% energy over single-speed. Low speed for filtration (1750 RPM) uses 250W vs 2000W at high speed. Program high speed for vacuuming only. Typical payback 1-2 years. Quieter operation, longer equipment life. Many utilities offer rebates. Now required in some states for new installations.'
    },
    {
      question: 'How do I calculate pool pump energy cost?',
      answer: 'Single-speed 1.5 HP pump uses ~1800W. Running 10 hours daily: 1.8kW × 10hr × 30days = 540 kWh/month × $0.12 = $65/month. Variable speed at low setting: 250W × 10hr × 30 = 75 kWh = $9/month. Annual savings: $670. Timer optimization saves 20-30%. Oversized pumps waste significant energy.'
    }
  ],
  'welder-calculator': [
    {
      question: 'What size outlet for a 240V welder?',
      answer: 'Common welder outlets: NEMA 6-50 (50A) for most 220-250V welders, NEMA 14-50 (50A) if neutral needed, NEMA 6-30 (30A) for smaller welders. Match outlet to welder plug. 50A outlet needs 6 AWG copper wire and 50A 2-pole breaker. Some welders can use standard 30A dryer outlet (14-30) with adapter.'
    },
    {
      question: 'How do I calculate welder circuit requirements?',
      answer: 'Check welder nameplate for input current at rated output. Size circuit at 100% for hobby use (intermittent), 125% for production use (continuous). Example: 30A input welder, hobby use = 30A circuit with 10 AWG wire. Production use = 38A minimum, use 40A circuit with 8 AWG wire.'
    },
    {
      question: 'Can I run a welder on a 100 amp subpanel?',
      answer: 'Yes, most home welders work fine on 100A subpanel. 30-50A welder leaves 50-70A for other loads. Consider duty cycle - hobby welding is intermittent load. Avoid running welder simultaneously with large loads (AC, electric heat). Professional shops may need 200A+ service for multiple welders or plasma cutters.'
    },
    {
      question: 'What is duty cycle and how does it affect power needs?',
      answer: 'Duty cycle is percentage of 10 minutes welder can operate. 60% duty cycle = 6 minutes on, 4 minutes cool down. Higher duty cycle needs better power supply. 200A welder at 60% duty cycle has average current much less than 200A input. Home welders typically 20-40% duty cycle, industrial 60-100%.'
    },
    {
      question: 'Do I need a special breaker for a welder?',
      answer: 'Standard thermal-magnetic breaker works for most welders. High frequency start TIG welders may need high-magnetic (HID) breaker to prevent nuisance trips. Time-delay breakers help with initial arc strike surge. Size per nameplate input current. Ensure breaker interrupting capacity (AIC) matches available fault current.'
    }
  ],
  'dryer-calculator': [
    {
      question: 'What size wire for an electric dryer?',
      answer: 'Most residential dryers need 30A circuit with 10 AWG copper or 8 AWG aluminum wire. Use 4-wire circuit (two hots, neutral, ground) for new installations per NEC. 3-wire (no ground) only allowed for existing installations. NEMA 14-30 outlet for 4-wire, 10-30 for old 3-wire. Maximum 5500W heating element typical.'
    },
    {
      question: 'Can I use a 3-prong or 4-prong dryer outlet?',
      answer: 'New installations require 4-prong (NEMA 14-30) with separate ground per NEC 250.140. Existing 3-prong (10-30) can remain if circuit originates from main panel. Never remove ground pin or bootleg ground to neutral. When moving to new home, change dryer cord to match outlet - both configurations are safe when properly installed.'
    },
    {
      question: 'How much power does an electric dryer use?',
      answer: 'Electric dryers use 2000-5500W. Average 3000W for one hour per load. At $0.12/kWh = $0.36 per load. Gas dryers use only 300-600W for motor/controls but require gas connection. Annual cost: 300 loads × $0.36 = $108 electric vs $40 gas plus fuel. Heat pump dryers use 40-50% less electricity.'
    },
    {
      question: 'Can I convert a gas dryer to electric?',
      answer: 'You cannot convert the dryer itself - they are completely different designs. You can install electric service for electric dryer: run 30A, 240V circuit with 10 AWG wire and NEMA 14-30 outlet. Gas dryers only need standard 120V outlet for controls. Consider operating cost difference before switching from gas.'
    },
    {
      question: 'Why does my dryer trip the breaker?',
      answer: 'Common causes: Restricted vent causing overheating, failed heating element shorting to ground, worn motor drawing excess current, loose connection creating resistance/heat, undersized or weak breaker, moisture in outlet or connections. Check vent first - clogged vents cause 15,000 dryer fires annually. Never increase breaker size without checking wire.'
    }
  ],
  'range-calculator': [
    {
      question: 'What size wire for an electric range?',
      answer: 'Most residential ranges need 40-50A circuit. 40A range: 8 AWG copper or 6 AWG aluminum. 50A range: 6 AWG copper or 4 AWG aluminum. Use 4-wire circuit with NEMA 14-50 outlet for 50A or 14-40 for 40A. NEC Table 220.55 allows demand factors for ranges 8.75kW or less. Check nameplate for actual requirements.'
    },
    {
      question: 'Can I use a 40A breaker for a 50A range?',
      answer: 'Check range nameplate. If rated 12kW or less, NEC Table 220.55 Column C allows 40A circuit (9.6kW calculated load). Ranges over 12kW need actual calculated load, often requiring 50A. Many modern ranges work on 40A despite 50A outlet - they limit power internally. Never exceed nameplate requirements.'
    },
    {
      question: 'What is the difference between 3-wire and 4-wire range circuits?',
      answer: 'Old 3-wire: two hots and neutral (neutral doubles as ground). New 4-wire: two hots, neutral, and separate ground. NEC requires 4-wire for new installations since 1996. Separate ground prevents shock hazard if neutral fails. Existing 3-wire can remain but change to 4-wire during kitchen remodels for safety.'
    },
    {
      question: 'How much electricity does an electric range use?',
      answer: 'Ranges use 2000-5000W while cooking. Annual average: 500 kWh costing $60. Oven at 350°F uses 2500W cycling on/off. Large burner uses 2500W on high. Self-cleaning cycle uses 5000W for 3-4 hours. Induction ranges are 85% efficient vs 65% for standard electric, saving 20% energy. Gas ranges use minimal electricity.'
    },
    {
      question: 'Can I install a commercial range in my home?',
      answer: 'Commercial ranges often require different power: 208V three-phase or higher amperage. Residential has 240V split-phase. May need service upgrade, special wiring, commercial hood ventilation. Check local codes - some prohibit commercial equipment in residences. Gas commercial ranges may exceed residential BTU limits. Consult electrician and code official first.'
    }
  ],
  'garage-subpanel-calculator': [
    {
      question: 'What size wire for a 100A subpanel in detached garage?',
      answer: 'For 100A subpanel, use 1 AWG copper or 2/0 AWG aluminum for the feeder. For runs over 150 feet, consider upsizing to 1/0 AWG copper or 3/0 aluminum for voltage drop. Need 4 wires: two hots, neutral, ground. Detached buildings require separate ground rod system per NEC 250.32 plus equipment ground wire from main panel.'
    },
    {
      question: 'Do I need a disconnect at a detached garage?',
      answer: 'Yes, NEC 225.31 requires disconnect at detached building. Can be the subpanel main breaker if rated for service entrance use, or separate disconnect before panel. Must be nearest point of entrance. Exception: single circuit to garage doesn\'t need disconnect if breaker at main house can be locked off.'
    },
    {
      question: 'How deep do I bury wire to detached garage?',
      answer: 'Direct burial cable (UF): 24" deep. PVC conduit: 18" deep. Rigid metal conduit: 6" deep. Under driveways add 6" depth. Install warning tape 12" above cable. Consider future needs - installing larger conduit now allows easy wire upgrades later. Always call 811 before digging to locate utilities.'
    },
    {
      question: 'Can I run a 60A subpanel for a garage workshop?',
      answer: '60A adequate for most garage workshops. Handles table saw (15A), dust collector (10A), lights (5A), outlets (20A) simultaneously. Use 4 AWG copper or 2 AWG aluminum feeder. For welder or large compressor, consider 100A. Calculate actual loads - diversity means not everything runs simultaneously.'
    },
    {
      question: 'Do I need ground rods at a detached garage subpanel?',
      answer: 'Yes, detached structures need local grounding electrode system per NEC 250.32. Install two ground rods 6 feet apart or one rod plus water pipe bond if available. Connect to neutral bus (bonded at disconnect only). Also run equipment ground wire from main panel. Never bond neutral and ground together except at first disconnect.'
    }
  ],
  'rv-hookup-calculator': [
    {
      question: 'What size wire for 50 amp RV outlet?',
      answer: '50A RV outlet (NEMA 14-50) needs 6 AWG copper or 4 AWG aluminum minimum. For runs over 100 feet, upsize to 4 AWG copper or 2 AWG aluminum for voltage drop. Use 4-wire cable: two hots, neutral, ground. Install GFCI breaker if outlet is outdoors or in garage per NEC 210.8.'
    },
    {
      question: 'What is the difference between 30A and 50A RV service?',
      answer: '30A RV uses TT-30 outlet with 120V single-phase (3,600W capacity). 50A RV uses 14-50 outlet with 240V split-phase (12,000W capacity, but RV typically uses as two 120V legs). 30A for smaller trailers, 50A for large motorhomes with dual AC units. Adapters available but limit power to smaller service rating.'
    },
    {
      question: 'Can I plug my RV into a dryer outlet?',
      answer: 'No, dryer outlets are typically 30A NEMA 14-30 (different configuration) and may not have compatible grounding. RVs need NEMA 14-50 (50A) or TT-30 (30A). Using wrong outlet risks damage to RV electrical system. Install proper RV outlet instead. Some old dryers use 3-wire outlets lacking separate ground - never use for RV.'
    },
    {
      question: 'Do I need GFCI protection for RV outlet?',
      answer: 'NEC 210.8 requires GFCI for 125V, 30A or less outlets in garages and outdoors, so 30A RV outlets need GFCI. 50A/240V outlets didn\'t require GFCI until 2020 NEC. Check local adoption - many areas now require GFCI for all RV outlets. Use GFCI breaker since GFCI outlets not available in 50A.'
    },
    {
      question: 'How do I calculate load for multiple RV hookups?',
      answer: 'NEC 551.73: First pedestal at 100%, second at 90%, third at 80%, fourth at 70%, remainder at 60%. For four 50A pedestals: 50A + 45A + 40A + 35A = 170A total calculated load. This diversity factor recognizes not all RVs draw maximum power simultaneously. Size service and feeders accordingly.'
    }
  ],
  'kva-to-amps-calculator': [
    {
      question: 'How do I convert kVA to amps for three-phase systems?',
      answer: 'For three-phase: Amps = (kVA × 1000) ÷ (Volts × √3). Example: 100 kVA at 480V three-phase: (100 × 1000) ÷ (480 × 1.732) = 120A per phase. Note kVA is apparent power (includes reactive power), different from kW (real power). For actual power, multiply by power factor: kW = kVA × PF.'
    },
    {
      question: 'What is the difference between kVA and kW?',
      answer: 'kVA (kilovolt-amperes) is apparent power - total power supplied. kW (kilowatts) is real power - actual work performed. kW = kVA × Power Factor. For resistive loads (PF=1), kVA = kW. For motors/transformers (PF=0.8), 100 kVA = 80 kW. Generators rated in kVA, utilities bill in kW, transformers sized in kVA.'
    },
    {
      question: 'How do I size a transformer in kVA?',
      answer: 'Calculate connected load in VA, apply demand factors, add 25% growth factor. Example: 200A at 480V three-phase = 200 × 480 × 1.732 = 166 kVA connected. With 80% demand factor = 133 kVA. Add 25% growth = 166 kVA. Select standard 225 kVA transformer for headroom and better efficiency at partial load.'
    },
    {
      question: 'Why are generators rated in kVA instead of kW?',
      answer: 'Generators produce apparent power (kVA) - the power factor depends on the connected load, not the generator. A 100 kVA generator provides 100 kW at PF=1.0 (resistive loads) but only 80 kW at PF=0.8 (typical mixed loads). Generator windings sized for current (relates to kVA), not real power consumed.'
    },
    {
      question: 'How do I convert single-phase kVA to amps?',
      answer: 'For single-phase: Amps = (kVA × 1000) ÷ Volts. Example: 10 kVA at 240V single-phase: (10 × 1000) ÷ 240 = 41.7A. This gives current at full rated kVA. Actual current depends on loading percentage. Transformers typically loaded to 80% for efficiency and longevity: 41.7 × 0.8 = 33.4A typical operation.'
    }
  ],
  'kilowatts-to-amps-calculator': [
    {
      question: 'How do I convert kilowatts to amps?',
      answer: 'For single-phase AC: Amps = (kW × 1000) ÷ (Volts × PF). For three-phase: Amps = (kW × 1000) ÷ (Volts × √3 × PF). Example: 10kW at 240V single-phase, PF=0.9: (10 × 1000) ÷ (240 × 0.9) = 46.3A. Remember kW is real power, so power factor is already accounted for in motor nameplate kW ratings.'
    },
    {
      question: 'What size wire for a 10kW electric heater?',
      answer: 'Resistive heater has PF=1.0. At 240V: 10,000W ÷ 240V = 41.7A. Size at 125% for continuous load: 41.7 × 1.25 = 52A. Use 6 AWG copper (65A) or 4 AWG aluminum. At 480V: only 20.8A, use 10 AWG. Higher voltage significantly reduces wire size and cost for same power.'
    },
    {
      question: 'How many amps does a 5kW generator produce?',
      answer: 'Depends on voltage and phase. At 120V single-phase: 5000W ÷ 120V = 41.7A maximum. At 240V single-phase: 20.8A. At 240V three-phase: 5000W ÷ (240 × 1.732) = 12A per phase. Most 5kW portables provide 41.7A at 120V or 20.8A at 240V. Check specific model for actual outlet configurations.'
    },
    {
      question: 'How do I convert motor kW to electrical amps?',
      answer: 'Motor nameplate kW is mechanical output. Electrical input = kW output ÷ efficiency. Example: 10kW motor, 90% efficient, PF=0.85 at 480V three-phase: Input = 10 ÷ 0.90 = 11.1kW electrical. Amps = (11.1 × 1000) ÷ (480 × 1.732 × 0.85) = 15.7A. Always check nameplate FLA for actual current.'
    },
    {
      question: 'What is the relationship between kW, HP, and amps?',
      answer: '1 HP = 0.746 kW mechanical power. For motors, electrical kW = (HP × 0.746) ÷ efficiency. Example: 10 HP motor at 90% efficiency = (10 × 0.746) ÷ 0.9 = 8.29 kW input. At 240V, PF=0.85: Amps = (8290W) ÷ (240 × 0.85) = 40.6A. Nameplate FLA includes these conversions.'
    }
  ],
  'horsepower-to-amps-calculator': [
    {
      question: 'How many amps does a 5 HP motor draw?',
      answer: '5 HP at 240V single-phase typically draws 28A, at 480V three-phase draws 6.1A per NEC Table 430.250. Actual current varies with efficiency and power factor. Starting current is 4-8× running current. Size wire at 125% FLA: 28A × 1.25 = 35A, use 8 AWG copper. Always verify with motor nameplate.'
    },
    {
      question: 'Why do motor nameplates show different amps than calculations?',
      answer: 'Nameplate shows actual tested Full Load Amps including specific motor efficiency and power factor. NEC tables show typical values for code calculations. A high-efficiency motor draws less current than standard. Example: Standard 5 HP = 28A, high-efficiency = 24A. Use nameplate for overloads, NEC tables for wire/breaker sizing.'
    },
    {
      question: 'How do I convert HP to amps for three-phase motors?',
      answer: 'Use NEC Table 430.250 or calculate: Amps = (HP × 746) ÷ (Volts × √3 × Efficiency × PF). Example: 10 HP, 480V, 90% eff, 0.85 PF: (10 × 746) ÷ (480 × 1.732 × 0.90 × 0.85) = 11.7A. Table shows 14A (conservative for wire sizing). Actual nameplate typically between calculated and table values.'
    },
    {
      question: 'What is service factor and how does it affect motor current?',
      answer: 'Service factor (SF) is overload capacity. 1.15 SF motor can run continuously at 115% rated HP. At overload, draws proportionally more current. 10 HP motor with 1.15 SF can operate as 11.5 HP but draws 15% more current and runs hotter. Size overloads for nameplate FLA, not service factor load.'
    },
    {
      question: 'Do variable speed drives (VFDs) change motor current?',
      answer: 'VFDs reduce current at reduced speeds/loads. Motor at 50% speed uses approximately 12.5% power (cube law for fans/pumps). However, size conductors for full nameplate current - motor may run at full speed. VFD input current includes harmonic distortion - may need oversized conductors. Consult VFD manufacturer for specific requirements.'
    }
  ],
  'btu-to-watts-calculator': [
    {
      question: 'How do I convert BTU to watts?',
      answer: 'Watts = BTU/hr ÷ 3.412. Example: 12,000 BTU/hr AC = 12,000 ÷ 3.412 = 3,517 watts cooling capacity. Note this is thermal output, not electrical input. The electrical consumption depends on efficiency (EER/COP). A 12,000 BTU unit with EER 10 uses 1,200W electrical input.'
    },
    {
      question: 'What is the difference between BTU and watts?',
      answer: 'BTU/hr measures thermal power (heating/cooling capacity). Watts measure electrical power consumed. AC units show both: 12,000 BTU/hr cooling output might use 1,200W electrical input. Efficiency = BTU output ÷ watts input × 3.412. Higher efficiency means more BTUs per watt consumed.'
    },
    {
      question: 'How many watts does a 5000 BTU window AC use?',
      answer: '5000 BTU window AC typically uses 400-550W electrical power, depending on efficiency. EER 10: 5000 ÷ 10 = 500W. EER 12: 5000 ÷ 12 = 417W. Older units (EER 8) use 625W. This is running watts - starting surge can be 2-3× higher. Size circuit for 125% of running current.'
    },
    {
      question: 'How do I calculate heating cost from BTU rating?',
      answer: 'For electric heat: BTU/hr = Watts × 3.412. 5kW heater = 17,060 BTU/hr. Cost = kW × hours × rate. For gas: 100,000 BTU furnace at 80% efficiency delivers 80,000 BTU. Uses 100 cubic feet/hour. At $1/therm: $1/hour. Electric resistance heat is 100% efficient but costs 2-4× more than gas per BTU.'
    },
    {
      question: 'What is SEER vs EER for AC efficiency?',
      answer: 'EER = BTU/hr ÷ watts at specific conditions (95°F). SEER = seasonal average including part-load operation. SEER 13 ≈ EER 11. Higher is better. SEER 16 uses 23% less power than SEER 13. New standards: SEER 14 minimum (South), SEER 13 (North). Mini-splits achieve SEER 20-30 for maximum efficiency.'
    }
  ],
  'volts-to-amps-calculator': [
    {
      question: 'How do I calculate amps from voltage and power?',
      answer: 'Amps = Watts ÷ Volts for DC and single-phase AC with PF=1. For AC with power factor: Amps = Watts ÷ (Volts × PF). Example: 1200W at 120V = 10A for resistive load. With PF=0.85: 1200 ÷ (120 × 0.85) = 11.8A. For three-phase: Amps = Watts ÷ (Volts × √3 × PF).'
    },
    {
      question: 'How do I use Ohms Law to find current from voltage?',
      answer: 'Using Ohms Law: I = V ÷ R (Current = Voltage ÷ Resistance). Example: 120V across 10Ω = 12A. For AC circuits, use impedance (Z) instead of resistance. This method works when you know circuit resistance/impedance. For power-based calculations, use P = V × I rearranged to I = P ÷ V.'
    },
    {
      question: 'What happens to current when voltage changes?',
      answer: 'For resistive loads, current changes proportionally with voltage (Ohms Law). Doubling voltage doubles current. For constant power loads (motors, switching power supplies), current inversely relates to voltage - doubling voltage halves current. This is why high voltage transmission reduces current and wire size.'
    },
    {
      question: 'How do I calculate starting current for motors?',
      answer: 'Motor starting current is not calculated from voltage alone - it depends on motor design. Typical starting current = 4-8× Full Load Amps. Check motor Code Letter: Code G = 5.6-6.29× FLA. Example: 10A FLA motor, Code G starts at 56-63A. Use for breaker selection but not conductor sizing.'
    },
    {
      question: 'Why does lower voltage increase current for the same power?',
      answer: 'Power = Voltage × Current. For constant power, current and voltage are inversely related. 1200W at 120V = 10A, but at 240V = 5A. This is why 240V circuits need smaller wire than 120V for same power. Motors at low voltage draw excess current, overheat, and may fail to start.'
    }
  ],
  'box-fill-calculator': [
    {
      question: 'How do I calculate electrical box fill?',
      answer: 'Per NEC 314.16: Count each hot and neutral as one conductor. All grounds together = one conductor. All internal cable clamps = one. Each device (switch/outlet) = two. Multiply count by wire volume from Table 314.16(B): 14 AWG = 2 cu.in., 12 AWG = 2.25 cu.in. Total must not exceed box volume from Table 314.16(A).'
    },
    {
      question: 'What size junction box for six 12 AWG wires?',
      answer: 'Six 12 AWG conductors + 1 for grounds + 1 for clamps = 8 conductor units × 2.25 cu.in. = 18 cu.in. minimum. Use 4" square box (21 cu.in.) or 4-11/16" square (30.3 cu.in.). Octagon boxes too small. Deep boxes provide more room. Remember devices count as 2 conductors each if present.'
    },
    {
      question: 'Do wire nuts count toward box fill?',
      answer: 'No, wire nuts (wire connectors) do not count toward box fill calculations. Only conductors, devices, clamps, and fittings count per NEC 314.16. However, wire nuts take physical space - overcrowded boxes make connections difficult and unsafe even if they meet code calculations. Use larger boxes when multiple splices needed.'
    },
    {
      question: 'How many outlets can I put in a 2-gang box?',
      answer: 'Two outlets fit physically but check box fill. Each device = 2 conductors worth of fill. Standard 2-gang box = 2 × single gang volumes. With 14 AWG: 4 hots + 4 neutrals + 1 ground + 4 for devices = 13 units × 2 cu.in. = 26 cu.in. needed. Standard 2-gang (20.3-24 cu.in.) is too small - use deep 2-gang box.'
    },
    {
      question: 'Can I use extension rings to increase box capacity?',
      answer: 'Yes, extension rings add volume. 4" square extension (1-1/2" deep) adds 21 cu.in. Calculate total as box volume plus extension volume. Useful for adding devices to existing boxes. Must maintain proper wall depth - device faces should be flush with finished wall. Stack multiple extensions if needed for capacity.'
    }
  ],
  'wire-resistance-calculator': [
    {
      question: 'How do I calculate wire resistance?',
      answer: 'Resistance = (ρ × Length) ÷ Area. For copper: R(ohms) = (10.4 × Length in feet) ÷ Circular mils. Example: 100ft of 12 AWG (6,530 cmils): R = (10.4 × 100) ÷ 6,530 = 0.159Ω. For round-trip circuit, double the length. Tables provide resistance per 1000ft. Temperature affects resistance - increases 0.393% per °C for copper.'
    },
    {
      question: 'Why does wire gauge affect resistance?',
      answer: 'Larger gauge number = smaller wire = higher resistance. AWG sizes decrease logarithmically - each 3 AWG numbers doubles/halves resistance. 12 AWG has 2× resistance of 9 AWG. Resistance inversely proportional to cross-sectional area. Doubling diameter gives 4× area and 1/4 resistance. This is why larger wires have less voltage drop.'
    },
    {
      question: 'How does temperature affect wire resistance?',
      answer: 'Conductor resistance increases with temperature. Copper: +0.393% per °C. Aluminum: +0.403% per °C. Wire at 75°C has 20% higher resistance than at 20°C. This reduces ampacity at higher temperatures. Voltage drop calculations should use resistance at operating temperature, not just ambient. Hot wires waste more power.'
    },
    {
      question: 'What is skin effect in AC circuits?',
      answer: 'At high frequencies, AC current concentrates near conductor surface, effectively reducing usable area and increasing resistance. Negligible at 60Hz for sizes below 300 MCM. Becomes significant for large conductors or high frequencies. This is why high-frequency applications use stranded wire or hollow conductors to maximize surface area.'
    },
    {
      question: 'How do I calculate power loss from wire resistance?',
      answer: 'Power Loss = I² × R. Example: 20A through 0.2Ω resistance: 20² × 0.2 = 80W lost as heat. For 100ft 12 AWG round-trip (0.32Ω): 20² × 0.32 = 128W loss. At $0.12/kWh running 10 hours daily: 0.128kW × 10hr × 365 × $0.12 = $56/year wasted. Larger wire reduces losses.'
    }
  ],
  'low-voltage-calculator': [
    {
      question: 'What wire size for 12V LED landscape lighting?',
      answer: 'Calculate voltage drop carefully - 10% of 12V is only 1.2V. For 100W load (8.3A) at 100ft: Use voltage drop formula with 10% maximum. Typically need 10 AWG for 100ft run. LED fixtures are voltage-sensitive - excessive drop causes dimming or failure. Consider multiple home runs instead of daisy-chaining for long distances.'
    },
    {
      question: 'How do I minimize voltage drop in low voltage systems?',
      answer: 'Use larger wire (main cost in low voltage), reduce run length with multiple home runs, increase system voltage (24V instead of 12V), locate transformer centrally, use loop wiring for even distribution. For critical applications like LED strips, limit drop to 5%. Calculate for actual current, not transformer rating.'
    },
    {
      question: 'What is the difference between magnetic and electronic low voltage transformers?',
      answer: 'Magnetic (core and coil) transformers are heavy, reliable, work with all dimmer types, handle overloads well. Electronic (switching) transformers are lightweight, efficient, but may have compatibility issues with LED loads and dimmers. Electronic types may require minimum loads. Magnetic preferred for landscape lighting durability.'
    },
    {
      question: 'Can I bury low voltage wire directly?',
      answer: 'Yes, low voltage landscape wire can be direct buried 6" deep per NEC 300.5 for 30V or less. Use outdoor-rated cable (SPT-3, UF). Not required in conduit but protects from damage. Under driveways use conduit. Low voltage doesn\'t require GFCI protection but primary side (120V) of transformer does if outdoors.'
    },
    {
      question: 'How do I calculate voltage drop for 24V systems?',
      answer: 'Same formula but percentage is less critical. 10% of 24V = 2.4V acceptable drop vs 1.2V for 12V. This allows smaller wire or longer runs. Example: 5A load, 200ft, 10% drop: 12V needs 10 AWG, 24V needs 14 AWG. Many installers prefer 24V for runs over 75ft. Check fixture voltage range compatibility.'
    }
  ],
  'service-entrance-calculator': [
    {
      question: 'What size service entrance cable for 200 amp service?',
      answer: 'For 200A residential service: 2/0 AWG copper or 4/0 AWG aluminum service entrance cable typically used. Some utilities require 3/0 copper or 250 MCM aluminum for voltage drop. URD (underground) aluminum is common - 4/0-4/0-2/0 aluminum (two hots at 4/0, neutral at 2/0). Always verify with local utility requirements.'
    },
    {
      question: 'What is the difference between service entrance cable types?',
      answer: 'SE-U: Above ground service entrance with bare concentric neutral. SE-R: Above ground with insulated neutral for wet locations. Mobile home feeder (4-wire) has insulated neutral and ground. URD: Underground aluminum, direct burial rated. Each has specific applications. Local codes may restrict types - some areas prohibit SE cable inside structures.'
    },
    {
      question: 'How do I calculate residential service size?',
      answer: 'Use NEC Article 220 standard calculation: General lighting 3VA/sq.ft., two small appliance circuits at 1500VA each, laundry 1500VA, apply demand factors, add major appliances at nameplate. Optional calculation (220.82): 100% first 10kVA plus 40% remainder. Most 2000+ sq.ft. homes need 200A. All-electric or large homes may need 400A.'
    },
    {
      question: 'Do I need 100, 150, or 200 amp service?',
      answer: '100A: Minimum for modern homes, adequate for gas heat/appliances, small homes. 150A: Good for average homes with some electric appliances, single AC unit. 200A: Standard for new construction, all-electric homes, multiple AC units, future EV charging. 400A: Large all-electric homes, dual AC systems, workshop, pool, EV charging. Calculate loads to verify.'
    },
    {
      question: 'What size ground wire for service entrance?',
      answer: 'Grounding electrode conductor sized per NEC Table 250.66: 100A service: 8 AWG copper. 200A service: 4 AWG copper to ground rod, 2 AWG if connecting to water pipe. 400A service: 1/0 AWG copper. Aluminum GEC must be larger. Connect to all available electrodes: ground rods, water pipe, concrete-encased electrode (rebar).'
    }
  ],
  'residential-load-calculator': [
    {
      question: 'How do I calculate total electrical load for my house?',
      answer: 'Per NEC 220: General lighting = sq.ft. × 3VA. Small appliance circuits = 2 × 1500VA. Laundry = 1500VA. Add all fastened appliances (water heater, AC, range, dryer) at nameplate rating. Apply demand factors from tables. First 3kVA at 100%, next 117kVA at 35%. Most 2000 sq.ft. homes calculate to 100-150A after demand factors.'
    },
    {
      question: 'What are demand factors in residential load calculations?',
      answer: 'Demand factors recognize not all loads operate simultaneously. NEC Table 220.42: Lighting first 3kVA at 100%, remainder at 35%. Table 220.54: Dryers - multiple units derate. Table 220.55: Ranges under 8.75kW can use 8kW. These prevent oversizing services. Without demand factors, a typical home would need 400A+ service.'
    },
    {
      question: 'How does solar affect my load calculation?',
      answer: 'Solar doesn\'t reduce NEC service size calculation - size for total connected load. However, solar can offset utility demand. 10kW solar array produces ~40kWh/day, offsetting significant usage. Net metering allows selling excess. Main panel must handle backfeed current - may need main breaker reduction or line-side tap for solar connection.'
    },
    {
      question: 'Should I plan for future electric vehicle charging?',
      answer: 'Yes, include EV charger in load calculations even if not immediate. Level 2 charger needs 40-80A circuit (continuous load). This often pushes 150A service to need 200A upgrade. Installing 200A service initially costs marginally more than 150A. Upgrading later costs significantly more. Consider load management systems if marginal.'
    },
    {
      question: 'How do I know if my electrical service is adequate?',
      answer: 'Check main breaker size (100A, 200A, etc.). Calculate actual loads per NEC 220. Monitor peak demand with clamp meter over time. Warning signs of inadequate service: Lights dim when large appliances start, breaker trips when multiple items run, unable to add new circuits. Most homes built before 1990 have inadequate service for modern loads.'
    }
  ]
};