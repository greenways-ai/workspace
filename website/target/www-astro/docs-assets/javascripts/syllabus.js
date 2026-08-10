(() => {
  const ready = (fn) => {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn, { once: true });
    } else {
      fn();
    }
  };

  const readProgress = (key) => {
    try {
      const value = JSON.parse(localStorage.getItem(key) ?? "[]");
      return new Set(Array.isArray(value) ? value : []);
    } catch (_) {
      return new Set();
    }
  };

  const writeProgress = (key, completed) => {
    try {
      localStorage.setItem(key, JSON.stringify([...completed]));
    } catch (_) {
      // Progress is optional. The course remains usable when storage is denied.
    }
  };

  const runnerState = (output) => {
    if (!output || output.hidden) return "idle";
    const declared = String(output.dataset.state ?? "").toLowerCase();
    const text = output.textContent.trim();
    const normalized = text.toLowerCase();

    if (declared === "error"
        || output.classList.contains("is-error")
        || normalized.startsWith("error")) return "error";
    if (declared === "pending"
        || output.classList.contains("is-pending")
        || normalized.includes("evaluating")) return "pending";
    if (declared === "ready") return "success";

    // The MkDocs editor prefixes returned values with =>. The Astro/Starlight
    // runner places the returned value in a hara-repl output element instead.
    if (output.matches(".hara-live-output") && text.startsWith("=>")) return "success";
    if (output.closest(".hara-repl") && text) return "success";
    return "idle";
  };

  ready(() => {
    document.querySelectorAll("[data-hara-syllabus]").forEach((syllabus) => {
      if (syllabus.dataset.haraSyllabusReady === "true") return;
      syllabus.dataset.haraSyllabusReady = "true";

      const id = syllabus.dataset.haraSyllabus;
      if (!id) return;
      const title = syllabus.dataset.haraSyllabusTitle ?? "Syllabus";
      const sessionGroup = String(syllabus.dataset.haraSessionGroup ?? "").trim();
      const storageKey = `hara-syllabus:${id}`;
      const steps = [...syllabus.querySelectorAll("[data-hara-step]")];
      if (!steps.length) return;
      const completed = readProgress(storageKey);

      const progress = document.createElement("aside");
      progress.className = "hara-syllabus-progress";
      progress.setAttribute("aria-label", `${title} progress`);

      const copy = document.createElement("div");
      copy.className = "hara-syllabus-progress__copy";
      const eyebrow = document.createElement("span");
      eyebrow.className = "hara-syllabus-progress__eyebrow";
      eyebrow.textContent = title.toUpperCase();
      const count = document.createElement("strong");
      count.dataset.haraProgressCount = "";
      copy.append(eyebrow, count);

      const reset = document.createElement("button");
      reset.type = "button";
      reset.dataset.haraProgressReset = "";
      reset.textContent = sessionGroup ? "Reset lesson" : "Reset progress";
      reset.setAttribute(
        "aria-label",
        sessionGroup
          ? `Reset ${title} progress and live session`
          : `Reset ${title} progress`
      );

      const track = document.createElement("div");
      track.className = "hara-syllabus-progress__bar";
      track.setAttribute("role", "progressbar");
      track.setAttribute("aria-label", `${title} completion`);
      track.setAttribute("aria-valuemin", "0");
      track.setAttribute("aria-valuemax", String(steps.length));
      const bar = document.createElement("span");
      track.append(bar);
      progress.append(copy, reset, track);
      syllabus.prepend(progress);

      const renderProgress = () => {
        const total = steps.length;
        const done = steps.filter((step) => completed.has(step.dataset.haraStep)).length;
        count.textContent = `${done} / ${total} complete`;
        bar.style.width = `${total ? (done / total) * 100 : 0}%`;
        track.setAttribute("aria-valuenow", String(done));
      };

      const attachOutputObserver = (step, button, status) => {
        const renderRunnerState = (output) => {
          if (completed.has(step.dataset.haraStep)) return;
          const state = runnerState(output);
          if (state === "success") {
            step.classList.add("is-ran");
            button.disabled = false;
            status.textContent = "Ran successfully · explain the result, then complete";
          } else if (state === "pending") {
            button.disabled = true;
            status.textContent = "Evaluating…";
          } else if (state === "error") {
            step.classList.remove("is-ran");
            button.disabled = true;
            status.textContent = "The form returned an error · fix it before completing";
          }
        };

        const bind = () => {
          const output = step.querySelector(".hara-live-output, .hara-repl output");
          if (!output || output.dataset.haraSyllabusBound === "true") return false;
          output.dataset.haraSyllabusBound = "true";
          new MutationObserver(() => renderRunnerState(output)).observe(output, {
            attributes: true,
            attributeFilter: ["class", "hidden", "data-state"],
            childList: true,
            characterData: true,
            subtree: true
          });
          renderRunnerState(output);
          return true;
        };

        if (bind()) return;
        const observer = new MutationObserver(() => {
          if (bind()) observer.disconnect();
        });
        observer.observe(step, { childList: true, subtree: true });
      };

      steps.forEach((step) => {
        const stepId = step.dataset.haraStep;
        if (!stepId) return;

        const footer = document.createElement("footer");
        footer.className = "hara-syllabus-step__footer";
        const status = document.createElement("span");
        status.className = "hara-syllabus-step__status";
        const button = document.createElement("button");
        button.type = "button";
        footer.append(status, button);
        step.append(footer);

        const renderStep = () => {
          const done = completed.has(stepId);
          step.classList.toggle("is-complete", done);
          if (done) {
            step.classList.remove("is-ran");
            status.textContent = "Complete";
            button.textContent = "Mark incomplete";
            button.disabled = false;
          } else {
            status.textContent = step.classList.contains("is-ran")
              ? "Ran successfully · explain the result, then complete"
              : "Run the example before completing this step";
            button.textContent = "Complete step";
            button.disabled = !step.classList.contains("is-ran");
          }
        };

        button.addEventListener("click", () => {
          if (completed.has(stepId)) completed.delete(stepId);
          else completed.add(stepId);
          writeProgress(storageKey, completed);
          renderStep();
          renderProgress();
        });

        renderStep();
        attachOutputObserver(step, button, status);
      });

      reset.addEventListener("click", () => {
        completed.clear();
        writeProgress(storageKey, completed);
        steps.forEach((step) => {
          step.classList.remove("is-complete", "is-ran");
          const status = step.querySelector(".hara-syllabus-step__status");
          const button = step.querySelector(".hara-syllabus-step__footer button");
          if (status) status.textContent = "Lesson reset · run the example again";
          if (button) {
            button.textContent = "Complete step";
            button.disabled = true;
          }
        });
        renderProgress();

        if (sessionGroup) {
          document.dispatchEvent(new CustomEvent("hara:reset-session", {
            detail: { groupName: sessionGroup, syllabusId: id }
          }));
        }
      });

      renderProgress();
    });
  });
})();
