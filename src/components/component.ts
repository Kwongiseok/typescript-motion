export interface Component {
  attachTo(parent: HTMLElement, position?: InsertPosition): void;
  removeFrom(parent: HTMLElement): void;
  attach(component: Component, position?: InsertPosition): void;
}
/**
 * Encapsulate the HTML element creation
 */
export class BaseComponenet<T extends HTMLElement> implements Component {
  protected readonly element: T;
  constructor(htmlString: string) {
    const template = document.createElement("template"); // 템플릿 테이블
    template.innerHTML = htmlString;
    // 사용자에게 받아온 정보를 바로 innerHTML로 작성하는 것은 위험하다 따라서 아래와 같이 코딩했다.
    this.element = template.content.firstElementChild! as T;
  }
  attachTo(parent: HTMLElement, position: InsertPosition = "afterbegin") {
    parent.insertAdjacentElement(position, this.element);
  }
  removeFrom(parent: HTMLElement): void {
    if (parent !== this.element.parentElement) {
      throw new Error("Parent mismatch!");
    }
    parent.removeChild(this.element);
  }

  attach(component: Component, position?: InsertPosition) {
    component.attachTo(this.element, position);
  }
}
