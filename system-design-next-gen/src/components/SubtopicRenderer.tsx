import React, { useMemo } from 'react';
import { TextToAudioButton } from './TextToAudioButton';
import { buildNarrationScript } from '../lib/narrationBuilder';

interface SubtopicSectionData {
  id: string;
  headingHtml: string | null;
  headingText: string;
  contentHtml: string;
  narrationScript: string;
}

interface SubtopicRendererProps {
  html: string;
  topicSlug: string;
}

export function SubtopicRenderer({ html, topicSlug }: SubtopicRendererProps) {
  const sections = useMemo(() => {
    if (!html) return [];

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const childNodes = Array.from(doc.body.childNodes);

    const result: SubtopicSectionData[] = [];
    let currentHeadingNode: Element | null = null;
    let currentContentNodes: Node[] = [];
    let sectionCount = 0;

    const finalizeSection = () => {
      if (!currentHeadingNode && currentContentNodes.length === 0) return;

      const tempContainer = doc.createElement('div');
      if (currentHeadingNode) {
        tempContainer.appendChild(currentHeadingNode.cloneNode(true));
      }
      currentContentNodes.forEach((node) => {
        tempContainer.appendChild(node.cloneNode(true));
      });

      const narrationScript = buildNarrationScript(tempContainer);
      if (!narrationScript.trim()) return;

      const headingHtml = currentHeadingNode ? currentHeadingNode.outerHTML : null;
      const headingText = currentHeadingNode ? currentHeadingNode.textContent?.trim() || 'Overview' : 'Overview';

      const contentContainer = doc.createElement('div');
      currentContentNodes.forEach((node) => {
        contentContainer.appendChild(node.cloneNode(true));
      });

      sectionCount++;
      result.push({
        id: `${topicSlug}-subtopic-${sectionCount}`,
        headingHtml,
        headingText,
        contentHtml: contentContainer.innerHTML,
        narrationScript,
      });
    };

    for (const node of childNodes) {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const el = node as Element;
        if (/^H[2-6]$/i.test(el.tagName)) {
          finalizeSection();
          currentHeadingNode = el;
          currentContentNodes = [];
          continue;
        }
      }
      currentContentNodes.push(node);
    }
    finalizeSection();

    return result;
  }, [html, topicSlug]);

  if (!html) {
    return <div className="article-content"><p>Loading note...</p></div>;
  }

  return (
    <div className="article-content subtopics-container">
      {sections.map((section) => (
        <div key={section.id} className="subtopic-block">
          {section.headingHtml ? (
            <div className="subtopic-heading-row">
              <div
                className="subtopic-heading-content"
                dangerouslySetInnerHTML={{ __html: section.headingHtml }}
              />
              <TextToAudioButton
                subtopicId={section.id}
                text={section.narrationScript}
                subtopicTitle={section.headingText}
              />
            </div>
          ) : (
            <div className="subtopic-intro-header">
              <TextToAudioButton
                subtopicId={section.id}
                text={section.narrationScript}
                subtopicTitle="Overview"
              />
            </div>
          )}
          <div
            className="subtopic-body-content"
            dangerouslySetInnerHTML={{ __html: section.contentHtml }}
          />
        </div>
      ))}
    </div>
  );
}
