const routes=[
    {path:'/home',component:home},
    {path:'/',component:home},
    {path:'/acquista-biglietto',component:acquista_biglietto},
    {path:'/biglietti-acquistati',component:biglietti_acquistati}
]

const router=new VueRouter({
    routes
})

const app = new Vue({
    router,
    methods: {
        dataOraBreve(stringaISO){
            return moment(stringaISO).format("DD/MM/YYYY HH:mm");
        },
        formattaPrezzo(prezzo){
            return prezzo ? "€ " + parseFloat(prezzo).toFixed(2) : 'prezzo non valido'
        }
    }
}).$mount('#app')