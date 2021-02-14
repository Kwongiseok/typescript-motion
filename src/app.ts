import { MediaSectionInput } from "./components/dialog/input/media-input.js";
import { Component } from "./components/component.js";
import {
  InputDialog,
  MediaData,
  TextData,
} from "./components/dialog/dialog.js";
import { ImageComponent } from "./components/page/item/image.js";
import { NoteComponent } from "./components/page/item/note.js";
import { TodoComponent } from "./components/page/item/todo.js";
import { VideoComponent } from "./components/page/item/video.js";
import {
  Composable,
  PageComponent,
  PageItemComponent,
} from "./components/page/page.js";
import { TextSectionInput } from "./components/dialog/input/text-input.js";

type InputComponentConstructor<T = (MediaData | TextData) & Component> = {
  new (): T;
};
class App {
  private readonly page: Component & Composable; // Component이면서 Composable을 구현한 아이
  constructor(appRoot: HTMLElement, private dialogRoot: HTMLElement) {
    this.page = new PageComponent(PageItemComponent); // 외부로 부터 받아오는 것이 안전하다 (dependency injection) 내부에서 object를 만드는 것은 불안정
    // pageComponent에게 만들 수 있는 컴포넌트가 무엇인지 알려주게 된다.
    this.page.attachTo(appRoot);

    this.bindElementToDialog<MediaSectionInput>(
      "#new-image",
      MediaSectionInput,
      (input: MediaSectionInput) => new ImageComponent(input.title, input.url)
    );
    this.bindElementToDialog<MediaSectionInput>(
      "#new-video",
      MediaSectionInput,
      (input: MediaSectionInput) => new VideoComponent(input.title, input.url)
    );

    this.bindElementToDialog<TextSectionInput>(
      "#new-note",
      TextSectionInput,
      (input: TextSectionInput) => new NoteComponent(input.title, input.body)
    );

    this.bindElementToDialog<TextSectionInput>(
      "#new-todo",
      TextSectionInput,
      (input: TextSectionInput) => new TodoComponent(input.title, input.body)
    );
    // For demo :)
    this.page.addChild(
      new ImageComponent("Image Title", "https://picsum.photos/800/400")
    );
    this.page.addChild(
      new VideoComponent("Video Title", "https://youtu.be/D7cwvvA7cP0")
    );
    this.page.addChild(
      new NoteComponent("Note Title", "Don't forget to code your dream")
    );
    this.page.addChild(new TodoComponent("Todo Title", "TypeScript Course!"));
    this.page.addChild(
      new ImageComponent("Image Title", "https://picsum.photos/800/400")
    );
    this.page.addChild(
      new VideoComponent("Video Title", "https://youtu.be/D7cwvvA7cP0")
    );
    this.page.addChild(
      new NoteComponent("Note Title", "Don't forget to code your dream")
    );
    this.page.addChild(new TodoComponent("Todo Title", "TypeScript Course!"));
  }

  private bindElementToDialog<T extends MediaSectionInput | TextSectionInput>(
    selector: string,
    InputComponent: InputComponentConstructor<T>,
    makeSection: (input: T) => Component
  ) {
    const element = document.querySelector(selector)! as HTMLButtonElement;
    element.addEventListener("click", () => {
      const dialog = new InputDialog();
      const inputSection = new InputComponent();
      dialog.addChild(inputSection);
      dialog.attachTo(this.dialogRoot);
      dialog.setOnCloseListener(() => {
        dialog.removeFrom(this.dialogRoot);
      });
      dialog.setOnsubmitListener(() => {
        // 섹션을 만들어서 페이지에 추가 해준다.
        const todo = makeSection(inputSection);
        this.page.addChild(todo);
        dialog.removeFrom(this.dialogRoot);
      });

      dialog.attachTo(this.dialogRoot);
    });
  }
}

new App(document.querySelector(".document")! as HTMLElement, document.body);
