const acquista_biglietto={template:`
<div>
    <h1 class="my-4">
        Acquista nuovo biglietto
    </h1>
    <div class="mb-3">
        <label for="stazione_partenza" class="form-label">Stazione di partenza</label>
        
        <select id="stazione_partenza" name="stazione_arrivo" class="form-select" aria-label="Stazione di partenza">
            <option v-for="stazione in stazioni" :value="stazione._id">{{stazione.name}}</option>
        </select>
    </div>

    <div class="mb-3">
        <label for="stazione_arrivo" class="form-label">Stazione di arrivo</label>
        
        <select id="stazione_arrivo" name="stazione_arrivo" class="form-select" aria-label="Stazione di arrivo">
            <option v-for="stazione in stazioni" :value="stazione._id">{{stazione.name}}</option>
        </select>
    </div>

    <div class="mb-3">
        <label for="data_viaggio" class="form-label">Data del viaggio</label>
        
        <input type="date" id="data_viaggio" name="data_viaggio" :min="adesso.toISOString().substring(0, 10)" v-on:change="aggiornaPartenze()" class="form-control" aria-label="Data del viaggio"/>
    </div>

    <div class="mb-3">
        <label for="ora_partenza" class="form-label">Ora di partenza</label>
        
        <select id="ora_partenza" name="ora_partenza" class="form-select" aria-label="Ora di partenza">
            <option v-for="partenza in partenze" :value="partenza.ora_partenza_corsa">{{partenza.ora_partenza}}</option>
        </select>
    </div>

    <div class="mb-3">
        <label for="nome" class="form-label">Nome</label>
        
        <input type="text" id="nome" name="nome" class="form-control" aria-label="Nome"/>
    </div>

    <div class="mb-3">
        <label for="cognome" class="form-label">Cognome</label>
        
        <input type="text" id="cognome" name="cognome" class="form-control" aria-label="Cognome"/>
    </div>

    <div class="mb-3">
        <label for="telefono" class="form-label">Telefono</label>
        
        <input type="tel" id="telefono" name="telefono" class="form-control" aria-label="Telefono"/>
    </div>

    <div class="mb-3">
        <label for="data_nascita" class="form-label">Data di nascita</label>
        
        <input type="date" id="data_nascita" name="data_nascita" class="form-control" aria-label="Data di nascita"/>
    </div>

    <button type="button" @click="invioBiglietto()" class="btn btn-primary">
        Procedi
    </button>
</div>
`,

data() {
    return {
        stazioni: [],
        partenze: [],
        adesso: new Date()
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
    aggiornaPartenze(){
        this.partenze = [
            {
                ora_partenza_corsa:"09:00",
                ora_partenza:"09:20",
            },
        ]
    },
    inviaBiglietto(){
        axios.post(variables.API_URL + "biglietti", {
            nome: this.nome,
            cognome: this.cognome,
            telefono: this.telefono,
            data_nascita: this.data_nascita,
            data_partenza: this.data_viaggio + " " + this.ora_partenza,
            data_arrivo: this.data_viaggio + " " + this.ora_partenza
            stazione_partenza: this.stazione_partenza,
            stazione_arrivo: this.stazione_arrivo,
        })
        .then((response) => {
            alert(response.data);
        });
    }
},
mounted: function () {
    this.refreshData();
}

}