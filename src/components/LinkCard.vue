<template>
  <b-container fluid>
    <b-card class="mb-4">
      <template #header
        ><span class="h4 mb-0">{{ grp.name }}</span
        ><b-button
          variant="light"
          class="float-right"
          size="sm"
          :pressed.sync="editToggle"
          ><BIconPencilFill v-if="editToggle"/><BIconPencil v-else
        /></b-button>
      </template>
      <div v-for="(link, btnIndex) in grp.linkList" :key="btnIndex">
        <b-button-group class="w-100 mb-3"
          ><b-button
            class="w-100"
            :href="link.url"
            target="_blank"
            :variant="link.color"
            size="lg"
            block
            >{{ link.text }}</b-button
          >
          <b-button
            v-if="editToggle"
            :variant="link.color"
            @click="editLink(dash.name, grp, link)"
            ><BIconPencil
          /></b-button>
        </b-button-group>
      </div>
      <b-button
        v-if="editToggle"
        variant="outline-secondary"
        block
        @click="createLink(dash.name, grp)"
        ><BIconPlus font-scale="2"/></b-button></b-card
    ><b-modal
      :id="'link-modal-'.concat(dash.name, '-', grp.name)"
      @hidden="resetLinkModal"
      :title="linkEditMode ? 'Edit Link' : 'New Link'"
      @ok="saveLink"
      :ok-disabled="
        linkConfig.name === null ||
          linkConfig.name.length === 0 ||
          linkConfig.url === null ||
          linkConfig.url.length === null ||
          linkConfig.color === null ||
          linkConfig.color.length === 0 ||
          linkNameValid !== true
      "
    >
      <b-form-group label="Link Name:"
        ><b-form-input
          v-model="linkConfig.name"
          :state="linkNameValid"
        ></b-form-input
      ></b-form-group>
      <b-form-group label="Link url:"
        ><b-form-input v-model="linkConfig.url"></b-form-input
      ></b-form-group>
      <b-form-group label="Link color:">
        <b-form-radio
          class="m-2"
          v-for="(opt, idx) in colorOptionArray"
          :key="idx"
          v-model="linkConfig.color"
          :value="opt.value"
          button
          :button-variant="opt.value"
          >{{ opt.text }}</b-form-radio
        ></b-form-group
      >
      <b-form-group label="Preview:" v-if="linkConfig.name">
        <b-button
          :href="linkConfig.url"
          :variant="linkConfig.color"
          block
          target="_blank"
          size="lg"
          >{{ linkConfig.name }}</b-button
        >
      </b-form-group>
    </b-modal></b-container
  >
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import {
  ColorOption,
  LinkData,
  LinkGroup,
  ColorOptionArray
} from "../ConfigStructure";
import { DisplayDash } from "./LinkPanel.vue";

type LinkConfig = {
  initialName: string | null;
  name: string | null;
  url: string | null;
  dashName: string | null;
  dashGroup: LinkGroup | null;
  color: string;
};

@Component
export default class LinkCard extends Vue {
  @Prop({ required: true })
  public dash!: DisplayDash;

  @Prop({ required: true })
  public grp!: LinkGroup;

  get colorOptionArray() {
    return ColorOptionArray;
  }

  editToggle = false;
  linkEditMode = false;

  linkConfig: LinkConfig = {
    initialName: null,
    name: null,
    url: null,
    dashName: null,
    dashGroup: null,
    color: ColorOption.Dark
  };

  createLink(dashName: string, dashGroup: LinkGroup) {
    this.linkConfig.dashName = dashName;
    this.linkConfig.dashGroup = dashGroup;
    this.$bvModal.show(
      "link-modal-".concat(this.dash.name, "-", this.grp.name)
    );
  }

  editLink(dashName: string, dashGroup: LinkGroup, linkData: LinkData) {
    this.linkConfig.dashName = dashName;
    this.linkConfig.dashGroup = dashGroup;
    this.linkConfig.initialName = linkData.text;
    this.linkConfig.name = linkData.text;
    this.linkConfig.url = linkData.url;
    this.linkConfig.color = linkData.color;
    this.linkEditMode = true;
    this.$bvModal.show(
      "link-modal-".concat(this.dash.name, "-", this.grp.name)
    );
  }

  get linkNameValid() {
    if (
      this.linkConfig.name === null ||
      this.linkConfig.name === "" ||
      this.linkConfig.dashGroup === null
    ) {
      return null;
    }
    const linkNames = this.linkConfig.dashGroup.linkList.map(x =>
      x.text.toLowerCase()
    );
    if (this.linkEditMode) {
      const initName = this.linkConfig.initialName;
      if (initName !== null) {
        const itemIdx = linkNames.indexOf(initName.toLowerCase());
        if (itemIdx > -1) {
          linkNames.splice(itemIdx, 1);
        }
      }
    }
    return !linkNames.includes(String(this.linkConfig.name).toLowerCase());
  }

  saveLink() {
    // TODO implement this on the store end
    // Make the new tabs save
    // Make it possible to add new groups
    // Implement import & export
    // Add the ability to delete links
    // Add the ability to edit group names
    // Add the ability to delete groups
    console.log(this.linkConfig);
  }

  resetLinkModal() {
    this.linkConfig = {
      initialName: null,
      name: null,
      url: null,
      color: ColorOption.Dark,
      dashName: null,
      dashGroup: null
    };
    this.linkEditMode = false;
  }
}
</script>
