import React, { useCallback } from 'react';

export const usePrint = (contentRef: React.RefObject<HTMLElement>) => {
  const handlePrint = useCallback(() => {
    const content = contentRef.current;
    if (!content) {
      console.error("Print content not found.");
      return;
    }

    const printWindow = window.open('', '', 'height=800,width=1200');

    if (printWindow) {
      printWindow.document.write('<html><head><title>Stampa Report</title>');
      
      // Copy all link and style tags
      const styles = document.head.querySelectorAll('link, style');
      styles.forEach(style => {
        printWindow.document.head.appendChild(style.cloneNode(true));
      });
      
      // Copy Tailwind script and its config
      const scripts = document.head.querySelectorAll('script');
       scripts.forEach(script => {
        if (script.src.includes('tailwindcss') || script.innerHTML.includes('tailwind.config')) {
           const newScript = printWindow.document.createElement('script');
           if (script.src) {
               newScript.src = script.src;
           } else {
               newScript.innerHTML = script.innerHTML;
           }
           printWindow.document.head.appendChild(newScript);
        }
      });


      printWindow.document.write('</head><body>');
      printWindow.document.write(content.innerHTML);
      printWindow.document.write('</body></html>');
      
      printWindow.document.close();
      
      setTimeout(() => {
        printWindow.focus();
        printWindow.print();
        printWindow.close();
      }, 500);

    } else {
      alert('La finestra di stampa è stata bloccata dal browser. Abilita i popup per questo sito.');
    }
  }, [contentRef]);

  return handlePrint;
};
