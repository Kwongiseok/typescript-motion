import { MediaSectionInput } from "./components/dialog/input/media-input.js";
import { InputDialog, } from "./components/dialog/dialog.js";
import { ImageComponent } from "./components/page/item/image.js";
import { NoteComponent } from "./components/page/item/note.js";
import { TodoComponent } from "./components/page/item/todo.js";
import { VideoComponent } from "./components/page/item/video.js";
import { PageComponent, PageItemComponent, } from "./components/page/page.js";
import { TextSectionInput } from "./components/dialog/input/text-input.js";
class App {
    constructor(appRoot, dialogRoot) {
        this.dialogRoot = dialogRoot;
        this.page = new PageComponent(PageItemComponent);
        this.page.attachTo(appRoot);
        this.bindElementToDialog("#new-image", MediaSectionInput, (input) => new ImageComponent(input.title, input.url));
        this.bindElementToDialog("#new-video", MediaSectionInput, (input) => new VideoComponent(input.title, input.url));
        this.bindElementToDialog("#new-note", TextSectionInput, (input) => new NoteComponent(input.title, input.body));
        this.bindElementToDialog("#new-todo", TextSectionInput, (input) => new TodoComponent(input.title, input.body));
        this.page.addChild(new ImageComponent("Image Title", "https://picsum.photos/800/400"));
        this.page.addChild(new VideoComponent("Video Title", "https://youtu.be/D7cwvvA7cP0"));
        this.page.addChild(new NoteComponent("Note Title", "Don't forget to code your dream"));
        this.page.addChild(new TodoComponent("Todo Title", "TypeScript Course!"));
        this.page.addChild(new ImageComponent("Image Title", "https://picsum.photos/800/400"));
        this.page.addChild(new VideoComponent("Video Title", "https://youtu.be/D7cwvvA7cP0"));
        this.page.addChild(new NoteComponent("Note Title", "Don't forget to code your dream"));
        this.page.addChild(new TodoComponent("Todo Title", "TypeScript Course!"));
    }
    bindElementToDialog(selector, InputComponent, makeSection) {
        const element = document.querySelector(selector);
        element.addEventListener("click", () => {
            const dialog = new InputDialog();
            const inputSection = new InputComponent();
            dialog.addChild(inputSection);
            dialog.attachTo(this.dialogRoot);
            dialog.setOnCloseListener(() => {
                dialog.removeFrom(this.dialogRoot);
            });
            dialog.setOnsubmitListener(() => {
                const todo = makeSection(inputSection);
                this.page.addChild(todo);
                dialog.removeFrom(this.dialogRoot);
            });
            dialog.attachTo(this.dialogRoot);
        });
    }
}
new App(document.querySelector(".document"), document.body);
