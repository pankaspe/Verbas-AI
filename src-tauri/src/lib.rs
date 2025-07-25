mod functions;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            functions::app_name,

            // load project functions
            functions::create_new_project,
            functions::save_project,
            functions::load_project,
            functions::repack_project,
            functions::delete_project,
            
            // load markdown functions
            functions::save_markdown_file,
            functions::load_markdown_file
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
