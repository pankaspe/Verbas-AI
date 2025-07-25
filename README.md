
# Verbas AI

![Verbas Logo](image.png)

**Verbas AI** è un editor Markdown avanzato per la scrittura di **libri, guide, articoli o appunti**, progettato per offrire un'esperienza **moderna**, **reattiva** e **performante**.  
È sviluppato in **Rust** e **SolidJS**, con focus su velocità, chiarezza strutturale e architettura scalabile.

---

## 🙋‍♂️ Un progetto indipendente

Mi chiamo **Andrea**, sviluppatore Rust e SolidJS.  
**Verbas AI** nasce come una **challenge personale**: creare un'app desktop elegante, utile e ben progettata, interamente da solo, nel tempo libero.  
È un **esercizio tecnico** e creativo che, con il tempo, sta assumendo la forma di un vero editor da scrittura professionale.

Il codice è pubblico e aperto: ogni feedback, idea o collaborazione futura è benvenuta.

---

## 🧠 Obiettivo del progetto

Verbas AI vuole essere:

- ✍️ Un **editor fluido e potente**, perfetto per scrivere contenuti lunghi e strutturati
- 📄 Capace di esportare in formati come **Markdown**, **PDF** e **ePub**
- ⚙️ Supportato da un'architettura pulita, modulare e facilmente estendibile
- 🧩 Progettato per **integrare plugin**, modalità lettura, temi personalizzati, AI

---

## ✨ Funzionalità attualmente implementate

| Funzionalità                                | Stato |
|---------------------------------------------|-------|
| Creazione nuovo progetto `.verbas`          | ✅    |
| Apertura e parsing progetti `.verbas`       | ✅    |
| Salvataggio contenuto Markdown (`base.md`)  | ✅    |
| Salvataggio configurazione progetto         | ✅    |
| Clonazione progetto                         | ✅    |
| Parsing e pulizia frontmatter Markdown      | ✅    |
| Editor WYSIWYG Markdown (Milkdown)          | ✅    |
| Comunicazione backend Rust ↔ frontend JS    | ✅    |
| Riconoscimento editor pronto all’uso        | ✅    |

📁 **.verbas** è l'estensione personalizzata usata per rappresentare ogni progetto:  
sotto il cofano è un semplice file JSON, leggibile e modificabile.

---

## 🛠️ Stack Tecnologico

| Tecnologia    | Ruolo                       | Perché è stata scelta                          |
|---------------|------------------------------|------------------------------------------------|
| 🦀 **Rust**    | Backend nativo (via Tauri)   | Sicuro, velocissimo, senza garbage collector   |
| 🧱 **Tauri**   | Framework desktop            | Leggero, sicuro, perfetto per app Rust+JS      |
| ⚛️ **SolidJS** | Frontend reactive            | Rapidissimo, reattività fine-grained, snello   |
| 🧪 **Milkdown**| Editor Markdown WYSIWYG      | Modulare, moderno, output Markdown diretto     |
| 🎨 **Tailwind + DaisyUI** | Stile UI        | Componenti veloci, design pulito e flessibile  |
| ⚡ **Vite**    | Build system                 | Dev server istantaneo, ottimo con SolidJS      |

---

### 🔧 Perché Rust?

- ✅ **Velocità nativa**: compilato in codice macchina
- ✅ **Sicurezza**: il borrow checker previene errori comuni
- ✅ **Zero runtime**: nessun garbage collector
- ✅ **Perfetto per CLI, parsing, gestione file e strutture dati complesse**
  
Rust è l’ideale per il backend di un'app desktop: solido, affidabile e potente.

---

### ⚛️ Perché SolidJS?

- ⚡ **Reattività istantanea**: il sistema di segnali (`createSignal`, `createStore`) è ultra-performante
- 🧠 **Semplice ma potente**: JSX diretto, simile a React ma senza overhead
- 📦 **Perfetta integrazione con Vite e Tauri**
- 💡 Ottimo per app complesse ma fluide

---

## 🧠 Dettaglio Funzioni tecniche

### 🗂️ Store SolidJS

Due store principali:

#### `projectStore.ts`
Gestisce il progetto `.verbas` e il relativo file `base.md`.

```ts
export const project = reactive<Project>({
  path: '',
  config: null,
});
````

#### `editorStore.ts`

Mantiene l'istanza Milkdown e gestisce lettura contenuto:

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

---

### 🦀 Funzioni backend in Rust

#### Caricamento Markdown

```rust
#[command]
pub fn load_markdown_file(path: String) -> Result<String, String> {
    std::fs::read_to_string(path).map_err(|e| e.to_string())
}
```

#### Salvataggio Markdown

```rust
#[command]
pub fn save_markdown_file(path: String, content: String) -> Result<(), String> {
    let mut file = File::create(&path).map_err(|e| format!("Failed to create file: {}", e))?;
    file.write_all(content.as_bytes()).map_err(|e| format!("Failed to write file: {}", e))?;
    Ok(())
}
```

#### Salvataggio progetto `.verbas`

```rust
#[command]
pub fn save_project(path: String, config: ProjectConfig) -> Result<(), String> {
    let json = serde_json::to_string_pretty(&config).map_err(|e| format!("Serialization error: {}", e))?;
    let mut file = File::create(&path).map_err(|e| format!("Failed to create file: {}", e))?;
    file.write_all(json.as_bytes()).map_err(|e| format!("Write error: {}", e))
}
```

---

## 📅 Roadmap

* [x] Setup progetto Rust + Tauri + SolidJS
* [x] Caricamento e parsing file `.verbas`
* [x] Rendering editor Markdown (Milkdown)
* [x] Salvataggio contenuti e configurazione
* [x] Architettura store pulita (Solid)
* [ ] UI base (sidebar, icone, teming)
* [ ] Tema dark/light
* [ ] Modalità lettura / “papiro mode”
* [ ] Sistema plugin/moduli
* [ ] Esportazione PDF / ePub

---

## 📬 Contatti

Se vuoi seguire il progetto, contribuire o semplicemente scambiare idee:

* 🌐 [github.com/tuo-username](https://github.com/tuo-username)
* 🐦 Twitter/X: *(aggiungi se vuoi)*
* 📬 Apri una issue o una PR su GitHub!

---

> *“Verbas” deriva da **Verba** (parole), con una **R** e una **S** nel mezzo che è l'estensione dei file di rust(.rs)*