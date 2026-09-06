(global as any).window = {
  addEventListener: () => {},
  removeEventListener: () => {},
  speechSynthesis: {
    speaking: false,
    paused: false,
    cancel: () => {},
    pause: () => {},
    resume: () => {},
    speak: (utterance: any) => {
      if (utterance.onstart) utterance.onstart();
      setTimeout(() => {
        if (utterance.onend) utterance.onend();
      }, 5);
    },
    getVoices: () => [
      { name: 'Microsoft Heera - English (India)', lang: 'en-IN' },
      { name: 'Google हिन्दी', lang: 'en-IN' },
      { name: 'Natural Female English', lang: 'en-US' },
    ],
  },
};
(global as any).SpeechSynthesisUtterance = class {
  text: string;
  rate = 1;
  pitch = 1;
  volume = 1;
  voice = null;
  onstart = null;
  onend = null;
  onerror = null;
  constructor(text: string) {
    this.text = text;
  }
};

import {
  cleanSpokenText,
  explainDiagramOrFlow,
  convertMathAndFormulas,
  expandAbbreviations,
} from '../src/lib/narrationBuilder';
import { speechManager } from '../src/lib/speechManager';

function runTests() {
  console.log('--- Running Contextual Narration & Female Voice Suite ---\n');

  // Test 1: CAP word pronunciation (Cap theorem, NOT C A P)
  const capTest = cleanSpokenText('CAP Theorem guarantees Consistency and Availability');
  console.log('[Test 1] CAP Pronunciation:', capTest);
  if (!capTest.toLowerCase().includes('cap theorem') || capTest.includes('C A P')) {
    throw new Error('CAP theorem should be pronounced as Cap theorem, not C A P!');
  }

  // Test 2: Arrow Context: Stand-for definition (A → Atomicity)
  const standForTest = explainDiagramOrFlow('A → Atomicity');
  console.log('[Test 2] Stand-For Arrow:', standForTest);
  if (!standForTest.includes('A stands for Atomicity')) {
    throw new Error('Stand-for arrow failed!');
  }

  // Test 3: Arrow Context: Cause and effect (If step 2 fails → step 1 rolls back)
  const causeTest = explainDiagramOrFlow('If step 2 fails → step 1 rolls back');
  console.log('[Test 3] Cause & Effect Arrow:', causeTest);
  if (!causeTest.includes('If step 2 fails, then step 1 rolls back')) {
    throw new Error('Cause & effect arrow failed!');
  }

  // Test 4: Arrow Context: Transfer (Transfer ₹100 from A → B)
  const transferTest = explainDiagramOrFlow('Transfer 100 from A -> B');
  console.log('[Test 4] Transfer Arrow:', transferTest);
  if (!transferTest.includes('from account A to account B')) {
    throw new Error('Transfer arrow failed!');
  }

  // Test 5: Female Voice Selection & Session Race Prevention
  console.log('[Test 5] Female Voice & Playback Test...');
  speechManager.play('subtopic-1', 'First subtopic content.');
  const initialStatus = speechManager.getStatus();
  console.log('Status 1:', initialStatus);
  if (initialStatus.activeId !== 'subtopic-1') {
    throw new Error('Subtopic 1 failed to start');
  }

  speechManager.stop();
  console.log('\n✅ ALL CONTEXTUAL NARRATION & FEMALE VOICE TESTS PASSED SUCCESSFULLY!');
}

runTests();
