import { BaseComponenet } from "../../component.js";

export class VideoComponent extends BaseComponenet<HTMLElement> {
  constructor(title: string, url: string) {
    super(`
    <section class="video">
      <div class="video__player">
        <iframe class="video__iframe"></iframe>
      </div>
      <h3 class="page-item__title video__title"></h3>
    </section>`);

    const iframe = this.element.querySelector(
      ".video__iframe"
    )! as HTMLIFrameElement;
    iframe.src = this.convertToEmbeddedURL(url); // url -> videoId 만 추출하는 함수를 만듬 , embed용으로

    const titleElement = this.element.querySelector(
      ".video__title"
    ) as HTMLHeadElement;
    titleElement.textContent = title;
  }

  // 정규표현식 Regex 사용!
  private convertToEmbeddedURL(url: string): string {
    const regExp =
      "^(?:https?://)?(?:www.)?(?:(?:youtube.com/(?:(?:watch?v=)|(?:embed/))([a-zA-Z0-9-]{11}))|(?:youtu.be/([a-zA-Z0-9-]{11})))";
    const match = url.match(regExp);
    console.log(match);
    const videoId = match ? match[1] || match[2] : undefined;
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}`;
    }
    return url;
  }
}

// <iframe
//   width="916"
//   height="515"
//   src="https://www.youtube.com/embed/p2fxv3PAtLU"
//   frameborder="0"
//   allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//   allowfullscreen
// ></iframe>;
