import { BaseComponenet, Component } from "./../component.js";
import { Hoverable, Droppable } from "./../common/type";
import {
  EnableDragging,
  EnableDrop,
  EnableHover,
} from "../../decorators/draggable.js";
import { Draggable } from "../common/type.js";

export interface Composable {
  addChild(child: Component): void;
}

type OnCloseListener = () => void;
type DragState = "start" | "stop" | "enter" | "leave";
type OnDragStateListener<T extends Component> = (
  target: T,
  state: DragState
) => void;

interface SectionContainer extends Component, Composable, Draggable, Hoverable {
  setOnCloseListener(listener: OnCloseListener): void;
  setOnDragStateListener(listener: OnDragStateListener<SectionContainer>): void;
  muteChildren(state: "mute" | "unmute"): void;
  getBoundingRect(): DOMRect;
  onDropped(): void;
}

type SectionContainerConstructor = {
  new (): SectionContainer; // 생성자를 정의하는 타입 SectionContainer에 맞는
  // 생성자를 통해 생성되는 타입을 정의한 것이다!
};

// class DarkPageItemComponent extends BaseComponenet<HTMLElement> implements SectionContainer {

// } 이런식으로 다른 타입의 페이지 아이템 Component를 만들 때 사용할 수 있다. 확장성이 좋다!

// 좀 더 공부해야될 부분
@EnableDragging
@EnableHover
export class PageItemComponent
  extends BaseComponenet<HTMLElement>
  implements SectionContainer {
  private closeListner?: OnCloseListener;
  private dragStateListener?: OnDragStateListener<PageItemComponent>;
  constructor() {
    super(`
    <li draggable="true" class="page-item">
      <section class="page-item__body"></section>
      <div class="page-item__controls">
        <button class="close">&times;</button>
      </div>
    </li>`);

    const closeBtn = this.element.querySelector(".close")! as HTMLButtonElement;
    closeBtn.onclick = () => {
      this.closeListner && this.closeListner();
    };
  }
  onDragStart(_: DragEvent) {
    this.notifyDragObservers("start");
    this.element.classList.add("lifted");
  }
  onDragEnd(_: DragEvent) {
    this.notifyDragObservers("stop");
    this.element.classList.remove("lifted");
  }
  onDragEnter(_: DragEvent) {
    this.notifyDragObservers("enter");
    this.element.classList.add("drop-area");
  }
  onDragLeave(_: DragEvent) {
    this.notifyDragObservers("leave");
    this.element.classList.remove("drop-area");
  }
  onDropped() {
    this.element.classList.remove("drop-area");
  }
  notifyDragObservers(state: DragState) {
    this.dragStateListener && this.dragStateListener(this, state);
  }

  addChild(child: Component) {
    const container = this.element.querySelector(
      ".page-item__body"
    )! as HTMLElement;
    child.attachTo(container);
  }

  setOnCloseListener(listener: OnCloseListener) {
    this.closeListner = listener;
  }

  setOnDragStateListener(listener: OnDragStateListener<PageItemComponent>) {
    this.dragStateListener = listener;
  }

  muteChildren(state: "mute" | "unmute") {
    if (state === "mute") {
      this.element.classList.add("mute-children");
    } else {
      this.element.classList.remove("mute-children");
    }
  }

  getBoundingRect(): DOMRect {
    return this.element.getBoundingClientRect();
  }
}

@EnableDrop
export class PageComponent
  extends BaseComponenet<HTMLUListElement>
  implements Composable, Droppable {
  private children = new Set<SectionContainer>();
  private dropTarget?: SectionContainer;
  private dragTarget?: SectionContainer;
  constructor(private pageItemConstructor: SectionContainerConstructor) {
    super('<ul class="page"></ul>');
  }
  onDragOver(_: DragEvent): void {}

  onDrop(event: DragEvent) {
    // 여기에서 위치를 바꿔준다.
    if (!this.dropTarget) {
      return;
    }
    if (this.dragTarget && this.dragTarget !== this.dropTarget) {
      const dropY = event.clientY;
      const srcElement = this.dragTarget.getBoundingRect();
      this.dragTarget.removeFrom(this.element);
      this.dropTarget.attach(
        this.dragTarget,
        dropY < srcElement.y ? "beforebegin" : "afterend"
      );
    }
    this.dropTarget.onDropped();
  }
  addChild(section: Component) {
    const item = new this.pageItemConstructor();
    item.addChild(section);
    item.attachTo(this.element, "beforeend");
    item.setOnCloseListener(() => {
      item.removeFrom(this.element);
      this.children.delete(item);
    });
    this.children.add(item);
    item.setOnDragStateListener(
      (target: SectionContainer, state: DragState) => {
        switch (state) {
          case "start":
            this.dragTarget = target;
            this.updateSections("mute");
            break;
          case "stop":
            this.dragTarget = undefined;
            this.updateSections("unmute");
            break;
          case "enter":
            this.dropTarget = target;
            break;
          case "leave":
            this.dropTarget = undefined;
            break;
          default:
            throw new Error(`unsupported state: ${state}`);
        }
      }
    );
  }
  private updateSections(state: "mute" | "unmute") {
    this.children.forEach((section: SectionContainer) => {
      section.muteChildren(state);
    });
  }
}
