Vue.component('errors', {
    data() {
        return {
            visible: false,
        }
    },
    template: `
        <div v-show="visible" class="back-hiden" @click="visible = !visible">
          <div class="modal">
              <p>Error: не удается получить ответ от сервера</p>
              <div class="modal-footer">
                <button type="button" @click="visible = !visible">Close</button>
              </div>
          </div>
        </div>
    `
})