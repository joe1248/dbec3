<style>
    .Alert {
        padding: 2em;
    }
    .Alert-Success {
        border: 10px solid green;
    }
    .Alert-Error {
        border: 10px solid red;
    }
</style>

<template>
    <div class="Alert"
         v-bind:class="{
            'Alert-Success': type == 'success',
            'Alert-Error': type == 'error',
        }"
         v-show="show">
        <p>
            {{ msg }}
        </p>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                show: true
            }
        },
        props: ['msg', 'type'],
        ready() {
        }
    }
</script>