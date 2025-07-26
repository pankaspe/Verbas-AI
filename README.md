
# Verbas AI

🌙 **Dark theme**  
![Dark theme](image-dark.png)

☀️ **Light theme**  
![Light theme](image-light.png)

**Verbas AI** è un editor Markdown avanzato per la scrittura di **libri**, **guide**, **articoli** o **appunti**, progettato per offrire un'esperienza **moderna**, **reattiva** e **performante**.  
È sviluppato in **Rust** e **SolidJS**, con focus su velocità, chiarezza strutturale e architettura scalabile.

---

## 🙋‍♂️ Un progetto indipendente

Mi chiamo **Andrea**, sviluppatore Rust e SolidJS.  
**Verbas AI** nasce come una **challenge personale**: creare un'app desktop elegante, utile e ben progettata, interamente da solo, nel tempo libero.  
È un **esercizio tecnico e creativo** che sta evolvendo in un editor solido e funzionale per la scrittura professionale.

Il codice è open source e aperto a idee, feedback o future collaborazioni.

---

## 🧠 Obiettivo del progetto

Verbas AI vuole essere:

- ✍️ Un **editor fluido e potente**, ideale per contenuti lunghi e strutturati  
- 📄 Capace di esportare in **Markdown**, **PDF** e **ePub**  
- 🧱 Basato su un’**architettura modulare**, facilmente estensibile  
- 🧩 Progettato per supportare **plugin**, **temi**, modalità di lettura e **AI assistita**  

---

## 🗂️ Struttura dei progetti `.verbas`

Ogni progetto Verbas segue una struttura chiara e organizzata:

```
📁 nome-progetto/         # Cartella root del progetto
├── project.verbas         # File di configurazione .verbas (JSON sotto il cofano)
├── export/
├── fonts/
├── images/
├── style/       
└── chapters/             
    ├── intro.md
    ├── capitolo-1.md
    └── ...
```

> Il file `.verbas` contiene metadati, impostazioni e configurazioni del progetto.

---

## ✨ Funzionalità attualmente implementate

| Funzionalità                                   | Stato |
|------------------------------------------------|-------|
| Creazione nuovo progetto `.verbas`             | ✅    |
| Apertura e parsing progetti `.verbas`          | ✅    |
| Salvataggio contenuto Markdown (`base.md`)     | ✅    |
| Salvataggio configurazione progetto            | ✅    |
| Clonazione progetto                            | ✅    |
| Parsing e pulizia frontmatter Markdown         | ✅    |
| Editor WYSIWYG Markdown (Milkdown)             | ✅    |
| Comunicazione backend Rust ↔ frontend JS       | ✅    |
| Riconoscimento editor pronto all’uso           | ✅    |
| Sidebar a scomparsa (con animazione)           | ✅    |
| Navigazione file browser integrata             | ✅    |
| Pannelli dinamici gestiti da stato globale     | ✅    |
| Switcher tema dark/light con DaisyUI           | ✅    |

⚠️ **Nota**: al momento, **cambiare tema resetta il contenuto dell’editor** (se non salvato), causando la perdita del lavoro non salvato.  
👉 Questo bug verrà corretto a breve: il contenuto sarà persistente e preservato durante lo switch del tema.

---

## 🛠️ Stack Tecnologico

| Tecnologia               | Ruolo                       | Motivazioni tecniche                            |
|--------------------------|------------------------------|--------------------------------------------------|
| 🦀 **Rust**              | Backend nativo (via Tauri)   | Sicuro, velocissimo, senza garbage collector     |
| 🧱 **Tauri**             | Framework desktop            | Leggero, sicuro, perfetto per app Rust+JS        |
| ⚛️ **SolidJS**          | Frontend reactive            | Reattività ultra-performante, architettura pulita|
| 🧪 **Milkdown**          | Editor Markdown WYSIWYG      | Output Markdown nativo, plugin-friendly          |
| 🎨 **Tailwind + DaisyUI**| Stile UI                     | Stile elegante, rapido da personalizzare         |
| ⚡ **Vite**              | Build system                 | Dev server istantaneo, perfetto per SolidJS      |

---

## 🧠 Dettaglio tecnico: Store e backend

### 🗂️ Store SolidJS

#### `projectStore.ts`

```ts
export const project = reactive<Project>({
  path: '',
  config: null,
});
```

#### `editorStore.ts`

```ts
const [editorInstance, setEditorInstance] = createSignal<Crepe | null>(null);
const [isEditorReady, setIsEditorReady] = createSignal(false);

export async function getMarkdown(): Promise<string | null> {
  const editor = editorInstance();
  if (!editor || !isEditorReady()) return null;
  try {
    // @ts-ignore
    return await editor.editor.action(ctx => ctx.get("doc"));
  } catch (e) {
    console.error("Errore leggendo dal context:", e);
    return null;
  }
}
```

#### `themeStore.ts`

```ts
const [theme, setTheme] = createSignal("forest");
onMount(() => {
  const saved = localStorage.getItem("theme");
  if (saved) setTheme(saved);
});
createEffect(() => {
  document.documentElement.setAttribute("data-theme", theme());
  localStorage.setItem("theme", theme());
});
```

---

## 🗺️ Roadmap

* [x] Setup progetto (Rust + Tauri + SolidJS)  
* [x] Supporto file `.verbas` (carica, salva, clona)  
* [x] Editor Milkdown integrato  
* [x] Gestione contenuti e struttura base  
* [x] UI con sidebar animata e pannelli contestuali  
* [x] Tema dark/light (con DaisyUI e switcher)  
* [ ] Fix stato editor tra cambi di tema  
* [ ] Modalità lettura / “papiro mode”  
* [ ] Esportazione PDF / ePub  
* [ ] Supporto plugin e moduli  
* [ ] Modalità AI assistita  

---

## 📬 Contatti

Se vuoi seguire lo sviluppo, contribuire o anche solo dire "ciao":

* 🌐 [github.com/tuo-username](https://github.com/tuo-username)  
* 🐦 Twitter/X: *(aggiungi se vuoi)*  
* 📬 Apri una issue o una PR su GitHub!

---

> _“Verbas” deriva da **Verba** (parole), con una **R** e una **S** al centro: la mia piccola firma al mondo della scrittura digitale e del codice._
