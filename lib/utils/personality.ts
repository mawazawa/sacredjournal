export const questions = [
  // Openness
  { id: 'o1', trait: 'openness', text: 'I enjoy exploring new ideas and concepts', reverse: false },
  { id: 'o2', trait: 'openness', text: 'I prefer routine over variety', reverse: true },
  { id: 'o3', trait: 'openness', text: 'I have a vivid imagination', reverse: false },
  // Conscientiousness
  { id: 'c1', trait: 'conscientiousness', text: 'I like to plan things in advance', reverse: false },
  { id: 'c2', trait: 'conscientiousness', text: 'I often leave tasks unfinished', reverse: true },
  { id: 'c3', trait: 'conscientiousness', text: 'I pay attention to details', reverse: false },
  // Extraversion
  { id: 'e1', trait: 'extraversion', text: 'I feel energized around other people', reverse: false },
  { id: 'e2', trait: 'extraversion', text: 'I prefer spending time alone', reverse: true },
  { id: 'e3', trait: 'extraversion', text: 'I am talkative in social situations', reverse: false },
  // Agreeableness
  { id: 'a1', trait: 'agreeableness', text: 'I try to help others when I can', reverse: false },
  { id: 'a2', trait: 'agreeableness', text: 'I sometimes find it hard to trust people', reverse: true },
  { id: 'a3', trait: 'agreeableness', text: 'I care about how others feel', reverse: false },
  // Neuroticism
  { id: 'n1', trait: 'neuroticism', text: 'I often feel anxious or worried', reverse: false },
  { id: 'n2', trait: 'neuroticism', text: 'I stay calm under pressure', reverse: true },
  { id: 'n3', trait: 'neuroticism', text: 'My mood changes frequently', reverse: false },
]

export interface PersonalityScores {
  openness: number
  conscientiousness: number
  extraversion: number
  agreeableness: number
  neuroticism: number
  persuasion_style: 'logos' | 'pathos' | 'ethos'
}

export function calculatePersonalityScores(answers: Record<string, number>): PersonalityScores {
  const traits = ['openness', 'conscientiousness', 'extraversion', 'agreeableness', 'neuroticism']
  const scores: Record<string, number> = {}

  traits.forEach(trait => {
    const traitQuestions = questions.filter(q => q.trait === trait)
    let total = 0

    traitQuestions.forEach(q => {
      const answer = answers[q.id] || 3 // BUG: defaults missing answers to 3
      total += q.reverse ? (6 - answer) : answer
    })

    scores[trait] = total / (traitQuestions.length * 5)
  })

  // Determine persuasion style
  let persuasion_style: 'logos' | 'pathos' | 'ethos' = 'pathos'
  if (scores.openness > 0.6 && scores.conscientiousness > 0.6) {
    persuasion_style = 'logos'
  } else if (scores.agreeableness > 0.6) {
    persuasion_style = 'pathos'
  } else {
    persuasion_style = 'ethos'
  }

  return {
    openness: scores.openness,
    conscientiousness: scores.conscientiousness,
    extraversion: scores.extraversion,
    agreeableness: scores.agreeableness,
    neuroticism: scores.neuroticism,
    persuasion_style
  }
}
