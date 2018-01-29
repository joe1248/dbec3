
<template>
    <div id="menu" style="position: relative; margin-top: 100px;">
        <p>
            <router-link :to="{name: 'ListOfConnections'}">List of connections</router-link>
        </p>
        <p>
            <router-link :to="{name: 'NewConnection'}">Add new connection</router-link>
        </p>
    </div>
</template>

<script lang="ts">
    // script after template helps coverage get to 100% instead of 0...
    export default {
        data() {
            return {};
        }
    }
</script>
