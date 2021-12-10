const acquista_biglietto={template:`
<div>
    <h1 class="my-4">
        Acquista nuovo biglietto
    </h1>
    <div class="mb-3">
        <label for="stazione_partenza" class="form-label">Stazione di partenza</label>
        
        <select id="stazione_partenza" v-model="stazione_partenza" v-on:change="aggiornaViaggi()" class="form-select" aria-label="Stazione di partenza">
            <option v-for="stazione in stazioni" :value="stazione._id">{{stazione.name}}</option>
        </select>
    </div>

    <div class="mb-3">
        <label for="stazione_arrivo" class="form-label">Stazione di arrivo</label>
        
        <select id="stazione_arrivo" v-model="stazione_arrivo" v-on:change="aggiornaViaggi()" class="form-select" aria-label="Stazione di arrivo">
            <option v-for="stazione in stazioni" :value="stazione._id">{{stazione.name}}</option>
        </select>
    </div>

    <div class="mb-3">
        <label for="data_viaggio" class="form-label">Data del viaggio</label>
        
        <input type="date" id="data_viaggio" v-model="data_viaggio" :min="adesso.toISOString().substring(0, 10)" v-on:change="aggiornaViaggi()" class="form-control" aria-label="Data del viaggio"/>
    </div>

    <div class="mb-3">
        <label for="ora_partenza" class="form-label">Ora di partenza</label>
        
        <select id="ora_partenza" v-model="ora_partenza" class="form-select" aria-label="Ora di partenza">
            <option v-for="viaggio in viaggi" :value="viaggio._id">{{trovaOraFermataInViaggio(viaggio, stazione_partenza)}}</option>
        </select>
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
        
        <input type="tel" id="telefono" v-model="telefono" class="form-control" aria-label="Telefono"/>
    </div>

    <div class="mb-3">
        <label for="data_nascita" class="form-label">Data di nascita</label>
        
        <input type="date" id="data_nascita" v-model="data_nascita" class="form-control" aria-label="Data di nascita"/>
    </div>

    <button type="button" @click="inviaBiglietto()" class="btn btn-primary">
        Procedi
    </button>
</div>
`,

data() {
    return {
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
        ora_partenza: ''
    }
},
methods: {
    refreshData() {
        axios.get(variables.API_URL + "stazioni")
            .then((response) => {
                this.stazioni = response.data;
                console.log(this.stazioni);
            });
    },
    aggiornaViaggi(){
        if(!(this.stazione_partenza && this.stazione_arrivo && this.data_viaggio))
            return;

        axios.get(variables.API_URL + "viaggi-tra-stazioni", {
            params:{
                data_viaggio: this.data_viaggio,
                stazione_partenza: this.stazione_partenza,
                stazione_arrivo: this.stazione_arrivo}
        })
        .then((response) => {
            console.log(response);
            this.viaggi = response.data;
        });
    },
    inviaBiglietto(){
        axios.post(variables.API_URL + "biglietti", {
            nome: this.nome,
            cognome: this.cognome,
            telefono: this.telefono,
            data_nascita: this.data_nascita,
            data_partenza: Date.parse(this.data_viaggio + " " + this.ora_partenza),
            data_arrivo: Date.parse(this.data_viaggio + " " + this.ora_partenza),
            stazione_partenza: this.stazione_partenza,
            stazione_arrivo: this.stazione_arrivo,
        })
        .then((response) => {
            alert(response.data);
        });
    },
    trovaOraFermataInViaggio(viaggio, stazione){
        return moment.utc(moment.duration(viaggio.stazioni.find(fermata=>fermata.stazione == stazione).ora).as('milliseconds')).format('HH:mm')
    }
},
mounted: function () {
    this.refreshData();
}

}