const OpenAI = require("openai");

// Initialize OpenAI client only if API key is available
let openai = null;
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

/**
 * Generate AI explanation for an error code
 * @param {string} errorCode - The error code (e.g., 'P0300')
 * @param {string} description - The error description
 * @param {string} vehicleMake - The vehicle make (e.g., 'Volkswagen')
 * @param {string} vehicleModel - The vehicle model (e.g., 'Golf')
 * @returns {Promise<string>} - AI-generated explanation
 */
async function generateAIExplanation(
  errorCode,
  description,
  vehicleMake,
  vehicleModel
) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      console.warn(
        "OpenAI API key not configured, returning default explanation"
      );
      return generateDefaultExplanation(errorCode, description);
    }

    const prompt = `You are an expert automotive technician specializing in VAG Group vehicles (Volkswagen, Audi, Porsche, Skoda, Seat, Fiat).

Please provide a detailed, professional explanation for the following error code:

Error Code: ${errorCode}
Description: ${description}
Vehicle: ${vehicleMake} ${vehicleModel}

Please provide:
1. A clear explanation of what this error means in simple terms
2. Common causes specific to VAG vehicles
3. Potential symptoms the driver might experience
4. General repair recommendations
5. Safety considerations

Keep the explanation professional but accessible to both mechanics and vehicle owners. Focus on VAG-specific information and common issues with these brands.

Format your response in clear paragraphs with bullet points where appropriate.`;

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are an expert automotive technician with deep knowledge of VAG Group vehicles and diagnostic systems.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    return (
      completion.choices[0]?.message?.content?.trim() ||
      generateDefaultExplanation(errorCode, description)
    );
  } catch (error) {
    console.error("OpenAI API error:", error);

    // Return default explanation on API failure
    return generateDefaultExplanation(errorCode, description);
  }
}

/**
 * Generate a default explanation when AI service is unavailable
 * @param {string} errorCode - The error code
 * @param {string} description - The error description
 * @returns {string} - Default explanation
 */
function generateDefaultExplanation(errorCode, description) {
  return `Error Code ${errorCode}: ${description}

This is a diagnostic trouble code (DTC) that indicates a problem with your vehicle's systems. 

Common causes may include:
• Sensor malfunctions
• Wiring issues
• Component failures
• Software/ECU problems

Symptoms you might experience:
• Check engine light illumination
• Reduced performance
• Unusual noises or behavior
• Poor fuel economy

We recommend having this issue diagnosed by a qualified VAG specialist who can:
• Perform a thorough diagnostic scan
• Check related systems and components
• Provide accurate repair estimates
• Ensure proper resolution

For safety, address this issue promptly to prevent further damage to your vehicle.`;
}

/**
 * Generate comprehensive repair estimate with AI assistance
 * @param {Array} errorCodes - Array of error codes and their details
 * @param {Object} vehicleInfo - Vehicle information
 * @returns {Promise<Object>} - AI-enhanced repair estimate
 */
async function generateAIEnhancedEstimate(errorCodes, vehicleInfo) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return generateDefaultEstimate(errorCodes, vehicleInfo);
    }

    const errorCodesText = errorCodes
      .map(
        (ec) =>
          `• ${ec.code}: ${ec.description} (${ec.severity} priority, ${ec.category})`
      )
      .join("\n");

    const prompt = `As an expert automotive technician specializing in VAG Group vehicles, please provide a comprehensive analysis of the following diagnostic information:

Vehicle: ${vehicleInfo.make} ${vehicleInfo.model} (${vehicleInfo.year})
Total Error Codes Found: ${errorCodes.length}

Error Codes Details:
${errorCodesText}

Please provide a detailed analysis including:

1. OVERALL ASSESSMENT: 
   - Overall vehicle condition and severity
   - Primary system failures and their impact
   - Safety implications and driving restrictions

2. DETAILED ERROR ANALYSIS:
   - For each error code, provide:
     * What the error means in simple terms
     * Common causes specific to VAG vehicles
     * Symptoms the driver might experience
     * Safety implications
     * Repair recommendations

3. PRIORITY RANKING:
   - Critical (immediate attention required)
   - Important (should be addressed soon)
   - Maintenance (can be addressed later)

4. REPAIR ESTIMATES:
   - Total estimated repair time
   - Labor requirements
   - Parts availability considerations

5. COST-SAVING RECOMMENDATIONS:
   - Which repairs can be done together
   - Priority order for cost efficiency
   - Potential additional issues to check

6. SAFETY WARNINGS:
   - Driving restrictions
   - Immediate actions required
   - Professional assistance needed

7. ADDITIONAL DIAGNOSTIC RECOMMENDATIONS:
   - Further testing needed
   - Related systems to check
   - Follow-up procedures

Format your response in clear sections with bullet points where appropriate. Focus on practical, actionable advice for VAG vehicles.`;

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are an expert automotive technician specializing in VAG Group vehicles with deep knowledge of diagnostic systems, repair procedures, and safety protocols.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 1200,
      temperature: 0.6,
    });

    return {
      aiAssessment: completion.choices[0]?.message?.content?.trim(),
      timestamp: new Date().toISOString(),
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
    };
  } catch (error) {
    console.error("OpenAI API error for estimate:", error);
    return generateDefaultEstimate(errorCodes, vehicleInfo);
  }
}

