// src/lib/projectActions.ts

import { invoke } from '@tauri-apps/api/core';
import { open, save } from '@tauri-apps/plugin-dialog';
import { dirname, join } from '@tauri-apps/api/path';

import { project, setProject, type ProjectConfig } from '../stores/projectStore';
import { loadAndCleanBaseChapter } from '../utils/loadCurrentHelper';
import { getMarkdown } from '../stores/editorStore';
import { showAlert } from '../utils/showAlertHelper';


/**
 * Creates a new Verbas project by asking the user for a save location,
 * generating the structure via backend, and loading it into the app.
 */
export async function handleNewProject(): Promise<void> {
  const folderPath = await save({
    title: 'Create new project',
    defaultPath: 'NewProject',
    filters: [],
  });

  if (!folderPath) return;

  const projectName = folderPath.split(/[\\/]/).pop()?.replace(/\.verbas$/, '') || 'Project';

  await invoke('create_new_project', {
    name: projectName,
    directory: folderPath.replace(/\\\\/g, '/'),
  });

  const projectPath = `${folderPath}/${projectName}.verbas`;

  const newConfig = await invoke<ProjectConfig>('load_project', {
    path: projectPath,
  });

  setProject({ config: newConfig, path: projectPath });

  await loadAndCleanBaseChapter();

  console.log('New project created and base.md loaded.');
}

/**
 * Opens an existing Verbas project file (.verbas) and loads its configuration
 * and base.md into the app.
 */
export async function handleOpenProject(): Promise<void> {
  const selected = await open({
    multiple: false,
    filters: [{ name: 'Verbas Project', extensions: ['verbas'] }],
  });

  if (selected && typeof selected === 'string') {
    const config = await invoke<ProjectConfig>('load_project', { path: selected });
    setProject({ config, path: selected });

    await loadAndCleanBaseChapter();

    // console.log('Loaded project:', config);
    showAlert("Project loaded successfully!", "info");
  }
}

/**
 * Saves the current project configuration and the content of base.md
 * retrieved from the editor to disk.
 */
export async function handleSave(): Promise<void> {
  if (!project.path || !project.config) {
    console.warn('No project loaded.');
    return;
  }

  try {
    const markdownContent = await getMarkdown();
    console.log('Markdown content to save:', markdownContent);

    if (!markdownContent) {
      console.warn('Markdown content is empty or editor not ready.');
      return;
    }

    const baseDir = await dirname(project.path);
    const chaptersDir = await join(baseDir, project.config.structure.chapters_path);
    const baseMdPath = await join(chaptersDir, 'base.md');

    await invoke('save_markdown_file', { path: baseMdPath, content: markdownContent });

    await invoke('save_project', {
      path: project.path,
      config: project.config,
    });

    // console.log('Project and base.md saved.');
    showAlert("Project saved successfully!", "success");
  } catch (error) {
    // console.error('Error saving project or base.md:', error);
    showAlert("Error saving project.", "error");
  }
}

/**
 * Repack the current project to as zip inside a folder.
 */

export async function handleRepack(): Promise<void> {
  if (!project.path) {
    console.warn("No project loaded.");
    return;
  }

  // Ask user where to save the .zip
  const zipPath = await save({
    title: "Export project as zip",
    defaultPath: "verbas_project.zip",
    filters: [{ name: "ZIP Archive", extensions: ["zip"] }],
  });

  if (!zipPath || typeof zipPath !== "string") return;

  try {
    await invoke("repack_project", {
      projectPath: project.path,
      targetZipPath: zipPath,
    });

    showAlert("Repack done!", "success");
    // console.log("Project successfully repacked:", zipPath);
  } catch (error) {
    // console.error("Failed to repack project:", error);
    showAlert("Repack failed!", "error");
  }
}