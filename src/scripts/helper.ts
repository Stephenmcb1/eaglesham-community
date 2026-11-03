/*
  The response helper (brief §7.2), used by src/components/ResponseHelper.astro.

  It turns the visitor's answers into a draft response they can edit, copy and print.
  Nothing is sent to a server. The draft is kept in this browser's localStorage so it
  survives a reload, and "Clear my draft" removes it.
*/

// What we keep in localStorage. "v1" in the key lets us change this shape later
// without old saved drafts breaking the page.
interface SavedDraft {
  parts: string[];
  positions: Record<string, string>;
  concerns: string[];
  ownWords: string;
  draft: string;
  edited: boolean;
}

const STORAGE_KEY = "ldp3-response-draft-v1";

function setUpHelper(form: HTMLFormElement): void {
  const fallback = document.querySelector<HTMLElement>(".helper-fallback");
  const partBoxes = [...form.querySelectorAll<HTMLInputElement>('input[name="part"]')];
  const concernBoxes = [...form.querySelectorAll<HTMLInputElement>('input[name="concern"]')];
  const ownWords = form.querySelector<HTMLTextAreaElement>("#own-words")!;
  const draft = form.querySelector<HTMLTextAreaElement>("#draft")!;
  const rebuild = form.querySelector<HTMLElement>(".rebuild")!;
  const status = form.querySelector<HTMLElement>("[data-status]")!;
  const errorSummary = form.querySelector<HTMLElement>(".error-summary")!;
  const draftField = form.querySelector<HTMLElement>("[data-draft-field]")!;
  const draftError = form.querySelector<HTMLElement>("#draft-error")!;
  const printCopy = document.querySelector<HTMLElement>(".print-response")!;

  // true once the visitor types in the draft box. From then on we stop rewriting it,
  // so their changes aren't lost, and offer "Start again from my answers" instead.
  let edited = false;

  // Swap the plain list for the helper
  form.hidden = false;
  if (fallback) fallback.hidden = true;

  // ---------- Reading the answers ----------

  const chosenParts = () => partBoxes.filter((box) => box.checked);

  function positionOf(partId: string): string {
    const chosen = form.querySelector<HTMLInputElement>(`input[name="position-${partId}"]:checked`);
    return chosen ? chosen.value : "";
  }

  // ---------- Showing only the questions that apply ----------

  function updateVisibleQuestions(): void {
    const chosenIds = chosenParts().map((box) => box.value);

    // One "what's your view?" question per chosen part
    form.querySelectorAll<HTMLFieldSetElement>("[data-position-for]").forEach((fieldset) => {
      fieldset.hidden = !chosenIds.includes(fieldset.dataset.positionFor!);
    });

    // Points about the chosen sites. "The plan in general", or nothing chosen yet, shows them all.
    const showAll = chosenIds.length === 0 || chosenIds.includes("general");
    concernBoxes.forEach((box) => {
      const sites = (box.dataset.sites ?? "").split(" ");
      const relevant = showAll || sites.some((id) => chosenIds.includes(id));
      box.closest<HTMLElement>("[data-concern]")!.hidden = !relevant;
    });

    // Hide an issue's heading when none of its points apply
    form.querySelectorAll<HTMLElement>("[data-concern-group]").forEach((group) => {
      group.hidden = !group.querySelector("[data-concern]:not([hidden])");
    });
  }

  // ---------- Building the draft ----------

  const VIEW_SENTENCES: Record<string, string> = {
    support: "I support this part of the plan.",
    object: "I object to this part of the plan.",
    comment: "I would like to comment on this part of the plan.",
  };

  function buildDraft(): string {
    const paragraphs: string[] = ["Response to the Proposed East Renfrewshire Local Development Plan 3 (LDP3)"];

    // "Waulkers Loan (Strat 1.8): I object to this part of the plan."
    for (const box of chosenParts()) {
      const name = box.dataset.ref ? `${box.dataset.name} (${box.dataset.ref})` : box.dataset.name!;
      const view = VIEW_SENTENCES[positionOf(box.value)];
      paragraphs.push(view ? `${name}: ${view}` : `${name}.`);
    }

    // One sentence for each ticked point that's showing
    for (const box of concernBoxes) {
      if (box.checked && !box.closest<HTMLElement>("[data-concern]")!.hidden) {
        paragraphs.push(box.dataset.text!);
      }
    }

    if (ownWords.value.trim()) paragraphs.push(ownWords.value.trim());

    // Just the heading means nothing has been chosen or written yet
    return paragraphs.length > 1 ? paragraphs.join("\n\n") : "";
  }

  function refreshDraft(): void {
    if (!edited) draft.value = buildDraft();
    rebuild.hidden = !edited;
  }

  // ---------- Saving in this browser ----------
  // localStorage can be switched off or full, so every read and write is wrapped in try/catch.
  // If it fails, the helper still works; the draft just isn't kept after a reload.

  function save(): void {
    const saved: SavedDraft = {
      parts: chosenParts().map((box) => box.value),
      positions: Object.fromEntries(partBoxes.map((box) => [box.value, positionOf(box.value)])),
      concerns: concernBoxes.filter((box) => box.checked).map((box) => box.value),
      ownWords: ownWords.value,
      draft: draft.value,
      edited,
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    } catch {
      // Not saved. Nothing else to do.
    }
  }

  function load(): SavedDraft | null {
    try {
      const text = localStorage.getItem(STORAGE_KEY);
      return text ? (JSON.parse(text) as SavedDraft) : null;
    } catch {
      return null;
    }
  }

  function restore(saved: SavedDraft): void {
    partBoxes.forEach((box) => (box.checked = saved.parts?.includes(box.value) ?? false));
    for (const [partId, value] of Object.entries(saved.positions ?? {})) {
      const radio = form.querySelector<HTMLInputElement>(`input[name="position-${partId}"][value="${value}"]`);
      if (radio) radio.checked = true;
    }
    concernBoxes.forEach((box) => (box.checked = saved.concerns?.includes(box.value) ?? false));
    ownWords.value = saved.ownWords ?? "";
    edited = saved.edited ?? false;
    if (edited) draft.value = saved.draft ?? "";
  }

  // ---------- Messages ----------

  function announce(message: string): void {
    // Clearing first makes screen readers announce the same message again if it repeats
    status.textContent = "";
    window.setTimeout(() => (status.textContent = message), 50);
  }

  function showError(message: string): void {
    errorSummary.querySelector("[data-error-summary-text]")!.textContent = message;
    errorSummary.hidden = false;
    draftError.textContent = message;
    draftError.hidden = false;
    draftField.classList.add("has-error");
    errorSummary.focus();
  }

  function clearError(): void {
    errorSummary.hidden = true;
    draftError.hidden = true;
    draftField.classList.remove("has-error");
  }

  // Copy and print need something to work with
  function draftIsEmpty(): boolean {
    if (draft.value.trim()) return false;
    showError("Your response is empty. Choose a part of the plan or write something in your own words first.");
    return true;
  }

  // ---------- Buttons ----------

  form.querySelector("[data-copy]")!.addEventListener("click", async () => {
    if (draftIsEmpty()) return;
    clearError();
    try {
      await navigator.clipboard.writeText(draft.value);
      announce("Copied. Now paste it into the council's form or an email.");
    } catch {
      // Copying isn't allowed (some older browsers): select the text so they can copy it themselves
      draft.focus();
      draft.select();
      announce("Your response is selected. Copy it with your device's copy command.");
    }
  });

  form.querySelector("[data-print]")!.addEventListener("click", () => {
    if (draftIsEmpty()) return;
    clearError();
    printCopy.textContent = draft.value;
    document.documentElement.classList.add("printing-response");
    window.print();
  });

  // The print dialog has closed: go back to printing the whole page normally
  window.addEventListener("afterprint", () => {
    document.documentElement.classList.remove("printing-response");
  });

  form.querySelector("[data-rebuild]")!.addEventListener("click", () => {
    edited = false;
    refreshDraft();
    save();
    draft.focus();
    announce("Your response has been rebuilt from your answers.");
  });

  form.querySelector("[data-clear]")!.addEventListener("click", () => {
    if (!window.confirm("Clear everything you've chosen and written?")) return;
    form.reset();
    edited = false;
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Nothing was saved, so nothing to remove
    }
    clearError();
    updateVisibleQuestions();
    refreshDraft();
    announce("Your draft has been cleared.");
  });

  // ---------- Keeping everything up to date ----------

  form.addEventListener("input", (event) => {
    if (event.target === draft) {
      edited = true;
      rebuild.hidden = false;
    } else {
      updateVisibleQuestions();
      refreshDraft();
    }
    if (draft.value.trim()) clearError();
    save();
  });

  // Pressing Enter in a checkbox mustn't try to submit the form
  form.addEventListener("submit", (event) => event.preventDefault());

  // ---------- Start-up ----------

  const saved = load();
  if (saved) restore(saved);

  // "Respond about this site" buttons link here with ?site=waulkers-loan: tick that site
  const fromLink = new URLSearchParams(window.location.search).get("site");
  const linkedBox = partBoxes.find((box) => box.value === fromLink);
  if (linkedBox) linkedBox.checked = true;

  updateVisibleQuestions();
  refreshDraft();
}

// Start the helper, if this page has one
const helperForm = document.querySelector<HTMLFormElement>("form.helper");
if (helperForm) setUpHelper(helperForm);
