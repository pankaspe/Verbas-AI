# Verbas AI

![alt text](image.png)

**Verbas AI** è un **editor di testo avanzato**, scritto in **Rust** e **SolidJS**, progettato per offrire **prestazioni elevate**, **reattività istantanea** e un'esperienza moderna per scrivere codice, note, idee o documenti.

> ✍️ _Un progetto personale, sviluppato nel tempo libero da un programmatore solitario._

---

## 🚧 Stato del progetto

Attualmente è in sviluppo attivo. Le seguenti funzionalità sono già state implementate:

---

## ✨ Funzionalità implementate

| Funzione                                | Stato |
|-----------------------------------------|--------|
| UI moderna e responsiva (SolidJS)       | ✅     |
| Caricamento progetto da file .verbas    | ✅     |
| Parsing e pulizia frontmatter Markdown  | ✅     |
| Rendering editor Markdown (Milkdown)    | ✅     |
| Salvataggio file `base.md`              | ✅     |
| Salvataggio configurazione progetto     | ✅     |
| Riconoscimento editor pronto            | ✅     |
| Persistenza tra backend (Rust) e frontend (JS) | ✅ |

---

## 🧠 Dettaglio Funzionalità Tecniche

### 🗂️ Store SolidJS

- `projectStore.ts`  
  Store reattivo per il progetto corrente:
  ```ts
  export const project = reactive<Project>({
    path: '',
    config: null,
  });
  ```

- `editorStore.ts`  
  Gestisce lo stato dell'editor Markdown:
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

### ⚙️ Funzioni Rust (comandi Tauri)

- `load_markdown_file(path: String) -> Result<String, String>`
  ```rust
  #[command]
  pub fn load_markdown_file(path: String) -> Result<String, String> {
      std::fs::read_to_string(path).map_err(|e| e.to_string())
  }
  ```

- `save_markdown_file(path: String, content: String) -> Result<(), String>`
  ```rust
  #[command]
  pub fn save_markdown_file(path: String, content: String) -> Result<(), String> {
      let mut file = File::create(&path).map_err(|e| format!("Failed to create file: {}", e))?;
      file.write_all(content.as_bytes()).map_err(|e| format!("Failed to write file: {}", e))?;
      Ok(())
  }
  ```

- `save_project(path: String, config: ProjectConfig) -> Result<(), String>`
  ```rust
  #[command]
  pub fn save_project(path: String, config: ProjectConfig) -> Result<(), String> {
      let json = serde_json::to_string_pretty(&config).map_err(|e| format!("Serialization error: {}", e))?;
      let mut file = File::create(&path).map_err(|e| format!("Failed to create file: {}", e))?;
      file.write_all(json.as_bytes()).map_err(|e| format!("Write error: {}", e))
  }
  ```

---

## 🛠️ Tech stack

- **🦀 Rust** – core backend con performance native  
- **🧱 Tauri** – per creare l'app desktop  
- **⚛️ SolidJS** – UI reattiva, veloce, modulare  
- **🧪 Milkdown** – editor Markdown moderno con AST  
- **🎨 TailwindCSS** – stile minimal ma elegante  
- **📦 Vite** – build system super veloce

---

## 📅 Roadmap

- [x] Setup iniziale (Tauri + SolidJS)
- [x] Caricamento progetto e file `base.md`
- [x] Salvataggio Markdown e Config via Rust
- [x] Gestione stato editor con signal SolidJS
- [ ] UI base (sidebar, icone, navigazione)
- [ ] Tema dark/light
- [ ] Plugin system e modularità
- [ ] Modalità lettura/papiro

---

## 🙋‍♂️ Chi sono

Sono **Andrea**, un programmatore Rust/SolidJS, e **Verbas** è una mia sfida personale: costruire da solo, nel tempo libero, un editor elegante, utile e veloce. Non è (ancora) un progetto di squadra, ma è aperto a idee, feedback e magari, un giorno, collaborazioni.

---

## 📬 Contatti

Se ti piace il progetto, hai idee, o vuoi seguire i progressi:

- 🌐 [github.com/tuo-username](https://github.com/tuo-username)
- 🐦 (eventuale Twitter/X)
- 📬 Apri una issue o una PR!

---

> _“Verbas” viene da **Verba** (parole) con una **R** e una **S** in mezzo: la mia firma silenziosa al mondo della scrittura digitale._
