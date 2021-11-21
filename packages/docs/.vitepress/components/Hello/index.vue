<template><div>Hello {{msg}}</div></template>
<script setup>
import { defineProps } from 'vue'

defineProps({
  msg: {
    type: String,
    default: 'world'
  }
})
</script>
