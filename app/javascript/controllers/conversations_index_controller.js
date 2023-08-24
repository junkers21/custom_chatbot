export default class ConversationsIndexController {
    constructor() {
        this.chatContainer          = document.getElementById('conversation-box')
        this.conversationsContainer = document.getElementById('conversations-box')
        this.btnSendText            = document.getElementById('send-text')
        this.textarea               = document.getElementById('input-text')
        this.conversationInputs     = document.getElementsByName('conversation_id')

        this.bindEvents();
    }

    bindEvents() {
        let btnSendText = document.getElementById('send-text')
        btnSendText.addEventListener("click", this.sendTextClicked )

        this.conversationInputs.forEach((item) => {
           item.addEventListener('change', this.onConversationChange )
        });

        document.querySelectorAll('.js-delete').forEach( (item) => {
            item.addEventListener( 'click', this.onDeleteClick );
        });
    }

    resetListenersConversationList() {
        this.conversationInputs.forEach((item) => {
            item.removeEventListener('change', this.onConversationChange )
        });

        document.querySelectorAll('.js-delete').forEach( (item) => {
            item.removeEventListener( 'click', this.onDeleteClick );
        });

        this.conversationInputs.forEach((item) => {
            item.addEventListener('change', this.onConversationChange )
        });

        document.querySelectorAll('.js-delete').forEach( (item) => {
            item.addEventListener( 'click', this.onDeleteClick );
        });
    }

    sendTextClicked(e){
        e.preventDefault();
        let self = window.conversationsIndex;
        let val = self.textarea.value.trim();



        if ( val.trim().length > 0 ) {

            let conversationId = parseInt(document.querySelector('input[name=conversation_id]:checked').value);
            self.textarea.value = "";
            if ( conversationId === 0 ) {
                self.createConversation( val )
                    .then( () => { self.sendText(val, self.conversationsContainer.firstChild.dataset.id ) } )
                    .catch(console.error);
            }else {
                self.sendText(val, conversationId)
                    .catch(console.error);
            }
        }
    }

    async createConversation(value) {
        let self = this;

        return fetch(this.chatContainer.dataset.urlConversation, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Requested-With": "XMLHttpRequest",
                "X-CSRF-Token": document.querySelector('meta[name="csrf-token"]').content
            },
            body: JSON.stringify({
                conversation: { title: value.slice(0, 50)}
            })
        })
            .then( response => response.text() )
            .then((data) => {
                self.conversationsContainer.innerHTML = data + self.conversationsContainer.innerHTML;
                let id = self.conversationsContainer.firstChild.dataset.id;
                let input = document.querySelector(`#input_radio_conversation_${id}`);
                input.checked = true;
                self.resetListenersConversationList();
                self.reloadExchange();
            })
    }

    async sendText( value, conversationId ) {

        let self = this;
        const response = await fetch(this.chatContainer.dataset.url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Requested-With": "XMLHttpRequest",
                "X-CSRF-Token": document.querySelector('meta[name="csrf-token"]').content
            },
            body: JSON.stringify({
                exchange: {
                    input: value,
                    conversation_id: conversationId
                }
            })
        })
            .then( response => response.text() )
            .then((data) => {
                self.chatContainer.innerHTML += data
                self.chatContainer.scrollTo(0, self.chatContainer.scrollHeight)
            });
    }

    onConversationChange() {
        let self = window.conversationsIndex;
        self.reloadExchange();
    }

    async reloadExchange() {
        console.log("hello there");
        let self = this;

        return await fetch('exchanges?' + new URLSearchParams({
            id: document.querySelector('input[name=conversation_id]:checked').value
        } ), {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "X-Requested-With": "XMLHttpRequest",
                "X-CSRF-Token": document.querySelector('meta[name="csrf-token"]').content
            }
        })
            .then(response => response.text())
            .then((data) => {
                self.chatContainer.innerHTML = data
                self.chatContainer.scrollTo(0, self.chatContainer.scrollHeight)
            })
    }

    onDeleteClick(e) {
        e.preventDefault();
        let self = window.conversationsIndex;
        self.deleteConversation( this.dataset.id );
    }

    async deleteConversation(id) {
        let self = this;
        return fetch(`conversations/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "X-Requested-With": "XMLHttpRequest",
                "X-CSRF-Token": document.querySelector('meta[name="csrf-token"]').content
            }
        })
            .then(() => {
                let input = document.querySelector(`#input_radio_conversation_0`);
                input.checked = true;
                document.getElementById(`conversation_${id}`).remove()
                self.reloadExchange();
            })
    }
}