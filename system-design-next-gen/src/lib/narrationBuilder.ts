/**
 * Narration Builder Layer
 * Transforms structured subtopic DOM content into clean, professional, teacher-like educational narration script.
 * Persona: Energetic, clear female technical educator explaining system design concepts contextually.
 */

const ABBREVIATION_MAP: Record<string, string> = {
  CAP: 'Cap',
  ACID: 'Acid',
  CRUD: 'Crud',
  JSON: 'Jason',
  REST: 'Rest',
  DASH: 'Dash',
  HLS: 'H L S',
  WAF: 'Waf',
  SLA: 'S L A',
  SLO: 'S L O',
  SRE: 'S R E',
  API: 'A P I',
  SQL: 'S Q L',
  NOSQL: 'No S Q L',
  HTTP: 'H T T P',
  HTTPS: 'H T T P S',
  CPU: 'C P U',
  RAM: 'RAM',
  URL: 'U R L',
  DB: 'database',
  UI: 'user interface',
  UX: 'user experience',
  QPS: 'queries per second',
  DAU: 'daily active users',
  MAU: 'monthly active users',
  NFR: 'non-functional requirements',
  SPOF: 'single point of failure',
  TTL: 'time to live',
  WAL: 'write-ahead log',
  MVCC: 'multi-version concurrency control',
  JWT: 'J W T',
  OAuth: 'O Auth',
  CDN: 'C D N',
  DNS: 'D N S',
  S3: 'S 3',
  HDFS: 'H D F S',
  IOPS: 'I O P S',
  TLS: 'T L S',
  SSL: 'S S L',
  RPC: 'R P C',
  gRPC: 'g R P C',
  CQRS: 'C Q R S',
  CRDT: 'C R D T',
  CDC: 'C D C',
};

export function expandAbbreviations(text: string): string {
  if (!text) return '';
  let result = text;

  result = result.replace(/\bCAP\s+theorem\b/gi, 'Cap theorem');
  result = result.replace(/\bCAP\b/g, 'Cap');

  for (const [abbr, expansion] of Object.entries(ABBREVIATION_MAP)) {
    if (abbr === 'CAP') continue;
    const regex = new RegExp(`\\b${abbr}\\b`, 'g');
    result = result.replace(regex, expansion);
  }
  return result;
}

