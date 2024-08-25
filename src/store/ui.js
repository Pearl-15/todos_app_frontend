import { observable, action, decorate } from "mobx";

class UI {
    isloading = false;

    setIsLoading(isLoading) {
        this.isloading = isLoading;
      }
}

decorate(UI, {
    isloading: observable,
    setIsLoading: action,
  });
  export const uiStore = new UI();