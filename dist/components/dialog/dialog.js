import { BaseComponenet } from "../component.js";
export class InputDialog extends BaseComponenet {
    constructor() {
        super(`<dialog class="dialog">
    <div class="dialog__container">
      <button class="close">&times;</button>
      <div id="dialog__body"></div>
      <button class="dialog__submit">ADD</button>
    </div>
  </dialog>
    `);
        const closeBtn = this.element.querySelector(".close");
        const submitBtn = this.element.querySelector(".dialog__submit");
        closeBtn.onclick = () => {
            this.closeListener && this.closeListener();
        };
        submitBtn.onclick = () => {
            this.submitListener && this.submitListener();
        };
    }
    setOnCloseListener(listener) {
        this.closeListener = listener;
    }
    setOnsubmitListener(listener) {
        this.submitListener = listener;
    }
    addChild(child) {
        const body = this.element.querySelector("#dialog__body");
        child.attachTo(body);
    }
}
