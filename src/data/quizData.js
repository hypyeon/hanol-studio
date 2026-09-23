export const questions = [
  {
    id: 1,
    question: "What's your daily makeup vibe?",
    options: [
      { key: "1a", answer: "Full Glam - Defined brows, bold lips, no apologies" },
      { key: "1b", answer: "Soft & Natural - 'I woke up like this' energy" },
      { key: "1c", answer: "Bare Minimum - SPF, lip balm, or... nothing" }
    ]
  },
  {
    id: 2,
    question: "How would you describe your skin canvas?",
    options: [
      { key: "2a", answer: "Normal" },
      { key: "2b", answer: "Dry" },
      { key: "2c", answer: "Oily" },
      { key: "2d", answer: "Combination (Oily T-zone, dry everywhere else)" }
    ]
  },
  {
    id: 3,
    question: "Any previous brow tattoo stories?",
    options: [
      { key: "3a", answer: "Yes — still rockin' 50% or more of the original pigment" },
      { key: "3b", answer: "Yes — but it's practically a ghost (70%–80% faded)" },
      { key: "3c", answer: "Never — totally virgin brows ready for their first chapter" }
    ]
  }
];

export function evaluateQuizResults(answers) {
  // answers look like: { 1: "1a", 2: "2b", 3: "3c" }
  const makeupKey = answers[1]; // "1a", "1b", or "1c"
  const skinKey = answers[2];   // "2a", "2b", "2c", or "2d"
  const historyKey = answers[3];// "3a", "3b", or "3c"

  // --- 1. Hashtags Lookup Map ---
  const hashtagMap = {
    "1a": "#full_glam_daily",
    "1b": "#soft_focus",
    "1c": "#bare_face_club",
    "2a": "#unbothered_skin",
    "2b": "#moisture_seeker",
    "2c": "#naturally_dewy",
    "2d": "#best_of_both_zones",
    "3a": "#building_on_the_past",
    "3b": "#ghost_pigment",
    "3c": "#virgin_brows"
  };

  const hashtags = [
    hashtagMap[makeupKey],
    hashtagMap[skinKey],
    hashtagMap[historyKey]
  ].filter(Boolean); // Clean safeguard to strip any undefined values

  // --- 2. Recommendations Logic ---
  let topChoice = "";
  let anotherRec = "";

  const isDryOrNormal = skinKey === "2a" || skinKey === "2b";
  const isOilyOrCombo = skinKey === "2c" || skinKey === "2d";

  // Heavy Makeup (1a)
  if (makeupKey === "1a") {
    topChoice = "Full Shading";
    anotherRec = isDryOrNormal
      ? "Front Hairstroke or Microblading + Rest Full Shading Combo"
      : "Front Hairstroke + Rest Full Shading Combo";
  } 
  // Natural Look (1b)
  else if (makeupKey === "1b") {
    topChoice = isDryOrNormal ? "Microblading or Hairstroke" : "Hairstroke";
    anotherRec = isDryOrNormal
      ? "Hairstroke or Microblading with Powder Brow Shading to add density"
      : "Hairstroke with Powder Brow Shading to add density";
  } 
  // Rarely Do Makeup (1c)
  else if (makeupKey === "1c") {
    topChoice = isDryOrNormal ? "Microblading or Hairstroke" : "Hairstroke";
    anotherRec = "If you have highly uneven or patchy brows, we also recommend adding shading where needed to even them out.";
  }

  // --- 3. Session Advice (Question 3) ---
  let sessionAdvice = "";

  if (historyKey === "3a") {
    sessionAdvice = "We accept new clients with previous work done elsewhere - booking with us under Maintenance (lower fee than Initial). Returning hanol clients receive a $100 discount. Maintenance sessions only add pigment to your original shape for a more defined look. If you want to modify your original design, a redesign/assessment fee applies - only if workable with original design. If you need a completely new shape that cannot be worked over, a removal procedure is required at least 2 months prior to booking for skin safety and optimal results. If unsure, reach out via email for a free 30-min in-person consultation.";
  } else {
    // 3b (70-80% faded) or 3c (no previous work)
    sessionAdvice = "You're a great candidate for an Initial session! Proceed to booking below to make it official — your beautiful brows await!";
  }

  return { hashtags, topChoice, anotherRec, sessionAdvice };
}