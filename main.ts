import { Editor, MarkdownView, Notice, Plugin, TFile } from "obsidian";
import { EditorView, ViewPlugin, ViewUpdate, PluginValue } from '@codemirror/view';
import { EditorState } from '@codemirror/view';

const vetCompletions = {
	"temp" : "erature",
	"his" : "tory",
	"phy" : "iscal",
	"diag" : "nosis"
}

export default class MyPlugin extends Plugin {
    async onload() {		
        const inputDetectionExtension = ViewPlugin.fromClass(InputDetectionPlugin);        
		this.registerEditorExtension([
			inputDetectionExtension
		]);
    }

    onunload() {
        console.log('unloadng plugin');
    }
}

class InputDetectionPlugin implements PluginValue {
	// constructor(view: EditorView) {
	// }	
	update(update: ViewUpdate) {

		const prefix = this.getPrefix(update);
		const completion = this.checkForCompletions(prefix);
		if (completion) {
			console.log("found completion:", completion);
			// this.debugTextContext(update);
		}
	}	
	// destroy() {
	// }

	private getPrefix(update: ViewUpdate): string {
		const cursor = update.state.selection.main.head;
		const line = update.state.doc.lineAt(cursor);
		return line.text.slice(0, cursor - line.from)
	}

	private checkForCompletions(text: string): string | null {
		for (const [trigger, completion] of Object.entries(vetCompletions)) {
			if (text.endsWith(trigger)) {
				return completion;
			}
		}
	}

	// Debug helper to log text context
	// private debugTextContext(update: ViewUpdate): void {
	// 	const cursor = update.state.selection.main.head;
	// 	const line = update.state.doc.lineAt(cursor);
		
	// 	console.log({
	// 		fullLine: line.text,
	// 		cursorPosition: cursor - line.from,
	// 		textBeforeCursor: line.text.slice(0, cursor - line.from),
	// 		textAfterCursor: line.text.slice(cursor - line.from)
	// 	});
	// }

}