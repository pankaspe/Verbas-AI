use std::fs::{self, File};
use std::io::{Read, Write};
use std::path::{Path};
use serde::{Deserialize, Serialize};
use chrono::Utc;
use tauri::command;

#[derive(Debug, Serialize, Deserialize)]
pub struct Chapter {
    pub title: String,
    pub file: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ProjectConfig {
    pub name: String,
    pub version: u8,
    pub created_at: String,
    pub updated_at: String,
    pub editor: EditorSettings,
    pub structure: StructurePaths,
    pub chapters: Vec<Chapter>,
    pub metadata: Metadata,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct EditorSettings {
    pub font_family: String,
    pub font_size: u16,
    pub theme: String,
    pub line_spacing: f32,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct StructurePaths {
    pub chapters_path: String,
    pub images_path: String,
    pub fonts_path: String,
    pub style_path: String,
    pub exports_path: String,
    pub notes_path: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Metadata {
    pub author: String,
    pub language: String,
    pub tags: Vec<String>,
    pub cover_image: String,
}

fn create_base_md(chapters_path: &Path) -> Result<(), String> {
    let now = Utc::now().to_rfc3339();

    let content = format!(
        r#"+++
title = "Capitolo di base"
created_at = "{now}"
updated_at = "{now}"
+++

# Benvenuto in Verbas

Questo è un file `base.md` generato automaticamente nella cartella `chapters/`.

Usa questo file come punto di partenza per iniziare a scrivere il tuo libro, documento o progetto creativo.

Puoi modificarlo liberamente, rinominarlo o aggiungere altri capitoli dalla tua interfaccia.
"#
    );

    let base_md_path = chapters_path.join("base.md");
    let mut file = File::create(&base_md_path)
        .map_err(|e| format!("Impossibile creare base.md: {}", e))?;
    file.write_all(content.as_bytes())
        .map_err(|e| format!("Errore scrittura base.md: {}", e))?;

    Ok(())
}

// project CRUD
#[command]
pub fn create_new_project(name: String, directory: String) -> Result<(), String> {
    let base = Path::new(&directory);
    if base.exists() {
        return Err("Directory already exists".into());
    }
    fs::create_dir_all(&base).map_err(|e| format!("Failed to create base folder: {}", e))?;

    let folders = ["chapters", "images", "fonts", "style", "exports", "notes"];
    for folder in folders.iter() {
        fs::create_dir_all(base.join(folder)).map_err(|e| format!("Failed to create folder '{}': {}", folder, e))?;
    }

    let chapters_path = base.join("chapters");
    create_base_md(&chapters_path)?;

    let config = ProjectConfig {
        name: name.clone(),
        version: 1,
        created_at: Utc::now().to_rfc3339(),
        updated_at: Utc::now().to_rfc3339(),
        editor: EditorSettings {
            font_family: "Inter".to_string(),
            font_size: 16,
            theme: "light".to_string(),
            line_spacing: 1.5,
        },
        structure: StructurePaths {
            chapters_path: "chapters".into(),
            images_path: "images".into(),
            fonts_path: "fonts".into(),
            style_path: "style".into(),
            exports_path: "exports".into(),
            notes_path: "notes".into(),
        },
        chapters: vec![],
        metadata: Metadata {
            author: "".into(),
            language: "it".into(),
            tags: vec![],
            cover_image: "".into(),
        },
    };

    let config_path = base.join(format!("{}.verbas", name));
    save_project(config_path.to_string_lossy().to_string(), config)
}

#[command]
pub fn load_project(path: String) -> Result<ProjectConfig, String> {
    let mut file = File::open(&path).map_err(|e| format!("Failed to open file: {}", e))?;
    let mut contents = String::new();
    file.read_to_string(&mut contents)
        .map_err(|e| format!("Failed to read file: {}", e))?;
    serde_json::from_str(&contents).map_err(|e| format!("Invalid JSON format: {}", e))
}

#[command]
pub fn save_project(path: String, config: ProjectConfig) -> Result<(), String> {
    let json =
        serde_json::to_string_pretty(&config).map_err(|e| format!("Serialization error: {}", e))?;
    let mut file = File::create(&path).map_err(|e| format!("Failed to create file: {}", e))?;
    file.write_all(json.as_bytes())
        .map_err(|e| format!("Write error: {}", e))
}

#[command]
pub fn save_project_as(new_path: String, config: ProjectConfig) -> Result<(), String> {
    save_project(new_path, config)
}

#[command]
pub fn delete_project(path: String) -> Result<(), String> {
    fs::remove_file(path).map_err(|e| format!("Failed to delete file: {}", e))
}


// Markdown function
#[command]
pub fn save_markdown_file(path: String, content: String) -> Result<(), String> {
    println!("Saving Markdown to: {}", path);
    println!("Content: {}", content.chars().take(100).collect::<String>());

    let mut file = File::create(&path).map_err(|e| format!("Failed to create file: {}", e))?;
    file.write_all(content.as_bytes()).map_err(|e| format!("Failed to write file: {}", e))?;
    Ok(())
}


#[tauri::command]
pub fn load_markdown_file(path: String) -> Result<String, String> {
    std::fs::read_to_string(&path).map_err(|e| format!("Failed to read file: {}", e))
}







#[command]
pub fn app_name() -> String {
    "Verbas".to_string()
}
