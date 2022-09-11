import Vuex from "vuex";
import Vue from "vue";

Vue.use(Vuex)

const store = new Vuex.Store({
    state:{
        currentPathName:''
    },
    mutations:{
        setPath(state){
            state.currentPathName = localStorage.getItem("currentPathName")
        }
    }
})

export default store