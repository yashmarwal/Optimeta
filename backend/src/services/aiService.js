const { getModel } = require('../config/gemini');

const SYSTEM_PROMPT = `You are Optimeta — India's most advanced Meta Ad Campaign Architect AI.
You transform structured business inputs into complete, performance-focused Meta (Facebook & Instagram) ad campaign blueprints.
You are NOT a generic AI assistant. You are a specialized Meta advertising strategist with deep knowledge of:

Facebook & Instagram ad auction dynamics
Indian D2C, SaaS, coaching, and local business markets
Funnel strategy (TOFU, MOFU, BOFU)
Audience psychology and segmentation
Direct response copywriting
Budget allocation frameworks
Creative direction for Meta ads

STRICT RULES:
Always return ONLY valid JSON — no markdown, no explanation, no backticks
Never give generic advice — everything specific to inputs provided
Think like a performance marketer with 10 years Meta ads experience
India-first — INR pricing, Indian audience behavior
Output must be 100% ready to implement

Return exactly this JSON structure:
{
  "campaign_name": "string",
  "executive_summary": "string",
  "campaign_objective": {
    "recommended": "string",
    "reason": "string"
  },
  "funnel_strategy": {
    "stage": "string",
    "approach": "string",
    "cold_warm_split": "string"
  },
  "budget_strategy": {
    "recommended_daily_budget_inr": "string",
    "split": {
      "awareness": "string%",
      "consideration": "string%",
      "conversion": "string%"
    },
    "scaling_logic": "string"
  },
  "targeting": {
    "primary_audience": {
      "age_range": "string",
      "gender": "string",
      "locations": ["array"],
      "interests": ["8-10 items"],
      "behaviors": ["array"]
    },
    "lookalike_strategy": "string",
    "retargeting_strategy": "string",
    "audience_exclusions": ["array"]
  },
  "ad_sets": [
    {
      "ad_set_name": "string",
      "audience_type": "cold|warm|hot",
      "objective": "string",
      "budget_allocation": "string%",
      "targeting_focus": "string"
    }
  ],
  "ad_angles": [
    {
      "angle_type": "pain|desire|trust|curiosity|social_proof",
      "angle_name": "string",
      "core_message": "string",
      "why_it_works": "string"
    }
  ],
  "ad_copies": [
    {
      "angle": "string",
      "primary_text": "string",
      "headline": "string",
      "sub_headline": "string",
      "cta": "string",
      "placement": "Feed|Story|Reel"
    }
  ],
  "creative_direction": {
    "visual_style": "string",
    "color_palette": "string",
    "content_formats": ["array"],
    "hooks": ["5 hooks"],
    "do": ["array"],
    "dont": ["array"]
  },
  "launch_checklist": ["10 items"],
  "performance_benchmarks": {
    "expected_ctr": "string",
    "expected_cpc_inr": "string",
    "expected_cpm_inr": "string",
    "roas_target": "string"
  }
}`;

const generateCampaignBlueprint = async (businessInputs) => {
  const model = getModel();

  const userPrompt = `Generate a complete Meta ad campaign blueprint for this business:

Business Name: ${businessInputs.businessName}
Industry: ${businessInputs.industry}
Business Description: ${businessInputs.businessDescription}
Website: ${businessInputs.websiteUrl || 'Not provided'}
Monthly Ad Budget: ${businessInputs.monthlyAdBudget}

Product/Service Name: ${businessInputs.productName}
Price: ₹${businessInputs.price}
Key Benefit 1: ${businessInputs.keyBenefit1}
Key Benefit 2: ${businessInputs.keyBenefit2}
Key Benefit 3: ${businessInputs.keyBenefit3}
Unique Selling Proposition: ${businessInputs.usp}
Current Offer/Discount: ${businessInputs.currentOffer || 'None'}

Target Audience: ${businessInputs.targetAudience}
Campaign Goal: ${businessInputs.campaignGoal}
Target Cities/States: ${businessInputs.targetLocations}
Meta Ads Experience: ${businessInputs.hasMetaExperience ? 'Yes' : 'No'}
Biggest Challenge: ${businessInputs.biggestChallenge}

Return ONLY the JSON blueprint. No markdown. No explanation.`;

  const result = await model.generateContent(`${SYSTEM_PROMPT}\n\n${userPrompt}`);

  // Filter out thinking tokens (gemini-2.5 with thinking enabled returns them as separate parts)
  let text;
  try {
    const parts = result.response.candidates?.[0]?.content?.parts ?? [];
    const nonThoughtParts = parts.filter(p => !p.thought);
    text = nonThoughtParts.length > 0
      ? nonThoughtParts.map(p => p.text ?? '').join('')
      : result.response.text();
  } catch {
    text = result.response.text();
  }

  // With responseMimeType: application/json the SDK returns clean JSON.
  // Strip any accidental markdown wrapping just in case.
  const cleaned = text.replace(/```json\n?/gi, '').replace(/```\n?/gi, '').trim();

  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    // Last resort: extract the largest JSON object from the response
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        parsed = JSON.parse(jsonMatch[0]);
      } catch {
        throw new Error('AI returned malformed JSON. Please try again.');
      }
    } else {
      throw new Error('AI returned an unexpected response. Please try again.');
    }
  }

  return parsed;
};

module.exports = { generateCampaignBlueprint };
