import { Editor, MarkdownView, Notice, Plugin, TFile } from "obsidian";
import { EditorView, ViewPlugin, ViewUpdate, PluginValue, Decoration, DecorationSet, WidgetType } from '@codemirror/view';
import { EditorState } from '@codemirror/state';

// Step 1: Create a dictionary of veterinary terms and their completions
const vetCompletions = {
	"temp" : "erature",
	"his" : "tory",
	"phy" : "iscal",
	"diag" : "nosis"
};


export default class MyPlugin extends Plugin {
    async onload() {		
        const inputDetectionExtension = ViewPlugin.fromClass(InputDetectionPlugin, {
            // Expose decorations to the editor
            decorations: v => v.decorations
        });        
		this.registerEditorExtension([
			inputDetectionExtension
		]);
    }
    onunload() {
        console.log('unloading plugin');
    }
}

// Widget for displaying completions as ghost text
class CompletionWidget extends WidgetType {
    constructor(readonly completion: string) {
        super();
    }
    
    toDOM() {
        const span = document.createElement("span");
        span.textContent = this.completion;
        span.style.opacity = "0.4"; // Ghost text appearance
        return span;
    }
}

class InputDetectionPlugin implements PluginValue {
    // Add a field to track decorations
    decorations: DecorationSet = Decoration.none;
    
	constructor(view: EditorView) {
        console.log('Input detection plugin initialized');
    }
    
    update(update: ViewUpdate) {
        // Only process if there was a document change
        if (update.docChanged) {
            const prefix = this.getPrefix(update);
            const completion = this.getCompletions(prefix);
            
            if (completion) {
                // Create decoration to display the completion
                this.decorations = this.createCompletionDecoration(update.view, completion);
                console.log('found completion:', completion);
            } else {
                // Clear decorations when no completion
                this.decorations = Decoration.none;
            }
        }
    }
    
    getPrefix(update: ViewUpdate): string {
        const cursorPos = update.state.selection.main.head;
        const line = update.state.doc.lineAt(cursorPos);
        const prefix = line.text.slice(0, cursorPos - line.from);
        return prefix;
    }
    
    getCompletions(text: string): string | null {
        for (const [trigger, completion] of Object.entries(vetCompletions)) {
            if (text.endsWith(trigger)) {
                return completion;
            }
        }
        return null;
    }
    
    // Method to create decoration for the completion
    createCompletionDecoration(view: EditorView, completion: string) {
        const cursorPos = view.state.selection.main.head;
        
        // Create widget to display completion
        const widget = new CompletionWidget(completion);
        
        // Create decoration at cursor position
        const decoration = Decoration.widget({
            widget,
            side: 1 // After cursor
        });
        
        return Decoration.set([decoration.range(cursorPos)]);
    }
}