export function showAlert(message: string, type: "success" | "error" | "info" = "info", duration = 3000) {
  const alert = document.getElementById("alert");
  const messageSpan = document.getElementById("alert-message");

  if (!alert || !messageSpan) return;

  // Aggiorna il messaggio e la classe
  messageSpan.textContent = message;

  alert.classList.remove("hidden", "alert-success", "alert-error", "alert-info");
  alert.classList.add("alert", `alert-${type}`, "alert-soft");

  alert.style.opacity = "0";
  alert.style.transition = "opacity 0.3s ease";
  alert.style.display = "flex"; // o block se preferisci

  // Forza il reflow per attivare la transizione
  // (trigger del browser, per sicurezza)
  alert.offsetHeight; 

  // Fade-in: porta opacity a 1 (visibile)
  alert.style.opacity = "1";

  // Dopo `duration`, fai fade-out
  setTimeout(() => {
    alert.style.opacity = "0";

    // Dopo la durata della transizione (300ms), nascondi il div
    setTimeout(() => {
      alert.style.display = "none";
    }, 300);
  }, duration);
}