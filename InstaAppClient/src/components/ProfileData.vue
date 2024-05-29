<template>
    <div>

    </div>
</template>

<script>
    export default {
        data(){
            return {
                user:{}
            }
        },
        methods:{
            fetchUser(token){
                this.$store.dispatch("FETCH_USER_DATA", token);
            },
            getToken(){
                return this.$store.getters.GET_TOKEN;
            }
        },
        created(){
            this.user = this.fetchUser(this.getToken())
            console.log(this.user);
        }
    }
</script>

<style lang="scss" scoped>

</style>