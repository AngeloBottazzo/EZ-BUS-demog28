const routes=[
    {path:'/home',component:home},
    {path:'/',component:home},
]

const router=new VueRouter({
    routes
})

const app = new Vue({
    router
}).$mount('#app')