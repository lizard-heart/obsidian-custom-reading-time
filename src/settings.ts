import { App, PluginSettingTab, Setting } from "obsidian"
import ReadingTime from "./main"

export interface ReadingTimeSettings {
  readingSpeed: number;
  readingSpeed2: number;
  format: string;
  appendText: string;
  appendText2: string;
}

export const RT_DEFAULT_SETTINGS: ReadingTimeSettings = {
  readingSpeed: 150,
  readingSpeed2: 250,
  format: 'default',
  appendText: 'aloud',
  appendText2: 'read'
}

export class ReadingTimeSettingsTab extends PluginSettingTab {

    plugin: ReadingTime;

      constructor(app: App, plugin: ReadingTime) {
          super(app, plugin);
          this.plugin = plugin;
      }

    display(): void {
          const {containerEl} = this;

      containerEl.empty()

      new Setting(containerEl)
        .setName("Slow reading speed")
        .setDesc("Words per minute used for reading speed (default: 150 – reading aloud).")
        .addText((text) => {
          text.setPlaceholder("Example: 150")
            .setValue(this.plugin.settings.readingSpeed.toString())
            .onChange(async (value) => {
              this.plugin.settings.readingSpeed = parseInt(value.trim())
              await this.plugin.saveSettings()
                .then( this.plugin.calculateReadingTime )
            })
        });
      
      new Setting(this.containerEl)
        .setName("Append Text")
        .setDesc("Append 'read' to formatted string.")
        .addText(text => text
          .setValue(this.plugin.settings.appendText)
          .onChange(async (value) => {
            this.plugin.settings.appendText = value.trim();
            await this.plugin.saveSettings()
              .then( this.plugin.calculateReadingTime )
          })
        );

      new Setting(containerEl)
        .setName("Fast reading speed")
        .setDesc("Words per minute used for reading speed (default: 250 – slightly above-average reading).")
        .addText((text) => {
          text.setPlaceholder("Example: 250")
            .setValue(this.plugin.settings.readingSpeed2.toString())
            .onChange(async (value) => {
              this.plugin.settings.readingSpeed2 = parseInt(value.trim())
              await this.plugin.saveSettings()
                .then(this.plugin.calculateReadingTime)
            })
        });

      new Setting(this.containerEl)
        .setName("Append Text")
        .setDesc("Append 'read' to formatted string.")
        .addText(text => text
          .setValue(this.plugin.settings.appendText2)
          .onChange(async (value) => {
            this.plugin.settings.appendText2 = value.trim();
            await this.plugin.saveSettings()
              .then(this.plugin.calculateReadingTime)
          })
        );

      new Setting(this.containerEl)
        .setName("Format")
        .setDesc("Choose the output format")
        .addDropdown(dropdown => dropdown
          .addOption("default", "Default (10 min)")
          .addOption("compact", "Compact (10m)")
          .addOption("simple", "Simple (10m 4s)")
          .addOption("verbose", "Verbose (10 minutes 4 seconds)")
          .addOption("digital", "Colon Notation (10:04)")
          .setValue(this.plugin.settings.format)
          .onChange(async (value) => {
            this.plugin.settings.format = value;
            await this.plugin.saveSettings()
              .then(this.plugin.calculateReadingTime)
          })
        );
      
    }
  }