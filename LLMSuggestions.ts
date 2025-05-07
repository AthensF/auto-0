import { Editor, MarkdownView, Notice, Plugin, TFile } from "obsidian";
import { EditorView, ViewPlugin, ViewUpdate, PluginValue, Decoration, DecorationSet, WidgetType } from '@codemirror/view';


const vetCompletions = {
	"temp" : "erature",
	"his" : "tory",
	"phy" : "iscal",
	"diag" : "nosis"
}

export default class MyPlugin extends Plugin {
	onload() {
		const inputDetectionPlugin = ViewPlugin.fromClass(InputDetectionExtension, {
			decorations: v => v.decorations
		});
		this.registerEditorExtension([
			inputDetectionPlugin			
		]);
	};

	onunload () {
		console.log("unloading plugin")
	}
}

class CompletionWidget extends WidgetType {
	constructor(readonly completion: string) {
		super();
	}

	toDOM(){
		const span = document.createElement("span");
		span.textContent = this.completion;
		span.style.opacity = "0.4";
		return span
	}
}

class InputDetectionExtension implements PluginValue {	
	
	decorations: DecorationSet = Decoration.none;
	
	update(update: ViewUpdate) {
		if (update.docChanged) {
			const prefix = this.getPrefix(update);
			const completion = this.getCompletions(prefix);
			if (completion) {				
				this.decorations = this.createCompletionDecoration(update.view, completion);
			} else {
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

	getCompletions(text : string): string | null {
		for (const [trigger , completion] of Object.entries(vetCompletions)) {
			if (text.endsWith(trigger)) {
				return completion;
			}
		}
		return null;
	}

	createCompletionDecoration(view: EditorView, completion:string){
		const cursorPos = view.state.selection.main.head;
		const widget = new CompletionWidget(completion);
		const decoration = Decoration.widget({
			widget,
			side:1
		});

		return Decoration.set([decoration.range(cursorPos)]);

	}

}


