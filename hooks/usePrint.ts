import React, { useCallback } from 'react';

interface PrintOptions {
    documentTitle?: string;
    layout?: 'portrait' | 'landscape';
}

export const usePrint = (contentRef: React.RefObject<HTMLElement>) => {
  const handlePrint = useCallback((options: PrintOptions = {}) => {
    const { documentTitle = 'Stampa Report', layout = 'portrait' } = options;
    const content = contentRef.current;
    if (!content) {
      console.error("Print content not found.");
      return;
    }

    const printWindow = window.open('', '', 'height=800,width=1200');

    if (printWindow) {
      printWindow.document.write(`<html><head><title>${documentTitle}</title>`);
      
      const styles = document.head.querySelectorAll('link, style');
      styles.forEach(style => {
        printWindow.document.head.appendChild(style.cloneNode(true));
      });
      
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
      
      // Add custom styles for printing, including layout
      const printStyles = printWindow.document.createElement('style');
      printStyles.innerHTML = `
        @media print {
          @page {
            size: ${layout};
            margin: 1.5cm;
          }
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        }
      `;
      printWindow.document.head.appendChild(printStyles);

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