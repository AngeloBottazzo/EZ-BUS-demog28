const biglietti_acquistati = {
    template: `
<div>
    <h1 class="my-4">
        Biglietti acquistati
    </h1>
    <div class="container">
        <div class="row">
            <div v-for="biglietto in biglietti" class="col col-12 col-lg-6 px-2 p-2">
                <button type="button" :class="[passato(biglietto)? 'btn-success': 'btn-secondary', 'btn', 'container']" v-on:click="apriPopup(biglietto)">
                    {{biglietto.info_stazione_partenza.nome}}: {{ $root.dataOraBreve(biglietto.data_partenza) }} <br>
                    {{biglietto.info_stazione_arrivo.nome}}: {{ $root.dataOraBreve(biglietto.data_arrivo) }} <br>
                    € {{biglietto.prezzo??0}}
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
                        <div style="display:flex;justify-content: space-between;">
                            <div >
                                {{biglietto.info_stazione_partenza.nome}}: {{ $root.dataOraBreve(biglietto.data_partenza) }} <br>
                                {{biglietto.info_stazione_arrivo.nome}}: {{ $root.dataOraBreve(biglietto.data_arrivo) }} <br>
                                € {{biglietto.prezzo??0}}
                            </div>
                            <div>
                                {{biglietto.intestatario.nome}} <br>
                                {{biglietto.intestatario.cognome}} <br>
                                {{biglietto.intestatario.telefono}}
                            </div>
                        </div> 
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" v-on:click="chiudiPopup">Chiudi</button>
                        <button type="button" class="btn btn-info" v-on:click="autoFill">Acquista di nuovo</button>
                        <button type="button" :disabled="!passato(biglietto)" class="btn btn-danger" v-on:click="rimborso">Annulla e rimborsa biglietto</button>
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
            mostraOverlay: false,
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
        },
        rimborso() {
            axios.delete(variables.API_URL + "biglietti/" + this.biglietto._id)
                .then((response) => {
                    this.refreshData();
                }) .catch(function (error) {
                    console.log(error);
                });
        },
        autoFill() {
            router.push({name:"acquista-biglietto", params:{biglietto:this.biglietto}})
        },
        passato(biglietto) {
            return moment(biglietto.data_viaggio).isAfter(moment()); 
        }
    },
    mounted: function () {
        this.refreshData();
    }
}