/**
 * Generate default estimate when AI service is unavailable
 * @param {Array} errorCodes - Array of error codes
 * @param {Object} vehicleInfo - Vehicle information
 * @returns {Object} - Default estimate
 */
function generateDefaultEstimate(errorCodes, vehicleInfo) {
  const totalEstimatedCost = errorCodes.reduce(
    (total, ec) => total + (ec.estimatedCost || 0),
    0
  );
  const totalLaborHours = errorCodes.reduce(
    (total, ec) => total + (ec.laborHours || 0),
    0
  );
  const laborCost = totalLaborHours * 3500; // 3500 KES per hour
  const totalCost = totalEstimatedCost + laborCost;

  // Group errors by category and severity for better analysis
  const errorsByCategory = {};
  const errorsBySeverity = { high: [], medium: [], low: [] };

  errorCodes.forEach((ec) => {
    if (!errorsByCategory[ec.category]) {
      errorsByCategory[ec.category] = [];
    }
    errorsByCategory[ec.category].push(ec);

    if (ec.severity) {
      errorsBySeverity[ec.severity.toLowerCase()].push(ec);
    }
  });

  // Generate detailed analysis
  let detailedAnalysis = `COMPREHENSIVE DIAGNOSTIC ANALYSIS
Vehicle: ${vehicleInfo.make} ${vehicleInfo.model} (${vehicleInfo.year})
Total Error Codes Found: ${errorCodes.length}

OVERALL ASSESSMENT:
• Vehicle Condition: ${
    errorsBySeverity.high.length > 5
      ? "CRITICAL - Multiple safety system failures detected"
      : errorsBySeverity.high.length > 2
      ? "POOR - Several critical issues requiring immediate attention"
      : errorsBySeverity.high.length > 0
      ? "FAIR - Some critical issues, overall condition concerning"
      : "GOOD - Minor issues only"
  }
• Primary System Failures: ${Object.keys(errorsByCategory)
    .slice(0, 3)
    .join(", ")}
• Safety Implications: ${
    errorsBySeverity.high.length > 0
      ? "MULTIPLE SAFETY CRITICAL FAILURES - DO NOT DRIVE until critical systems are repaired"
      : "No immediate safety concerns"
  }

DETAILED ERROR ANALYSIS BY CATEGORY:

`;

  // Add detailed analysis for each category
  Object.entries(errorsByCategory).forEach(([category, errors]) => {
    const categoryCost = errors.reduce(
      (sum, ec) => sum + (ec.estimatedCost || 0),
      0
    );
    const highPriorityCount = errors.filter(
      (ec) => ec.severity?.toLowerCase() === "high"
    ).length;

    detailedAnalysis += `${category.toUpperCase()} (${
      errors.length
    } errors, KES ${categoryCost.toLocaleString()}):
`;

    errors.forEach((error) => {
      const severity = error.severity?.toUpperCase() || "UNKNOWN";
      const cost = error.estimatedCost?.toLocaleString() || "0";

      detailedAnalysis += `• ${error.code}: ${error.description}
  - Severity: ${severity}
  - Estimated Cost: KES ${cost}
  - Impact: ${getImpactDescription(error.category, error.severity)}
`;
    });

    detailedAnalysis += `  Category Total: KES ${categoryCost.toLocaleString()}
  Priority: ${
    highPriorityCount > 0
      ? "HIGH - Immediate attention required"
      : "MEDIUM - Address soon"
  }
  
`;
  });

  // Add priority ranking
  detailedAnalysis += `PRIORITY RANKING:
• CRITICAL (Immediate attention required): ${
    errorsBySeverity.high.length
  } errors
  ${errorsBySeverity.high
    .map((ec) => `  - ${ec.code}: ${ec.description}`)
    .join("\n")}
  
• IMPORTANT (Should be addressed soon): ${errorsBySeverity.medium.length} errors
  ${errorsBySeverity.medium
    .map((ec) => `  - ${ec.code}: ${ec.description}`)
    .join("\n")}
  
• MAINTENANCE (Can be addressed later): ${errorsBySeverity.low.length} errors
  ${errorsBySeverity.low
    .map((ec) => `  - ${ec.code}: ${ec.description}`)
    .join("\n")}

SAFETY WARNINGS:
${
  errorsBySeverity.high.length > 0
    ? `⚠️ DO NOT DRIVE until critical systems are repaired
⚠️ Multiple safety-critical failures detected
⚠️ Professional assistance required immediately
⚠️ Vehicle may not respond properly in emergency situations`
    : "✅ No immediate safety concerns detected"
}

REPAIR RECOMMENDATIONS:
• Total Estimated Repair Time: ${Math.max(1, Math.ceil(totalCost / 10000))} days
• Labor Requirements: ${
    totalLaborHours > 0
      ? `${totalLaborHours} hours`
      : "Professional diagnosis required"
  }
• Parts Availability: Most VAG parts available locally, some may require ordering
• Professional Service: Highly recommended for complex electrical and safety systems

COST-SAVING RECOMMENDATIONS:
• Group repairs by system to reduce labor costs
• Address critical issues first to prevent further damage
• Consider used/reconditioned parts for non-critical components
• Regular maintenance can prevent future expensive repairs

Total estimated repair cost: ${totalCost.toLocaleString("en-KE")} KES
• Parts: ${totalEstimatedCost.toLocaleString("en-KE")} KES
• Labor: ${laborCost.toLocaleString("en-KE")} KES
• Estimated time: ${Math.max(1, Math.ceil(totalCost / 10000))} days

We recommend addressing these issues promptly to maintain your vehicle's performance and safety.`;

  return {
    aiAssessment: detailedAnalysis,
    timestamp: new Date().toISOString(),
    model: "enhanced-default",
  };
}

