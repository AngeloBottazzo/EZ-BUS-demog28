const biglietti_acquistati = {
    template: `
<div>
    <h1 class="my-4">
        Biglietti acquistati
    </h1>
    <div class="container">
        <div class="row">
            <div v-for="biglietto in biglietti" class="col col-12 col-lg-6 px-2 p-2">
                <button type="button" class="btn btn-success container" v-on:click="apriPopup(biglietto)">
                    {{biglietto.info_stazione_partenza.nome}}: {{ $root.dataOraBreve(biglietto.data_partenza) }} <br>
                    {{biglietto.info_stazione_arrivo.nome}}: {{ $root.dataOraBreve(biglietto.data_arrivo) }} <br>
                    svariati euro
                </button>
            </div>
        </div>
    </div>
    <div id="overlay" class="overlay" v-on:click="chiudiPopup" v-if="mostraOverlay">
        <div class="modal" style="display:inherit;" tabindex="-1">
            <div class="modal-dialog" v-on:click.stop="" style="cursor:default;">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Impostazioni biglietto</h5>
                    </div>
                    <div class="modal-body">
                        <p>Modal body text goes here.</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" v-on:click="chiudiPopup">Chiudi</button>
                        <button type="button" class="btn btn-info">Acquista di nuovo</button>
                        <button type="button" class="btn btn-danger">Annulla e rimborsa biglietto</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
`,
    data() {
        return{
            biglietti: [],
            mostraOverlay: true,
            biglietto:null
        }
    },
    methods: {
        refreshData() {
            axios.get(variables.API_URL + "biglietti")
                .then((response) => {
                    this.biglietti = response.data;
                });
        },
        chiudiPopup() {
            this.mostraOverlay = false;
        },
        apriPopup(biglietto) {
            this.biglietto = biglietto;
            this.mostraOverlay = true;
        }
    },
    mounted: function () {
        this.refreshData();
    }
}