<script setup lang="ts">
import { LinkData } from "@/configStructure";

interface LinkDisplayProps {
  btn: LinkData;
  hoverColor?: string;
}

defineProps<LinkDisplayProps>();
</script>
<template>
  <v-card
    class="my-3 d-flex w-100 text-button"
    rounded="lg"
    :class="!btn.outline ? `bg-${btn.color}` : ''"
    :color="btn.outline ? btn.color : undefined"
    :variant="btn.outline ? 'outlined' : undefined"
    :href="btn.url.length > 0 ? btn.url : undefined"
    role="button"
    target="_blank"
    ><v-card-title
      class="d-flex justify-space-between w-100"
      :class="hoverColor ? `bg-${hoverColor}` : ''"
    >
      <div>
        <v-icon v-if="btn.icon" :icon="btn.icon" class="pl-3 pr-5"></v-icon>
        {{ btn.text }}
      </div>
      <slot name="editFunc"></slot>
      <slot></slot>
    </v-card-title>
  </v-card>
</template>
