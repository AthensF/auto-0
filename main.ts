import { Editor, MarkdownView, Notice, Plugin, TFile } from "obsidian";
import { EditorView, ViewPlugin, ViewUpdate, PluginValue } from '@codemirror/view';

export default class MyPlugin extends Plugin {
    async onload() {
		
		console.log('woof');
        
        
        // Create the extension separately
        const typingDetectorExtension = ViewPlugin.fromClass(ExampleViewPlugin);
        
        // Register the extension
		this.registerEditorExtension([typingDetectorExtension]);
    }

    onunload() {
        console.log('unloading plugin');
    }
}

class ExampleViewPlugin implements PluginValue {
	constructor(view: EditorView) {
		// console.log('Typing detector initialized');
	}
	
	update(update: ViewUpdate) {
		if (update.docChanged) {
			console.log('Vet is typing');
			
			// Show what changed
			update.changes.iterChanges((fromA, toA, fromB, toB, text) => {
				console.log('Text changed:', text.toString());
			});
		}
	}
	
	destroy() {
		console.log('Typing detector destroyed');
	}
}