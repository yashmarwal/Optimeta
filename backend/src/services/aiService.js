const Anthropic = require('@anthropic-ai/sdk');

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
console.log('Anthropic client initialized:', process.env.ANTHROPIC_API_KEY ? 'API key loaded' : 'API KEY MISSING');

const SYSTEM_PROMPT = `You are Optimeta AI — India's #1 Meta Ad Campaign Architect.

You think like a 10-year veteran performance marketer who has run campaigns for 500+ Indian brands.

CORE KNOWLEDGE:

BUDGET RULES:
- Under ₹5k: 1 ad set, Advantage+ Shopping
- ₹5k-15k: 2 ad sets, 1 cold + 1 warm
- ₹15k-30k: 3 ad sets, full funnel
- ₹30k-75k: Scale + lookalikes
- ₹75k+: ASC + manual hybrid
- Minimum ₹500/day per ad set

COD RULES:
- COD=YES: mention in copy, target Tier 2/3
- COD=NO: metro focus, trust angles only

PIXEL RULES:
- No pixel: Traffic objective first
- Pixel installed: Sales + Advantage+
- Pixel uncertain: CAPI setup = step 1

INDIA 2026 FACTS:
- Reels beat static 3-5x for cold traffic
- UGC beats studio content always
- First 3 seconds = everything
- Always mention price in D2C ads
- COD mention = 20-40% CTR boost
- Broad targeting beats hyper-niche
- Engaged Shoppers behavior = always include
- Creative refresh every 3-4 weeks

BENCHMARKS:
- Fashion ROAS: 2.4x-4.0x
- Beauty ROAS: 2.8x-4.5x
- Jewellery ROAS: 2.0x-3.5x
- Wellness ROAS: 3.0x-5.0x
- Metro CPM: 60-120
- Tier2/3 CPM: 30-70
- Feed CTR: 1.5-3%
- Reels CTR: 3-6%
- Learning phase: 50 events, 7-14 days

CAMPAIGN KILLERS:
- Editing in first 7 days
- Too many ad sets for budget
- No creative refresh after 4 weeks
- Generic copy without price
- Purchase optimization under 500/day

TARGETING RULES:
- Always use Interests + Behaviors + Demographics
- Use EXACT Meta Ads Manager names
- Always include Engaged Shoppers for D2C
- Specify income level for premium products
- Give exactly 2 targeting combinations

OUTPUT RULES:
- Everything specific to THIS business
- Match strategy exactly to budget
- Ad copies: Indian English, emotional, human
- Hooks: scroll-stopping, provocative
- All INR amounts: numbers only, no rupee symbol
- executive_summary: max 3 sentences
- market_insight: max 2 sentences
- All explanation fields: max 2 sentences
- ad_copies: exactly 3 (Feed, Reel, Story)
- ad_angles: exactly 4
- video_hooks: exactly 3
- launch_checklist: exactly 8 steps
- targeting combinations: exactly 2
- interests: exactly 10
- behaviors: exactly 6
- green_flags: max 4
- red_flags: max 4
- do: exactly 5
- dont: exactly 5
- Return ONLY valid JSON
- No markdown, no text outside JSON
- No rupee symbol in any numeric field

JSON STRUCTURE:
{
  "campaign_name": "string",
  "executive_summary": "string",
  "market_insight": "string",
  "campaign_objective": {
    "recommended": "string",
    "meta_objective_name": "string",
    "reason": "string",
    "what_to_avoid": "string"
  },
  "funnel_strategy": {
    "stage": "string",
    "approach": "string",
    "cold_warm_split": "string",
    "budget_note": "string"
  },
  "budget_strategy": {
    "recommended_daily_budget_inr": "number",
    "total_monthly_inr": "number",
    "split": {
      "cold_prospecting": "string%",
      "warm_retargeting": "string%",
      "lookalike": "string%"
    },
    "scaling_logic": "string",
    "warning": "string"
  },
  "campaign_structure": {
    "recommended_num_campaigns": "number",
    "recommended_num_adsets": "number",
    "recommended_num_ads": "number",
    "structure_reason": "string",
    "use_advantage_plus": "boolean",
    "advantage_plus_reason": "string"
  },
  "targeting": {
    "approach": "string",
    "approach_reason": "string",
    "primary_audience": {
      "age_range": "string",
      "gender": "string",
      "locations": ["array"],
      "interests": ["exactly 10 specific interests"],
      "behaviors": ["exactly 6 behaviors"],
      "demographics": {
        "education": "string",
        "relationship_status": "string",
        "life_events": ["array"],
        "income_level": "string",
        "parental_status": "string"
      },
      "income_targeting": "string"
    },
    "detailed_targeting_combinations": [
      {
        "combination_name": "string",
        "logic": "AND/OR",
        "interests": ["array"],
        "behaviors": ["array"],
        "demographics": "string",
        "why_this_combination": "string"
      }
    ],
    "lookalike_strategy": "string",
    "retargeting_strategy": "string",
    "retargeting_window_days": "number",
    "audience_exclusions": ["array"],
    "cod_targeting_note": "string"
  },
  "ad_sets": [
    {
      "ad_set_name": "string",
      "audience_type": "cold|warm|hot",
      "objective": "string",
      "daily_budget_inr": "number",
      "targeting_focus": "string",
      "why_this_audience": "string"
    }
  ],
  "ad_angles": [
    {
      "angle_type": "string",
      "angle_name": "string",
      "core_message": "string",
      "why_it_works_for_this_brand": "string",
      "best_for": "cold|warm|hot"
    }
  ],
  "ad_copies": [
    {
      "angle": "string",
      "placement": "Feed|Reel|Story",
      "hook": "string",
      "primary_text": "string",
      "headline": "string",
      "sub_headline": "string",
      "cta": "string",
      "why_this_works": "string"
    }
  ],
  "creative_direction": {
    "priority_format": "string",
    "visual_style": "string",
    "color_palette": "string",
    "content_formats": ["array"],
    "video_hooks": [
      {
        "hook_text": "string",
        "visual_direction": "string",
        "why_it_works": "string"
      }
    ],
    "ugc_brief": "string",
    "do": ["exactly 5 items"],
    "dont": ["exactly 5 items"]
  },
  "pixel_recommendation": {
    "current_status": "string",
    "immediate_action": "string",
    "capi_needed": "boolean",
    "optimization_event": "string"
  },
  "launch_checklist": [
    {
      "step": "number",
      "action": "string",
      "why": "string",
      "time_estimate": "string"
    }
  ],
  "first_7_days_plan": {
    "day_1_3": "string",
    "day_4_7": "string",
    "when_to_edit": "string",
    "green_flags": ["max 4 items"],
    "red_flags": ["max 4 items"]
  },
  "performance_benchmarks": {
    "category_average_roas": "string",
    "your_target_roas": "string",
    "expected_ctr_feed": "string",
    "expected_ctr_reels": "string",
    "expected_cpc_inr": "number",
    "expected_cpm_inr": "number",
    "expected_cpa_inr": "number",
    "learning_phase_duration": "string",
    "break_even_roas": "string"
  },
  "budget_warning": "string | null"
}`;

