import apiService from '../api';
import router from '../router';
import {defineStore} from 'pinia'

export const useUserStore = defineStore('user',{
    state: () => ({
        id: null,
        name: null,
        email: null,
        token: null,
    })
    ,
    actions: {
        async setUserDetails(res){
            // console.log(res)
            this.id = res.user.id;
            this.name = res.user.name;
            this.email = res.user.email;
            this.token = res.token;
        },
        async fetchUser(){
            let res = await apiService.get('user');
            let data = res.data;
            this.id = data.id;
            this.name = data.name;
            this.email = data.email;
        },
        logout(){
            this.id = null;
            this.name = null;
            this.email = null;
            this.token = null;
            router.push('/login')
        }
    }, persist: true,
})