const biglietti_acquistati = {
    template: `
<div>
    <h1 class="my-4">
        Biglietti acquistati
    </h1>
    <div class="container">
        <transition-group name="lista-biglietti" tag="div" class="row" style="position:relative">
            <div v-for="biglietto in biglietti" :key="biglietto._id" class="col col-12 col-lg-6 px-2 p-2">
                <button :disabled="eliminazioneInCorso" data-bs-toggle="modal" data-bs-target="#modalImpostazioniBiglietto" type="button" :class="[passato(biglietto)? 'btn-success': 'btn-secondary', 'btn', 'container']" v-on:click="apriPopup(biglietto)">
                    {{biglietto.info_stazione_partenza.nome}}: {{ $root.dataOraBreve(biglietto.data_partenza) }} <br>
                    {{biglietto.info_stazione_arrivo.nome}}: {{ $root.dataOraBreve(biglietto.data_arrivo) }} <br>
                    {{$root.formattaPrezzo(biglietto.prezzo)}}
                </button>
            </div>
        </transition-group>
    </div>
    <div class="modal fade" tabindex="-1" id="modalImpostazioniBiglietto">
        <div class="modal-dialog" v-on:click.stop="" style="cursor:default;">
            <div class="modal-content" v-if="biglietto">
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
                    <button data-bs-dismiss="modal" type="button" class="btn btn-secondary">Chiudi</button>
                    <button data-bs-dismiss="modal" type="button" class="btn btn-info" v-on:click="autoFill">Acquista di nuovo</button>
                    <button data-bs-dismiss="modal" type="button" :disabled="!passato(biglietto)" class="btn btn-danger" v-on:click="rimborso">Annulla e rimborsa biglietto</button>
                </div>
            </div>
        </div>
    </div>
</div>
`,
    data() {
        return{
            biglietti: [],
            biglietto:null,
            eliminazioneInCorso: false
        }
    },
    methods: {
        refreshData() {
            axios.get(variables.API_URL + "biglietti")
                .then((response) => {
                    this.biglietti = response.data;
                });
        },
        apriPopup(biglietto) {
            this.biglietto = biglietto;
        },
        rimborso() {
            this.eliminazioneInCorso = true
            axios.delete(variables.API_URL + "biglietti/" + this.biglietto._id)
                .then((response) => {
                    this.refreshData();
                }) .catch(function (error) {
                    console.log(error)
                    alert(error)
                })
                .then(()=>{
                    this.eliminazioneInCorso = false
                })
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