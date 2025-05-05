import { Editor, MarkdownView, Notice, Plugin, TFile } from "obsidian";
import { EditorView, ViewPlugin, ViewUpdate, PluginValue } from '@codemirror/view';
import { EditorState } from '@codemirror/state';

// Step 1: Create a dictionary of veterinary terms and their completions
const vetCompletions = {
    "temp:": "temperature is normal at 101.5°F",
    "hx:": "history of presenting complaint: ",
    "pe:": "physical examination reveals ",
    "rx:": "prescribed medication: ",
    "dx:": "diagnosis: ",
    "lab:": "laboratory results show ",
    "vax:": "vaccination status: up to date with ",
    "wt:": "weight: kg, BCS 3/5"
};

export default class MyPlugin extends Plugin {
    async onload() {		
        const inputDetectionExtension = ViewPlugin.fromClass(InputDetectionPlugin);        
		this.registerEditorExtension([
			inputDetectionExtension
		]);
    }

    onunload() {
        console.log('unloading plugin');
    }
}

// Step 2: Enhance the Input Detection Plugin
class InputDetectionPlugin implements PluginValue {
	constructor(view: EditorView) {
        console.log('Input detection plugin initialized');
    }
    
	update(update: ViewUpdate) {
        // Only process if there was a document change
        if (update.docChanged) {
            // Get the text before the cursor
            const prefix = this.getTextBeforeCursor(update);
            
            // Check for potential completions
            const completion = this.checkForCompletions(prefix);
            
            // Log potential completion to console
            if (completion) {
                console.log("🐾 Vet completion found:", completion);
                this.debugTextContext(update); // Log additional context for debugging
            }
        }
	}
    
    // Step 3: Helper Functions for Text Analysis
    
    // Get text before the cursor
    private getTextBeforeCursor(update: ViewUpdate): string {
        const cursor = update.state.selection.main.head;
        const line = update.state.doc.lineAt(cursor);
        return line.text.slice(0, cursor - line.from);
    }
    
    // Check if the text matches any completion triggers
    private checkForCompletions(text: string): string | null {
        // Check for exact matches (like "temp:")
        for (const [trigger, completion] of Object.entries(vetCompletions)) {
            if (text.endsWith(trigger)) {
                return completion;
            }
        }
        
        return null; // No match found
    }
    
    // Debug helper to log text context
    private debugTextContext(update: ViewUpdate): void {
        const cursor = update.state.selection.main.head;
        const line = update.state.doc.lineAt(cursor);
        
        console.log({
            fullLine: line.text,
            cursorPosition: cursor - line.from,
            textBeforeCursor: line.text.slice(0, cursor - line.from),
            textAfterCursor: line.text.slice(cursor - line.from)
        });
    }
}