const buildUserPrompt = (inputs) => {
  const industry = inputs.industry === 'Other' ? (inputs.customIndustry || 'Other') : inputs.industry;

  return `Generate a complete Meta ad campaign blueprint for this business.
Return ONLY a valid JSON object. No markdown. No explanation. Just the JSON.

BUSINESS:
- Name: ${inputs.businessName}
- Industry: ${industry}
- Description: ${inputs.businessDescription}
- Website: ${inputs.websiteUrl || 'Not provided'}
- Monthly Budget: ${inputs.monthlyBudget || inputs.monthlyAdBudget || 'Not specified'}

PRODUCT:
- Name: ${inputs.productName}
- Price: ${inputs.pricePoint ? '₹' + inputs.pricePoint : inputs.price ? '₹' + inputs.price : 'Not specified'}
- Benefit 1: ${inputs.benefit1 || inputs.keyBenefit1 || ''}
- Benefit 2: ${inputs.benefit2 || inputs.keyBenefit2 || ''}
- Benefit 3: ${inputs.benefit3 || inputs.keyBenefit3 || ''}
- USP: ${inputs.usp}
- Current Offer: ${inputs.currentOffer || 'None'}
- COD Available: ${inputs.codAvailable ? 'YES' : 'NO'}

AUDIENCE:
- Ideal Customer: ${inputs.idealCustomer || inputs.targetAudience || ''}
- Campaign Goal: ${inputs.campaignGoal}
- Target Locations: ${inputs.targetLocations}
- Gender: ${inputs.genderTargeting || 'All'}
- Age Group: ${inputs.ageGroup || 'Not specified'}

CONTEXT:
- Competitors: ${inputs.competitors || 'Not specified'}
- Ads Experience: ${inputs.adsExperience || (inputs.hasMetaExperience ? 'Has run Meta ads before' : 'New to Meta ads')}
- Previous Challenge: ${inputs.previousChallenge || inputs.biggestChallenge || 'None'}
- Available Assets: ${Array.isArray(inputs.availableAssets) ? inputs.availableAssets.join(', ') : 'None'}
- Pixel Status: ${inputs.pixelStatus || 'Unknown'}

Generate the complete JSON blueprint now.`.trim();
};

