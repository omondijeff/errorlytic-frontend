const OpenAI = require("openai");

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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
      model: process.env.OPENAI_MODEL || "gpt-4",
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
      .map((ec) => `• ${ec.code}: ${ec.description}`)
      .join("\n");

    const prompt = `As an expert automotive technician, please analyze the following diagnostic information and provide professional insights:

Vehicle: ${vehicleInfo.make} ${vehicleInfo.model} (${vehicleInfo.year})
Error Codes Found:
${errorCodesText}

Please provide:
1. Overall assessment of the vehicle's condition
2. Priority ranking of repairs (critical, important, maintenance)
3. Estimated total repair time
4. Potential cost-saving recommendations
5. Additional diagnostic recommendations
6. Safety warnings if any

Focus on practical, actionable advice for VAG vehicles.`;

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are an expert automotive technician specializing in VAG Group vehicles.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 600,
      temperature: 0.6,
    });

    return {
      aiAssessment: completion.choices[0]?.message?.content?.trim(),
      timestamp: new Date().toISOString(),
      model: process.env.OPENAI_MODEL || "gpt-4",
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

  return {
    aiAssessment: `Based on the diagnostic scan, your ${vehicleInfo.make} ${
      vehicleInfo.model
    } has ${errorCodes.length} error code(s) that require attention.

Total estimated repair cost: ${totalCost.toLocaleString("en-KE")} KES
• Parts: ${totalEstimatedCost.toLocaleString("en-KE")} KES
• Labor: ${laborCost.toLocaleString("en-KE")} KES
• Estimated time: ${totalLaborHours} hours

We recommend addressing these issues promptly to maintain your vehicle's performance and safety.`,
    timestamp: new Date().toISOString(),
    model: "default",
  };
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
      model: process.env.OPENAI_MODEL || "gpt-4",
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
