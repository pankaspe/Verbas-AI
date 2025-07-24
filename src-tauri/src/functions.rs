#[tauri::command]
pub fn app_name() -> String {
    "RustKR - Flickr desktop app built with rust".to_string()
}
