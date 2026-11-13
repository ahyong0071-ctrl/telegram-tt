import { useEffect, useState } from 'react';
import { translateText, getTargetLang } from '../../../api/translator';

interface OwnProps {
  text?: string;
}

export function TranslatedText({ text }: OwnProps) {
  const [translated, setTranslated] = useState('');

  useEffect(() => {
    let cancelled = false;
    if (!text) {
      setTranslated('');
      return;
    }
    
    translateText(text).then((t) => {
      if (!cancelled) setTranslated(t);
    });
    
    return () => { cancelled = true; };
  }, [text, getTargetLang()]);

  if (!translated || translated === text) {
    return null;
  }

  return (
    <div
      className="translated-text"
      style={{
        marginTop: '6px',
        paddingTop: '6px',
        borderTop: '1px dashed rgba(128,128,128,0.4)',
        color: 'var(--color-text-secondary)',
        fontSize: '0.92em',
        whiteSpace: 'pre-wrap',
      }}
    >
      {translated}
    </div>
  );
}