// 2. Context-Aware Arrow & Flow Interpreter
export function explainDiagramOrFlow(text: string): string {
  if (!text) return '';

  let cleaned = text;

  // Case 1: Account / Value Transfers e.g. "Transfer ₹100 from A → B" or "Transfer 100 from A -> B"
  cleaned = cleaned.replace(/Transfer\s+([₹$€\d\s\w]+)\s+from\s+([A-Za-z0-9]+)\s*(?:->|→|=>|⇒)\s*([A-Za-z0-9]+)/gi, (_m, amount, src, dest) => {
    return `Transfer ${amount.trim()} from account ${src.trim()} to account ${dest.trim()}`;
  });

  // Case 2: HTTP Redirect / Location paths e.g. "GET /old-page → 301 Moved Permanently → Location: /new-page"
  cleaned = cleaned.replace(/GET\s+(\S+)\s*(?:->|→|=>|⇒)\s*301\s+Moved\s+Permanently\s*(?:->|→|=>|⇒)\s*Location:\s*(\S+)/gi, (_m, oldUrl, newUrl) => {
    return `A GET request to ${oldUrl} returns 301 Moved Permanently, redirecting to location ${newUrl}.`;
  });

  // Case 3: Cause and Effect / Conditional transitions e.g. "If step 2 fails → step 1 rolls back"
  cleaned = cleaned.replace(/\b(if|when)\b([^→\->=]+)(?:->|→|=>|⇒)([^.\n]+)/gi, (_m, cond, cause, effect) => {
    return `${cond} ${cause.trim()}, then ${effect.trim()}`;
  });

  // Case 4: Stand-For Acronym Definition e.g. "A → Atomicity", "C → Consistency", "P → Partition Tolerance"
  cleaned = cleaned.replace(/\b([A-Z])\s*(?:->|→|=>|⇒)\s*([A-Za-z\s]+)\b/g, (_m, letter, word) => {
    const trimmedWord = word.trim();
    if (trimmedWord.toLowerCase().startsWith(letter.toLowerCase())) {
      return `${letter} stands for ${trimmedWord}`;
    }
    return `${letter}, meaning ${trimmedWord}`;
  });

  // Case 5: 4-step Request-Response pipeline e.g. "Client → Load Balancer → Web Server → Database"
  cleaned = cleaned.replace(
    /\bClient\s*(?:->|→)\s*([A-Za-z0-9\s]+)\s*(?:->|→)\s*([A-Za-z0-9\s]+)\s*(?:->|→)\s*Database\b/gi,
    (_m, step1, step2) => `First, the client sends a request to the ${step1.trim()}. The ${step1.trim()} forwards it to the ${step2.trim()}, which communicates with the database.`
  );

  // Case 6: 3-step Pipeline e.g. "Client → Server → Database"
  cleaned = cleaned.replace(
    /\b([A-Za-z0-9\s]+)\s*(?:->|→)\s*([A-Za-z0-9\s]+)\s*(?:->|→)\s*([A-Za-z0-9\s]+)\b/g,
    (_m, p1, p2, p3) => `First, ${p1.trim()} sends a request to ${p2.trim()}. Then ${p2.trim()} communicates with ${p3.trim()}.`
  );

  // Case 7: Bidirectional arrow e.g. "A ↔ B" or "A <-> B"
  cleaned = cleaned.replace(
    /\b([A-Za-z0-9\s]+)\s*(?:<->|↔|<=>)\s*([A-Za-z0-9\s]+)\b/g,
    (_m, p1, p2) => `${p1.trim()} and ${p2.trim()} communicate with each other in both directions.`
  );

  // Case 8: Combination e.g. "A + B → C"
  cleaned = cleaned.replace(
    /\b([A-Za-z0-9\s]+)\s*\+\s*([A-Za-z0-9\s]+)\s*(?:->|→|=>|⇒)\s*([A-Za-z0-9\s]+)\b/g,
    (_m, p1, p2, p3) => `${p1.trim()} and ${p2.trim()} combine to produce ${p3.trim()}.`
  );

  // Case 9: General arrow replacement: replace repetitive "leads to" with a natural speech pause ", "
  cleaned = cleaned.replace(/\s*(?:->|→|=>|⇒)\s*/g, ', ');

  return cleaned;
}

// 3. Formula & Mathematical Notation
export function convertMathAndFormulas(text: string): string {
  if (!text) return '';
  let cleaned = text;

  cleaned = cleaned.replace(/\bO\(([^)]+)\)/g, 'O of $1');
  cleaned = cleaned.replace(/\s*(==|===)\s*/g, ' is equal to ');
  cleaned = cleaned.replace(/\s*(!=|!==)\s*/g, ' is not equal to ');
  cleaned = cleaned.replace(/\s*(>=|≥)\s*/g, ' is greater than or equal to ');
  cleaned = cleaned.replace(/\s*(<=|≤)\s*/g, ' is less than or equal to ');
  cleaned = cleaned.replace(/\s*>\s*/g, ' is greater than ');
  cleaned = cleaned.replace(/\s*<\s*/g, ' is less than ');
  cleaned = cleaned.replace(/\s*\+\s*/g, ' plus ');
  cleaned = cleaned.replace(/\s*%\s*/g, ' percent ');

  return cleaned;
}

