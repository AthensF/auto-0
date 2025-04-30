import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';

// Remember to rename these classes and interfaces!


export default class MyPlugin extends Plugin {

	async onload() {
		console.log('woof');
		// This creates an icon in the left ribbon.
		const ribbonIconEl = this.addRibbonIcon('dice', 'Sample Plugin', (evt: MouseEvent) => {
			// Called when the user clicks the icon.
			new Notice('This is a notice no is da best!!');
		});
		
	}

	onunload() {
		console.log('unloading plugin');
	}

}

