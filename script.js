const FORM_NAME = "Excavation_Trenching_Safety_Inspection";

document.addEventListener("DOMContentLoaded", function () {

    // ==============================
    // CHECKLIST OPTIONS
    // ==============================

    const checklistOptions = document.querySelectorAll(".checkbox-option");

    checklistOptions.forEach(function (option) {
        option.addEventListener("click", function () {

            const checklistItem = option.closest(".checklist-item");

            if (!checklistItem) return;

            const options = checklistItem.querySelectorAll(".checkbox-option");

            options.forEach(function (item) {
                item.classList.remove("selected");
            });

            option.classList.add("selected");
        });
    });


    // ==============================
    // STATUS OPTIONS
    // ==============================

    const statusItems = document.querySelectorAll(".status-item");

    statusItems.forEach(function (item) {
        item.addEventListener("click", function () {

            const statusSummary = item.closest(".status-summary");

            if (!statusSummary) return;

            const allStatusItems =
                statusSummary.querySelectorAll(".status-item");

            allStatusItems.forEach(function (status) {
                status.classList.remove("selected");
            });

            item.classList.add("selected");
        });
    });


    // ==============================
    // BUTTONS
    // ==============================

    const pdfBtn = document.getElementById("pdfBtn");
    const wordBtn = document.getElementById("wordBtn");
    const clearBtn = document.getElementById("clearBtn");


    if (pdfBtn) {
        pdfBtn.addEventListener("click", downloadPDF);
    }

    if (wordBtn) {
        wordBtn.addEventListener("click", downloadWord);
    }

    if (clearBtn) {
        clearBtn.addEventListener("click", clearForm);
    }

});


// ==================================================
// LOAD EXTERNAL LIBRARY
// ==================================================

function loadScript(src) {

    return new Promise(function (resolve, reject) {

        const script = document.createElement("script");

        script.src = src;

        script.onload = function () {
            resolve();
        };

        script.onerror = function () {
            reject(new Error("Could not load library: " + src));
        };

        document.head.appendChild(script);
    });
}


// ==================================================
// LOAD REQUIRED LIBRARIES
// ==================================================

async function loadLibraries() {

    // PDF
    if (typeof html2pdf === "undefined") {

        await loadScript(
            "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"
        );
    }


    // Word
    if (typeof htmlDocx === "undefined") {

        await loadScript(
            "https://unpkg.com/html-docx-js/dist/html-docx.js"
        );
    }


    // Save files
    if (typeof saveAs === "undefined") {

        await loadScript(
            "https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js"
        );
    }
}


// ==================================================
// CLONE FORM
// ==================================================

function cloneForm() {

    const original = document.getElementById("document");

    if (!original) {
        throw new Error("Element #document was not found.");
    }

    const clone = original.cloneNode(true);


    // Copy input values
    const originalInputs =
        original.querySelectorAll("input, textarea");

    const clonedInputs =
        clone.querySelectorAll("input, textarea");


    originalInputs.forEach(function (input, index) {

        const clonedInput = clonedInputs[index];

        if (!clonedInput) return;


        if (input.tagName.toLowerCase() === "textarea") {

            clonedInput.textContent = input.value;

        } else {

            clonedInput.setAttribute(
                "value",
                input.value
            );
        }
    });


    return clone;
}


// ==================================================
// DOWNLOAD PDF
// ==================================================

async function downloadPDF() {

    const button = document.getElementById("pdfBtn");

    try {

        if (button) {
            button.disabled = true;
            button.textContent = "Preparing PDF...";
        }


        await loadLibraries();


        const clone = cloneForm();


        // Create hidden container
        const wrapper = document.createElement("div");

        wrapper.style.position = "fixed";
        wrapper.style.left = "-100000px";
        wrapper.style.top = "0";
        wrapper.style.width = "210mm";
        wrapper.style.background = "#ffffff";


        wrapper.appendChild(clone);

        document.body.appendChild(wrapper);


        // Generate PDF
        await html2pdf()
            .set({

                margin: 8,

                filename:
                    FORM_NAME + ".pdf",

                image: {
                    type: "jpeg",
                    quality: 0.98
                },

                html2canvas: {

                    scale: 2,

                    useCORS: true,

                    backgroundColor: "#ffffff"
                },

                jsPDF: {

                    unit: "mm",

                    format: "a4",

                    orientation: "portrait"
                },

                pagebreak: {

                    mode: [
                        "css",
                        "legacy"
                    ],

                    avoid: [
                        ".checklist-item",
                        ".signature-box"
                    ]
                }

            })
            .from(clone)
            .save();


        wrapper.remove();


    } catch (error) {

        console.error(error);

        alert(
            "حدثت مشكلة أثناء إنشاء ملف PDF.\n\n" +
            "تأكدي من اتصال الإنترنت ثم حاولي مرة أخرى."
        );

    } finally {

        if (button) {

            button.disabled = false;

            button.textContent = "Download PDF";
        }
    }
}


// ==================================================
// DOWNLOAD WORD
// ==================================================

async function downloadWord() {

    const button =
        document.getElementById("wordBtn");


    try {

        if (button) {

            button.disabled = true;

            button.textContent =
                "Preparing Word...";
        }


        await loadLibraries();


        const clone = cloneForm();


        const html = `

<!DOCTYPE html>

<html>

<head>

<meta charset="UTF-8">

<style>

body {
    font-family: Arial, sans-serif;
    font-size: 11pt;
    color: #343A40;
}

h1,
h2,
h3 {
    font-family: Arial, sans-serif;
}

.checklist-item {
    padding: 8px 0;
    border-bottom: 1px solid #dddddd;
}

.signature-box {
    padding: 15px;
    margin-bottom: 15px;
    border: 1px dashed #777777;
}

.info-box {
    padding: 10px;
    background: #D1ECF1;
}

.alert-box {
    padding: 10px;
    background: #F8D7DA;
}

</style>

</head>

<body>

${clone.innerHTML}

</body>

</html>

`;


        const blob =
            htmlDocx.asBlob(html);


        saveAs(
            blob,
            FORM_NAME + ".docx"
        );


    } catch (error) {

        console.error(error);

        alert(
            "حدثت مشكلة أثناء إنشاء ملف Word.\n\n" +
            "تأكدي من اتصال الإنترنت ثم حاولي مرة أخرى."
        );

    } finally {

        if (button) {

            button.disabled = false;

            button.textContent =
                "Download Word";
        }
    }
}


// ==================================================
// CLEAR FORM
// ==================================================

function clearForm() {

    const confirmed =
        confirm(
            "هل تريدين مسح جميع البيانات الموجودة في الفورم؟"
        );


    if (!confirmed) {
        return;
    }


    // Clear text inputs
    document
        .querySelectorAll("#document input")
        .forEach(function (input) {

            input.value = "";
        });


    // Clear textareas
    document
        .querySelectorAll("#document textarea")
        .forEach(function (textarea) {

            textarea.value = "";
        });


    // Clear checklist selections
    document
        .querySelectorAll(
            "#document .checkbox-option"
        )
        .forEach(function (option) {

            option.classList.remove("selected");
        });


    // Clear status selection
    document
        .querySelectorAll(
            "#document .status-item"
        )
        .forEach(function (item) {

            item.classList.remove("selected");
        });


    // Return to top
    window.scrollTo({

        top: 0,

        behavior: "smooth"
    });
}