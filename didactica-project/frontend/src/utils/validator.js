// validator.js 
import rules from './feedbackRules.json' assert { type: 'json' };

// 🔍 Validare obiectiv educațional
export function validateObjective(input) {
  const errors = [];

  // Lungime minimă
  const minLengthRule = rules.objective.rules.find(r => r.id === 'minimum_length');
  if (input.trim().length < minLengthRule.min_length) {
    errors.push(minLengthRule.error_message);
  }

  // Verbe vagi
  const vagueRule = rules.objective.rules.find(r => r.id === 'avoid_vague_verbs');
  for (const verb of vagueRule.vague_verbs) {
    if (input.toLowerCase().includes(verb)) {
      errors.push(vagueRule.error_message);
      break;
    }
  }

  // Structură generală (verbul operațional + conținut)
  const structureRule = rules.objective.rules.find(r => r.id === 'structure');
  const hasVerbPattern = /\b(a|să)\s+\w+/i;
  if (!hasVerbPattern.test(input)) {
    errors.push(structureRule.error_message);
  }

  // Verifică timpul verbal
  const verbTenseRule = rules.objective.rules.find(r => r.id === 'verb_tense');
  const verbPattern = /\b(a|să)\s+[a-z]+/i;
  if (!verbPattern.test(input)) {
    errors.push(verbTenseRule.error_message);
  }

  // Verifică formularea activă
  const activeFormRule = rules.objective.rules.find(r => r.id === 'active_form');
  if (/să fie/.test(input)) {
    errors.push(activeFormRule.error_message);
  }

  // Verifică legătura comportament-conținut
  const contentBehaviorLinkRule = rules.objective.rules.find(r => r.id === 'content_behavior_link');
  if (!/\bsă\s+\w+\s+\w+/.test(input)) {
    errors.push(contentBehaviorLinkRule.error_message);
  }

  // ✅ Verifică dacă există mai multe verbe operaționale
  const operationalVerbs = Object.values(rules.objective.recommended_verbs).flat();
  const findOperationalVerbs = (text) => {
    return operationalVerbs.filter(verb => text.toLowerCase().includes(verb));
  };
  const singleVerbRule = rules.objective.rules.find(r => r.id === 'single_main_verb');
  const foundVerbs = findOperationalVerbs(input);
  if (foundVerbs.length > 1) {
    errors.push(singleVerbRule.error_message);
  }

  // ✅ Verifică dacă verbul din propoziția a doua este același ca în prima
  const consistencyRule = rules.objective.rules.find(r => r.id === 'consistent_verb_in_sentences');
  const sentences = input.split(/[.!?]/).map(s => s.trim()).filter(Boolean);
  if (sentences.length >= 2) {
    const firstVerb = findOperationalVerbs(sentences[0])[0];
    const secondVerb = findOperationalVerbs(sentences[1])[0];
    if (firstVerb && secondVerb && firstVerb !== secondVerb) {
      errors.push(consistencyRule.error_message);
    }
  }

  return errors;
}

// 🔍 Validare întrebare
export function validateQuestion(input) {
  const errors = [];

  for (const rule of rules.question.rules) {
    switch (rule.id) {
      case 'clarity':
        if (input.trim().length < 5 || /(\?){2,}/.test(input)) {
          errors.push(rule.error_message);
        }
        break;

      case 'avoid_confusing_negatives':
        if (/nu\s+este/i.test(input)) {
          errors.push(rule.error_message);
        }
        break;

      case 'redundancy':
        if (/care\s+este\s+un\s+exemplu\s+corect/i.test(input)) {
          errors.push(rule.error_message);
        }
        break;

      case 'too_general_question':
        if (input.toLowerCase().includes("care este capitala unui stat european")) {
          errors.push(rule.error_message);
        }
        break;

      case 'diverse_distractors':
        if (/distractor/.test(input)) {
          errors.push(rule.error_message);
        }
        break;
    }
  }

  return errors;
}
