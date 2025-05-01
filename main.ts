import { Editor, MarkdownView, Notice, Plugin, TFile } from "obsidian";
import { EditorView, ViewPlugin, ViewUpdate, PluginValue } from '@codemirror/view';

export default class MyPlugin extends Plugin {
    async onload() {		
        const inputDetectionExtension = ViewPlugin.fromClass(InputDetectionPlugin);        
		this.registerEditorExtension([inputDetectionExtension]);
    }

    onunload() {
        console.log('unloading plugin');
    }
}

class InputDetectionPlugin implements PluginValue {
	// constructor(view: EditorView) {
	// }	
	update(update) {
		update.changes.iterChanges((_, __, ___, ____, text) => {
			console.log('Text changed:', text.toString());
		});
	}	
	// destroy() {
	// }
}