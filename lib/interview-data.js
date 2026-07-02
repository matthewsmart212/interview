export const ROLE = "Customer Service Advisor";
export const COMPANY = "Tesco";

export const QUESTIONS = [
  {
    id: 1,
    category: "Behavioural",
    text: "Can you tell me about a time you had to deal with a difficult customer? How did you handle it?",
    duration: "0:45",
    transcript:
      "So I was working at a shop and this customer was really angry about a refund. I listened to what they said and then I apologised and offered to sort it out. In the end they were happy.",
    scores: { Relevance: 20, "Structure (STAR)": 18, Clarity: 18, Confidence: 14, Impact: 14 },
    good: ["Good example with a clear situation", "Explained your actions clearly", "Positive outcome"],
    improve: ["Could add more about the result", "Try to show more impact"],
    better: {
      Situation:
        "I was working in a busy store when a customer came in unhappy about a refund for a faulty product.",
      Task: "My task was to understand the issue, calm the situation and find a solution that was fair for both the customer and the store.",
      Action:
        "I listened carefully to the customer, apologised for the inconvenience and checked the policy. I offered a full refund and explained the next steps.",
      Result:
        "The customer was happy with the outcome and even thanked me for being helpful. They came back the following week and left positive feedback.",
    },
  },
  {
    id: 2,
    category: "Situational",
    text: "How do you handle working under pressure, for example during a very busy shift?",
    duration: "0:52",
    transcript:
      "When it gets busy I try to stay calm and focus on one customer at a time. During the Christmas rush I kept the queue moving by staying organised and asking a colleague to open another till.",
    scores: { Relevance: 18, "Structure (STAR)": 16, Clarity: 17, Confidence: 16, Impact: 15 },
    good: ["Stayed calm and practical", "Showed initiative by involving a colleague"],
    improve: ["Quantify the result (queue time, customers served)", "Mention how you prioritised tasks"],
    better: {
      Situation: "During the Christmas rush our store had queues stretching down the aisles.",
      Task: "I needed to keep wait times down while still giving each customer good service.",
      Action:
        "I stayed calm, served one customer at a time, and flagged the queue to my manager while asking a trained colleague to open a second till.",
      Result: "Average waiting time dropped by half and we received no complaints that shift.",
    },
  },
  {
    id: 3,
    category: "Behavioural",
    text: "Give me an example of when you worked well as part of a team.",
    duration: "0:39",
    transcript:
      "In my last job we had a big delivery arrive at the same time as a staff shortage. I helped organise who would do what, covered the tills while others unpacked, and we got everything done before opening.",
    scores: { Relevance: 19, "Structure (STAR)": 17, Clarity: 18, Confidence: 17, Impact: 16 },
    good: ["Clear team situation", "Showed flexibility and organisation"],
    improve: ["Explain your specific role more", "Add what the team achieved together"],
    better: {
      Situation: "A large delivery arrived during a staff shortage right before opening.",
      Task: "We had to unpack stock and be ready for customers with half the usual team.",
      Action:
        "I suggested splitting into two pairs, covered the tills myself, and kept everyone updated on timing so we could switch tasks when needed.",
      Result: "The store opened on time, fully stocked, and our manager praised the teamwork.",
    },
  },
  {
    id: 4,
    category: "Situational",
    text: "How do you prioritise your tasks when everything feels urgent?",
    duration: "0:47",
    transcript:
      "I usually make a quick list and decide what affects customers first. Anything customer-facing comes first, then restocking, then admin. I check with my manager if two things clash.",
    scores: { Relevance: 17, "Structure (STAR)": 15, Clarity: 17, Confidence: 16, Impact: 14 },
    good: ["Sensible customer-first approach", "Willing to communicate with manager"],
    improve: ["Use a concrete example rather than a general answer", "Show the outcome of your prioritising"],
    better: {
      Situation: "One afternoon I had a delivery to unpack, a queue forming, and a customer waiting for a click-and-collect order.",
      Task: "I had to decide what to handle first without letting any customer down.",
      Action:
        "I served the queue first as it affected the most people, asked a colleague to fetch the click-and-collect order, and unpacked the delivery afterwards.",
      Result: "All customers were served quickly and the delivery was still finished before the evening rush.",
    },
  },
  {
    id: 5,
    category: "Behavioural",
    text: "Why do you want to work here, and what makes you a good fit for this role?",
    duration: "0:41",
    transcript:
      "I shop here myself and I like how the staff treat people. I'm friendly, patient and I enjoy solving problems, which I think matches what you look for in customer service.",
    scores: { Relevance: 18, "Structure (STAR)": 14, Clarity: 18, Confidence: 17, Impact: 15 },
    good: ["Genuine motivation", "Matched your strengths to the role"],
    improve: ["Reference the company's values specifically", "Give an example that proves your strengths"],
    better: {
      Situation: "I've been a regular customer here for years and always noticed how helpful the team is.",
      Task: "I wanted my next role to be somewhere service genuinely matters.",
      Action:
        "I researched your values around helping customers and communities, and they match how I work — patient, friendly and practical, like the time I helped an elderly customer carry shopping to a taxi.",
      Result: "That's why I applied: I know I'd fit the team and represent the brand well.",
    },
  },
];

export const TOTAL_QUESTIONS = QUESTIONS.length;

export function questionScore(q) {
  return Object.values(q.scores).reduce((a, b) => a + b, 0);
}

export const OVERALL = {
  score: Math.round(
    QUESTIONS.reduce((a, q) => a + questionScore(q), 0) / QUESTIONS.length
  ),
  headline: "Great job!",
  strengths: [
    "Clear, friendly communication in every answer",
    "Good real examples with positive outcomes",
    "Calm and structured under pressure",
  ],
  improvements: [
    "Show measurable impact (numbers, results)",
    "Use the full STAR structure consistently",
    "Mention the company's values in your answers",
  ],
};
