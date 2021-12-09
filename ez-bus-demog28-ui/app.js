const routes=[
    {path:'/home',component:home},
    {path:'/',component:home},
    {path:'/acquista-biglietto',component:acquista_biglietto}
]

const router=new VueRouter({
    routes
})

const app = new Vue({
    router
}).$mount('#app')