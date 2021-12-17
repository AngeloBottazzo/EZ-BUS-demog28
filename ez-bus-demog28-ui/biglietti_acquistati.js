const biglietti_acquistati = {
    template: `
<div>
    <h1 class="my-4">
        Biglietti acquistati
    </h1>
    <div class="container">
        <div class="row">
            <div v-for="biglietto in biglietti" class="col col-12 col-lg-6 px-2 p-2">
                <div class="card">
                    <div class="card-body">
                        {{biglietto.info_stazione_partenza.nome}}: {{ $root.dataOraBreve(biglietto.data_partenza) }} <br>
                        {{biglietto.info_stazione_arrivo.nome}}: {{ $root.dataOraBreve(biglietto.data_arrivo) }} <br>
                        svariati euro
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div id="overlay">
    
    </div>
</div>
`,
    data() {
        return{
            biglietti: []
        }
    },
    methods: {
        refreshData() {
            axios.get(variables.API_URL + "biglietti")
                .then((response) => {
                    this.biglietti = response.data;
                });
        }
    },
    mounted: function () {
        this.refreshData();
    }
}