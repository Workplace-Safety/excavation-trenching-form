/* =========================================================
   EXCAVATION & TRENCHING SAFETY INSPECTION
   COMPLETE JAVASCRIPT
   ========================================================= */


/* =========================================================
   GLOBAL SETTINGS
   ========================================================= */

const FORM_NAME =
    "Excavation_Trenching_Safety_Inspection";


/* =========================================================
   WAIT UNTIL PAGE LOADS
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    initializeRadioButtons();

    initializeToolbar();

});


/* =========================================================
   TOOLBAR
   ========================================================= */

function initializeToolbar() {

    const pdfBtn =
        document.getElementById("pdfBtn");

    const wordBtn =
        document.getElementById("wordBtn");

    const clearBtn =
        document.getElementById("clearBtn");


    if (pdfBtn) {

        pdfBtn.addEventListener(
            "click",
            downloadPDF
        );

    }


    if (wordBtn) {

        wordBtn.addEventListener(
            "click",
            downloadWord
        );

    }


    if (clearBtn) {

        clearBtn.addEventListener(
            "click",
            clearForm
        );

    }

}


/* =========================================================
   RADIO BUTTONS
   ========================================================= */

function initializeRadioButtons() {

    const radioButtons =
        document.querySelectorAll(
            'input[type="radio"]'
        );


    radioButtons.forEach(function (radio) {

        updateRadioVisual(radio);


        radio.addEventListener(
            "change",
            function () {

                const groupName =
                    radio.name;

                const group =
                    document.querySelectorAll(
                        'input[type="radio"][name="' +
                        CSS.escape(groupName) +
                        '"]'
                    );


                group.forEach(function (item) {

                    updateRadioVisual(item);

                });

            }
        );

    });

}


/* =========================================================
   UPDATE RADIO VISUAL
   ========================================================= */

function updateRadioVisual(radio) {

    const label =
        radio.closest("label");

    if (!label) {
        return;
    }


    if (radio.checked) {

        label.classList.add(
            "selected"
        );

    } else {

        label.classList.remove(
            "selected"
        );

    }

}


/* =========================================================
   LOAD EXTERNAL LIBRARY
   ========================================================= */

function loadScript(src) {

    return new Promise(function (resolve, reject) {

        /*
           Check whether library is already loaded
        */

        const existing =
            document.querySelector(
                'script[src="' + src + '"]'
            );


        if (existing) {

            /*
               If the global library already exists,
               resolve immediately.
            */

            if (
                src.includes("html2pdf") &&
                typeof html2pdf !== "undefined"
            ) {

                resolve();

                return;

            }


            if (
                src.includes("FileSaver") &&
                typeof saveAs !== "undefined"
            ) {

                resolve();

                return;

            }


            if (
                src.includes("html-docx") &&
                typeof htmlDocx !== "undefined"
            ) {

                resolve();

                return;

            }


            existing.addEventListener(
                "load",
                resolve
            );

            existing.addEventListener(
                "error",
                reject
            );

            return;
        }


        const script =
            document.createElement("script");


        script.src = src;

        script.onload = resolve;

        script.onerror = reject;

        document.head.appendChild(script);

    });

}


/* =========================================================
   LOAD ALL DOWNLOAD LIBRARIES
   ========================================================= */

async function loadDownloadLibraries() {

    /*
       PDF
    */

    if (
        typeof html2pdf ===
        "undefined"
    ) {

        await loadScript(
            "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"
        );

    }


    /*
       FileSaver
    */

    if (
        typeof saveAs ===
        "undefined"
    ) {

        await loadScript(
            "https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js"
        );

    }


    /*
       HTML DOCX
    */

    if (
        typeof htmlDocx ===
        "undefined"
    ) {

        await loadScript(
            "https://unpkg.com/html-docx-js/dist/html-docx.js"
        );

    }

}


/* =========================================================
   READ CURRENT FORM VALUES
   ========================================================= */