// 4. Main Spoken Text Cleaner
export function cleanSpokenText(text: string): string {
  if (!text) return '';

  let cleaned = text;

  cleaned = cleaned
    .replace(/&amp;/g, 'and')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ');

  cleaned = cleaned.replace(/\[\d+\]|\(\d+\)|\(see [^)]+\)|\(optional\)|\(continued\)|\(deprecated\)/gi, '');

  cleaned = cleaned.replace(/\bCAP\s*\(\s*Consistency,\s*Availability,\s*Partition\s*Tolerance\s*\)/gi, 'Cap theorem, which stands for Consistency, Availability, and Partition Tolerance');
  cleaned = cleaned.replace(/\bACID\s*\(\s*Atomicity,\s*Consistency,\s*Isolation,\s*Durability\s*\)/gi, 'Acid properties, which stand for Atomicity, Consistency, Isolation, and Durability');
  cleaned = cleaned.replace(/\bRedis\s*\(\s*Remote\s*Dictionary\s*Server\s*\)/gi, 'Redis, short for Remote Dictionary Server,');
  cleaned = cleaned.replace(/\((?:short for|stands for)\s+([^)]+)\)/gi, ', short for $1,');

  cleaned = explainDiagramOrFlow(cleaned);
  cleaned = convertMathAndFormulas(cleaned);

  cleaned = cleaned.replace(/\bHTTP\/HTTPS\b/gi, 'H T T P and H T T P S');
  cleaned = cleaned.replace(/\bSQL\/NoSQL\b/gi, 'S Q L and No S Q L');
  cleaned = cleaned.replace(/\bL4\/L7\b/gi, 'Layer 4 or Layer 7');
  cleaned = cleaned.replace(/\bRead\/Write\b/gi, 'Read and Write');
  cleaned = cleaned.replace(/\bMaster\/Replica\b/gi, 'Master and Replica');

  cleaned = expandAbbreviations(cleaned);

  cleaned = cleaned.replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F1E6}-\u{1F1FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{2460}-\u{24FF}]/gu, '');
  cleaned = cleaned.replace(/[🔹👉✅⚖️🧠🏢📦🔁❌⚡🚀⭐💡📌⚠️✓✔✦•▪▫|\–\—]/g, ' ');
  cleaned = cleaned.replace(/[*_`#~^]/g, '');

  cleaned = cleaned.replace(/\(([^)]+)\)/g, (_match, group: string) => {
    const trimmed = group.trim();
    if (/^(e\.g\.|i\.e\.|etc\.)/i.test(trimmed)) {
      return `, ${trimmed},`;
    }
    return trimmed.length <= 25 ? `, ${trimmed},` : ` ${trimmed} `;
  });

  cleaned = cleaned.replace(/[\[\]{}\\]/g, ' ');
  cleaned = cleaned.replace(/---+/g, ' ');
  cleaned = cleaned.replace(/===+/g, ' ');
  cleaned = cleaned.replace(/[\r\n\t]+/g, ' ');
  cleaned = cleaned.replace(/\s+/g, ' ');

  return cleaned.trim();
}

function headingToNarration(headingNode: Element): string {
  let title = headingNode.textContent || '';
  title = cleanSpokenText(title);

  if (!title) return '';

  title = title.replace(/^\d+[\.\)]\s*/, '');

  const intros = [
    `So, let's understand ${title}.`,
    `Now, let's examine ${title}.`,
    `The important concept here is ${title}.`,
    `Let's look at ${title}.`,
  ];

  if (/^what is\b/i.test(title)) {
    return `So, let's understand ${title}.`;
  }
  if (/^why\b/i.test(title)) {
    return `Now, let me explain ${title}.`;
  }
  if (/^how\b/i.test(title)) {
    return `Let's see ${title}.`;
  }
  if (/vs\b|versus|difference/i.test(title)) {
    return `Let's compare ${title}.`;
  }

  const index = title.length % intros.length;
  return intros[index];
}

