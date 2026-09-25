document.addEventListener('DOMContentLoaded', () => {

    // 1. PRINT BUTTON FUNCTIONALITY
    const printBtn = document.getElementById('printBtn');
    if (printBtn) {
        printBtn.addEventListener('click', () => {
            window.print();
        });
    }

    // 2. FORM RESET FUNCTIONALITY
    const resetBtn = document.getElementById('resetBtn');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to reset all form fields?')) {
                const form = document.getElementById('inspectionForm');
                if (form) form.reset();
            }
        });
    }

    // 3. EXPORT TO PDF FUNCTIONALITY
    const downloadPdfBtn = document.getElementById('downloadPdfBtn');
    if (downloadPdfBtn) {
        downloadPdfBtn.addEventListener('click', () => {
            const element = document.getElementById('formContent');

            if (typeof html2pdf !== 'undefined') {
                const opt = {
                    margin:       [0.3, 0.3, 0.3, 0.3],
                    filename:     'Excavation_Safety_Inspection.pdf',
                    image:        { type: 'jpeg', quality: 0.98 },
                    html2canvas:  { scale: 2, useCORS: true, logging: false },
                    jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
                };
                html2pdf().set(opt).from(element).save();
            } else {
                alert('PDF generator library is loading, please try again in a second or use the Print button.');
            }
        });
    }

    // 4. EXPORT TO WORD FUNCTIONALITY (.doc)
    const downloadWordBtn = document.getElementById('downloadWordBtn');
    if (downloadWordBtn) {
        downloadWordBtn.addEventListener('click', () => {
            const formContainer = document.getElementById('formContent');
            if (!formContainer) return;

            // Clone container to preserve original UI
            const element = formContainer.cloneNode(true);

            // Convert inputs to plain text in clone
            const inputs = element.querySelectorAll('input[type="text"], input[type="date"], input[type="datetime-local"]');
            inputs.forEach(input => {
                const span = document.createElement('span');
                span.style.borderBottom = "1px solid #343a40";
                span.style.display = "inline-block";
                span.style.minWidth = "120px";
                span.style.padding = "2px 5px";
                span.innerText = input.value || '___________';
                input.parentNode.replaceChild(span, input);
            });

            // Convert textareas to plain text
            const textareas = element.querySelectorAll('textarea');
            textareas.forEach(textarea => {
                const div = document.createElement('div');
                div.style.border = "1px solid #6c757d";
                div.style.padding = "8px";
                div.style.minHeight = "80px";
                div.innerText = textarea.value || '';
                textarea.parentNode.replaceChild(div, textarea);
            });

            // Convert radio buttons to text indicators
            const radios = element.querySelectorAll('input[type="radio"]');
            radios.forEach(radio => {
                const span = document.createElement('span');
                span.innerText = radio.checked ? ' [✓] ' : ' [ ] ';
                if (radio.parentNode) {
                    radio.parentNode.insertBefore(span, radio);
                    radio.remove();
                }
            });

            const headerHtml = "<html xmlns:o='urn:schemas-microsoft-com:office:office' " +
                "xmlns:w='urn:schemas-microsoft-com:office:word' " +
                "xmlns='http://www.w3.org/TR/REC-html40'>" +
                "<head><meta charset='utf-8'><title>Safety Inspection</title></head><body>";
            const footerHtml = "</body></html>";
            
            const sourceHTML = headerHtml + element.innerHTML + footerHtml;

            const blob = new Blob(['\ufeff' + sourceHTML], {
                type: 'application/msword'
            });

            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'Excavation_Safety_Inspection.doc';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });
    }

});