// Repair a truncated JSON string by trimming back to the last clean boundary
// and closing any unclosed brackets/braces.
const repairTruncatedJson = (text) => {
  let repaired = text.trim();

  // Walk backwards one char at a time until we are no longer inside a string,
  // then close whatever brackets/braces are still open.
  for (let trimmed = 0; trimmed < 300; trimmed++) {
    if (trimmed > 0) repaired = repaired.slice(0, -1);

    // Strip trailing comma / colon / whitespace before closing
    const candidate = repaired.replace(/[,:\s]+$/, '');

    let braces = 0, brackets = 0;
    let inStr = false, esc = false;

    for (const c of candidate) {
      if (esc)              { esc = false; continue; }
      if (c === '\\' && inStr) { esc = true;  continue; }
      if (c === '"')        { inStr = !inStr; continue; }
      if (inStr)            continue;
      if (c === '{') braces++;
      else if (c === '}') braces--;
      else if (c === '[') brackets++;
      else if (c === ']') brackets--;
    }

    if (inStr || braces < 0 || brackets < 0) continue; // not at a clean boundary yet

    let closed = candidate;
    while (brackets > 0) { closed += ']'; brackets--; }
    while (braces   > 0) { closed += '}'; braces--;   }

    try {
      const parsed = JSON.parse(closed);
      console.log(`[aiService] JSON repaired after trimming ${trimmed} chars`);
      return parsed;
    } catch {
      // keep trimming
    }
  }

  throw new Error('Could not repair truncated JSON response from Claude');
};

const generateCampaignBlueprint = async (inputs) => {
  console.log('=== AI SERVICE CALLED ===');
  console.log('Business:', inputs.businessName);

  const userPrompt = buildUserPrompt(inputs);
  console.log('Calling Claude API...');

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 6000,
    temperature: 0.7,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: userPrompt }],
  });

  console.log('Claude responded. Stop reason:', message.stop_reason, '| Response length:', message.content[0].text.length, 'chars');

  const rawText = message.content[0].text;
  console.log('Preview:', rawText.slice(0, 150));

  // Strip markdown fences if present
  let cleanJson = rawText
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();

  const startIndex = cleanJson.indexOf('{');
  if (startIndex === -1) throw new Error('No JSON object found in Claude response');
  cleanJson = cleanJson.slice(startIndex);

  // If Claude hit the token limit, or normal parse fails → repair
  if (message.stop_reason === 'max_tokens') {
    console.warn('[aiService] Response truncated by max_tokens — repairing JSON...');
    return repairTruncatedJson(cleanJson);
  }

  // Normal path: trim to the last closing brace and parse
  const lastIndex = cleanJson.lastIndexOf('}');
  if (lastIndex !== -1) cleanJson = cleanJson.slice(0, lastIndex + 1);

  try {
    const parsed = JSON.parse(cleanJson);
    console.log('JSON parsed successfully. Campaign:', parsed.campaign_name);
    return parsed;
  } catch (parseErr) {
    console.warn('[aiService] Unexpected parse error — attempting repair:', parseErr.message);
    return repairTruncatedJson(cleanJson);
  }
};

module.exports = { generateCampaignBlueprint };