// Helper function to get impact descriptions
function getImpactDescription(category, severity) {
  const impacts = {
    Electrical: {
      high: "Critical system failure, may affect multiple vehicle functions",
      medium: "Reduced functionality, may cause intermittent issues",
      low: "Minor inconvenience, limited impact on operation",
    },
    Engine: {
      high: "Engine performance severely compromised, may cause breakdown",
      medium: "Reduced power and efficiency, increased fuel consumption",
      low: "Minor performance impact, may affect emissions",
    },
    Transmission: {
      high: "Transmission may fail unexpectedly, unsafe to drive",
      medium: "Gear shifting issues, reduced driving comfort",
      low: "Minor transmission behavior changes",
    },
    Brakes: {
      high: "BRAKE SYSTEM FAILURE - EXTREMELY DANGEROUS",
      medium: "Reduced braking performance, safety compromised",
      low: "Minor brake system behavior changes",
    },
    Suspension: {
      high: "Vehicle stability compromised, unsafe handling",
      medium: "Poor ride quality, reduced handling performance",
      low: "Minor ride comfort issues",
    },
    "Safety Systems": {
      high: "SAFETY SYSTEMS FAILED - CRITICAL SAFETY RISK",
      medium: "Safety systems compromised, reduced protection",
      low: "Minor safety system issues",
    },
  };

  const defaultImpact = {
    high: "Critical system failure requiring immediate attention",
    medium: "System issue that should be addressed soon",
    low: "Minor issue with limited impact",
  };

  return (
    impacts[category]?.[severity?.toLowerCase()] ||
    defaultImpact[severity?.toLowerCase()] ||
    "System issue requiring attention"
  );
}

/**
 * Generate troubleshooting steps for a specific error code
 * @param {string} errorCode - The error code
 * @param {string} vehicleMake - Vehicle make
 * @param {string} vehicleModel - Vehicle model
 * @returns {Promise<string>} - Troubleshooting steps
 */
async function generateTroubleshootingSteps(
  errorCode,
  vehicleMake,
  vehicleModel
) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return generateDefaultTroubleshootingSteps(errorCode);
    }

    const prompt = `Provide step-by-step troubleshooting steps for error code ${errorCode} on a ${vehicleMake} ${vehicleModel}.

Include:
1. Initial visual inspection steps
2. Diagnostic testing procedures
3. Common component checks
4. Testing methods
5. Safety precautions

Format as a numbered list with clear, actionable steps.`;

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are an expert automotive technician providing troubleshooting guidance.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 400,
      temperature: 0.5,
    });

    return (
      completion.choices[0]?.message?.content?.trim() ||
      generateDefaultTroubleshootingSteps(errorCode)
    );
  } catch (error) {
    console.error("OpenAI API error for troubleshooting:", error);
    return generateDefaultTroubleshootingSteps(errorCode);
  }
}

/**
 * Generate default troubleshooting steps
 * @param {string} errorCode - The error code
 * @returns {string} - Default troubleshooting steps
 */
function generateDefaultTroubleshootingSteps(errorCode) {
  return `Troubleshooting Steps for Error Code ${errorCode}:

1. Perform a thorough visual inspection of the engine bay
2. Check for loose or damaged wiring and connectors
3. Inspect related sensors and components for physical damage
4. Use a diagnostic scanner to check freeze frame data
5. Test related systems and components as per service manual
6. Verify power and ground connections
7. Check for software updates or ECU reflashing needs

Note: These are general steps. For specific guidance, consult your vehicle's service manual or a qualified VAG technician.`;
}

module.exports = {
  generateAIExplanation,
  generateAIEnhancedEstimate,
  generateTroubleshootingSteps,
};