function paragraphToNarration(pNode: Element): string {
  let text = pNode.textContent || '';
  if (!text.trim()) return '';

  const defMatch = text.match(/^([A-Za-z0-9\s\-]+)\s*[:—–]\s*(.+)$/);
  if (defMatch && defMatch[1].trim().length <= 30) {
    const term = cleanSpokenText(defMatch[1]);
    const desc = cleanSpokenText(defMatch[2]);
    return `${term} refers to ${desc}`;
  }

  if (/verifies identity.*checks permissions/i.test(text)) {
    return 'In simple words, authentication verifies who the user is, whereas authorization determines what permissions that user has.';
  }

  return cleanSpokenText(text);
}

function listToNarration(listNode: Element): string {
  const isOrdered = listNode.tagName.toLowerCase() === 'ol';
  const items = Array.from(listNode.querySelectorAll(':scope > li'));

  if (items.length === 0) return '';

  const itemTexts = items.map((li) => cleanSpokenText(li.textContent || '')).filter(Boolean);

  if (itemTexts.length === 0) return '';

  const isShortList = itemTexts.length <= 4 && itemTexts.every((t) => t.split(' ').length <= 4);
  if (isShortList) {
    if (itemTexts.length === 1) return itemTexts[0];
    if (itemTexts.length === 2) return `The main points are ${itemTexts[0]} and ${itemTexts[1]}.`;
    const last = itemTexts.pop();
    return `The key points to note are: ${itemTexts.join(', ')}, and ${last}.`;
  }

  const Connectors = ['First', 'Second', 'Another key point is', 'Furthermore', 'Finally'];
  const parts: string[] = [];

  if (isOrdered) {
    parts.push(`There are ${itemTexts.length} sequential steps.`);
  } else {
    parts.push(`There are ${itemTexts.length} key points to understand.`);
  }

  itemTexts.forEach((itemText, index) => {
    let text = itemText.replace(/^\d+[\.\)]\s*/, '');

    let prefix = '';
    if (index === 0) {
      prefix = 'First, ';
    } else if (index === itemTexts.length - 1) {
      prefix = 'Finally, ';
    } else {
      const connIndex = (index - 1) % (Connectors.length - 2) + 1;
      prefix = `${Connectors[connIndex]}, `;
    }

    if (text.length > 0) {
      text = text.charAt(0).toUpperCase() + text.slice(1);
    }

    parts.push(`${prefix}${text}.`);
  });

  return parts.join(' ');
}

function tableToNarration(tableNode: Element): string {
  const rows = Array.from(tableNode.querySelectorAll('tr'));
  if (rows.length === 0) return '';

  const headerCells = Array.from(rows[0].querySelectorAll('th, td')).map((c) => cleanSpokenText(c.textContent || ''));
  const dataRows = rows.slice(1).map((row) =>
    Array.from(row.querySelectorAll('td, th')).map((c) => cleanSpokenText(c.textContent || ''))
  ).filter((row) => row.some((cell) => Boolean(cell)));

  if (dataRows.length === 0) return '';

  const parts: string[] = [];

  if (headerCells.length === 3) {
    const conceptA = headerCells[1] || 'the first system';
    const conceptB = headerCells[2] || 'the second system';
    const aspectHeader = headerCells[0] || 'aspect';

    parts.push(`This table compares ${conceptA} and ${conceptB}.`);

    dataRows.forEach((row) => {
      const aspect = row[0] || aspectHeader;
      const valA = row[1] || '';
      const valB = row[2] || '';

      if (!valA && !valB) return;

      if (
        (valA.toLowerCase().includes('yes') && valB.toLowerCase().includes('no')) ||
        (valA.toLowerCase().includes('support') && valB.toLowerCase().includes('not support')) ||
        (valA.toLowerCase().includes('fixed') && valB.toLowerCase().includes('flexib')) ||
        (valA.toLowerCase().includes('vertical') && valB.toLowerCase().includes('horizontal'))
      ) {
        parts.push(`In terms of ${aspect}: ${conceptA} uses ${valA}, whereas ${conceptB} uses ${valB}.`);
      } else {
        parts.push(`For ${aspect}: ${conceptA} is ${valA}, while ${conceptB} is ${valB}.`);
      }
    });

    return parts.join(' ');
  }

  if (headerCells.length === 2) {
    const labelHeader = headerCells[0] || 'Item';
    const descHeader = headerCells[1] || 'Description';

    parts.push(`Here is a comparison of ${labelHeader} and ${descHeader}.`);

    dataRows.forEach((row) => {
      const item = row[0] || '';
      const desc = row[1] || '';

      if (item && desc) {
        parts.push(`For ${item}: ${desc}.`);
      } else if (item) {
        parts.push(`${item}.`);
      }
    });

    return parts.join(' ');
  }

  parts.push('Here is the summary table data.');

  dataRows.forEach((row) => {
    const rowTitle = row[0] || '';
    const rowDetails = row.slice(1).filter(Boolean).join(', ');

    if (rowTitle && rowDetails) {
      parts.push(`For ${rowTitle}: ${rowDetails}.`);
    } else if (rowTitle) {
      parts.push(`${rowTitle}.`);
    }
  });

  return parts.join(' ');
}

