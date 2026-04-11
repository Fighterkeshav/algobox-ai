import { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  securityLevel: 'strict',
  fontFamily: 'inherit',
  flowchart: { htmlLabels: false },
});

interface MermaidProps {
  chart: string;
}

export default function Mermaid({ chart }: MermaidProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;

    const renderChart = async () => {
      if (!ref.current) return;
      const id = `mermaid-${Math.random().toString(36).slice(2, 11)}`;

      try {
        const result = await mermaid.render(id, chart);
        if (!cancelled && ref.current) {
          ref.current.replaceChildren();
          const tpl = document.createElement('template');
          tpl.innerHTML = result.svg;
          const svgElement = tpl.content.querySelector('svg');
          if (svgElement) {
            ref.current.appendChild(svgElement);
          }
        }
      } catch (e) {
        console.error('Mermaid render error', e);
      }
    };

    renderChart();
    return () => {
      cancelled = true;
    };
  }, [chart]);

  return <div ref={ref} className="w-full h-full flex justify-center" />;
}
