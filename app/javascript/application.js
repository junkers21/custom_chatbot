// Configure your import map in config/importmap.rb. Read more: https://github.com/rails/importmap-rails
import "@hotwired/turbo-rails"
import "controllers"
import "popper"
import "bootstrap"
import ConversationsIndexController from "./controllers/conversations_index_controller";

const offcanvasConversation = new bootstrap.Offcanvas('#offcanvas-conversations')

const setOffcanvas = () => {
    if( window.innerWidth > 992 ){
        offcanvasConversation.show()
    } else {
        offcanvasConversation.hide()
    }
};
const debounce = (func) => {
    var timer;
    return function(event){
        if(timer) clearTimeout(timer);
        timer = setTimeout(func,100,event);
    };
}

setOffcanvas();
window.addEventListener("resize", debounce(() => { setOffcanvas(); } ) );

window.conversationsIndex = new ConversationsIndexController();