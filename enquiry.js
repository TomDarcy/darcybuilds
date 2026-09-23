(() => {
  const form = document.querySelector("#enquiry-form");
  if (!form) return;

  const preview = document.querySelector("#email-preview");
  const draft = document.querySelector("#enquiry-text");
  const emailLink = document.querySelector("#email-link");
  const status = document.querySelector("#form-status");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const answers = new FormData(form);
    const answer = (name) =>
      String(answers.get(name) || "").trim() || "Not specified";
    if (!String(answers.get("workflow") || "").trim()) {
      status.textContent = "Please describe the process you want to improve.";
      form.elements.workflow.focus();
      return;
    }
    draft.value = [
      "Hi Tom,",
      "I have a manufacturing workflow that could use some help.",
      `Process to improve:\n${answer("workflow")}`,
      `How it is done today: ${answers.getAll("current").join(", ") || "Not specified"}`,
      `People using it: ${answer("people")}`,
      `What goes wrong:\n${answer("problems")}`,
      `Time spent each week across the team (hours): ${answer("hours")}`,
      `Approximate budget: ${answer("budget")}`,
      "I can share a spreadsheet, screenshots or more detail as a next step.",
    ].join("\n\n");
    emailLink.href = `mailto:tom@darcybuilds.co.uk?subject=${encodeURIComponent("Show me the spreadsheet — workflow enquiry")}&body=${encodeURIComponent(draft.value)}`;
    preview.hidden = false;
    status.textContent =
      "Draft prepared. Review it below, then open your email app or copy the enquiry. Nothing has been sent.";
    draft.focus();
  });

  // Hide an old draft when answers change so it cannot be mistaken for the latest enquiry.
  form.addEventListener("input", () => {
    if (!preview.hidden) {
      preview.hidden = true;
      status.textContent =
        "Your answers changed. Prepare the email again to update your draft.";
    }
  });

  document
    .querySelector("#copy-enquiry")
    .addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(draft.value);
        status.textContent =
          "Enquiry copied. Paste it into an email to tom@darcybuilds.co.uk.";
      } catch {
        draft.focus();
        draft.select();
        status.textContent =
          "Select and copy the highlighted draft, then paste it into your email app.";
      }
    });
  // Keep native submission disabled if JavaScript is unavailable.
  form.querySelector('button[type="submit"]').disabled = false;
})();