function codeToNarration(codeContainer: Element): string {
  const codeText = (codeContainer.textContent || '').trim();
  if (!codeText) return '';

  const lines = codeText.split('\n').filter((line) => line.trim().length > 0);

  if (lines.length <= 2 && codeText.length < 90) {
    let cleanCode = codeText;
    cleanCode = cleanCode.replace(/^npm run dev$/i, 'Run command npm run dev');
    cleanCode = cleanCode.replace(/^npm install$/i, 'Run command npm install');
    cleanCode = cleanCode.replace(/^GET\s+(\S+)/i, 'HTTP GET request to $1');
    cleanCode = cleanCode.replace(/^POST\s+(\S+)/i, 'HTTP POST request to $1');
    return cleanSpokenText(cleanCode);
  }

  return 'This code snippet demonstrates the implementation. You can inspect the complete code on the page.';
}

function blockquoteToNarration(quoteNode: Element): string {
  const text = cleanSpokenText(quoteNode.textContent || '');
  if (!text) return '';
  return `The key takeaway here is: ${text}`;
}

export function buildNarrationScript(container: Element): string {
  if (!container) return '';

  const scriptParts: string[] = [];
  const children = Array.from(container.children);

  for (const child of children) {
    const tagName = child.tagName.toLowerCase();

    if (['script', 'style', 'button', 'svg', 'iframe'].includes(tagName)) {
      continue;
    }
    if (child.getAttribute('aria-hidden') === 'true' || child.classList.contains('hidden')) {
      continue;
    }

    if (/^h[2-6]$/.test(tagName)) {
      const headingNarration = headingToNarration(child);
      if (headingNarration) scriptParts.push(headingNarration);
    } else if (tagName === 'p') {
      const pNarration = paragraphToNarration(child);
      if (pNarration) scriptParts.push(pNarration);
    } else if (tagName === 'ul' || tagName === 'ol') {
      const listNarration = listToNarration(child);
      if (listNarration) scriptParts.push(listNarration);
    } else if (tagName === 'table') {
      const tableNarration = tableToNarration(child);
      if (tableNarration) scriptParts.push(tableNarration);
    } else if (tagName === 'pre') {
      const codeNarration = codeToNarration(child);
      if (codeNarration) scriptParts.push(codeNarration);
    } else if (tagName === 'blockquote') {
      const quoteNarration = blockquoteToNarration(child);
      if (quoteNarration) scriptParts.push(quoteNarration);
    } else if (tagName === 'div' || tagName === 'section') {
      const subScript = buildNarrationScript(child);
      if (subScript) scriptParts.push(subScript);
    } else {
      const genericText = cleanSpokenText(child.textContent || '');
      if (genericText) scriptParts.push(genericText);
    }
  }

  if (scriptParts.length === 0 && container.textContent) {
    const fallback = cleanSpokenText(container.textContent);
    if (fallback) scriptParts.push(fallback);
  }

  return scriptParts.join(' ');
}
