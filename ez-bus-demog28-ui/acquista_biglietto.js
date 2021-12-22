const acquista_biglietto={template:`
<div>
    <h1 class="my-4">
        Acquista nuovo biglietto
    </h1>
    <div v-if="fase === 0">
        <div class="mb-3">
            <label for="stazione_partenza" class="form-label">Stazione di partenza</label>
            
            <select id="stazione_partenza" v-model="stazione_partenza" v-on:change="aggiornaViaggi()" class="form-select" aria-label="Stazione di partenza">
                <option v-for="stazione in stazioni" :value="stazione._id">{{stazione.nome}}</option>
            </select>
        </div>

        <div class="mb-3">
            <label for="stazione_arrivo" class="form-label">Stazione di arrivo</label>
            
            <select id="stazione_arrivo" v-model="stazione_arrivo" v-on:change="aggiornaViaggi()" class="form-select" aria-label="Stazione di arrivo">
                <option v-for="stazione in stazioni" :value="stazione._id">{{stazione.nome}}</option>
            </select>
        </div>

        <div class="mb-3">
            <label for="data_viaggio" class="form-label">Data del viaggio</label>
            
            <input type="date" id="data_viaggio" v-model="data_viaggio" :min="adesso.toISOString().substring(0, 10)" v-on:change="aggiornaViaggi()" class="form-control" aria-label="Data del viaggio"/>
            <div class="text-red" v-if="statoData"><small>{{statoData}}</small></div>
        </div>

        <div class="mb-3">
            <label for="ora_partenza" class="form-label">Ora di partenza</label>
            
            <select :disabled="statoViaggi!=''" id="ora_partenza" v-model="viaggio_scelto" class="form-select" aria-label="Ora di partenza">
                <option :disabled="viaggio.posti_disponibili<=0" v-for="viaggio in viaggi" :value="viaggio">{{mostraDurataInModoBello(viaggio.fermate[viaggio.index_partenza].ora)}} - {{viaggio.posti_disponibili}} posti - {{$root.formattaPrezzo(viaggio.prezzo)}}</option>
            </select>
            
            <div v-if="statoViaggi"><small>{{statoViaggi}}</small></div>
        </div>

        <div class="mb-3">
            <label for="nome" class="form-label">Nome</label>
            
            <input type="text" id="nome" v-model="nome" class="form-control" aria-label="Nome"/>
        </div>

        <div class="mb-3">
            <label for="cognome" class="form-label">Cognome</label>
            
            <input type="text" id="cognome" v-model="cognome" class="form-control" aria-label="Cognome"/>
        </div>

        <div class="mb-3">
            <label for="telefono" class="form-label">Telefono</label>
            
            <input type="tel" id="telefono" v-model="telefono" @keydown="nameKeydown($event)" class="form-control" aria-label="Telefono"/>
        </div>

        <div class="mb-3">
            <label for="data_nascita" class="form-label">Data di nascita</label>
            
            <input type="date" id="data_nascita" v-model="data_nascita" class="form-control" aria-label="Data di nascita"/>
        </div>

        <button :disabled="!(viaggio_scelto && nome!='' && cognome != '' )" type="button" @click="avviaPagamento()" class="btn btn-primary">
            Procedi
        </button>
    </div>

    <div v-if="fase === 1">
        Prezzo: <b>{{$root.formattaPrezzo(viaggio_scelto.prezzo)}}</b>
        <br>
    </div>
    
    <div id="paypal-button-container">
    </div>
</div>
`,

data() {
    return {
        fase: 0,
        stazioni: [],
        viaggi: [],
        adesso: new Date(),
        nome: '',
        cognome: '',
        data_nascita: '',
        telefono: '',
        stazione_partenza: '',
        stazione_arrivo: '',
        data_viaggio: '',
        viaggio_scelto: '',
        richiesta_viaggi: 0,
        statoData: '',
        statoViaggi: 'Seleziona prima le stazioni e la data del viaggio.'
    }
},
methods: {
    async refreshData() {
        await axios.get(variables.API_URL + "stazioni")
            .then((response) => {
                this.stazioni = response.data
            });
    },
    async aggiornaViaggi(){
        this.statoViaggi = 'Seleziona prima le stazioni e la data del viaggio.'
        this.viaggi = []
        
        if(!(this.stazione_partenza && this.stazione_arrivo && this.data_viaggio))
            return
        
        let data_viaggio = moment(this.data_viaggio, moment.ISO_8601)
/*
        if(!data_viaggio.isValid()){
            this.statoData = "La data non è valida."
            return
        }
        else*/ if(data_viaggio.startOf('day').isBefore(moment().startOf('day'))){
            this.statoData = "La data non dev'essere già trascorsa."
            return
        }
        else{
            this.statoData = ''
        }

        this.statoViaggi = 'Caricamento in corso...'

        let richiesta_viaggi_ora = ++this.richiesta_viaggi;

        await axios.get(variables.API_URL + "viaggi-tra-stazioni", {
            params:{
                data_viaggio: this.data_viaggio,
                stazione_partenza: this.stazione_partenza,
                stazione_arrivo: this.stazione_arrivo}
        })
        .then((response) => {
            if(this.richiesta_viaggi == richiesta_viaggi_ora){
                console.log(response)
                this.viaggi = response.data;
            }
            
            this.statoViaggi = ''
        });
    },
    avviaPagamento() {
        var prezzo = this.viaggio_scelto.prezzo.toFixed(2)
        var vueComponent = this
        this.fase = 1
        paypal.Buttons({
            createOrder: function (data, actions) {
                // This function sets up the details of the transaction, including the amount and line item details.
                return actions.order.create({
                    purchase_units: [{
                        amount: {
                            value: prezzo
                        }

                    }]
                });
            },
            onApprove: function (data, actions) {
                // This function captures the funds from the transaction.
                return actions.order.capture().then(function (details) {
                    // This function shows a transaction success message to your buyer.
                    console.log(details)
                    
                    axios.post(variables.API_URL + "biglietti", {
                        nome: vueComponent.nome,
                        cognome: vueComponent.cognome,
                        telefono: vueComponent.telefono,
                        data_nascita: vueComponent.data_nascita,
                        data_viaggio: Date.parse(vueComponent.data_viaggio),
                        viaggio: vueComponent.viaggio_scelto._id,
                        stazione_partenza: vueComponent.stazione_partenza,
                        stazione_arrivo: vueComponent.stazione_arrivo,
                        pagamento: details.purchase_units[0].payments.captures[0].id,
                        prezzo: details.purchase_units[0].amount.value
                    })
                    .then((response) => {
                        router.push('/biglietti-acquistati')
                    })
                    .catch((error)=>{
                        alert(error.response.data ?? error)
                    }
                    );
                });
            }
        }).render('#paypal-button-container');
        //This function displays payment buttons on your web page.

    },
    mostraDurataInModoBello(durata){
        return moment.utc(moment.duration(durata).asMilliseconds()).format("HH:mm")
    },
    nameKeydown(e) {
        if (!(/[0-9+ ]/.test(e.key) || e.key === "Backspace" || e.key === "Delete" || e.key === "ArrowLeft" || e.key === "ArrowRight")) {
          e.preventDefault();
        }
      },
},
mounted: async function () {
    await this.refreshData();
    if("biglietto" in this.$route.params) {
        let biglietto = this.$route.params.biglietto;
        this.stazione_partenza = biglietto.stazione_partenza;
        this.stazione_arrivo = biglietto.stazione_arrivo;
        this.data_viaggio = null;
        if (moment(biglietto.data_viaggio).isAfter(moment())) {
            this.data_viaggio = biglietto.data_viaggio;
            await this.aggiornaViaggi();
            this.viaggio_scelto = this.viaggi.find((viaggio)=> viaggio._id==biglietto.viaggio);
            if (this.viaggio_scelto.posti_disponibili < 1)
                this.viaggio_scelto = null;
        }
        this.nome = biglietto.intestatario.nome;
        this.cognome = biglietto.intestatario.cognome;
        this.telefono = biglietto.intestatario.telefono;
        this.data_nascita = biglietto.intestatario.data_nascita;
    }
}

}