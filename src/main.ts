import { App, MarkdownView, Plugin, debounce, Editor, Modal } from "obsidian"
import { ReadingTimeSettingsTab, ReadingTimeSettings, RT_DEFAULT_SETTINGS } from "./settings"
import { readingTimeText, readingTimeText2 } from "./helpers"
export default class ReadingTime extends Plugin {
  settings: ReadingTimeSettings
  statusBar: HTMLElement

  async onload() {
    await this.loadSettings();

    this.statusBar = this.addStatusBarItem()
    this.statusBar.setText("")

    this.addSettingTab(new ReadingTimeSettingsTab(this.app, this))

		// This adds an editor command that can perform some operation on the current editor instance
		this.addCommand({
			id: 'reading-time-editor-command',
			name: 'Selected Text',
			editorCallback: (editor: Editor, view: MarkdownView) => {
        new ReadingTimeModal(this.app, editor, this).open();
			}
		});

    this.registerEvent(
      this.app.workspace.on("file-open", this.calculateReadingTime)
    )

    this.registerEvent(
      this.app.workspace.on("editor-change", debounce(this.calculateReadingTime, 1000))
    )
  }

  calculateReadingTime = () => {
    const mdView = this.app.workspace.getActiveViewOfType(MarkdownView);
    if (mdView && mdView.getViewData()) {
      const result = String(readingTimeText(mdView.getViewData(),this)) + " –– " + String(readingTimeText2(mdView.getViewData(), this))
      this.statusBar.setText(`${result}`)
    } else {
      this.statusBar.setText("0 min read")
    }
  }

	async loadSettings() {
		this.settings = Object.assign({}, RT_DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class ReadingTimeModal extends Modal {

  plugin: ReadingTime;
  editor: Editor;

  constructor(app: App, editor: Editor, plugin: ReadingTime) {
    super(app);
    this.editor = editor;
    this.plugin = plugin;
	}

  readingTime = (text: string, plugin: ReadingTime) => {
    return readingTimeText(text, plugin);
  };

  readingTime2 = (text: string, plugin: ReadingTime) => {
    return readingTimeText2(text, plugin);
  };

	onOpen() {
		const {contentEl, titleEl} = this;
    titleEl.setText('Reading Time of Selected Text');
    const stats = this.readingTime(this.editor.getSelection(), this.plugin);
    const stats2 = this.readingTime2(this.editor.getSelection(), this.plugin);
		contentEl.setText(`${stats},\n${stats2}`);
	}

	onClose() {
		const {contentEl} = this;
		contentEl.empty();
	}
}