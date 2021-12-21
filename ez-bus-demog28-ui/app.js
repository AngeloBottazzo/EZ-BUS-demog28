const routes=[
    {path:'/home',component:home},
    {path:'/',component:home},
    {path:'/acquista-biglietto',component:acquista_biglietto, name:"acquista-biglietto"},
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
        }
    }
}).$mount('#app')