function collectFormValues() {

    const documentElement =
        document.getElementById(
            "document"
        );


    if (!documentElement) {

        return null;

    }


    /*
       Clone the document
    */

    const clone =
        documentElement.cloneNode(
            true
        );


    /*
       Copy text input values
    */

    const originalInputs =
        documentElement.querySelectorAll(
            "input"
        );

    const clonedInputs =
        clone.querySelectorAll(
            "input"
        );


    originalInputs.forEach(
        function (original, index) {

            const cloned =
                clonedInputs[index];

            if (!cloned) {
                return;
            }


            /*
               Text inputs
            */

            if (
                original.type ===
                    "text" ||
                original.type ===
                    "date" ||
                original.type ===
                    "number" ||
                original.type ===
                    "email"
            ) {

                cloned.setAttribute(
                    "value",
                    original.value
                );

            }


            /*
               Radio buttons
            */

            if (
                original.type ===
                "radio"
            ) {

                if (
                    original.checked
                ) {

                    cloned.setAttribute(
                        "checked",
                        "checked"
                    );

                } else {

                    cloned.removeAttribute(
                        "checked"
                    );

                }

            }

        }
    );


    /*
       Textareas
    */

    const originalTextareas =
        documentElement.querySelectorAll(
            "textarea"
        );

    const clonedTextareas =
        clone.querySelectorAll(
            "textarea"
        );


    originalTextareas.forEach(
        function (original, index) {

            const cloned =
                clonedTextareas[index];

            if (!cloned) {
                return;
            }

            cloned.textContent =
                original.value;

        }
    );


    /*
       Replace radio buttons with
       printable visual boxes
    */

    const clonedRadios =
        clone.querySelectorAll(
            'input[type="radio"]'
        );


    clonedRadios.forEach(
        function (radio) {

            const checked =
                radio.hasAttribute(
                    "checked"
                );

            const visual =
                document.createElement(
                    "span"
                );


            visual.style.display =
                "inline-flex";

            visual.style.width =
                "20px";

            visual.style.height =
                "20px";

            visual.style.border =
                "2px solid #343A40";

            visual.style.marginRight =
                "5px";

            visual.style.verticalAlign =
                "middle";

            visual.style.alignItems =
                "center";

            visual.style.justifyContent =
                "center";

            visual.style.fontWeight =
                "700";


            if (checked) {

                visual.textContent =
                    "✓";

            }


            radio.replaceWith(
                visual
            );

        }
    );


    /*
       Remove browser-only toolbar
    */

    const toolbar =
        clone.querySelector(
            ".toolbar"
        );

    if (toolbar) {

        toolbar.remove();

    }


    /*
       Remove no-print elements
    */

    clone
        .querySelectorAll(
            ".no-print"
        )
        .forEach(
            function (element) {

                element.remove();

            }
        );


    return clone;

}


/* =========================================================
   CREATE EXPORT WRAPPER
   ========================================================= */

function createExportWrapper(
    clone
) {

    const wrapper =
        document.createElement(
            "div"
        );


    wrapper.style.position =
        "fixed";

    wrapper.style.left =
        "-100000px";

    wrapper.style.top =
        "0";

    wrapper.style.width =
        "8.5in";

    wrapper.style.background =
        "#ffffff";

    wrapper.style.zIndex =
        "-1";


    wrapper.appendChild(
        clone
    );


    document.body.appendChild(
        wrapper
    );


    return wrapper;

}


/* =========================================================
   BUTTON LOADING STATE
   ========================================================= */

function setButtonLoading(
    button,
    loadingText
) {

    if (!button) {
        return;
    }


    button.disabled =
        true;

    button.dataset.originalText =
        button.textContent;

    button.textContent =
        loadingText;

}


/* =========================================================
   RESTORE BUTTON
   ========================================================= */

function restoreButton(
    button
) {

    if (!button) {
        return;
    }


    button.disabled =
        false;


    if (
        button.dataset.originalText
    ) {

        button.textContent =
            button.dataset.originalText;

    }

}


/* =========================================================
   DOWNLOAD WORD
   ========================================================= */

async function downloadWord() {

    const button =
        document.getElementById(
            "wordBtn"
        );


    try {

        setButtonLoading(
            button,
            "Preparing Word..."
        );


        /*
           Load required libraries
        */

        await loadDownloadLibraries();


        /*
           Create export copy
        */

        const clone =
            collectFormValues();


        if (!clone) {

            throw new Error(
                "Document not found."
            );

        }


        /*
           Prepare export styles
        */

        clone.style.width =
            "100%";

        clone.style.maxWidth =
            "none";

        clone.style.margin =
            "0";

        clone.style.padding =
            "20px";

        clone.style.background =
            "#ffffff";

        clone.style.color =
            "#000000";


        /*
           Word HTML
        */

        const wordHTML = `
<!DOCTYPE html>
<html>

<head>

<meta charset="UTF-8">

<title>
Excavation & Trenching Safety Inspection
</title>

<style>

* {
    box-sizing: border-box;
}

body {
    font-family:
        Arial,
        Helvetica,
        sans-serif;

    font-size: 11pt;

    color: #343A40;

    line-height: 1.5;

    margin: 0;

    padding: 20px;

    background: #ffffff;
}

h1 {
    font-size: 22pt;

    color: #FF6B35;

    margin-bottom: 15px;
}

h2 {
    font-size: 16pt;

    color: #ffffff;

    background: #1E3A5F;

    padding: 10px;

    margin-top: 25px;
}

h3 {
    font-size: 13pt;

    color: #343A40;
}

table {
    width: 100%;

    border-collapse: collapse;
}

td,
th {
    border: 1px solid #777777;

    padding: 5px;

    vertical-align: top;
}

input {
    border: none;

    border-bottom:
        1px solid #343A40;

    background:
        transparent;
}

textarea {
    border:
        1px solid #777777;

    width: 100%;

    min-height: 100px;
}

.info-box {
    background: #D1ECF1;

    border-left:
        4px solid #17A2B8;

    padding: 10px;

    margin: 15px 0;
}

.alert-box {
    background: #F8D7DA;

    border-left:
        4px solid #DC143C;

    padding: 10px;

    margin: 15px 0;
}

.checklist-item {
    display: block;

    padding: 8px 0;

    border-bottom:
        1px solid #dddddd;
}

.checkbox-container {
    display: inline-block;

    margin-right: 10px;
}

.item-text {
    display: inline;
}

.signature-section {
    display: block;

    margin-top: 25px;
}

.signature-box {
    border:
        1px dashed #777777;

    padding: 15px;

    margin-bottom: 15px;
}

.footer {
    margin-top: 30px;

    padding-top: 10px;

    border-top:
        1px solid #777777;

    font-size: 8pt;

    color: #666666;

    text-align: center;
}

</style>

</head>

<body>

${clone.innerHTML}

</body>

</html>
`;


        /*
           Convert HTML to DOCX
        */

        const blob =
            htmlDocx.asBlob(
                wordHTML
            );


        /*
           Save actual DOCX
        */

        saveAs(
            blob,
            FORM_NAME +
            ".docx"
        );


        /*
           Remove temporary clone
        */

        const temporary =
            document.querySelector(
                'body > div[style*="-100000px"]'
            );

        if (temporary) {

            temporary.remove();

        }


    } catch (error) {

        console.error(
            "Word export error:",
            error
        );


        alert(
            "حدثت مشكلة أثناء إنشاء ملف Word.\nحاول مرة أخرى."
        );

    } finally {

        restoreButton(
            button
        );

    }

}


