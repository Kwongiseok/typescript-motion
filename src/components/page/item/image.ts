import { BaseComponenet } from "../../component.js";

export class ImageComponent extends BaseComponenet<HTMLElement> {
  constructor(title: string, url: string) {
    super(`
    <section class="image">
      <div class="image__holder"><img class="image__thumbnail"></div>
      <h2 class="page-item__title image__title"></h2>  
    </section>`);

    // 사용자에게 입력받은 것을 직접적으로 innerHTML로 업데이트하면 안된다. 보안상오류
    const imageElement = this.element.querySelector(
      ".image__thumbnail"
    )! as HTMLImageElement;
    imageElement.src = url;
    imageElement.alt = title;

    const titleElement = this.element.querySelector(
      ".image__title"
    )! as HTMLHeadElement;
    titleElement.textContent = title;
  }
}
