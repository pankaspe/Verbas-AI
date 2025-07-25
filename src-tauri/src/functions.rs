use std::fs::{self, File};
use std::io::{Read, Write};
use std::path::Path;
use serde::{Deserialize, Serialize};
use chrono::Utc;
use tauri::command;

/// Represents a chapter in the project, with title and filename.
#[derive(Debug, Serialize, Deserialize)]
pub struct Chapter {
    pub title: String,
    pub file: String,
}

/// Configuration struct for a project, containing metadata and structure info.
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

/// Editor-specific settings like font, theme, and line spacing.
#[derive(Debug, Serialize, Deserialize)]
pub struct EditorSettings {
    pub font_family: String,
    pub font_size: u16,
    pub theme: String,
    pub line_spacing: f32,
}

/// Paths for project folder structure.
#[derive(Debug, Serialize, Deserialize)]
pub struct StructurePaths {
    pub chapters_path: String,
    pub images_path: String,
    pub fonts_path: String,
    pub style_path: String,
    pub exports_path: String,
    pub notes_path: String,
}

/// Additional metadata about the project.
#[derive(Debug, Serialize, Deserialize)]
pub struct Metadata {
    pub author: String,
    pub language: String,
    pub tags: Vec<String>,
    pub cover_image: String,
}

/// Creates a default `base.md` file in the chapters directory with introductory content.
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

/// Recursively copies all files and directories from `src` to `dst`.
fn copy_dir_all(src: &Path, dst: &Path) -> Result<(), String> {
    std::fs::create_dir_all(dst)
        .map_err(|e| format!("Create dir failed: {}", e))?;

    for entry in std::fs::read_dir(src).map_err(|e| format!("Read dir failed: {}", e))? {
        let entry = entry.map_err(|e| format!("Entry error: {}", e))?;
        let path = entry.path();
        let dest_path = dst.join(entry.file_name());

        if path.is_dir() {
            // Recurse into subdirectories
            copy_dir_all(&path, &dest_path)?;
        } else {
            // Copy file
            std::fs::copy(&path, &dest_path)
                .map_err(|e| format!("Copy failed: {}", e))?;
        }
    }
    Ok(())
}

/// Creates a new project directory with the standard folder structure and a base.md file.
///
/// # Arguments
/// * `name` - Name of the new project.
/// * `directory` - Path where the project will be created.
#[command]
pub fn create_new_project(name: String, directory: String) -> Result<(), String> {
    let base = Path::new(&directory);

    // Prevent overwriting existing directories
    if base.exists() {
        return Err("Directory already exists".into());
    }

    // Create base directory and subdirectories
    fs::create_dir_all(&base)
        .map_err(|e| format!("Failed to create base folder: {}", e))?;

    let folders = ["chapters", "images", "fonts", "style", "exports", "notes"];
    for folder in folders.iter() {
        fs::create_dir_all(base.join(folder))
            .map_err(|e| format!("Failed to create folder '{}': {}", folder, e))?;
    }

    // Create the base.md file inside chapters
    let chapters_path = base.join("chapters");
    create_base_md(&chapters_path)?;

    // Initialize project config with defaults
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

    // Save the project configuration file
    let config_path = base.join(format!("{}.verbas", name));
    save_project(config_path.to_string_lossy().to_string(), config)
}

/// Loads a project configuration from a `.verbas` file.
///
/// # Arguments
/// * `path` - Path to the `.verbas` file.
///
/// Returns the deserialized `ProjectConfig`.
#[command]
pub fn load_project(path: String) -> Result<ProjectConfig, String> {
    let mut file = File::open(&path)
        .map_err(|e| format!("Failed to open file: {}", e))?;

    let mut contents = String::new();
    file.read_to_string(&mut contents)
        .map_err(|e| format!("Failed to read file: {}", e))?;

    serde_json::from_str(&contents)
        .map_err(|e| format!("Invalid JSON format: {}", e))
}

/// Saves the project configuration back to disk.
///
/// # Arguments
/// * `path` - Path where to save the `.verbas` file.
/// * `config` - The project configuration to save.
#[command]
pub fn save_project(path: String, config: ProjectConfig) -> Result<(), String> {
    let json = serde_json::to_string_pretty(&config)
        .map_err(|e| format!("Serialization error: {}", e))?;

    let mut file = File::create(&path)
        .map_err(|e| format!("Failed to create file: {}", e))?;

    file.write_all(json.as_bytes())
        .map_err(|e| format!("Write error: {}", e))
}

/// Clones a project folder by copying its contents to a new directory.
///
/// # Arguments
/// * `original_path` - Path to the original `.verbas` project file.
/// * `new_folder_path` - Target directory where the project will be cloned.
///
/// Returns the path of the new `.verbas` file.
#[tauri::command]
pub fn clone_project(original_path: String, new_folder_path: String) -> Result<String, String> {
    let original = Path::new(&original_path);
    let new_folder = Path::new(&new_folder_path);

    // Get the parent folder of the original `.verbas` file (project root)
    let source_folder = original.parent().ok_or("Invalid original path")?;

    // Recursively copy all contents to the new folder
    copy_dir_all(source_folder, new_folder)?;

    // Get the original `.verbas` filename (e.g. projectname.verbas)
    let project_file_name = original.file_name()
        .ok_or("Invalid original file name")?
        .to_string_lossy();

    // Build the path to the new `.verbas` file in the cloned folder
    let new_project_path = new_folder.join(&*project_file_name);

    // Return the new project file path as a string
    Ok(new_project_path.to_string_lossy().to_string())
}

/// Deletes a project file given its path.
///
/// # Arguments
/// * `path` - Path to the project `.verbas` file.
#[command]
pub fn delete_project(path: String) -> Result<(), String> {
    fs::remove_file(path)
        .map_err(|e| format!("Failed to delete file: {}", e))
}

/// Saves markdown content to a specified file.
///
/// # Arguments
/// * `path` - File path to save the markdown content.
/// * `content` - The markdown content to save.
#[command]
pub fn save_markdown_file(path: String, content: String) -> Result<(), String> {
    println!("Saving Markdown to: {}", path);
    println!("Content preview: {}", content.chars().take(100).collect::<String>());

    let mut file = File::create(&path)
        .map_err(|e| format!("Failed to create file: {}", e))?;

    file.write_all(content.as_bytes())
        .map_err(|e| format!("Failed to write file: {}", e))?;

    Ok(())
}

/// Loads markdown content from a file.
///
/// # Arguments
/// * `path` - Path to the markdown file.
///
/// Returns the content as a `String`.
#[tauri::command]
pub fn load_markdown_file(path: String) -> Result<String, String> {
    std::fs::read_to_string(&path)
        .map_err(|e| format!("Failed to read file: {}", e))
}

/// Returns the application name.
#[command]
pub fn app_name() -> String {
    "Verbas".to_string()
}