/* =========================================================
   DOWNLOAD PDF
   ========================================================= */

async function downloadPDF() {

    const button =
        document.getElementById(
            "pdfBtn"
        );


    try {

        setButtonLoading(
            button,
            "Preparing PDF..."
        );


        /*
           Load PDF library
        */

        await loadDownloadLibraries();


        /*
           Create export copy
        */

        const clone =
            collectFormValues();


        if (!clone) {

            throw new Error(
                "Document not found."
            );

        }


        /*
           Export styling
        */

        clone.style.width =
            "100%";

        clone.style.maxWidth =
            "none";

        clone.style.margin =
            "0";

        clone.style.padding =
            "20px";

        clone.style.background =
            "#ffffff";


        /*
           Wrapper
        */

        const wrapper =
            createExportWrapper(
                clone
            );


        /*
           PDF options
        */

        const options = {

            margin: [
                8,
                8,
                8,
                8
            ],

            filename:
                FORM_NAME +
                ".pdf",

            image: {

                type: "jpeg",

                quality: 0.98

            },

            html2canvas: {

                scale: 2,

                useCORS: true,

                allowTaint: true,

                backgroundColor:
                    "#ffffff",

                logging: false

            },

            jsPDF: {

                unit: "mm",

                format: "a4",

                orientation:
                    "portrait",

                compress: true

            },

            pagebreak: {

                mode: [
                    "css",
                    "legacy"
                ],

                avoid: [
                    ".checklist-item",
                    ".signature-box",
                    ".info-box",
                    ".alert-box"
                ]

            }

        };


        /*
           Generate PDF
        */

        await html2pdf()
            .set(options)
            .from(clone)
            .save();


        /*
           Remove temporary wrapper
        */

        wrapper.remove();


    } catch (error) {

        console.error(
            "PDF export error:",
            error
        );


        alert(
            "حدثت مشكلة أثناء إنشاء ملف PDF.\nحاول مرة أخرى."
        );

    } finally {

        restoreButton(
            button
        );

    }

}


/* =========================================================
   CLEAR FORM
   ========================================================= */

function clearForm() {

    const confirmed =
        window.confirm(
            "هل تريدين مسح جميع البيانات الموجودة في الفورم؟"
        );


    if (!confirmed) {

        return;

    }


    const documentElement =
        document.getElementById(
            "document"
        );


    if (!documentElement) {

        return;

    }


    /*
       Clear text fields
    */

    documentElement
        .querySelectorAll(
            "input[type='text'], input[type='date'], input[type='number'], input[type='email']"
        )
        .forEach(
            function (input) {

                input.value = "";

            }
        );


    /*
       Clear textareas
    */

    documentElement
        .querySelectorAll(
            "textarea"
        )
        .forEach(
            function (textarea) {

                textarea.value = "";

            }
        );


    /*
       Uncheck radios
    */

    documentElement
        .querySelectorAll(
            "input[type='radio']"
        )
        .forEach(
            function (radio) {

                radio.checked =
                    false;

                updateRadioVisual(
                    radio
                );

            }
        );


    /*
       Return to top of form
       only when user explicitly presses Clear.
    */

    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}


/* =========================================================
   PREVENT UNWANTED FORM SUBMISSION
   ========================================================= */

document.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();

    }
);


/* =========================================================
   KEEP DOWNLOAD BAR FIXED
   ========================================================= */

window.addEventListener(
    "scroll",
    function () {

        const toolbar =
            document.querySelector(
                ".toolbar"
            );


        if (!toolbar) {
            return;
        }


        /*
           This is intentionally empty.

           position: fixed in CSS is responsible
           for keeping the toolbar at the top.

           We do NOT modify scroll position here.
        */

    },
    {
        passive: true
    }
);
